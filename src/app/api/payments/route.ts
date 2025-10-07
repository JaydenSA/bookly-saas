import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const docs = await Payment.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: docs }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/payments] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const created = await Payment.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/payments] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create payment' }, { status: 500 });
  }
}
