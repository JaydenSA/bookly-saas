import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

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

    const staffMembers = await User.find({
      businessId: dbUser.businessId,
      role: 'staff'
    }).sort({ isActive: -1, createdAt: -1 }); // Active members first, then by creation date

    // Ensure all staff members have isActive and permissions fields (for existing users that might not have them)
    const updatedStaffMembers = await Promise.all(
      staffMembers.map(async (member) => {
        let needsUpdate = false;
        
        // Fix missing isActive field
        if (member.isActive === undefined || member.isActive === null) {
          member.isActive = true;
          needsUpdate = true;
          console.log('Updated missing isActive field for user:', member._id, 'to true');
        }
        
        // Fix missing permissions field
        if (!member.permissions || member.permissions === undefined || member.permissions === null) {
          member.permissions = {
            canManageServices: false,
            canManageBookings: true,
            canManageCustomers: false,
            canViewReports: false,
            canManageStaff: false,
            canManageBusiness: false,
          };
          needsUpdate = true;
          console.log('Updated missing permissions field for user:', member._id);
        }
        
        if (needsUpdate) {
          await member.save();
        }
        
        return member;
      })
    );

    console.log('Fetched staff members:', updatedStaffMembers.map(m => ({ id: m._id, name: m.name, isActive: m.isActive, role: m.role })));

    return NextResponse.json({ staffMembers: updatedStaffMembers });
  } catch (error) {
    console.error('Error fetching staff members:', error);
    return NextResponse.json({ error: 'Failed to fetch staff members' }, { status: 500 });
  }
}
