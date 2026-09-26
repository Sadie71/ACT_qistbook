import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';
import { generateGeminiContent } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { message, lang = 'ur' } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    await connectDB();
    const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

    const user = await User.findById(userObjectId);
    const shopName = user?.shopName || 'Store';

    // Fetch compact snapshot of store
    const customers = await Customer.find({ userId: userObjectId }).select('_id name phone');
    const stats = await Transaction.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$customerId',
          totalUdhaar: {
            $sum: { $cond: [{ $eq: ['$type', 'udhaar'] }, '$amount', 0] },
          },
          totalWasooli: {
            $sum: { $cond: [{ $eq: ['$type', 'wasooli'] }, '$amount', 0] },
          },
        },
      },
    ]);

    const statsMap = new Map();
    stats.forEach((st) => {
      statsMap.set(st._id.toString(), {
        udhaar: st.totalUdhaar || 0,
        wasooli: st.totalWasooli || 0,
        balance: (st.totalUdhaar || 0) - (st.totalWasooli || 0),
      });
    });

    let totalOutstanding = 0;
    const customerBalances = [];

    customers.forEach((c) => {
      const s = statsMap.get(c._id.toString()) || { udhaar: 0, wasooli: 0, balance: 0 };
      if (s.balance > 0) {
        totalOutstanding += s.balance;
        customerBalances.push({
          name: c.name,
          phone: c.phone,
          balance: s.balance,
        });
      }
    });

    customerBalances.sort((a, b) => b.balance - a.balance);
    const topDebtors = customerBalances.slice(0, 10);

    const isEnglish = lang === 'en';

    const systemInstruction = isEnglish
      ? `You are "QistBook AI Advisor" — an intelligent financial assistant and digital accountant for retail store owners.
Store Name: "${shopName}"
Total Outstanding Credit Stuck in Market: Rs. ${totalOutstanding}
Top Debtors with Outstanding Balance:
${topDebtors.map((d, i) => `${i + 1}. ${d.name} (${d.phone}): Rs. ${d.balance}`).join('\n')}

INSTRUCTIONS:
1. Answer the shopkeeper's question directly, clearly, and concisely in 100% English.
2. If asked who owes the most, or about a specific customer, reference the store data above accurately.
3. Keep recommendations practical for small retail operations to improve cashflow and recover overdue debt.`
      : `Aap "QistBook AI Munshi" hain — Pakistani dukanon ke digital hisab kitab aur udhaar ke mahir mashir (advisor).
Dukan Ka Naam: "${shopName}"
Kul Baqi Udhaar (Market me phansa paisa): Rs. ${totalOutstanding}
Grahak Jin Par Udhaar Baqi Hai (Top Debtors):
${topDebtors.map((d, i) => `${i + 1}. ${d.name} (${d.phone}): Rs. ${d.balance}`).join('\n')}

HIDAYAAT:
1. Dukandar ke sawal ka seedha, asaan aur mukhtasir jawab Roman Urdu me dein.
2. Agar dukandar puche ke "Kis se sab se ziada wasooli baqi hai?" ya kisi grahak ka naam puche, to oopar diye gaye data se wazeh jawab dein.
3. Mashwara hamesha dukan ke cashflow ko behtar banane aur polite wasooli ke mutabiq dein.`;

    const userPrompt = isEnglish
      ? `Shopkeeper Question: "${message.trim()}"`
      : `Dukandar Ka Sawal: "${message.trim()}"`;

    // Smart data-driven fallback if external API experiences transient 503 high demand
    const fallbackGenerator = () => {
      const q = message.toLowerCase();
      if (isEnglish) {
        if (q.includes('who owes') || q.includes('most') || q.includes('top') || q.includes('debtor')) {
          if (topDebtors.length === 0) {
            return `All clear! You currently have no outstanding customer debts recorded for ${shopName}.`;
          }
          const list = topDebtors
            .slice(0, 5)
            .map((d, i) => `${i + 1}. **${d.name}** — Rs. ${d.balance.toLocaleString()} (${d.phone})`)
            .join('\n');
          return `Here are your top customers with pending balance:\n\n${list}\n\n**Tip:** Sending a polite reminder on WhatsApp using QistBook usually speeds up recovery by 3x.`;
        }
        if (q.includes('total') || q.includes('balance') || q.includes('outstanding') || q.includes('how much')) {
          return `Your total market credit stuck in customer accounts is **Rs. ${totalOutstanding.toLocaleString()}** across ${customerBalances.length} customer(s).`;
        }
        return `Based on your store records for "${shopName}", total outstanding credit is **Rs. ${totalOutstanding.toLocaleString()}**. For prompt recovery, we recommend prioritizing your top debtors and establishing fixed weekly credit limits.`;
      } else {
        // Roman Urdu
        if (q.includes('ziada') || q.includes('zyada') || q.includes('sab se') || q.includes('kin grahakon') || q.includes('kisko') || q.includes('kis se')) {
          if (topDebtors.length === 0) {
            return `Mubarak ho! Is waqt aap ki dukan "${shopName}" par kisi bhi grahak ka baqi udhaar nahi hai. Sab hisab bebaq hai.`;
          }
          const list = topDebtors
            .slice(0, 5)
            .map((d, i) => `${i + 1}. **${d.name}**: Rs. ${d.balance.toLocaleString()} (${d.phone})`)
            .join('\n');
          return `Aap ki dukan par in grahakon par sab se zyada udhaar baqi hai:\n\n${list}\n\n**Mashwara:** In grahakon ko QistBook ke zariye WhatsApp par soft reminder bhejein taake recovery jaldi ho sake.`;
        }
        if (q.includes('kul') || q.includes('total') || q.includes('kitna') || q.includes('paisa') || q.includes('sharah') || q.includes('rate')) {
          return `Aap ki dukan ka kul phansa hua udhaar **Rs. ${totalOutstanding.toLocaleString()}** hai jo kul ${customerBalances.length} grahakon par baqi hai.`;
        }
        return `Aap ki dukan "${shopName}" ke hisab ke mutabiq kul market me phansa udhaar **Rs. ${totalOutstanding.toLocaleString()}** hai. Udhaar kam karne ke liye naye soda dene se pehle pichli wasooli zaroor lein aur WhatsApp reminder ka istemal karein.`;
      }
    };

    const reply = await generateGeminiContent({
      contents: userPrompt,
      systemInstruction,
      fallback: fallbackGenerator,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'AI service temporarily unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}
