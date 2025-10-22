'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSnackbar } from '@/hooks/useSnackbar';

export default function WelcomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  useEffect(() => {
    const handleUserSetup = async () => {
      if (!isLoaded) return;
      
      if (!user) {
        router.push('/');
        return;
      }

      const loadingToast = showLoading('Setting up your account...', {
        description: 'Please wait while we prepare your dashboard',
      });

      setIsProcessing(true);
      setError(null);

      try {
        // Check if user exists in MongoDB
        const response = await fetch('/api/users/check-or-create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkUserId: user.id,
            name: user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || 'User',
            email: user.emailAddresses[0]?.emailAddress || '',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create or verify user account');
        }

        await response.json();
        
        dismiss(loadingToast);
        showSuccess('Welcome to your dashboard!', {
          description: 'Your account has been set up successfully',
        });
        
        // Small delay to show success message before redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } catch (err) {
        console.error('Error setting up user:', err);
        dismiss(loadingToast);
        showError('Account setup failed', {
          description: err instanceof Error ? err.message : 'Please try again',
        });
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsProcessing(false);
      }
    };

    handleUserSetup();
  }, [isLoaded, user, router, showLoading, showSuccess, showError, dismiss]);

  if (!isLoaded || isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <CardTitle>
              {!isLoaded ? 'Loading...' : 'Setting up your account...'}
            </CardTitle>
            <CardDescription>
              {!isLoaded ? 'Please wait while we verify your authentication.' : 'Creating your account and preparing your dashboard.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Setup Error</CardTitle>
            <CardDescription className="text-destructive">{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              variant="destructive"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
