import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Find user and verify they're an owner
    const dbUser = await User.findOne({ kindeUserId: user.id });
    if (!dbUser || dbUser.role !== 'owner' || !dbUser.businessId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { permissions, isActive } = body;

    console.log('PUT request for staff member:', { id, permissions, isActive });

    const updateData: any = {};
    
    // Always update permissions if provided
    if (permissions) {
      updateData.permissions = permissions;
      console.log('Setting permissions in updateData:', permissions);
    }
    
    // Update isActive if provided
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    console.log('Final updateData:', updateData);

    // Check current user before update
    const userBeforeUpdate = await User.findById(id);
    console.log('User before update:', { 
      id: userBeforeUpdate?._id, 
      permissions: userBeforeUpdate?.permissions 
    });

    // Try a different approach - find the user and update manually
    const staffMember = await User.findOne({
      _id: id,
      businessId: dbUser.businessId,
      role: 'staff'
    });

    if (!staffMember) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    console.log('Found staff member before update:', { 
      id: staffMember._id, 
      permissions: staffMember.permissions 
    });

    // Update the fields manually
    if (permissions) {
      staffMember.permissions = permissions;
      console.log('Set permissions on staff member:', permissions);
    }
    
    if (isActive !== undefined) {
      staffMember.isActive = isActive;
    }

    // Save the document
    await staffMember.save();
    
    console.log('Staff member after save:', { 
      id: staffMember._id, 
      permissions: staffMember.permissions 
    });

    console.log('Updated staff member via PUT:', { 
      id: staffMember?._id, 
      permissions: staffMember?.permissions,
      isActive: staffMember?.isActive 
    });

    if (!staffMember) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Ensure we return the permissions field explicitly
    const responseData = {
      _id: staffMember._id,
      kindeUserId: staffMember.kindeUserId,
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      businessId: staffMember.businessId,
      phone: staffMember.phone,
      theme: staffMember.theme,
      permissions: staffMember.permissions || {
        canManageServices: false,
        canManageBookings: true,
        canManageCustomers: false,
        canViewReports: false,
        canManageStaff: false,
        canManageBusiness: false,
      },
      isActive: staffMember.isActive,
      createdAt: staffMember.createdAt,
      plan: staffMember.plan
    };

    console.log('Final response data:', responseData);

    return NextResponse.json({ staffMember: responseData });
  } catch (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Find user and verify they're an owner
    const dbUser = await User.findOne({ kindeUserId: user.id });
    if (!dbUser || dbUser.role !== 'owner' || !dbUser.businessId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { permissions, isActive } = body;

    console.log('PATCH request for staff member:', { id, isActive, permissions });

    const staffMember = await User.findOneAndUpdate(
      { 
        _id: id,
        businessId: dbUser.businessId,
        role: 'staff'
      },
      { 
        ...(permissions && { permissions }),
        // Always set isActive to a boolean value
        isActive: isActive !== undefined ? isActive : true
      },
      { new: true }
    );

    if (!staffMember) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    console.log('Updated staff member:', { id: staffMember._id, isActive: staffMember.isActive });

    return NextResponse.json({ staffMember });
  } catch (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Find user and verify they're an owner
    const dbUser = await User.findOne({ kindeUserId: user.id });
    if (!dbUser || dbUser.role !== 'owner' || !dbUser.businessId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;

    // Don't actually delete, just deactivate
    const staffMember = await User.findOneAndUpdate(
      {
        _id: id,
        businessId: dbUser.businessId,
        role: 'staff'
      },
      { isActive: false },
      { new: true }
    );

    if (!staffMember) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Staff member deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating staff member:', error);
    return NextResponse.json({ error: 'Failed to deactivate staff member' }, { status: 500 });
  }
}
