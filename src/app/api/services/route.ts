import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const docs = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: docs }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/services] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const created = await Service.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/services] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create service' }, { status: 500 });
  }
}
