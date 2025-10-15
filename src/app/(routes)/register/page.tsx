'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKindeAuth, LoginLink } from '@kinde-oss/kinde-auth-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserPlus, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useKindeAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/welcome');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleRegister = () => {
    // Kinde handles both login and registration automatically
    // New users will be created on first authentication
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
          <p className="text-gray-600">Redirecting to welcome page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Join BookFlow</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and start managing bookings today
          </p>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Get started with your free BookFlow account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              onClick={handleRegister}
              className="w-full"
              size="lg"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              <p>Already have an account?</p>
              <Button 
                variant="link" 
                onClick={() => router.push('/login')}
                className="p-0 h-auto text-sm"
              >
                Sign in instead
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-center">What you get with BookFlow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Up to 50 bookings per month (Free plan)</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Basic calendar management</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Email notifications</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Customer database</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">Basic reporting</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">No credit card required</span>
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
