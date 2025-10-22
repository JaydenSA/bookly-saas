import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserSettings from '@/models/UserSettings';
import User from '@/models/User';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser(request);
    
    if (error || !dbUser) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get or create user settings
    let userSettings = await UserSettings.findOne({ userId: dbUser._id });
    
    if (!userSettings) {
      // Create default settings
      userSettings = new UserSettings({
        userId: dbUser._id,
        notifications: {
          email: true,
          sms: false,
          push: true,
          marketing: false,
        },
        appearance: {
          theme: dbUser.theme || 'system',
        },
      });
      await userSettings.save();
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

export async function POST(request: NextRequest) {
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

    // Update or create user settings
    const userSettings = await UserSettings.findOneAndUpdate(
      { userId: dbUser._id },
      {
        userId: dbUser._id,
        notifications: notifications || {
          email: true,
          sms: false,
          push: true,
          marketing: false,
        },
        appearance: appearance || {
          theme: 'system',
        },
      },
      { upsert: true, new: true }
    );

    // Update theme in User model as well
    if (appearance?.theme) {
      await User.findByIdAndUpdate(dbUser._id, { theme: appearance.theme });
    }

    return NextResponse.json({ userSettings });
  } catch (error) {
    console.error('Error saving user settings:', error);
    return NextResponse.json(
      { error: 'Failed to save user settings' },
      { status: 500 }
    );
  }
}
