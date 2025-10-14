import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the Kinde user ID from the request headers or query params
    // This would typically come from the Kinde middleware
    const kindeUserId = request.headers.get('x-kinde-user-id') || 
                       new URL(request.url).searchParams.get('kindeUserId');

    if (!kindeUserId) {
      return NextResponse.json(
        { error: 'User ID not provided' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ kindeUserId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('API /users/me - Found user:', {
      id: user._id,
      role: user.role,
      permissions: user.permissions,
      hasPermissions: !!user.permissions
    });

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
        theme: user.theme,
        permissions: user.permissions || {
          canManageServices: false,
          canManageBookings: user.role === 'owner' ? true : (user.permissions?.canManageBookings || false),
          canManageCustomers: false,
          canViewReports: false,
          canManageStaff: false,
          canManageBusiness: false,
        },
        isActive: user.isActive,
        createdAt: user.createdAt,
      }
    });

    console.log('API /users/me - Returning user data:', {
      id: user._id,
      role: user.role,
      permissions: user.permissions || 'default permissions',
      hasPermissions: !!(user.permissions || {
        canManageServices: false,
        canManageBookings: user.role === 'owner' ? true : (user.permissions?.canManageBookings || false),
        canManageCustomers: false,
        canViewReports: false,
        canManageStaff: false,
        canManageBusiness: false,
      })
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
