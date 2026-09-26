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

    // Fetch customers
    const customers = await Customer.find({ userId: userObjectId }).sort({ createdAt: -1 });

    // Aggregate transactions by customer for this user
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
          lastTransactionDate: { $max: '$date' },
          txnCount: { $sum: 1 },
        },
      },
    ]);

    const statsMap = new Map();
    stats.forEach((item) => {
      statsMap.set(item._id.toString(), {
        totalUdhaar: item.totalUdhaar || 0,
        totalWasooli: item.totalWasooli || 0,
        balance: (item.totalUdhaar || 0) - (item.totalWasooli || 0),
        lastTransactionDate: item.lastTransactionDate,
        txnCount: item.txnCount || 0,
      });
    });

    const customersWithBalance = customers.map((c) => {
      const cStats = statsMap.get(c._id.toString()) || {
        totalUdhaar: 0,
        totalWasooli: 0,
        balance: 0,
        lastTransactionDate: c.createdAt,
        txnCount: 0,
      };

      return {
        _id: c._id,
        id: c._id.toString(),
        name: c.name,
        phone: c.phone,
        address: c.address || '',
        notes: c.notes || '',
        createdAt: c.createdAt,
        totalUdhaar: cStats.totalUdhaar,
        totalWasooli: cStats.totalWasooli,
        balance: cStats.balance,
        lastTransactionDate: cStats.lastTransactionDate,
        txnCount: cStats.txnCount,
      };
    });

    return NextResponse.json({ customers: customersWithBalance });
  } catch (error) {
    console.error('Fetch customers error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers.' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { name, phone, address, notes, initialBalance } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Customer name and phone number are required.' },
        { status: 400 }
      );
    }

    const customer = await Customer.create({
      userId: new mongoose.Types.ObjectId(authUser.userId),
      name: name.trim(),
      phone: phone.trim(),
      address: address ? address.trim() : '',
      notes: notes ? notes.trim() : '',
    });

    let initialBalanceNum = Number(initialBalance) || 0;
    if (initialBalanceNum > 0) {
      await Transaction.create({
        userId: new mongoose.Types.ObjectId(authUser.userId),
        customerId: customer._id,
        type: 'udhaar',
        amount: initialBalanceNum,
        note: 'Pichla Baqi Udhaar (Initial Balance)',
        date: new Date(),
      });
    }

    return NextResponse.json(
      {
        message: 'Customer added successfully.',
        customer: {
          _id: customer._id,
          id: customer._id.toString(),
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          notes: customer.notes,
          createdAt: customer.createdAt,
          balance: initialBalanceNum,
          totalUdhaar: initialBalanceNum,
          totalWasooli: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create customer error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create customer.' },
      { status: 500 }
    );
  }
}
