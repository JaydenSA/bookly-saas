'use client';

import { Suspense, ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LazySectionProps {
  children: ReactNode;
  title: string;
  description?: string;
  fallback?: ReactNode;
}

function DefaultLoader({ title, description }: { title: string; description?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LazySection({ 
  children, 
  title, 
  description,
  fallback 
}: LazySectionProps) {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });

  const loader = fallback || <DefaultLoader title={title} description={description} />;

  return (
    <div ref={ref}>
      {hasIntersected ? (
        <Suspense fallback={loader}>
          {children}
        </Suspense>
      ) : (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Scroll to load {title.toLowerCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
