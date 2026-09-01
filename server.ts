import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import {
  connectDB,
  getShopkeeperByPhone,
  getShopkeeperById,
  createShopkeeper,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getTransactions,
  createTransaction,
  deleteTransaction
} from './server/db';
import { generateShopInsights, answerShopkeeperQuestion } from './server/ai';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'qistbook-secure-jwt-secret-key-2026';

app.use(express.json());

// Initialize DB connection in background without blocking
connectDB().catch(err => console.error('DB Init Error:', err));

// Helper: Extract authenticated shopkeeper ID or null if unauthenticated
function getAuthShopkeeperId(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      if (token && token !== 'null' && token !== 'undefined') {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        return decoded.id;
      }
    } catch (e) {
      // Invalid/expired token
      return null;
    }
  }
  return null;
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health & DB Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/db/status', async (req: Request, res: Response) => {
  try {
    const status = await connectDB();
    res.json({
      connected: true,
      type: status.isMongo ? 'mongodb' : 'memory',
      message: status.message
    });
  } catch (e) {
    res.json({
      connected: true,
      type: 'memory',
      message: 'Local fast memory store active.'
    });
  }
});

// Authentication
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, shopName, phone, city, password } = req.body;
    if (!name || !shopName || !phone || !password) {
      return res.status(400).json({ error: 'Please provide name, shopName, phone and password.' });
    }

    const existing = await getShopkeeperByPhone(phone.trim());
    if (existing) {
      return res.status(400).json({ error: 'Account with this phone number already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 8);
    const newShopkeeper = await createShopkeeper({
      name: name.trim(),
      shopName: shopName.trim(),
      phone: phone.trim(),
      city: city ? city.trim() : 'Pakistan',
      currency: 'Rs.',
      passwordHash
    });

    const token = jwt.sign({ id: newShopkeeper.id }, JWT_SECRET, { expiresIn: '30d' });
    const { passwordHash: _, ...safeUser } = newShopkeeper;
    return res.json({ token, shopkeeper: safeUser });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required.' });
    }

    const shopkeeper = await getShopkeeperByPhone(phone.trim());
    if (!shopkeeper) {
      return res.status(401).json({ error: 'Invalid phone or password.' });
    }

    const isValid = bcrypt.compareSync(password, shopkeeper.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid phone or password.' });
    }

    const token = jwt.sign({ id: shopkeeper.id }, JWT_SECRET, { expiresIn: '30d' });
    const { passwordHash: _, ...safeUser } = shopkeeper;
    return res.json({ token, shopkeeper: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Demo Login (Returns real JWT for pre-seeded demo shopkeeper)
app.post('/api/auth/demo', async (req: Request, res: Response) => {
  try {
    let demoShopkeeper = await getShopkeeperById('demo-shopkeeper-1');
    if (!demoShopkeeper) {
      demoShopkeeper = await createShopkeeper({
        name: 'Haji Abdul Sattar',
        shopName: 'Haji Kiryana & General Store',
        phone: '03009283741',
        city: 'Lahore, Raja Bazar',
        currency: 'Rs.',
        passwordHash: bcrypt.hashSync('demo1234', 8)
      });
    }
    const token = jwt.sign({ id: demoShopkeeper.id }, JWT_SECRET, { expiresIn: '30d' });
    const { passwordHash: _, ...safeUser } = demoShopkeeper;
    return res.json({ token, shopkeeper: safeUser });
  } catch (err) {
    console.error('Demo login error:', err);
    return res.status(500).json({ error: 'Failed to initialize demo mode.' });
  }
});

app.get('/api/auth/me', async (req: Request, res: Response) => {
  try {
    const shopkeeperId = getAuthShopkeeperId(req);
    if (!shopkeeperId) {
      return res.status(401).json({ error: 'No active session token.' });
    }
    const shopkeeper = await getShopkeeperById(shopkeeperId);
    if (!shopkeeper) {
      return res.status(404).json({ error: 'Shopkeeper profile not found.' });
    }
    const { passwordHash: _, ...safeUser } = shopkeeper;
    return res.json({ shopkeeper: safeUser });
  } catch (err) {
    return res.status(401).json({ error: 'Failed to retrieve session.' });
  }
});

// Customers
app.get('/api/customers', async (req: Request, res: Response) => {
  try {
    const shopkeeperId = getAuthShopkeeperId(req);
    if (!shopkeeperId) {
      return res.status(401).json({ error: 'Please log in to view customers.' });
    }
    const customers = await getCustomers(shopkeeperId);
    return res.json({ customers });
  } catch (err) {
    console.error('Fetch customers error:', err);
    return res.status(500).json({ error: 'Failed to fetch customers.' });
  }
});

app.post('/api/customers', async (req: Request, res: Response) => {
  try {
    const shopkeeperId = getAuthShopkeeperId(req);
    if (!shopkeeperId) {
      return res.status(401).json({ error: 'Please log in to add customers.' });
    }
    const { name, phone, address, notes } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Customer name is required.' });
    }
    const customer = await createCustomer(shopkeeperId, {
      name,
      phone: phone || '',
      address,
      notes
    });
    return res.json({ customer });
  } catch (err) {
    console.error('Create customer error:', err);
    return res.status(500).json({ error: 'Failed to create customer.' });
  }
});

app.put('/api/customers/:id', async (req: Request, res: Response) => {
  try {
    const shopkeeperId = getAuthShopkeeperId(req);
    if (!shopkeeperId) {
      return res.status(401).json({ error: 'Please log in to update customer.' });
    }
    const { id } = req.params;
    const updated = await updateCustomer(shopkeeperId, id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    return res.json({ customer: updated });
  } catch (err) {
    console.error('Update customer error:', err);
    return res.status(500).json({ error: 'Failed to update customer.' });
  }
});

app.delete('/api/customers/:id', async (req: Request, res: Response) => {
  try {
    const shopkeeperId = getAuthShopkeeperId(req);
    if (!shopkeeperId) {
      return res.status(401).json({ error: 'Please log in to delete customer.' });
    }
    const { id } = req.params;
    await deleteCustomer(shopkeeperId, id);
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete customer error:', err);
    return res.status(500).json({ error: 'Failed to delete customer.' });
  }
});

// Transactions
app.get('/api/transactions', async (req: Request, res: Response) => {
  try {
    const shopkeeperId = getAuthShopkeeperId(req);
    if (!shopkeeperId) {
      return res.status(401).json({ error: 'Please log in to view transactions.' });
    }
    const customerId = req.query.customerId as string | undefined;
    const transactions = await getTransactions(shopkeeperId, customerId);
    return res.json({ transactions });
  } catch (err) {
    console.error('Fetch transactions error:', err);
    return res.status(500).json({ error: 'Failed to fetch transactions.' });
  }
});

app.post('/api/transactions', async (req: Request, res: Response) => {
  try {
    const shopkeeperId = getAuthShopkeeperId(req);
    if (!shopkeeperId) {
      return res.status(401).json({ error: 'Please log in to record transactions.' });
    }
    const { customerId, customerName, customerPhone, type, amount, date, notes, itemsSummary, dueDate } = req.body;
    
    if (!customerName || !amount || !type) {
      return res.status(400).json({ error: 'Customer name, amount, and type are required.' });
    }

    const result = await createTransaction(shopkeeperId, {
      customerId,
      customerName,
      customerPhone: customerPhone || '',
      type,
      amount: Number(amount),
      date,
      notes,
      itemsSummary,
      dueDate
    });

    return res.json(result);
  } catch (err) {
    console.error('Create transaction error:', err);
    return res.status(500).json({ error: 'Failed to record transaction.' });
  }
});

app.delete('/api/transactions/:id', async (req: Request, res: Response) => {
  try {
    const shopkeeperId = getAuthShopkeeperId(req);
    if (!shopkeeperId) {
      return res.status(401).json({ error: 'Please log in to delete transaction.' });
    }
    const { id } = req.params;
    await deleteTransaction(shopkeeperId, id);
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete transaction error:', err);
    return res.status(500).json({ error: 'Failed to delete transaction.' });
  }
});

// AI Insights
app.post('/api/ai/insights', async (req: Request, res: Response) => {
  try {
    const shopkeeperId = getAuthShopkeeperId(req);
    if (!shopkeeperId) {
      return res.status(401).json({ error: 'Please log in to generate AI insights.' });
    }
    const { language = 'ur' } = req.body;
    const shopkeeper = await getShopkeeperById(shopkeeperId);
    const customers = await getCustomers(shopkeeperId);
    const transactions = await getTransactions(shopkeeperId);

    const insights = await generateShopInsights(
      shopkeeper ? shopkeeper.shopName : 'Kiryana Store',
      customers,
      transactions,
      language
    );

    return res.json({ insights });
  } catch (err) {
    console.error('AI Insights error:', err);
    return res.status(500).json({ error: 'Failed to generate AI insights.' });
  }
});

// Ask AI Custom Question
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  try {
    const shopkeeperId = getAuthShopkeeperId(req);
    if (!shopkeeperId) {
      return res.status(401).json({ error: 'Please log in to ask AI questions.' });
    }
    const { question, language = 'ur' } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const shopkeeper = await getShopkeeperById(shopkeeperId);
    const customers = await getCustomers(shopkeeperId);

    const answer = await answerShopkeeperQuestion(
      question,
      shopkeeper ? shopkeeper.shopName : 'Meri Dukan',
      customers,
      language
    );

    return res.json({ answer });
  } catch (err) {
    console.error('AI Ask error:', err);
    return res.status(500).json({ error: 'Failed to get answer from AI.' });
  }
});

// WhatsApp Link Generator
app.post('/api/whatsapp/link', (req: Request, res: Response) => {
  try {
    const { customerName, phone, balance, shopName, language = 'ur' } = req.body;
    
    // Clean phone number (format for WhatsApp e.g. 923001234567 or international)
    let cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '92' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('92') && cleanPhone.length === 10) {
      cleanPhone = '92' + cleanPhone;
    }

    let message = '';
    if (language === 'ur') {
      message = `Assalam-o-Alaikum ${customerName} bhai,\n\n${shopName || 'Hamari Dukan'} ke khate ke mutabiq aap ka kul baqi udhaar Rs. ${Number(balance).toLocaleString()} banta hai.\n\nBaraye meherbani jald az jald hisab bebaaq / ada farmayein.\n\nJazakAllah,\n${shopName || 'QistBook Shopkeeper'}`;
    } else {
      message = `Dear ${customerName},\n\nThis is a polite reminder from ${shopName || 'our shop'}. Your outstanding balance on the ledger is Rs. ${Number(balance).toLocaleString()}.\n\nKindly arrange the payment at your earliest convenience.\n\nThank you,\n${shopName || 'Shop Management'}`;
    }

    const encodedText = encodeURIComponent(message);
    const link = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    return res.json({
      link,
      message,
      phone: cleanPhone
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate WhatsApp link.' });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 QistBook Server running on http://localhost:${PORT}`);
  });
}

startServer();
