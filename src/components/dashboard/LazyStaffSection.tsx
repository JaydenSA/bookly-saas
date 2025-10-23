'use client';

import LazySection from './LazySection';
import StaffSection from './StaffSection';

interface LazyStaffSectionProps {
  businessId: string;
}

export default function LazyStaffSection({ businessId }: LazyStaffSectionProps) {
  return (
    <LazySection 
      title="Staff Management"
      description="Manage your team members and their permissions"
    >
      <StaffSection businessId={businessId} />
    </LazySection>
  );
}
