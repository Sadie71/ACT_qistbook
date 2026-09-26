import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectDB();
    const user = await User.findById(authUser.userId).select('-passwordHash');

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        shopName: user.shopName,
        shopType: user.shopType,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Auth /me error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error checking session.' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { name, shopName, shopType, newPassword } = body;

    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (name) user.name = name.trim();
    if (shopName) user.shopName = shopName.trim();
    if (shopType) user.shopType = shopType;

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters.' },
          { status: 400 }
        );
      }
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.default.genSalt(10);
      user.passwordHash = await bcrypt.default.hash(newPassword, salt);
    }

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        shopName: user.shopName,
        shopType: user.shopType,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
