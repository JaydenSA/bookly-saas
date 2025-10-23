'use client';

import LazySection from './LazySection';
import ServicesSection from './ServicesSection';

interface LazyServicesSectionProps {
  businessId: string;
}

export default function LazyServicesSection({ businessId }: LazyServicesSectionProps) {
  return (
    <LazySection 
      title="Services"
      description="Manage your business services and pricing"
    >
      <ServicesSection businessId={businessId} />
    </LazySection>
  );
}
