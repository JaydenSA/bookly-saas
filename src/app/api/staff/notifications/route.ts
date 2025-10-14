import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StaffInvite from '@/models/StaffInvite';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // User doesn't exist, no notifications
      return NextResponse.json({ invites: [] });
    }

    // Find pending invites for this user's email
    const invites = await StaffInvite.find({
      email,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    }).populate('businessId', 'name slug').populate('invitedBy', 'name email').sort({ createdAt: -1 });

    return NextResponse.json({ invites });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
