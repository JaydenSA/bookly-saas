import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Staff from '@/models/Staff';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser(request);
    
    if (error || !dbUser) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const staff = await Staff.findById(id).populate('serviceIds', 'name');

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Verify staff belongs to user's business
    if (staff.businessId.toString() !== dbUser.businessId?.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ staff });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    return NextResponse.json({ error: 'Failed to fetch staff member' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser(request);
    
    if (error || !dbUser) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const staff = await Staff.findById(id);

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Verify staff belongs to user's business
    if (staff.businessId.toString() !== dbUser.businessId?.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate('serviceIds', 'name');

    return NextResponse.json({ 
      staff: updatedStaff,
      message: 'Staff member updated successfully' 
    });
  } catch (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser(request);
    
    if (error || !dbUser) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const staff = await Staff.findById(id);

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Verify staff belongs to user's business
    if (staff.businessId.toString() !== dbUser.businessId?.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Staff.findByIdAndDelete(id);

    return NextResponse.json({ 
      message: 'Staff member deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json({ error: 'Failed to delete staff member' }, { status: 500 });
  }
}

