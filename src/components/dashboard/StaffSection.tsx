'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, User, Mail, Phone, Briefcase, Info, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useSnackbar } from '@/hooks/useSnackbar';
import { Staff, StaffFormData, Service } from '@/types';

interface StaffSectionProps {
  businessId: string;
}

export default function StaffSection({ businessId }: StaffSectionProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    bio: '',
    imageUrl: '',
    serviceIds: [],
  });
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        setStaff(data.staffMembers || data.staff || []);
      } else {
        showError('Failed to load staff members', {
          description: 'Please try refreshing the page',
        });
      }
    } catch (err) {
      console.error('Error fetching staff members:', err);
      showError('Failed to load staff members', {
        description: 'Check your internet connection and try again',
      });
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const fetchServices = useCallback(async () => {
    try {
      console.log('Fetching services for businessId:', businessId);
      const url = businessId ? `/api/services?businessId=${businessId}` : '/api/services';
      const response = await fetch(url);
      console.log('Services API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Services data received:', data);
        setServices(data.services || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to load services:', errorData);
        showError('Failed to load services for staff assignment', {
          description: errorData.message || 'Please try refreshing the page',
        });
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      showError('Failed to load services for staff assignment', {
        description: 'Check your internet connection and try again',
      });
    }
  }, [businessId, showError]);

  useEffect(() => {
    console.log('StaffSection useEffect - businessId:', businessId);
    if (businessId) {
      fetchStaff();
      fetchServices();
    } else {
      console.log('No businessId provided to StaffSection');
    }
  }, [businessId, fetchStaff, fetchServices]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      bio: '',
      imageUrl: '',
      serviceIds: [],
    });
    setEditingStaff(null);
  };

  const handleOpenDialog = (staffMember?: Staff) => {
    if (staffMember) {
      setEditingStaff(staffMember);
      setFormData({
        firstName: staffMember.firstName,
        lastName: staffMember.lastName,
        email: staffMember.email || '',
        phone: staffMember.phone || '',
        role: staffMember.role || '',
        bio: staffMember.bio || '',
        imageUrl: staffMember.imageUrl || '',
        serviceIds: staffMember.serviceIds?.map((s: string | { _id: string }) => (typeof s === 'string' ? s : s._id)) || [],
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => {
      const newServiceIds = prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId];
      return { ...prev, serviceIds: newServiceIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = showLoading(editingStaff ? 'Updating staff member...' : 'Adding staff member...');

    try {
      const url = editingStaff ? `/api/staff/${editingStaff._id}` : '/api/staff';
      const method = editingStaff ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to save staff member');
      }

      dismiss(loadingToast);
      showSuccess(editingStaff ? 'Staff member updated!' : 'Staff member added!', {
        description: editingStaff ? `${formData.firstName} ${formData.lastName} has been updated.` : `${formData.firstName} ${formData.lastName} has been added.`,
      });
      handleCloseDialog();
      fetchStaff(); // Refresh the list
    } catch (error) {
      dismiss(loadingToast);
      showError('Failed to save staff member', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    const loadingToast = showLoading('Deleting staff member...');
    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to delete staff member');
      }

      dismiss(loadingToast);
      showSuccess('Staff member deleted!', {
        description: 'The staff member has been removed.',
      });
      fetchStaff(); // Refresh the list
    } catch (error) {
      dismiss(loadingToast);
      showError('Failed to delete staff member', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    }
  };


  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase() || '??';
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">Staff Members</CardTitle>
          <CardDescription>Manage your team members and assign services.</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
              <DialogDescription>
                {editingStaff ? 'Update the details for this staff member.' : 'Add a new team member to your business.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role/Title
                </Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Hairstylist, Therapist"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="bio" className="text-right pt-2">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">
                  Profile Image
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  {formData.imageUrl && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image src={formData.imageUrl} alt="Profile" fill className="object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 h-6 w-6 rounded-full"
                        onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Assigned Services *</Label>
                <div className="col-span-3 space-y-2">
                  {services.length === 0 ? (
                    <div className="text-center p-4 border rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">No services available.</p>
                      <p className="text-xs text-muted-foreground">
                        Add services in the Services section first, then assign them to staff members.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
                      {services.map(service => (
                        <div key={service._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service._id}`}
                            checked={formData.serviceIds.includes(service._id)}
                            onCheckedChange={() => handleServiceToggle(service._id)}
                          />
                          <Label htmlFor={`service-${service._id}`} className="font-normal flex-1 cursor-pointer">
                            {service.name} ({service.duration} mins)
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Select which services this staff member can perform
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || formData.serviceIds.length === 0}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingStaff ? 'Save Changes' : 'Add Staff Member'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg text-muted-foreground">Loading staff members...</span>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center p-8">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No staff members added yet.</p>
            <p className="text-sm text-muted-foreground">Click &quot;Add Staff&quot; to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <Card key={member._id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-16 w-16">
                    {member.imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image src={member.imageUrl} alt={`${member.firstName} ${member.lastName}`} fill className="object-cover" />
                      </div>
                    ) : (
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xl">
                        {getInitials(member.firstName, member.lastName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle>{member.firstName} {member.lastName}</CardTitle>
                    {member.role && <CardDescription className="text-primary">{member.role}</CardDescription>}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
                  {member.email && (
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" /> {member.email}
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" /> {member.phone}
                    </div>
                  )}
                  {member.bio && (
                    <div className="flex items-start">
                      <Info className="mr-2 h-4 w-4 flex-shrink-0" /> <p className="line-clamp-2">{member.bio}</p>
                    </div>
                  )}
                  {member.serviceIds && member.serviceIds.length > 0 && (
                    <div className="flex items-start flex-wrap gap-1 pt-2 border-t mt-2">
                      <Briefcase className="mr-2 h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {member.serviceIds.map((service: string | { _id: string; name: string }) => {
                          if (typeof service === 'string') return null;
                          return (
                            <Badge key={service._id} variant="secondary" className="text-xs">
                              {service.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
                <div className="p-4 pt-0 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(member)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(member._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
