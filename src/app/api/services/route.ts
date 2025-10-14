import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    const filter = businessId ? { businessId } : {};
    const docs = await Service.find(filter)
      .populate('categoryId', 'name color')
      .sort({ createdAt: -1 });
    return NextResponse.json({ services: docs }, { status: 200 });
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
    
    // Populate the category information before returning
    const populatedService = await Service.findById(created._id)
      .populate('categoryId', 'name color');
    
    return NextResponse.json(populatedService, { status: 201 });
  } catch (error) {
    console.error('[POST /api/services] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create service' }, { status: 500 });
  }
}
