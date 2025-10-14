import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import StaffInvite from '@/models/StaffInvite';
import User from '@/models/User';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const body = await request.json();
    const { permissions } = body;

    const invite = await StaffInvite.findOneAndUpdate(
      { 
        _id: params.id,
        businessId: dbUser.businessId,
        status: 'pending'
      },
      { permissions },
      { new: true }
    );

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    return NextResponse.json({ invite });
  } catch (error) {
    console.error('Error updating staff invite:', error);
    return NextResponse.json({ error: 'Failed to update invite' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const invite = await StaffInvite.findOneAndDelete({
      _id: params.id,
      businessId: dbUser.businessId
    });

    if (!invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Invite deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff invite:', error);
    return NextResponse.json({ error: 'Failed to delete invite' }, { status: 500 });
  }
}
