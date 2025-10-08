'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { Loader2, User, Mail, Phone, Building, Crown, Calendar, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import BusinessSection from '@/components/dashboard/BusinessSection';
import ServicesSection from '@/components/dashboard/ServicesSection';
import { useSnackbar } from '@/hooks/useSnackbar';

interface UserData {
  id: string;
  kindeUserId: string;
  name: string;
  email: string;
  role: 'owner' | 'staff';
  plan: 'free' | 'pro' | 'enterprise';
  businessId?: string;
  phone?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user: kindeUser, isAuthenticated, isLoading } = useKindeAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
  });
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoading) return;
      
      if (!isAuthenticated || !kindeUser) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`/api/users/me?kindeUserId=${kindeUser.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data.user);
        setEditForm({
          name: data.user.name,
          phone: data.user.phone || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/welcome');
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, kindeUser, isLoading, router]);

  const handleSave = async () => {
    if (!userData) return;

    const loadingToast = showLoading('Updating profile...', {
      description: 'Saving your changes',
    });

    try {
      const response = await fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedData = await response.json();
      setUserData(updatedData.user);
      setIsEditing(false);
      
      dismiss(loadingToast);
      showSuccess('Profile updated successfully!', {
        description: 'Your changes have been saved',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      dismiss(loadingToast);
      showError('Failed to update profile', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };


  if (isLoading || isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Dashboard...
          </h2>
          <p className="text-gray-600">
            Please wait while we load your account information.
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Account Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t find your account. Please try signing up again.
          </p>
          <button
            onClick={() => router.push('/welcome')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Go to Welcome Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {userData.name}!</p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center"
              >
                <Edit2 className="h-4 w-4 mr-1" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>

          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: userData.name,
                      phone: userData.phone || '',
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {userData.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Crown className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <Badge variant={userData.plan === 'free' ? 'secondary' : userData.plan === 'pro' ? 'default' : 'destructive'}>
                      {userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge variant={userData.role === 'owner' ? 'default' : 'secondary'}>
                      {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          </CardContent>
        </Card>

        {/* Business Section */}
        <BusinessSection userId={userData.id} />

        {/* Services Section - Only show if user has a business */}
        {userData.businessId && (
          <ServicesSection businessId={userData.businessId} />
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>View and manage bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="p-0 h-auto">
                View Bookings →
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Account and app preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="p-0 h-auto">
                Open Settings →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
