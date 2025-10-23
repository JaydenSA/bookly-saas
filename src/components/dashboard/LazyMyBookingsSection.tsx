'use client';

import LazySection from './LazySection';
import MyBookingsSection from './MyBookingsSection';

interface LazyMyBookingsSectionProps {
  userId: string;
}

export default function LazyMyBookingsSection({ userId }: LazyMyBookingsSectionProps) {
  return (
    <LazySection 
      title="My Bookings"
      description="View and manage your personal bookings"
    >
      <MyBookingsSection userId={userId} />
    </LazySection>
  );
}
