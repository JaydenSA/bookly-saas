import dbConnect from '@/lib/mongodb';
import TestDoc from '@/models/TestDoc';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const docs = await TestDoc.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: docs }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/testdocs] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch docs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const created = await TestDoc.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/testdocs] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create doc' }, { status: 500 });
  }
}
