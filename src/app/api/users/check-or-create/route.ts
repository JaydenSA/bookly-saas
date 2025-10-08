import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { kindeUserId, name, email } = await request.json();

    if (!kindeUserId || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await User.findOne({ kindeUserId });

    if (user) {
      // User exists, return user data
      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          kindeUserId: user.kindeUserId,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          businessId: user.businessId,
          phone: user.phone,
          createdAt: user.createdAt,
        },
        message: 'User found'
      });
    }

    // Create new user
    user = new User({
      kindeUserId,
      name,
      email,
      role: 'owner', // Default role for new signups
      plan: 'free', // Default plan
    });

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        kindeUserId: user.kindeUserId,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        businessId: user.businessId,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Error in check-or-create user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
