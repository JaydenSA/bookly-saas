import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { clerkUserId, name, email } = await request.json();

    if (!clerkUserId || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // First, try to find by clerkUserId (for already migrated users)
    let user = await User.findOne({ clerkUserId });

    // If not found by clerkUserId, try to find by email
    // This handles existing users who migrated from Kinde
    if (!user) {
      user = await User.findOne({ email });
      
      if (user) {
        // Found existing user by email - update their clerkUserId
        console.log(`Updating Clerk ID for existing user: ${email}`);
        console.log(`  Old ID: ${user.clerkUserId}`);
        console.log(`  New ID: ${clerkUserId}`);
        
        user.clerkUserId = clerkUserId; // Update to new Clerk ID
        await user.save();
        
        return NextResponse.json({
          success: true,
          user: {
            id: user._id,
            clerkUserId: user.clerkUserId,
            name: user.name,
            email: user.email,
            role: user.role,
            plan: user.plan,
            businessId: user.businessId,
            phone: user.phone,
            createdAt: user.createdAt,
          },
          message: 'User found and updated with new Clerk ID'
        });
      }
    }

    if (user) {
      // User exists with correct clerkUserId
      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          clerkUserId: user.clerkUserId,
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
      clerkUserId,
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
        clerkUserId: user.clerkUserId,
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
