import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BookingSettings from '@/models/BookingSettings';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    if (!businessId) return NextResponse.json({ error: 'businessId required' }, { status: 400 });
    const settings = await BookingSettings.findOne({ businessId });
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/bookings/settings] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { businessId, ...rest } = body || {};
    if (!businessId) return NextResponse.json({ error: 'businessId required' }, { status: 400 });
    const updated = await BookingSettings.findOneAndUpdate(
      { businessId },
      { businessId, ...rest },
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json({ settings: updated }, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/bookings/settings] Error:', error);
    return NextResponse.json({ error: 'Failed to update booking settings' }, { status: 500 });
  }
}


