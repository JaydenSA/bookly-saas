import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Staff from '@/models/Staff';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const serviceId = searchParams.get('serviceId');

    // Public endpoint - allow fetching staff by businessId for booking purposes
    if (businessId) {
      const query: Record<string, unknown> = { businessId };

      // If serviceId is provided, filter staff who can perform this service
      if (serviceId) {
        query.serviceIds = { $in: [serviceId] };
      }

      console.log('[GET /api/staff] businessId:', businessId, 'serviceId:', serviceId);
      console.log('[GET /api/staff] query:', query);

      // First, let's see all staff for this business
      const allStaff = await Staff.find({ businessId }).populate('serviceIds');
      console.log('[GET /api/staff] all staff for business:', allStaff.length);
      console.log('[GET /api/staff] all staff details:', allStaff.map(s => ({ 
        id: s._id, 
        name: `${s.firstName} ${s.lastName}`, 
        serviceIds: s.serviceIds 
      })));

      const staffMembers = await Staff.find(query).populate('serviceIds');
      console.log('[GET /api/staff] found staff with query:', staffMembers.length);
      console.log('[GET /api/staff] staff details:', staffMembers.map(s => ({ 
        id: s._id, 
        name: `${s.firstName} ${s.lastName}`, 
        serviceIds: s.serviceIds 
      })));
      
      return NextResponse.json({ staffMembers });
    }

    // Private endpoint - require authentication
    const { user: dbUser, error } = await getAuthenticatedUser();
    
    if (error || !dbUser) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    if (!dbUser.businessId) {
      return NextResponse.json({ error: 'No business associated with user' }, { status: 400 });
    }

    const staff = await Staff.find({ 
      businessId: dbUser.businessId 
    }).populate('serviceIds', 'name').sort({ createdAt: -1 });

    return NextResponse.json({ staffMembers: staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser();
    
    if (error || !dbUser) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    if (!dbUser.businessId) {
      return NextResponse.json({ error: 'No business associated with user' }, { status: 400 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, role, bio, imageUrl, serviceIds } = body;

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    const newStaff = new Staff({
      businessId: dbUser.businessId,
      firstName,
      lastName,
      email,
      phone,
      role,
      bio,
      imageUrl,
      serviceIds: serviceIds || [],
    });

    await newStaff.save();

    return NextResponse.json({ 
      staff: newStaff,
      message: 'Staff member created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 });
  }
}

