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
import CategoriesSection from '@/components/dashboard/CategoriesSection';
import StaffSection from '@/components/dashboard/StaffSection';
import BookingsSection from '@/components/dashboard/BookingsSection';
import SettingsSection from '@/components/dashboard/SettingsSection';
import { useSnackbar } from '@/hooks/useSnackbar';
import { usePermissions } from '@/hooks/usePermissions';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useKindeAuth();
  const { 
    canManageServices, 
    canManageBusiness, 
    canManageBookings,
    canManageCustomers,
    canViewReports,
    canManageStaff,
    isLoadingPermissions,
    userData: permissionsUserData
  } = usePermissions();

  // Debug permissions
  console.log('Dashboard - Permissions:', {
    canManageServices,
    canManageBusiness,
    canManageBookings,
    canManageCustomers,
    canViewReports,
    canManageStaff,
    permissionsUserData
  });
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'settings'>('overview');
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
  });
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  // Use userData from usePermissions hook instead of fetching separately
  const userData = permissionsUserData;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
      return;
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name,
        phone: userData.phone || '',
      });
    }
  }, [userData]);

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

      await response.json();
      setIsEditing(false);
      // User data will be refreshed through the usePermissions hook
      
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



  if (isLoading || isLoadingPermissions) {
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
    <div className="dashboard-layout">
      <div className="general-container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back, {userData.name}!</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={activeSection === 'overview' ? 'default' : 'outline'}
                onClick={() => setActiveSection('overview')}
              >
                Overview
              </Button>
              <Button
                variant={activeSection === 'settings' ? 'default' : 'outline'}
                onClick={() => setActiveSection('settings')}
              >
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Conditional Content */}
        {activeSection === 'overview' ? (
          <>
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

        {/* Business Section - Only show for users who can manage business */}
        {!isLoadingPermissions && canManageBusiness && (
          <BusinessSection userId={userData.id} />
        )}

        {/* Categories Section - Only show if user can manage services */}
        {!isLoadingPermissions && userData.businessId && canManageServices && (
          <CategoriesSection businessId={userData.businessId} />
        )}

        {/* Services Section - Only show if user has a business and can manage services */}
        {!isLoadingPermissions && userData.businessId && canManageServices && (
          <ServicesSection businessId={userData.businessId} />
        )}

        {/* Staff Section - Only show for owners with a business */}
        {!isLoadingPermissions && userData.businessId && userData.role === 'owner' && (
          <StaffSection businessId={userData.businessId} />
        )}

        {/* Bookings Section - Show for users who can manage bookings */}
        {!isLoadingPermissions && userData.businessId && canManageBookings && (
          <BookingsSection businessId={userData.businessId} />
        )}

        {/* No Access Message - Show for staff members with no permissions */}
        {userData.role === 'staff' && 
         !isLoadingPermissions &&
         !canManageServices && 
         !canManageBookings && 
         !canManageBusiness && 
         !canManageCustomers && 
         !canViewReports && 
         !canManageStaff && (
          <Card>
            <CardHeader>
              <CardTitle>Limited Access</CardTitle>
              <CardDescription>
                You currently don&apos;t have access to any management features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contact your business owner to request additional permissions for managing services, bookings, or other features.
              </p>
            </CardContent>
          </Card>
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
                  <Button 
                    variant="link" 
                    className="p-0 h-auto"
                    onClick={() => setActiveSection('settings')}
                  >
                    Open Settings →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <SettingsSection userData={userData} />
        )}
      </div>
    </div>
  );
}
