'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Clock, Building, Mail, Shield } from 'lucide-react';
import { useSnackbar } from '@/hooks/useSnackbar';
import { StaffInvite } from '@/types';

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [invite, setInvite] = useState<StaffInvite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    if (!token) {
      router.push('/');
      return;
    }

    fetchInvite();
  }, [token, router]);

  const fetchInvite = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/staff/accept-invite?token=${token}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid invite');
      }

      const data = await response.json();
      setInvite(data.invite);
    } catch (error) {
      console.error('Error fetching invite:', error);
      showError('Invalid or expired invite', {
        description: 'This invitation link is no longer valid.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!token) return;

    try {
      setIsAccepting(true);
      const response = await fetch('/api/staff/accept-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to accept invite');
      }

      const data = await response.json();
      
      showSuccess('Welcome to the team!', {
        description: `You've been added to ${data.business.name}`,
      });

      // Trigger refresh of staff data for the business owner
      window.dispatchEvent(new CustomEvent('staffDataRefresh'));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error accepting invite:', error);
      showError('Failed to accept invite', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="default" className="flex items-center gap-1"><Check className="h-3 w-3" />Accepted</Badge>;
      case 'declined':
        return <Badge variant="destructive" className="flex items-center gap-1"><X className="h-3 w-3" />Declined</Badge>;
      case 'expired':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Invitation...
          </h2>
          <p className="text-gray-600">
            Please wait while we validate your invitation.
          </p>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <X className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid Invitation
          </h2>
          <p className="text-gray-600 mb-4">
            This invitation link is invalid or has expired.
          </p>
          <Button onClick={() => router.push('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Staff Invitation</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join a business team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Info */}
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{(invite.businessId as unknown as { name: string })?.name || 'Business'}</h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              {getStatusBadge(invite.status)}
            </div>
          </div>

          {/* Invitation Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{invite.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">{invite.role}</span>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h4 className="font-medium mb-2">Your Permissions:</h4>
            <div className="space-y-1">
              {invite.permissions.canManageBookings && (
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-sm">Manage Bookings</span>
                </div>
              )}
              {invite.permissions.canManageServices && (
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-sm">Manage Services</span>
                </div>
              )}
              {invite.permissions.canManageCustomers && (
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-sm">Manage Customers</span>
                </div>
              )}
              {invite.permissions.canViewReports && (
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span className="text-sm">View Reports</span>
                </div>
              )}
            </div>
          </div>

          {/* Expiration */}
          <div className="text-center text-sm text-muted-foreground">
            <p>This invitation expires on:</p>
            <p className="font-medium">
              {new Date(invite.expiresAt).toLocaleDateString()}
            </p>
          </div>

          {/* Actions */}
          {invite.status === 'pending' && new Date(invite.expiresAt) > new Date() && (
            <div className="space-y-3">
              <Button 
                onClick={handleAcceptInvite}
                disabled={isAccepting}
                className="w-full"
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  'Accept Invitation'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Decline
              </Button>
            </div>
          )}

          {invite.status !== 'pending' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                This invitation has already been {invite.status}.
              </p>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}
