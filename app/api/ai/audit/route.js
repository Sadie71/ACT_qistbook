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

    let lang = 'ur';
    try {
      const body = await req.json();
      if (body?.lang) lang = body.lang;
    } catch {
      // Body might be empty
    }

    await connectDB();
    const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

    const user = await User.findById(userObjectId);
    const shopName = user?.shopName || 'Store';
    const shopType = user?.shopType || 'Retail Store';

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Aggregate monthly numbers
    const [monthStats, totalCustomers, allDebtorsStats] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: startOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            monthUdhaar: {
              $sum: { $cond: [{ $eq: ['$type', 'udhaar'] }, '$amount', 0] },
            },
            monthWasooli: {
              $sum: { $cond: [{ $eq: ['$type', 'wasooli'] }, '$amount', 0] },
            },
          },
        },
      ]),
      Customer.countDocuments({ userId: userObjectId }),
      Transaction.aggregate([
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
        {
          $project: {
            customerId: '$_id',
            balance: { $subtract: ['$totalUdhaar', '$totalWasooli'] },
          },
        },
        { $match: { balance: { $gt: 0 } } },
        { $sort: { balance: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const monthUdhaar = monthStats[0]?.monthUdhaar || 0;
    const monthWasooli = monthStats[0]?.monthWasooli || 0;
    const recoveryRate = monthUdhaar > 0 ? Math.round((monthWasooli / monthUdhaar) * 100) : 0;

    // Populate top debtors names
    const debtorIds = allDebtorsStats.map((d) => d.customerId);
    const debtorCustomers = await Customer.find({ _id: { $in: debtorIds } }).select('_id name phone');
    const customerMap = new Map();
    debtorCustomers.forEach((c) => customerMap.set(c._id.toString(), c));

    const topDebtors = allDebtorsStats.map((d) => {
      const c = customerMap.get(d.customerId.toString());
      return {
        name: c?.name || 'Customer',
        phone: c?.phone || '',
        balance: d.balance,
      };
    });

    const isEnglish = lang === 'en';

    const systemInstruction = isEnglish
      ? `You are an expert retail financial advisor and digital accountant ("AI Munshi") for retail merchants using the "QistBook" application.
Store Information:
- Store Name: "${shopName}" (${shopType})
- Total Customers: ${totalCustomers}
- This Month's New Credit Given: Rs. ${monthUdhaar}
- This Month's Total Cash Recovered: Rs. ${monthWasooli}
- Collection / Recovery Rate: ${recoveryRate}%
- Top 5 Debtors with Overdue Balance: ${JSON.stringify(topDebtors)}

INSTRUCTIONS:
1. Provide your response 100% in clear, professional, concise English.
2. Structure your audit into clean, bulleted sections:
   - 📊 **Monthly Summary**: High-level store cashflow & recovery health evaluation.
   - ⚠️ **Risk Alert**: Customers with disproportionate credit exposure or lagging payment cycles.
   - 💡 **3 Actionable Recommendations**: Clear, practical steps to recover cash faster (e.g. WhatsApp reminder timing, offering installment terms, setting credit ceilings).
3. Tone should be professional, encouraging, and commercially sharp.`
      : `Aap ek professional Pakistani retail financial advisor aur digital munshi hain jo "QistBook" app ke zariye shopkeepers ki madad karte hain.
Dukan Ki Maloomaat:
- Dukan Ka Naam: "${shopName}" (${shopType})
- Kul Grahak: ${totalCustomers}
- Is Mahine Ka Naya Udhaar: Rs. ${monthUdhaar}
- Is Mahine Ki Kul Wasooli (Recovery): Rs. ${monthWasooli}
- Wasooli Ki Sharah (Recovery Rate): ${recoveryRate}%
- Top 5 Baqi Udhaar Wale Grahak: ${JSON.stringify(topDebtors)}

HIDAYAAT:
1. Mukammal jawab aam-fehm aur behtareen Roman Urdu (ya Roman Punjabi mix jo Pakistani dukandar aam bolte hain) me dein.
2. Short, structured aur pointwise audit report banayein:
   - 📊 **Mahana Khulasa (Monthly Summary)**: Dukan ki karkardagi kaisi rahi.
   - ⚠️ **Khatray Ki Nishandahi (Risk Alert)**: Kin grahakon ka udhaar zyada hai ya recovery rate kam hai.
   - 💡 **3 Amali Mashwaray (Actionable Advice)**: Wasooli tez karne aur udhaar control karne ke 3 seedhay mashwaray (jaise WhatsApp reminders bhejne ka waqt, installment offer karna, limit lagana).
3. Lehja professional, hosla-afza aur dostana ho.`;

    const userPrompt = isEnglish
      ? 'Please generate a comprehensive monthly audit report for my store based on this data.'
      : 'Baraye meherbani meri dukan ke is data ki roshni me mukammal mahana audit report aur wasooli ke mashwaray faraham karein.';

    // Fallback audit generator calculated directly from real store metrics
    const fallbackAudit = () => {
      if (isEnglish) {
        const topList = topDebtors.length > 0
          ? topDebtors.map((d, i) => `   ${i + 1}. **${d.name}**: Rs. ${d.balance.toLocaleString()} (${d.phone})`).join('\n')
          : '   No active debtor concentration.';

        return `### 📊 Monthly Audit Summary for ${shopName}
- **Credit Issued This Month:** Rs. ${monthUdhaar.toLocaleString()}
- **Cash Recovered This Month:** Rs. ${monthWasooli.toLocaleString()}
- **Recovery Rate:** ${recoveryRate}% (${recoveryRate >= 70 ? 'Healthy performance' : recoveryRate >= 40 ? 'Moderate - requires focus' : 'Critical attention needed'})
- **Active Customers:** ${totalCustomers}

### ⚠️ Risk Alert & Top Exposures
${topList}

### 💡 3 Actionable Recommendations
1. **Send Instant WhatsApp Reminders:** Reach out to the top debtors right away using the built-in WhatsApp button with a polite tone.
2. **Set a Soft Credit Cap:** Avoid issuing additional credit to customers who already exceed Rs. 5,000 until at least 50% is recovered.
3. **Offer Easy Installment (Qist) Terms:** For balances larger than Rs. 10,000, propose a weekly installment plan rather than demanding full lump-sum payment.`;
      } else {
        const topList = topDebtors.length > 0
          ? topDebtors.map((d, i) => `   ${i + 1}. **${d.name}**: Rs. ${d.balance.toLocaleString()} (${d.phone})`).join('\n')
          : '   Alhamdulillah is waqt koi barra khatarnak udhaar baqi nahi hai.';

        return `### 📊 ${shopName} Ki Mahana Audit Report
- **Is Mahine Ka Naya Udhaar:** Rs. ${monthUdhaar.toLocaleString()}
- **Is Mahine Ki Wasooli:** Rs. ${monthWasooli.toLocaleString()}
- **Wasooli Ki Sharah (Recovery Rate):** ${recoveryRate}% (${recoveryRate >= 70 ? 'Behtareen karkardagi' : recoveryRate >= 40 ? 'Darmiana - thori tawajjo darkar hai' : 'Khatarnak had tak kam'})
- **Kul Grahak:** ${totalCustomers}

### ⚠️ Khatray Ki Nishandahi (Top Baqi Udhaar)
${topList}

### 💡 Dukandar Ke Liye 3 Zaroori Mashwaray
1. **WhatsApp Reminders Bhejein:** Top grahakon ko QistBook ke button se WhatsApp par narmi se reminder bhejein. Mahine ki 1 se 5 tareekh wasooli ke liye behtareen waqt hota hai.
2. **Naya Udhaar Rokain:** Jin grahakon ka pichla udhaar Rs. 5,000 se ziada ho chuka hai, unhein pehle 50% ada karne ko kahein.
3. **Choti Qist (Installments) Ka Option Dein:** Barray udhaar wale grahakon ko 2 ya 4 haftawaar qiston ki sahulat dein taake raqam phansi na rahay.`;
      }
    };

    const responseText = await generateGeminiContent({
      contents: userPrompt,
      systemInstruction,
      fallback: fallbackAudit,
    });

    return NextResponse.json({
      audit: responseText,
      metrics: {
        shopName,
        totalCustomers,
        monthUdhaar,
        monthWasooli,
        recoveryRate,
        topDebtors,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('AI Audit error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI audit.' },
      { status: 500 }
    );
  }
}
