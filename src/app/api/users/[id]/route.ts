import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();
    const updated = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: updated._id,
        kindeUserId: updated.kindeUserId,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        plan: updated.plan,
        businessId: updated.businessId,
        phone: updated.phone,
        theme: updated.theme,
        createdAt: updated.createdAt,
      }
    }, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/users] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const result = await User.deleteOne({ _id: id });
    if (!result) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/users] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
  }
}
