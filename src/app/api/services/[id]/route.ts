import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import Category from '@/models/Category';
import Staff from '@/models/Staff';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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
    
    const { id } = await context.params;
    const body = await request.json();
    
    console.log('[PUT /api/services] Updating service:', id, 'with data:', body);
    
    // Validate required fields
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        message: 'Service name is required' 
      }, { status: 400 });
    }
    
    if (body.price === undefined || body.price < 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Valid price is required' 
      }, { status: 400 });
    }
    
    if (body.duration === undefined || body.duration <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Valid duration is required' 
      }, { status: 400 });
    }
    
    const updated = await Service.findByIdAndUpdate(id, body, { new: true, runValidators: true })
      .populate('categoryId', 'name color')
      .populate('staffIds', 'firstName lastName role');
    
    if (!updated) {
      console.log('[PUT /api/services] Service not found:', id);
      return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    }
    
    console.log('[PUT /api/services] Successfully updated service:', updated);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/services] Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update service',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // Ensure models are registered
    if (!mongoose.models.Service) {
      require('@/models/Service');
    }
    
    const { id } = await context.params;
    const result = await Service.deleteOne({ _id: id });
    if (!result) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/services] Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete service' }, { status: 500 });
  }
}
