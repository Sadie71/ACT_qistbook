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

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query = { userId: userObjectId };

    if (customerId && mongoose.Types.ObjectId.isValid(customerId)) {
      query.customerId = new mongoose.Types.ObjectId(customerId);
    }

    if (type && ['udhaar', 'wasooli'].includes(type)) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .populate('customerId', 'name phone')
      .lean();

    const formattedTransactions = transactions.map((t) => ({
      _id: t._id,
      id: t._id.toString(),
      customerId: t.customerId ? t.customerId._id.toString() : '',
      customerName: t.customerId ? t.customerId.name : 'Unknown Customer',
      customerPhone: t.customerId ? t.customerId.phone : '',
      type: t.type,
      amount: t.amount,
      note: t.note || '',
      date: t.date,
      createdAt: t.createdAt,
    }));

    return NextResponse.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error('Fetch transactions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions.' },
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
    const { customerId, type, amount, note, date } = body;

    if (!customerId || !type || amount === undefined || amount === null) {
      return NextResponse.json(
        { error: 'Customer, transaction type and amount are required.' },
        { status: 400 }
      );
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number greater than zero.' },
        { status: 400 }
      );
    }

    if (!['udhaar', 'wasooli'].includes(type)) {
      return NextResponse.json(
        { error: 'Transaction type must be either udhaar or wasooli.' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    const userObjectId = new mongoose.Types.ObjectId(authUser.userId);
    const customerObjectId = new mongoose.Types.ObjectId(customerId);

    // Verify customer belongs to this user
    const customer = await Customer.findOne({
      _id: customerObjectId,
      userId: userObjectId,
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
    }

    const transaction = await Transaction.create({
      userId: userObjectId,
      customerId: customerObjectId,
      type,
      amount: numAmount,
      note: note ? note.trim() : '',
      date: date ? new Date(date) : new Date(),
    });

    // Calculate customer's updated balance
    const stats = await Transaction.aggregate([
      { $match: { customerId: customerObjectId, userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalUdhaar: {
            $sum: { $cond: [{ $eq: ['$type', 'udhaar'] }, '$amount', 0] },
          },
          totalWasooli: {
            $sum: { $cond: [{ $eq: ['$type', 'wasooli'] }, '$amount', 0] },
          },
        },
      },
    ]);

    const totalUdhaar = stats[0]?.totalUdhaar || 0;
    const totalWasooli = stats[0]?.totalWasooli || 0;
    const newBalance = totalUdhaar - totalWasooli;

    return NextResponse.json(
      {
        message: 'Transaction recorded successfully.',
        transaction: {
          _id: transaction._id,
          id: transaction._id.toString(),
          customerId: customer._id.toString(),
          customerName: customer.name,
          customerPhone: customer.phone,
          type: transaction.type,
          amount: transaction.amount,
          note: transaction.note,
          date: transaction.date,
          createdAt: transaction.createdAt,
        },
        customerUpdatedBalance: newBalance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to record transaction.' },
      { status: 500 }
    );
  }
}
