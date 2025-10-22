import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserSettings from '@/models/UserSettings';
import User from '@/models/User';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser(request);
    
    if (error || !dbUser) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id } = await params;
    const userSettings = await UserSettings.findById(id);
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser(request);
    
    if (error || !dbUser) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { notifications, appearance } = body;

    const { id } = await params;
    const userSettings = await UserSettings.findByIdAndUpdate(
      id,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser(request);
    
    if (error || !dbUser) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id } = await params;
    const userSettings = await UserSettings.findByIdAndDelete(id);
    
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
