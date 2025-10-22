import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import User from '@/models/User';
import { getAuthenticatedUser } from '@/lib/auth';

// Calculate end time based on start time and duration
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const userId = searchParams.get('userId');

    const query: Record<string, unknown> = {};
    
    if (businessId) {
      query.businessId = businessId;
    }
    
    if (userId) {
      query.userId = userId;
    }

    const bookings = await Booking.find(query)
      .populate('serviceId')
      .populate('staffId')
      .sort({ date: -1, startTime: -1 });

    return NextResponse.json({ success: true, bookings }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/bookings] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user: dbUser, error } = await getAuthenticatedUser(request);

    if (error || !dbUser) {
      return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { businessId, serviceId, staffId, date, startTime, notes } = body;

    if (!businessId || !serviceId || !staffId || !date || !startTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get service details for duration and price
    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Calculate end time based on service duration
    const endTime = calculateEndTime(startTime, service.duration);

    // Create the booking
    const booking = await Booking.create({
      businessId,
      userId: dbUser._id,
      client: {
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || '',
      },
      serviceId,
      staffId,
      date: new Date(date),
      startTime,
      endTime,
      totalPrice: service.price,
      depositAmount: 0,
      notes,
      status: 'pending',
      paymentStatus: 'unpaid',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('serviceId')
      .populate('staffId');

    return NextResponse.json({ success: true, booking: populatedBooking }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/bookings] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
  }
}
