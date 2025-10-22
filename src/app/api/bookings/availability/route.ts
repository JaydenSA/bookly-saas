import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import BookingSettings from '@/models/BookingSettings';

function toMinutes(timeHHMM: string): number {
  const [h, m] = timeHHMM.split(':').map(Number);
  return h * 60 + m;
}

function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Generate time slots for a day based on settings (open/close and interval)
function generateTimeSlotsFromSettings(open: string, close: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  const startMin = toMinutes(open);
  const endMin = toMinutes(close);
  for (let t = startMin; t < endMin; t += intervalMinutes) {
    slots.push(toHHMM(t));
  }
  return slots;
}

// Calculate end time based on start time and duration
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

// Check if two time ranges overlap
function timesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  return start1 < end2 && start2 < end1;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const staffId = searchParams.get('staffId');
    const dateStr = searchParams.get('date');
    const duration = parseInt(searchParams.get('duration') || '60');

    if (!businessId || !staffId || !dateStr) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Parse the date
    const requestedDate = new Date(dateStr);
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all bookings for this staff member on this date
    const existingBookings = await Booking.find({
      businessId,
      staffId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $nin: ['cancelled'] }, // Exclude cancelled bookings
    }).select('startTime endTime');

    // Pull booking settings (falls back to 09:00-17:00 and 30m interval)
    const settings = await BookingSettings.findOne({ businessId }).lean();

    const weekdayIdx = requestedDate.getDay(); // 0=Sun
    const dayKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][weekdayIdx] as keyof NonNullable<typeof settings>;

    const dayConfig = settings?.days?.[dayKey as any] as undefined | { enabled?: boolean; open?: string; close?: string };
    const enabled = dayConfig?.enabled ?? (weekdayIdx >= 1 && weekdayIdx <= 5);

    // Check blackout dates
    const dateISO = requestedDate.toISOString().split('T')[0];
    const isBlackout = (settings?.blackoutDates || []).includes(dateISO);
    if (!enabled || isBlackout) {
      return NextResponse.json({ timeSlots: [] }, { status: 200 });
    }

    const open = dayConfig?.open || '09:00';
    const close = dayConfig?.close || '17:00';
    // Use service duration as slot interval instead of fixed setting
    const interval = duration;
    const lead = settings?.leadTimeMinutes || 0;

    // Generate all possible time slots from settings
    const allSlots = generateTimeSlotsFromSettings(open, close, interval);

    // Lead time filter (no booking before now + lead)
    const now = new Date();
    const startOfDayMin = Math.floor(startOfDay.getTime() / 60000);

    // Check which slots are available
    const timeSlots = allSlots.map((startTime) => {
      const endTime = calculateEndTime(startTime, duration);
      const slotStartMin = startOfDayMin + toMinutes(startTime);
      
      // For today: check if slot is after now + lead time
      // For future days: all slots are available (no lead time restriction)
      const isToday = requestedDate.toDateString() === now.toDateString();
      const isAfterLead = isToday ? 
        slotStartMin >= Math.ceil((now.getTime() + lead * 60000) / 60000) : 
        true;

      // Check if this slot overlaps with any existing booking
      const isAvailable = isAfterLead && !existingBookings.some((booking) => {
        return timesOverlap(startTime, endTime, booking.startTime, booking.endTime);
      });

      console.log(`Slot ${startTime}: isToday=${isToday}, isAfterLead=${isAfterLead}, isAvailable=${isAvailable}, existingBookings=${existingBookings.length}`);

      return {
        time: startTime,
        available: isAvailable,
      };
    });

    return NextResponse.json({ timeSlots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}


