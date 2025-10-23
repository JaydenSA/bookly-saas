'use client';

import LazySection from './LazySection';
import BookingsSection from './BookingsSection';

interface LazyBookingsSectionProps {
  businessId: string;
}

export default function LazyBookingsSection({ businessId }: LazyBookingsSectionProps) {
  return (
    <LazySection 
      title="Bookings Management"
      description="View and manage all business bookings"
    >
      <BookingsSection businessId={businessId} />
    </LazySection>
  );
}
