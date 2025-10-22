import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import Category from '@/models/Category';
import Staff from '@/models/Staff';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Ensure models are registered
    if (!mongoose.models.Service) {
      console.log('Service model not registered, importing...');
      require('@/models/Service');
    }
    if (!mongoose.models.Category) {
      console.log('Category model not registered, importing...');
      require('@/models/Category');
    }
    if (!mongoose.models.Staff) {
      console.log('Staff model not registered, importing...');
      require('@/models/Staff');
    }
    
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    console.log('[GET /api/services] businessId:', businessId);
    
    const filter = businessId ? { businessId } : {};
    console.log('[GET /api/services] filter:', filter);
    
    const docs = await Service.find(filter)
      .populate('categoryId', 'name color')
      .populate('staffIds', 'firstName lastName role')
      .sort({ createdAt: -1 });
    
    console.log('[GET /api/services] found services:', docs.length);
    return NextResponse.json({ services: docs }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/services] Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch services',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Ensure models are registered
    if (!mongoose.models.Service) {
      require('@/models/Service');
    }
    if (!mongoose.models.Category) {
      require('@/models/Category');
    }
    if (!mongoose.models.Staff) {
      require('@/models/Staff');
    }
    
    const body = await request.json();
    const created = await Service.create(body);
    
    // Populate the category and staff information before returning
    const populatedService = await Service.findById(created._id)
      .populate('categoryId', 'name color')
      .populate('staffIds', 'firstName lastName role');
    
    return NextResponse.json(populatedService, { status: 201 });
  } catch (error) {
    console.error('[POST /api/services] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create service' }, { status: 500 });
  }
}
