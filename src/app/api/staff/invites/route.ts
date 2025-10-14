import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StaffInvite from '@/models/StaffInvite';
import User from '@/models/User';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { sendEmail, generateStaffInviteEmail } from '@/lib/email';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
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

    const invites = await StaffInvite.find({ 
      businessId: dbUser.businessId 
    }).populate('invitedBy', 'name email').sort({ createdAt: -1 });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error('Error fetching staff invites:', error);
    return NextResponse.json({ error: 'Failed to fetch invites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { email, permissions } = body;

    if (!email || !permissions) {
      return NextResponse.json({ error: 'Email and permissions are required' }, { status: 400 });
    }

    // Check if user already exists and is already an active staff member of this business
    const existingUser = await User.findOne({ email });
    if (existingUser && 
        existingUser.businessId && 
        existingUser.businessId.toString() === dbUser.businessId.toString() && 
        existingUser.isActive) {
      return NextResponse.json({ error: 'User is already an active staff member of this business' }, { status: 400 });
    }

    // Check if user is part of another business
    if (existingUser && 
        existingUser.businessId && 
        existingUser.businessId.toString() !== dbUser.businessId.toString() && 
        existingUser.isActive) {
      return NextResponse.json({ 
        error: 'User is already part of another business',
        message: 'This user is already working for another business. They would need to leave their current business first.'
      }, { status: 400 });
    }

    // Check if there's already a pending invite for this email
    const existingInvite = await StaffInvite.findOne({
      businessId: dbUser.businessId,
      email,
      status: 'pending'
    });

    if (existingInvite) {
      return NextResponse.json({ error: 'Invite already sent to this email' }, { status: 400 });
    }

    // If user exists but is inactive or has no businessId, we can invite them
    // This will be handled in the accept invite logic

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = new StaffInvite({
      businessId: dbUser.businessId,
      invitedBy: dbUser._id,
      email,
      permissions,
      token,
      expiresAt,
    });

    await invite.save();

    // Generate invite URL
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/accept-invite?token=${token}`;

    // Get business and inviter info for email
    const business = await dbUser.businessId ? 
      await import('@/models/Business').then(m => m.default.findById(dbUser.businessId)) : 
      null;

    // Generate permission descriptions
    const permissionDescriptions = [];
    if (permissions.canManageBookings) permissionDescriptions.push('Manage Bookings');
    if (permissions.canManageServices) permissionDescriptions.push('Manage Services');
    if (permissions.canManageCustomers) permissionDescriptions.push('Manage Customers');
    if (permissions.canViewReports) permissionDescriptions.push('View Reports');
    if (permissions.canManageStaff) permissionDescriptions.push('Manage Staff');
    if (permissions.canManageBusiness) permissionDescriptions.push('Manage Business');

    // Send email invitation
    const emailData = generateStaffInviteEmail(
      business?.name || 'Our Business',
      dbUser.name,
      inviteUrl,
      permissionDescriptions
    );
    emailData.to = email;

    const emailSent = await sendEmail(emailData);

    return NextResponse.json({
      invite,
      inviteUrl,
      emailSent
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating staff invite:', error);
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
  }
}
