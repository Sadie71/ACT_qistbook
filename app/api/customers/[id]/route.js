import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
import Transaction from '@/models/Transaction';
import { getUserFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    const customerObjectId = new mongoose.Types.ObjectId(id);
    const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

    const customer = await Customer.findOne({
      _id: customerObjectId,
      userId: userObjectId,
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get all transactions for this customer to calculate running balance
    const transactions = await Transaction.find({
      userId: userObjectId,
      customerId: customerObjectId,
    }).sort({ date: 1, createdAt: 1 });

    let runningBalance = 0;
    let totalUdhaar = 0;
    let totalWasooli = 0;

    const ledgerEntries = transactions.map((t) => {
      if (t.type === 'udhaar') {
        runningBalance += t.amount;
        totalUdhaar += t.amount;
      } else {
        runningBalance -= t.amount;
        totalWasooli += t.amount;
      }

      return {
        _id: t._id,
        id: t._id.toString(),
        type: t.type,
        amount: t.amount,
        note: t.note,
        date: t.date,
        createdAt: t.createdAt,
        balanceAfter: runningBalance,
      };
    });

    // Reverse for displaying newest first in list, while maintaining balanceAfter calculation
    const reversedLedger = [...ledgerEntries].reverse();

    return NextResponse.json({
      customer: {
        _id: customer._id,
        id: customer._id.toString(),
        name: customer.name,
        phone: customer.phone,
        address: customer.address || '',
        notes: customer.notes || '',
        createdAt: customer.createdAt,
        totalUdhaar,
        totalWasooli,
        balance: runningBalance,
        transactions: reversedLedger,
      },
    });
  } catch (error) {
    console.error('Fetch customer error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customer details.' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    const body = await req.json();
    const { name, phone, address, notes } = body;

    const customer = await Customer.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(authUser.userId),
      },
      {
        ...(name && { name: name.trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(address !== undefined && { address: address.trim() }),
        ...(notes !== undefined && { notes: notes.trim() }),
      },
      { new: true }
    );

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Customer updated successfully',
      customer,
    });
  } catch (error) {
    console.error('Update customer error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update customer.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
    }

    const customerObjectId = new mongoose.Types.ObjectId(id);
    const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

    const customer = await Customer.findOneAndDelete({
      _id: customerObjectId,
      userId: userObjectId,
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Delete all transactions of this customer as required
    await Transaction.deleteMany({
      userId: userObjectId,
      customerId: customerObjectId,
    });

    return NextResponse.json({
      message: 'Customer and all associated transactions deleted successfully.',
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete customer.' },
      { status: 500 }
    );
  }
}
