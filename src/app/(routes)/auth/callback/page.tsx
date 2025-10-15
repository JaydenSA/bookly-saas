'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AuthCallbackPage() {
  const { isAuthenticated, isLoading, user } = useKindeAuth();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (isLoading) return;

      if (isAuthenticated && user) {
        setStatus('success');
        setMessage('Authentication successful! Redirecting to dashboard...');
        
        // Wait a moment to show success message, then redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
        
        // Redirect to login after showing error
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [isAuthenticated, isLoading, user, router]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-600" />;
      default:
        return <Loader2 className="h-12 w-12 animate-spin text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className={`text-2xl ${getStatusColor()}`}>
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Authentication Failed'}
            </CardTitle>
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {status === 'error' && (
              <div className="space-y-4">
                <Button 
                  onClick={() => router.push('/login')}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full"
                >
                  Go Home
                </Button>
              </div>
            )}
            
            {status === 'loading' && (
              <div className="text-sm text-gray-500">
                Please wait while we process your authentication...
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-sm text-gray-500">
                You will be redirected automatically.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
