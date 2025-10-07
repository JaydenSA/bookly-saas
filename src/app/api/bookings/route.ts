import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const docs = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: docs }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/bookings] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const created = await Booking.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/bookings] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create booking' }, { status: 500 });
  }
}
