import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the Clerk user ID from the request headers or query params
    const clerkUserId = request.headers.get('x-clerk-user-id') || 
                       new URL(request.url).searchParams.get('clerkUserId');

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'User ID not provided' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

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
        theme: user.theme,
        permissions: user.permissions || {
          canManageServices: false,
          canManageBookings: user.role === 'owner' ? true : (user.permissions?.canManageBookings || false),
          canManageCustomers: false,
          canViewReports: false,
          canManageBusiness: false,
        },
        isActive: user.isActive,
        createdAt: user.createdAt,
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
