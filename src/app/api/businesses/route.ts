import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const sortBy = searchParams.get('sortBy') || 'newest';
    
    let query = {};
    
    // Filter by slug if specified (for individual business pages)
    if (slug) {
      query = { slug };
    }
    // Filter by owner if specified
    else if (ownerId) {
      query = { ownerId };
    }
    
    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        ...query,
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { address: searchRegex },
          { category: searchRegex }
        ]
      };
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query = { ...query, category };
    }
    
    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'name-asc':
        sortOptions = { name: 1 };
        break;
      case 'name-desc':
        sortOptions = { name: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }
    
    const docs = await Business.find(query).sort(sortOptions);
    return NextResponse.json({ businesses: docs }, { status: 200 });
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
