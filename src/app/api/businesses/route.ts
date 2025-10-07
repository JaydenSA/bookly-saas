import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const docs = await Business.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: docs }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/businesses] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch businesses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const created = await Business.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/businesses] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create business' }, { status: 500 });
  }
}
