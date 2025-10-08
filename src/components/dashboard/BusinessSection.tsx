'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Building, Plus, Edit2, MapPin, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AddressInput from '@/components/ui/address-input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSnackbar } from '@/hooks/useSnackbar';

interface Business {
  _id: string;
  name: string;
  slug: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  category: string;
  timezone?: string;
  depositPercentage: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface BusinessSectionProps {
  userId: string;
}

export default function BusinessSection({ userId }: BusinessSectionProps) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    category: '',
    timezone: 'Africa/Johannesburg',
    depositPercentage: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  const fetchBusiness = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/businesses?ownerId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.businesses && data.businesses.length > 0) {
          setBusiness(data.businesses[0]);
          setFormData({
            name: data.businesses[0].name,
            address: data.businesses[0].address || '',
            description: data.businesses[0].description || '',
            category: data.businesses[0].category || '',
            timezone: data.businesses[0].timezone || 'Africa/Johannesburg',
            depositPercentage: data.businesses[0].depositPercentage || 0,
          });
        } else {
          setBusiness(null);
        }
      } else {
        showError('Failed to load business information', {
          description: 'Please try refreshing the page',
        });
      }
    } catch (err) {
      console.error('Error fetching business:', err);
      showError('Failed to load business information', {
        description: 'Check your internet connection and try again',
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, showError]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  const handleCreateBusiness = async () => {
    const loadingToast = showLoading('Creating business...', {
      description: 'Please wait while we set up your business account',
    });

    try {
      setIsCreating(true);
      setError(null);

      const businessData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        ownerId: userId,
      };

      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create business');
      }

      const newBusiness = await response.json();
      setBusiness(newBusiness.business);
      
      // Update user with business ID
      await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId: newBusiness.business._id }),
      });

      dismiss(loadingToast);
      showSuccess('Business created successfully!', {
        description: `${formData.name} is now ready to accept bookings`,
      });
    } catch (err) {
      console.error('Error creating business:', err);
      dismiss(loadingToast);
      showError('Failed to create business', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateBusiness = async () => {
    if (!business) return;

    const loadingToast = showLoading('Updating business...', {
      description: 'Saving your changes',
    });

    try {
      setIsEditing(true);
      setError(null);

      const response = await fetch(`/api/businesses/${business._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update business');
      }

      const updatedBusiness = await response.json();
      setBusiness(updatedBusiness.business);
      
      dismiss(loadingToast);
      showSuccess('Business updated successfully!', {
        description: 'Your changes have been saved',
      });
    } catch (err) {
      console.error('Error updating business:', err);
      dismiss(loadingToast);
      showError('Failed to update business', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsEditing(false);
    }
  };

  const resetForm = () => {
    if (business) {
      setFormData({
        name: business.name,
        address: business.address || '',
        description: business.description || '',
        category: business.category || '',
        timezone: business.timezone || 'Africa/Johannesburg',
        depositPercentage: business.depositPercentage,
      });
    } else {
      setFormData({
        name: '',
        address: '',
        description: '',
        category: '',
        timezone: 'Africa/Johannesburg',
        depositPercentage: 0,
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Business Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading business information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='mb-8'>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Business Account
          </CardTitle>
          {business && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Business</DialogTitle>
                  <DialogDescription>
                    Update your business information.
                  </DialogDescription>
                </DialogHeader>
                <BusinessForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleUpdateBusiness}
                  isLoading={isEditing}
                  submitText="Update Business"
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        <CardDescription>
          {business ? 'Manage your business account' : 'Create a business account to start accepting bookings'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {business ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{business.name}</h3>
                <Badge variant="secondary">Active</Badge>
              </div>
              {business.logoUrl && (
                <Image
                  src={business.logoUrl}
                  alt={`${business.name} logo`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.address && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-sm">{business.address}</p>
                  </div>
                </div>
              )}

              {business.timezone && (
                <div className="flex items-start">
                  <Clock className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Timezone</p>
                    <p className="text-sm">{business.timezone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <Globe className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Deposit Percentage</p>
                  <p className="text-sm">{business.depositPercentage}%</p>
                </div>
              </div>

              <div className="flex items-start">
                <Building className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Business Slug</p>
                  <p className="text-sm font-mono">{business.slug}</p>
                </div>
              </div>
            </div>

            {business.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{business.description}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">
                  View Bookings
                </Button>
                <Button variant="outline" size="sm">
                  Manage Services
                </Button>
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Business Account</h3>
            <p className="text-muted-foreground mb-4">
              Create a business account to start accepting bookings and managing your services.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Business Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Business Account</DialogTitle>
                  <DialogDescription>
                    Set up your business profile to start accepting bookings.
                  </DialogDescription>
                </DialogHeader>
                <BusinessForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleCreateBusiness}
                  isLoading={isCreating}
                  submitText="Create Business"
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface BusinessFormProps {
  formData: {
    name: string;
    address: string;
    description: string;
    category: string;
    timezone: string;
    depositPercentage: number;
  };
  setFormData: (data: {
    name: string;
    address: string;
    description: string;
    category: string;
    timezone: string;
    depositPercentage: number;
  }) => void;
  onSubmit: () => void;
  isLoading: boolean;
  submitText: string;
}

function BusinessForm({ formData, setFormData, onSubmit, isLoading, submitText }: BusinessFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Business Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter business name"
          required
        />
      </div>

      <AddressInput
        value={formData.address}
        onChange={(address) => setFormData({ ...formData, address })}
        placeholder="Enter business address"
        label="Address"
        id="address"
      />

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your business"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beauty & Wellness">Beauty & Wellness</SelectItem>
            <SelectItem value="Health & Medical">Health & Medical</SelectItem>
            <SelectItem value="Fitness & Sports">Fitness & Sports</SelectItem>
            <SelectItem value="Education & Training">Education & Training</SelectItem>
            <SelectItem value="Professional Services">Professional Services</SelectItem>
            <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
            <SelectItem value="Automotive">Automotive</SelectItem>
            <SelectItem value="Home & Garden">Home & Garden</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Entertainment">Entertainment</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            placeholder="Africa/Johannesburg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="depositPercentage">Deposit %</Label>
          <Input
            id="depositPercentage"
            type="number"
            min="0"
            max="100"
            value={formData.depositPercentage}
            onChange={(e) => setFormData({ ...formData, depositPercentage: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // Close dialog - this will be handled by the parent
          }}
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading || !formData.name}>
          {isLoading ? 'Processing...' : submitText}
        </Button>
      </div>
    </div>
  );
}
