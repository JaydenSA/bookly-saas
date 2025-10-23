'use client';

import LazySection from './LazySection';
import CategoriesSection from './CategoriesSection';

interface LazyCategoriesSectionProps {
  businessId: string;
}

export default function LazyCategoriesSection({ businessId }: LazyCategoriesSectionProps) {
  return (
    <LazySection 
      title="Categories"
      description="Organize your services with categories"
    >
      <CategoriesSection businessId={businessId} />
    </LazySection>
  );
}
