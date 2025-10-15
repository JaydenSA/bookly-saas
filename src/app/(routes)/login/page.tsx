'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKindeAuth, LoginLink } from '@kinde-oss/kinde-auth-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useKindeAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = () => {
    window.location.href = '/api/auth/kindeAuth/login';
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

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to BookFlow</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Access your booking management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full"
              size="lg"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In with Kinde
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              <p>Don&apos;t have an account? Sign up is automatic!</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            variant="link" 
            onClick={() => router.push('/')}
            className="text-sm"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
