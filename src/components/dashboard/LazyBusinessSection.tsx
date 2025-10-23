'use client';

import LazySection from './LazySection';
import BusinessSection from './BusinessSection';

interface LazyBusinessSectionProps {
  userId: string;
}

export default function LazyBusinessSection({ userId }: LazyBusinessSectionProps) {
  return (
    <LazySection 
      title="Business Information"
      description="Manage your business profile and settings"
    >
      <BusinessSection userId={userId} />
    </LazySection>
  );
}
