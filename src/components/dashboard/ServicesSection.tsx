'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Clock, DollarSign, Scissors, Tag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useSnackbar } from '@/hooks/useSnackbar';
import { usePermissions } from '@/hooks/usePermissions';
import { Service, ServicesSectionProps, Category, Staff, ServiceFormData } from '@/types';

export default function ServicesSection({ businessId }: ServicesSectionProps) {
  const { canManageServices } = usePermissions();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    categoryId: '',
    staffIds: [],
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

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`/api/categories?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, [businessId]);

  const fetchStaff = useCallback(async () => {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        setStaff(data.staffMembers || data.staff || []);
      }
    } catch (err) {
      console.error('Error fetching staff:', err);
    }
  }, []);

  useEffect(() => {
    if (businessId) {
      fetchServices();
      fetchCategories();
      fetchStaff();
    }
  }, [businessId, fetchServices, fetchCategories, fetchStaff]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 30,
      price: 0,
      categoryId: '',
      staffIds: [],
    });
    setEditingService(null);
  };

  const handleStaffToggle = (staffId: string) => {
    setFormData(prev => {
      const newStaffIds = prev.staffIds.includes(staffId)
        ? prev.staffIds.filter(id => id !== staffId)
        : [...prev.staffIds, staffId];
      return { ...prev, staffIds: newStaffIds };
    });
  };

  const handleCreateService = async () => {
    const loadingToast = showLoading('Creating service...', {
      description: 'Please wait while we add your service',
    });

    try {
      setIsCreating(true);
      
      // Clean up the data before sending - remove empty strings and ensure proper types
      const serviceData = {
        ...formData,
        businessId,
        isActive: true,
        categoryId: formData.categoryId || undefined,
        staffIds: formData.staffIds || [],
        duration: Number(formData.duration),
        price: Number(formData.price),
      };

      console.log('Creating service with data:', serviceData);

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
      
      // Clean up the data before sending - remove empty strings and ensure proper types
      const cleanedData = {
        ...formData,
        categoryId: formData.categoryId || undefined,
        staffIds: formData.staffIds || [],
        duration: Number(formData.duration),
        price: Number(formData.price),
      };
      
      console.log('Updating service with cleaned data:', cleanedData);
      
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Service update failed:', errorData);
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
      categoryId: typeof service.categoryId === 'object' ? service.categoryId._id : (service.categoryId || ''),
      staffIds: service.staffIds?.map((s: string | { _id: string }) => (typeof s === 'string' ? s : s._id)) || [],
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
          {canManageServices && (
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
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId || "none"}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Category</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Staff</Label>
                  {staff.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No staff members available. Add staff first.</p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
                      {staff.map(staffMember => (
                        <div key={staffMember._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`staff-${staffMember._id}`}
                            checked={formData.staffIds.includes(staffMember._id)}
                            onCheckedChange={() => handleStaffToggle(staffMember._id)}
                          />
                          <Label htmlFor={`staff-${staffMember._id}`} className="font-normal flex-1 cursor-pointer">
                            {staffMember.firstName} {staffMember.lastName}
                            {staffMember.role && <span className="text-muted-foreground ml-2">({staffMember.role})</span>}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Select which staff members can perform this service
                  </p>
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
          )}
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
                    {service?.categoryId && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {typeof service.categoryId === 'object' 
                          ? service.categoryId.name 
                          : categories.find(cat => cat._id === service.categoryId)?.name || 'Unknown Category'
                        }
                      </Badge>
                    )}
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
                  {service?.staffIds && service.staffIds.length > 0 && (
                    <div className="flex items-start flex-wrap gap-1 pt-2 border-t mt-2">
                      <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {service.staffIds.map((staffMember: string | { _id: string; firstName: string; lastName: string; role?: string }) => {
                          if (typeof staffMember === 'string') return null;
                          return (
                            <Badge key={staffMember._id} variant="secondary" className="text-xs">
                              {staffMember.firstName} {staffMember.lastName}
                              {staffMember.role && <span className="ml-1">({staffMember.role})</span>}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                {canManageServices && (
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
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
