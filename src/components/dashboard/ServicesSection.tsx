'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Clock, DollarSign, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSnackbar } from '@/hooks/useSnackbar';

interface Service {
  _id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  businessId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServicesSectionProps {
  businessId: string;
}

export default function ServicesSection({ businessId }: ServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
  });
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/services?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        // Ensure we have an array and filter out any invalid services
        const validServices = (data.services || []).filter((service: Service) => 
          service && service._id && service.name
        );
        setServices(validServices);
      } else {
        showError('Failed to load services', {
          description: 'Please try refreshing the page',
        });
        setServices([]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      showError('Failed to load services', {
        description: 'Check your internet connection and try again',
      });
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, [businessId, showError]);

  useEffect(() => {
    if (businessId) {
      fetchServices();
    }
  }, [businessId, fetchServices]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 30,
      price: 0,
    });
    setEditingService(null);
  };

  const handleCreateService = async () => {
    const loadingToast = showLoading('Creating service...', {
      description: 'Please wait while we add your service',
    });

    try {
      setIsCreating(true);
      const serviceData = {
        ...formData,
        businessId,
        isActive: true,
      };

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create service');
      }

      const data = await response.json();
      setServices(prev => [data, ...prev]);
      setIsDialogOpen(false);
      resetForm();

      dismiss(loadingToast);
      showSuccess('Service created successfully!', {
        description: `${formData.name} has been added to your services`,
      });
    } catch (err) {
      console.error('Error creating service:', err);
      dismiss(loadingToast);
      showError('Failed to create service', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateService = async (serviceId: string) => {
    const loadingToast = showLoading('Updating service...', {
      description: 'Saving your changes',
    });

    try {
      setIsUpdating(serviceId);
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update service');
      }

      const data = await response.json();
      setServices(prev => prev.map(service => 
        service._id === serviceId ? data : service
      ));
      setIsDialogOpen(false);
      resetForm();

      dismiss(loadingToast);
      showSuccess('Service updated successfully!', {
        description: 'Your changes have been saved',
      });
    } catch (err) {
      console.error('Error updating service:', err);
      dismiss(loadingToast);
      showError('Failed to update service', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const loadingToast = showLoading('Deleting service...', {
      description: 'Please wait while we remove this service',
    });

    try {
      setIsDeleting(serviceId);
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete service');
      }

      setServices(prev => prev.filter(service => service._id !== serviceId));

      dismiss(loadingToast);
      showSuccess('Service deleted successfully!', {
        description: 'The service has been removed from your business',
      });
    } catch (err) {
      console.error('Error deleting service:', err);
      dismiss(loadingToast);
      showError('Failed to delete service', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
    });
    setIsDialogOpen(true);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scissors className="h-5 w-5 mr-2" />
            Services
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Scissors className="h-5 w-5 mr-2" />
            Services
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
                <DialogDescription>
                  {editingService 
                    ? 'Update your service details below.' 
                    : 'Add a new service to your business offerings.'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Haircut, Massage, Consultation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this service includes..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration === 0 ? '' : formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      onFocus={(e) => e.target.select()}
                      placeholder="30"
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ZAR)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price === 0 ? '' : formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      onFocus={(e) => e.target.select()}
                      placeholder="0.00"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => editingService ? handleUpdateService(editingService._id) : handleCreateService()}
                    disabled={isCreating || (isUpdating !== null)}
                  >
                    {isCreating || (isUpdating !== null) ? 'Saving...' : editingService ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8">
            <Scissors className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No services yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first service to start accepting bookings
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.filter(service => service).map((service) => (
              <div
                key={service._id}
                className="flex items-center gap-4 justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{service?.name || 'Unnamed Service'}</h3>
                    <Badge variant={service?.isActive ? 'default' : 'secondary'}>
                      {service?.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {service?.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(service?.duration || 0)}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatPrice(service?.price || 0)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-col md:flex-row">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => service && openEditDialog(service)}
                    disabled={isUpdating === service?._id}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => service?._id && handleDeleteService(service._id)}
                    disabled={isDeleting === service?._id}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
