import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserSettings from '@/models/UserSettings';
import User from '@/models/User';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const userSettings = await UserSettings.findById(params.id);
    
    if (!userSettings) {
      return NextResponse.json(
        { error: 'User settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ userSettings });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { notifications, appearance } = body;

    const userSettings = await UserSettings.findByIdAndUpdate(
      params.id,
      {
        ...(notifications && { notifications }),
        ...(appearance && { appearance }),
      },
      { new: true }
    );

    if (!userSettings) {
      return NextResponse.json(
        { error: 'User settings not found' },
        { status: 404 }
      );
    }

    // Update theme in User model as well
    if (appearance?.theme) {
      await User.findByIdAndUpdate(userSettings.userId, { theme: appearance.theme });
    }

    return NextResponse.json({ userSettings });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const userSettings = await UserSettings.findByIdAndDelete(params.id);
    
    if (!userSettings) {
      return NextResponse.json(
        { error: 'User settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'User settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting user settings:', error);
    return NextResponse.json(
      { error: 'Failed to delete user settings' },
      { status: 500 }
    );
  }
}
