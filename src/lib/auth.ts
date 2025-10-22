import { currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    await connectDB();
    
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { user: null, error: 'Not authenticated' };
    }

    const dbUser = await User.findOne({ clerkUserId: clerkUser.id });
    
    if (!dbUser) {
      return { user: null, error: 'User not found in database' };
    }

    return { user: dbUser, error: null };
  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error);
    return { user: null, error: 'Internal server error' };
  }
}
