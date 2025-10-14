import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { 
      error: 'Upgrades are currently disabled',
      message: 'Premium plans are coming soon! You\'ll be notified when upgrade options become available.'
    },
    { status: 403 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { 
      error: 'Upgrades are currently disabled',
      message: 'Premium plans are coming soon! You\'ll be notified when upgrade options become available.'
    },
    { status: 403 }
  );
}
