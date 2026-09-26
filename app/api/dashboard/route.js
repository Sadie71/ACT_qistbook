import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
import Transaction from '@/models/Transaction';
import { getUserFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    // 1. Customer balances and Top Debtors calculation
    const customers = await Customer.find({ userId: userObjectId }).select('_id name phone address');

    const customerStats = await Transaction.aggregate([
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
          lastTransactionDate: { $max: '$date' },
        },
      },
    ]);

    const statsMap = new Map();
    customerStats.forEach((st) => {
      statsMap.set(st._id.toString(), {
        totalUdhaar: st.totalUdhaar || 0,
        totalWasooli: st.totalWasooli || 0,
        balance: (st.totalUdhaar || 0) - (st.totalWasooli || 0),
        lastTransactionDate: st.lastTransactionDate,
      });
    });

    let totalOutstandingCredit = 0;
    const allDebtors = [];

    customers.forEach((c) => {
      const cStats = statsMap.get(c._id.toString()) || { balance: 0 };
      if (cStats.balance > 0) {
        totalOutstandingCredit += cStats.balance;
        allDebtors.push({
          id: c._id.toString(),
          name: c.name,
          phone: c.phone,
          balance: cStats.balance,
          lastTransactionDate: cStats.lastTransactionDate,
        });
      }
    });

    // Sort to get top 5 debtors
    allDebtors.sort((a, b) => b.balance - a.balance);
    const topDebtors = allDebtors.slice(0, 5);

    // 2. Today's Totals
    const todayAgg = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startOfToday },
        },
      },
      {
        $group: {
          _id: null,
          todayUdhaar: {
            $sum: { $cond: [{ $eq: ['$type', 'udhaar'] }, '$amount', 0] },
          },
          todayWasooli: {
            $sum: { $cond: [{ $eq: ['$type', 'wasooli'] }, '$amount', 0] },
          },
        },
      },
    ]);

    const todayUdhaar = todayAgg[0]?.todayUdhaar || 0;
    const todayWasooli = todayAgg[0]?.todayWasooli || 0;

    // 3. Month's Totals
    const monthAgg = await Transaction.aggregate([
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
    ]);

    const monthUdhaar = monthAgg[0]?.monthUdhaar || 0;
    const monthRecovery = monthAgg[0]?.monthWasooli || 0;

    // Collection rate = (month recovery / (month udhaar || 1)) * 100
    // If total credit given this month is 0, base on all-time or 100%
    const collectionRate =
      monthUdhaar > 0
        ? Math.min(100, Math.round((monthRecovery / monthUdhaar) * 100))
        : monthRecovery > 0
        ? 100
        : 0;

    // 4. Last 7 Days Activity for Bar Chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const dayAgg = await Transaction.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: dayStart, $lte: dayEnd },
          },
        },
        {
          $group: {
            _id: null,
            udhaar: {
              $sum: { $cond: [{ $eq: ['$type', 'udhaar'] }, '$amount', 0] },
            },
            wasooli: {
              $sum: { $cond: [{ $eq: ['$type', 'wasooli'] }, '$amount', 0] },
            },
          },
        },
      ]);

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateLabel = `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`;

      last7Days.push({
        day: dayName,
        date: dateLabel,
        udhaar: dayAgg[0]?.udhaar || 0,
        wasooli: dayAgg[0]?.wasooli || 0,
      });
    }

    // 5. Recent 5 Transactions
    const recentTxns = await Transaction.find({ userId: userObjectId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .populate('customerId', 'name phone')
      .lean();

    const recentTransactions = recentTxns.map((t) => ({
      _id: t._id,
      id: t._id.toString(),
      customerName: t.customerId ? t.customerId.name : 'Customer',
      customerPhone: t.customerId ? t.customerId.phone : '',
      type: t.type,
      amount: t.amount,
      note: t.note,
      date: t.date,
    }));

    return NextResponse.json({
      totalOutstandingCredit,
      todayUdhaar,
      todayWasooli,
      monthUdhaar,
      monthRecovery,
      collectionRate,
      topDebtors,
      last7Days,
      recentTransactions,
      totalCustomers: customers.length,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load dashboard data.' },
      { status: 500 }
    );
  }
}
