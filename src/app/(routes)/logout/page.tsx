'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKindeAuth, LogoutLink } from '@kinde-oss/kinde-auth-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut } from 'lucide-react';

export default function LogoutPage() {
  const { isAuthenticated, isLoading } = useKindeAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    window.location.href = '/api/auth/kindeAuth/logout';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign Out</h1>
          <p className="mt-2 text-sm text-gray-600">
            Are you sure you want to sign out?
          </p>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Goodbye!</CardTitle>
            <CardDescription>
              You&apos;re about to sign out of your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
