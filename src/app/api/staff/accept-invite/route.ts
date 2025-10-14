import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StaffInvite from '@/models/StaffInvite';
import User from '@/models/User';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find and validate invite
    const invite = await StaffInvite.findOne({
      token,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).populate('businessId', 'name slug');

    if (!invite) {
      return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 });
    }

    // Check if user already exists
    let staffUser = await User.findOne({ kindeUserId: user.id });
    
    if (staffUser) {
      // Check if user is already an active member of another business
      if (staffUser.businessId && 
          staffUser.businessId.toString() !== invite.businessId._id.toString() && 
          staffUser.isActive) {
        return NextResponse.json({ 
          error: 'User is already part of another business',
          message: 'You are already working for another business. Please contact your current business owner to leave before joining this one.'
        }, { status: 400 });
      }
      
      // Update existing user to join this business
      staffUser.businessId = invite.businessId._id;
      staffUser.role = 'staff';
      staffUser.permissions = invite.permissions;
      staffUser.isActive = true;
      await staffUser.save();
      console.log('Updated existing user:', { id: staffUser._id, isActive: staffUser.isActive, role: staffUser.role });
    } else {
      // Create new staff user
      staffUser = new User({
        kindeUserId: user.id,
        name: user.given_name + ' ' + user.family_name,
        email: user.email,
        role: 'staff',
        businessId: invite.businessId._id,
        permissions: invite.permissions,
        isActive: true,
      });

      await staffUser.save();
      console.log('Created new user:', { id: staffUser._id, isActive: staffUser.isActive, role: staffUser.role });
    }

    // Update invite status
    invite.status = 'accepted';
    invite.acceptedAt = new Date();
    invite.acceptedBy = staffUser._id;
    await invite.save();

    // Clean up any other pending invites for this user's email
    await StaffInvite.updateMany(
      { 
        email: user.email, 
        status: 'pending',
        _id: { $ne: invite._id }
      },
      { status: 'expired' }
    );

    return NextResponse.json({
      user: {
        id: staffUser._id,
        kindeUserId: staffUser.kindeUserId,
        name: staffUser.name,
        email: staffUser.email,
        role: staffUser.role,
        businessId: staffUser.businessId,
        permissions: staffUser.permissions,
        isActive: staffUser.isActive,
        createdAt: staffUser.createdAt,
      },
      business: invite.businessId
    });
  } catch (error) {
    console.error('Error accepting staff invite:', error);
    return NextResponse.json({ error: 'Failed to accept invite' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    await connectDB();
    
    // Find and validate invite
    const invite = await StaffInvite.findOne({
      token,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).populate('businessId', 'name slug').populate('invitedBy', 'name email');

    if (!invite) {
      return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 });
    }

    return NextResponse.json({ invite });
  } catch (error) {
    console.error('Error validating staff invite:', error);
    return NextResponse.json({ error: 'Failed to validate invite' }, { status: 500 });
  }
}
