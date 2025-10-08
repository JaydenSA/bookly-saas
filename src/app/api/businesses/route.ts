import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    
    let query = {};
    if (ownerId) {
      query = { ownerId };
    }
    
    const docs = await Business.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, businesses: docs }, { status: 200 });
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
    return NextResponse.json({ success: true, business: created }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/businesses] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create business' }, { status: 500 });
  }
}
