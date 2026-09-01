import 'dotenv/config';
import mongoose, { type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Types
export interface IShopkeeper {
  id: string;
  name: string;
  shopName: string;
  phone: string;
  city: string;
  email?: string;
  currency: string;
  passwordHash: string;
  createdAt: string;
}

export interface ICustomer {
  id: string;
  shopkeeperId: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  totalUdhaar: number;
  totalWasool: number;
  balance: number;
  lastTransactionDate: string;
  createdAt: string;
}

export interface ITransaction {
  id: string;
  shopkeeperId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  type: 'UDHAAR' | 'WASOOLI';
  amount: number;
  date: string;
  notes?: string;
  itemsSummary?: string;
  dueDate?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// IN-MEMORY FALLBACK STORE (Pre-seeded with realistic Pakistani Kiryana data)
// -------------------------------------------------------------
const DEMO_SHOPKEEPER_ID = 'demo-shopkeeper-1';

const defaultShopkeeper: IShopkeeper = {
  id: DEMO_SHOPKEEPER_ID,
  name: 'Haji Abdul Sattar',
  shopName: 'Haji Kiryana & General Store',
  phone: '03009283741',
  city: 'Lahore, Raja Bazar',
  email: 'haji.sattar@qistbook.com',
  currency: 'Rs.',
  passwordHash: bcrypt.hashSync('demo1234', 8),
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
};

const defaultCustomers: ICustomer[] = [
  {
    id: 'cust-1',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    name: 'Chaudhry Akram (Zamidar)',
    phone: '03017654321',
    address: 'Near Purani Masjid, Street 4',
    notes: 'Mahana ration khata, har mahine ki 5 tareekh ko wasooli aati hai.',
    totalUdhaar: 24500,
    totalWasool: 12000,
    balance: 12500,
    lastTransactionDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    id: 'cust-2',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    name: 'Tariq Mehmood Tailor',
    phone: '03214567890',
    address: 'Shop # 12, Main Market',
    notes: 'Dukan ki chai, cheeni aur doodh ka khata.',
    totalUdhaar: 9800,
    totalWasool: 5000,
    balance: 4800,
    lastTransactionDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'cust-3',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    name: 'Master Rasheed (School Teacher)',
    phone: '03339876543',
    address: 'House 88, Model Town',
    notes: 'Salary aane par mukammal payment karte hain.',
    totalUdhaar: 18200,
    totalWasool: 18200,
    balance: 0,
    lastTransactionDate: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'cust-4',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    name: 'Bhai Zafar (Mechanic)',
    phone: '03451122334',
    address: 'Autoshop, Circular Road',
    notes: 'Old pending udhaar - 3 haftay se payment nahi aai.',
    totalUdhaar: 16400,
    totalWasool: 3000,
    balance: 13400,
    lastTransactionDate: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
  },
  {
    id: 'cust-5',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    name: 'Baji Fatima',
    phone: '03129988776',
    address: 'Gali 2, Quarter No. 5',
    notes: 'Daily doodh, dahi aur anday ka hisab.',
    totalUdhaar: 7500,
    totalWasool: 4000,
    balance: 3500,
    lastTransactionDate: new Date().toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

const defaultTransactions: ITransaction[] = [
  {
    id: 'txn-1',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    customerId: 'cust-1',
    customerName: 'Chaudhry Akram (Zamidar)',
    customerPhone: '03017654321',
    type: 'UDHAAR',
    amount: 6500,
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    notes: '20kg Basmati Chawal, 5kg Banaspati Ghee',
    itemsSummary: '20kg Chawal, 5kg Ghee',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'txn-2',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    customerId: 'cust-1',
    customerName: 'Chaudhry Akram (Zamidar)',
    customerPhone: '03017654321',
    type: 'WASOOLI',
    amount: 12000,
    date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    notes: 'Cash wasooli by beta Farooq',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'txn-3',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    customerId: 'cust-2',
    customerName: 'Tariq Mehmood Tailor',
    customerPhone: '03214567890',
    type: 'UDHAAR',
    amount: 2200,
    date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    notes: 'Tea bags box, 4kg Sugar, Doodh packs',
    itemsSummary: 'Chai patti, 4kg Cheeni',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'txn-4',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    customerId: 'cust-3',
    customerName: 'Master Rasheed (School Teacher)',
    customerPhone: '03339876543',
    type: 'WASOOLI',
    amount: 18200,
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    notes: 'Full monthly settlement via JazzCash',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'txn-5',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    customerId: 'cust-4',
    customerName: 'Bhai Zafar (Mechanic)',
    customerPhone: '03451122334',
    type: 'UDHAAR',
    amount: 8400,
    date: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
    notes: 'Soap cartons, oil, biscuits for workshop',
    dueDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString()
  },
  {
    id: 'txn-6',
    shopkeeperId: DEMO_SHOPKEEPER_ID,
    customerId: 'cust-5',
    customerName: 'Baji Fatima',
    customerPhone: '03129988776',
    type: 'UDHAAR',
    amount: 1500,
    date: new Date().toISOString().split('T')[0],
    notes: 'Fresh Doodh 3kg, 1 Dozen Eggs',
    itemsSummary: '3kg Doodh, Anday',
    createdAt: new Date().toISOString()
  }
];

// Memory state
let memoryShopkeepers: IShopkeeper[] = [defaultShopkeeper];
let memoryCustomers: ICustomer[] = [...defaultCustomers];
let memoryTransactions: ITransaction[] = [...defaultTransactions];

// -------------------------------------------------------------
// MONGOOSE SCHEMAS (Singleton Cached Connection)
// -------------------------------------------------------------
let isMongoConnected = false;
let mongoConnectionAttempted = false;

const ShopkeeperSchema = new mongoose.Schema<IShopkeeper>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shopName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  city: { type: String, default: 'Pakistan' },
  email: { type: String },
  currency: { type: String, default: 'Rs.' },
  passwordHash: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const CustomerSchema = new mongoose.Schema<ICustomer>({
  id: { type: String, required: true, unique: true },
  shopkeeperId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  notes: { type: String },
  totalUdhaar: { type: Number, default: 0 },
  totalWasool: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  lastTransactionDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const TransactionSchema = new mongoose.Schema<ITransaction>({
  id: { type: String, required: true, unique: true },
  shopkeeperId: { type: String, required: true, index: true },
  customerId: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  type: { type: String, enum: ['UDHAAR', 'WASOOLI'], required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  notes: { type: String },
  itemsSummary: { type: String },
  dueDate: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const ShopkeeperModel: Model<IShopkeeper> = (mongoose.models && mongoose.models.Shopkeeper ? mongoose.models.Shopkeeper as Model<IShopkeeper> : mongoose.model<IShopkeeper>('Shopkeeper', ShopkeeperSchema));
const CustomerModel: Model<ICustomer> = (mongoose.models && mongoose.models.Customer ? mongoose.models.Customer as Model<ICustomer> : mongoose.model<ICustomer>('Customer', CustomerSchema));
const TransactionModel: Model<ITransaction> = (mongoose.models && mongoose.models.Transaction ? mongoose.models.Transaction as Model<ITransaction> : mongoose.model<ITransaction>('Transaction', TransactionSchema));

export async function connectDB(): Promise<{ isMongo: boolean; message: string }> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    return { isMongo: false, message: 'Running with high-speed local store. Add MONGODB_URI to sync with cloud.' };
  }

  if (isMongoConnected && mongoose.connection.readyState === 1) {
    return { isMongo: true, message: 'Connected to MongoDB Atlas' };
  }

  try {
    mongoConnectionAttempted = true;
    const opts = {
      dbName: 'qistbook',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      bufferCommands: false,
    };
    await mongoose.connect(uri, opts);
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully.');
    
    // Seed demo data if empty
    const count = await CustomerModel.countDocuments();
    if (count === 0) {
      await ShopkeeperModel.create(defaultShopkeeper);
      await CustomerModel.insertMany(defaultCustomers);
      await TransactionModel.insertMany(defaultTransactions);
      console.log('🌱 Seeded initial QistBook demo ledger data into MongoDB Atlas.');
    }
    return { isMongo: true, message: 'Connected to MongoDB Atlas' };
  } catch (err) {
    console.warn('⚠️ MongoDB connection warning. Gracefully falling back to in-memory store:', (err as Error).message);
    isMongoConnected = false;
    return { isMongo: false, message: 'Using local storage mode (MongoDB timed out or connecting).' };
  }
}

// -------------------------------------------------------------
// DATA ACCESS LAYER (Transparently switches MongoDB / Memory)
// -------------------------------------------------------------

// Shopkeeper Auth
export async function getShopkeeperByPhone(phone: string): Promise<IShopkeeper | null> {
  await connectDB();
  if (isMongoConnected) {
    try {
      const doc = await ShopkeeperModel.findOne({ phone }).lean();
      return doc as IShopkeeper | null;
    } catch {
      // fallback
    }
  }
  return memoryShopkeepers.find(s => s.phone === phone) || null;
}

export async function getShopkeeperById(id: string): Promise<IShopkeeper | null> {
  await connectDB();
  if (isMongoConnected) {
    try {
      const doc = await ShopkeeperModel.findOne({ id }).lean();
      return doc as IShopkeeper | null;
    } catch {
      // fallback
    }
  }
  return memoryShopkeepers.find(s => s.id === id) || null;
}

export async function createShopkeeper(data: Omit<IShopkeeper, 'id' | 'createdAt'>): Promise<IShopkeeper> {
  const newShopkeeper: IShopkeeper = {
    ...data,
    id: `shop-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString()
  };

  await connectDB();
  if (isMongoConnected) {
    try {
      await ShopkeeperModel.create(newShopkeeper);
    } catch (e) {
      console.error('Mongo error creating shopkeeper:', e);
    }
  }
  memoryShopkeepers.push(newShopkeeper);
  return newShopkeeper;
}

// Customers
export async function getCustomers(shopkeeperId: string): Promise<ICustomer[]> {
  await connectDB();
  if (isMongoConnected) {
    try {
      const docs = await CustomerModel.find({ shopkeeperId }).sort({ balance: -1, lastTransactionDate: -1 }).lean();
      return docs as ICustomer[];
    } catch (e) {
      console.error('Mongo error fetching customers:', e);
    }
  }
  return memoryCustomers
    .filter(c => c.shopkeeperId === shopkeeperId || (shopkeeperId === DEMO_SHOPKEEPER_ID && c.shopkeeperId === DEMO_SHOPKEEPER_ID))
    .sort((a, b) => b.balance - a.balance);
}

export async function getCustomerById(shopkeeperId: string, id: string): Promise<ICustomer | null> {
  await connectDB();
  if (isMongoConnected) {
    try {
      const doc = await CustomerModel.findOne({ shopkeeperId, id }).lean();
      return doc as ICustomer | null;
    } catch {}
  }
  return memoryCustomers.find(c => (c.shopkeeperId === shopkeeperId || shopkeeperId === DEMO_SHOPKEEPER_ID) && c.id === id) || null;
}

export async function createCustomer(shopkeeperId: string, data: { name: string; phone: string; address?: string; notes?: string }): Promise<ICustomer> {
  const id = `cust-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const newCustomer: ICustomer = {
    id,
    shopkeeperId,
    name: data.name.trim(),
    phone: data.phone.trim(),
    address: data.address || '',
    notes: data.notes || '',
    totalUdhaar: 0,
    totalWasool: 0,
    balance: 0,
    lastTransactionDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };

  await connectDB();
  if (isMongoConnected) {
    try {
      await CustomerModel.create(newCustomer);
    } catch (e) {
      console.error('Mongo error creating customer:', e);
    }
  }
  memoryCustomers.push(newCustomer);
  return newCustomer;
}

export async function updateCustomer(shopkeeperId: string, id: string, data: Partial<ICustomer>): Promise<ICustomer | null> {
  await connectDB();
  if (isMongoConnected) {
    try {
      const updated = await CustomerModel.findOneAndUpdate({ shopkeeperId, id }, { $set: data }, { new: true }).lean();
      if (updated) return updated as ICustomer;
    } catch (e) {
      console.error('Mongo error updating customer:', e);
    }
  }
  const idx = memoryCustomers.findIndex(c => c.id === id);
  if (idx !== -1) {
    memoryCustomers[idx] = { ...memoryCustomers[idx], ...data };
    return memoryCustomers[idx];
  }
  return null;
}

export async function deleteCustomer(shopkeeperId: string, id: string): Promise<boolean> {
  await connectDB();
  if (isMongoConnected) {
    try {
      await CustomerModel.deleteOne({ shopkeeperId, id });
      await TransactionModel.deleteMany({ shopkeeperId, customerId: id });
    } catch (e) {
      console.error('Mongo error deleting customer:', e);
    }
  }
  memoryCustomers = memoryCustomers.filter(c => c.id !== id);
  memoryTransactions = memoryTransactions.filter(t => t.customerId !== id);
  return true;
}

// Transactions
export async function getTransactions(shopkeeperId: string, customerId?: string): Promise<ITransaction[]> {
  await connectDB();
  if (isMongoConnected) {
    try {
      const query: any = { shopkeeperId };
      if (customerId) query.customerId = customerId;
      const docs = await TransactionModel.find(query).sort({ date: -1, createdAt: -1 }).lean();
      return docs as ITransaction[];
    } catch (e) {
      console.error('Mongo error fetching transactions:', e);
    }
  }
  return memoryTransactions
    .filter(t => (t.shopkeeperId === shopkeeperId || (shopkeeperId === DEMO_SHOPKEEPER_ID && t.shopkeeperId === DEMO_SHOPKEEPER_ID)) && (!customerId || t.customerId === customerId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createTransaction(shopkeeperId: string, data: {
  customerId?: string;
  customerName: string;
  customerPhone: string;
  type: 'UDHAAR' | 'WASOOLI';
  amount: number;
  date?: string;
  notes?: string;
  itemsSummary?: string;
  dueDate?: string;
}): Promise<{ transaction: ITransaction; customer: ICustomer }> {
  // Find or create customer
  let customer: ICustomer | null = null;
  if (data.customerId) {
    customer = await getCustomerById(shopkeeperId, data.customerId);
  }
  
  if (!customer) {
    // Check by name or phone
    const allCusts = await getCustomers(shopkeeperId);
    customer = allCusts.find(c => c.name.toLowerCase() === data.customerName.toLowerCase() || (data.customerPhone && c.phone === data.customerPhone)) || null;
    if (!customer) {
      customer = await createCustomer(shopkeeperId, {
        name: data.customerName,
        phone: data.customerPhone || '03000000000',
        notes: data.notes
      });
    }
  }

  const txnDate = data.date || new Date().toISOString().split('T')[0];
  const newTxn: ITransaction = {
    id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    shopkeeperId,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    type: data.type,
    amount: Number(data.amount),
    date: txnDate,
    notes: data.notes || '',
    itemsSummary: data.itemsSummary || data.notes || '',
    dueDate: data.dueDate,
    createdAt: new Date().toISOString()
  };

  // Recalculate customer balances
  const addUdhaar = data.type === 'UDHAAR' ? Number(data.amount) : 0;
  const addWasool = data.type === 'WASOOLI' ? Number(data.amount) : 0;

  const updatedTotalUdhaar = Number(customer.totalUdhaar || 0) + addUdhaar;
  const updatedTotalWasool = Number(customer.totalWasool || 0) + addWasool;
  const updatedBalance = updatedTotalUdhaar - updatedTotalWasool;

  const updatedCustomer = await updateCustomer(shopkeeperId, customer.id, {
    totalUdhaar: updatedTotalUdhaar,
    totalWasool: updatedTotalWasool,
    balance: updatedBalance,
    lastTransactionDate: txnDate
  });

  await connectDB();
  if (isMongoConnected) {
    try {
      await TransactionModel.create(newTxn);
    } catch (e) {
      console.error('Mongo error creating transaction:', e);
    }
  }
  memoryTransactions.unshift(newTxn);

  return {
    transaction: newTxn,
    customer: updatedCustomer || customer
  };
}

export async function deleteTransaction(shopkeeperId: string, txnId: string): Promise<boolean> {
  const allTxns = await getTransactions(shopkeeperId);
  const txn = allTxns.find(t => t.id === txnId);
  if (!txn) return false;

  const customer = await getCustomerById(shopkeeperId, txn.customerId);
  if (customer) {
    const subUdhaar = txn.type === 'UDHAAR' ? txn.amount : 0;
    const subWasool = txn.type === 'WASOOLI' ? txn.amount : 0;
    const updatedTotalUdhaar = Math.max(0, customer.totalUdhaar - subUdhaar);
    const updatedTotalWasool = Math.max(0, customer.totalWasool - subWasool);
    const updatedBalance = updatedTotalUdhaar - updatedTotalWasool;

    await updateCustomer(shopkeeperId, customer.id, {
      totalUdhaar: updatedTotalUdhaar,
      totalWasool: updatedTotalWasool,
      balance: updatedBalance
    });
  }

  await connectDB();
  if (isMongoConnected) {
    try {
      await TransactionModel.deleteOne({ shopkeeperId, id: txnId });
    } catch (e) {
      console.error('Mongo error deleting transaction:', e);
    }
  }
  memoryTransactions = memoryTransactions.filter(t => t.id !== txnId);
  return true;
}
