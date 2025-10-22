import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser();

    if (error || !dbUser) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    // Find the booking and check ownership
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if user owns this booking or manages the business
    const isOwner = booking.userId?.toString() === dbUser._id.toString();
    const isBusinessManager = booking.businessId?.toString() === dbUser.businessId?.toString();

    if (!isOwner && !isBusinessManager) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const updated = await Booking.findByIdAndUpdate(id, body, { 
      new: true, 
      runValidators: true 
    })
    .populate('serviceId')
    .populate('staffId');

    return NextResponse.json({ success: true, booking: updated }, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/bookings] Error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser();

    if (error || !dbUser) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    // Find the booking and check ownership
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if user manages the business (only business owners can change status)
    const isBusinessManager = booking.businessId?.toString() === dbUser.businessId?.toString();

    if (!isBusinessManager) {
      return NextResponse.json({ error: 'Only business owners can update booking status' }, { status: 403 });
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await Booking.findByIdAndUpdate(id, body, { 
      new: true, 
      runValidators: true 
    })
    .populate('serviceId')
    .populate('staffId');

    return NextResponse.json({ success: true, booking: updated }, { status: 200 });
  } catch (error) {
    console.error('[PATCH /api/bookings] Error:', error);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const result = await Booking.deleteOne({ _id: id });
    if (!result) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/bookings] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete booking' }, { status: 500 });
  }
}
