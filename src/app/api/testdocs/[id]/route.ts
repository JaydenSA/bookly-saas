import dbConnect from '@/lib/mongodb';
import TestDoc from '@/models/TestDoc';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();
    const updated = await TestDoc.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error(`[PUT /api/testdocs] Error:`, error);
    return NextResponse.json({ success: false, message: 'Failed to update doc' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const result = await TestDoc.deleteOne({ _id: id });
    if (!result) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error(`[DELETE /api/testdocs] Error:`, error);
    return NextResponse.json({ success: false, message: 'Failed to delete doc' }, { status: 500 });
  }
}
