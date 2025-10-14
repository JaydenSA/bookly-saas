import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ success: false, message: 'Image URL is required' }, { status: 400 });
    }

    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    if (!filename) {
      return NextResponse.json({ success: false, message: 'Invalid image URL' }, { status: 400 });
    }

    // Construct file path
    const filepath = join(process.cwd(), 'public', 'uploads', 'businesses', filename);

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json({ success: false, message: 'File not found' }, { status: 404 });
    }

    // Delete the file
    await unlink(filepath);

    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete image' 
    }, { status: 500 });
  }
}
