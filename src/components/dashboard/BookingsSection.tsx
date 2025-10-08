'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, Phone, Mail, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSnackbar } from '@/hooks/useSnackbar';

interface Booking {
  _id: string;
  businessId: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  totalAmount: number;
  depositAmount?: number;
  createdAt: string;
  updatedAt: string;
  service?: {
    _id: string;
    name: string;
    duration: number;
    price: number;
  };
}

interface BookingsSectionProps {
  businessId: string;
}

export default function BookingsSection({ businessId }: BookingsSectionProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<{_id: string; name: string; price: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    serviceId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    bookingTime: '',
    status: 'pending' as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    notes: '',
    totalAmount: 0,
    depositAmount: 0,
  });
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        const validBookings = (data.bookings || []).filter((booking: Booking) => 
          booking && booking._id && booking.customerName
        );
        setBookings(validBookings);
      } else {
        showError('Failed to load bookings', {
          description: 'Please try refreshing the page',
        });
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      showError('Failed to load bookings', {
        description: 'Check your internet connection and try again',
      });
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [businessId, showError]);

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(`/api/services?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  }, [businessId]);

  useEffect(() => {
    if (businessId) {
      fetchBookings();
      fetchServices();
    }
  }, [businessId, fetchBookings, fetchServices]);

  const resetForm = () => {
    setFormData({
      serviceId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      bookingDate: '',
      bookingTime: '',
      status: 'pending',
      notes: '',
      totalAmount: 0,
      depositAmount: 0,
    });
    setEditingBooking(null);
  };

  const handleCreateBooking = async () => {
    if (!formData.serviceId || !formData.customerName || !formData.bookingDate || !formData.bookingTime) {
      showError('Please fill in all required fields');
      return;
    }

    const loadingToast = showLoading('Creating booking...', {
      description: 'Please wait while we add your booking',
    });

    try {
      setIsCreating(true);
      const bookingData = {
        ...formData,
        businessId,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const data = await response.json();
      setBookings(prev => [data, ...prev]);
      setIsDialogOpen(false);
      resetForm();

      dismiss(loadingToast);
      showSuccess('Booking created successfully!', {
        description: `Booking for ${formData.customerName} has been added`,
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      dismiss(loadingToast);
      showError('Failed to create booking', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateBooking = async (bookingId: string) => {
    const loadingToast = showLoading('Updating booking...', {
      description: 'Saving your changes',
    });

    try {
      setIsUpdating(bookingId);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update booking');
      }

      const data = await response.json();
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId ? data : booking
      ));
      setIsDialogOpen(false);
      resetForm();

      dismiss(loadingToast);
      showSuccess('Booking updated successfully!', {
        description: 'Your changes have been saved',
      });
    } catch (err) {
      console.error('Error updating booking:', err);
      dismiss(loadingToast);
      showError('Failed to update booking', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const loadingToast = showLoading('Deleting booking...', {
      description: 'Please wait while we remove this booking',
    });

    try {
      setIsDeleting(bookingId);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete booking');
      }

      setBookings(prev => prev.filter(booking => booking._id !== bookingId));

      dismiss(loadingToast);
      showSuccess('Booking deleted successfully!', {
        description: 'The booking has been removed',
      });
    } catch (err) {
      console.error('Error deleting booking:', err);
      dismiss(loadingToast);
      showError('Failed to delete booking', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditDialog = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      serviceId: booking.serviceId,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      bookingDate: booking.bookingDate.split('T')[0], // Convert to YYYY-MM-DD format
      bookingTime: booking.bookingTime,
      status: booking.status,
      notes: booking.notes || '',
      totalAmount: booking.totalAmount,
      depositAmount: booking.depositAmount || 0,
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <Calendar className="h-5 w-5 mr-2" />
            Bookings
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
            <Calendar className="h-5 w-5 mr-2" />
            Bookings
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBooking ? 'Edit Booking' : 'Add New Booking'}
                </DialogTitle>
                <DialogDescription>
                  {editingBooking 
                    ? 'Update the booking details below.' 
                    : 'Add a new booking for your business.'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceId">Service *</Label>
                    <Select
                      value={formData.serviceId}
                      onValueChange={(value) => setFormData({ ...formData, serviceId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service._id} value={service._id}>
                            {service.name} - {formatPrice(service.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'pending' | 'confirmed' | 'cancelled' | 'completed') => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="customer@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bookingDate">Date *</Label>
                    <Input
                      id="bookingDate"
                      type="date"
                      value={formData.bookingDate}
                      onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bookingTime">Time *</Label>
                    <Input
                      id="bookingTime"
                      type="time"
                      value={formData.bookingTime}
                      onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalAmount">Total Amount (ZAR)</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      step="0.01"
                      value={formData.totalAmount === 0 ? '' : formData.totalAmount}
                      onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                      onFocus={(e) => e.target.select()}
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depositAmount">Deposit Amount (ZAR)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      step="0.01"
                      value={formData.depositAmount === 0 ? '' : formData.depositAmount}
                      onChange={(e) => setFormData({ ...formData, depositAmount: parseFloat(e.target.value) || 0 })}
                      onFocus={(e) => e.target.select()}
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes about this booking..."
                    rows={3}
                  />
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
                    onClick={() => editingBooking ? handleUpdateBooking(editingBooking._id) : handleCreateBooking()}
                    disabled={isCreating || (isUpdating !== null)}
                  >
                    {isCreating || (isUpdating !== null) ? 'Saving...' : editingBooking ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first booking to start managing appointments
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Booking
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.filter(booking => booking).map((booking) => (
              <div
                key={booking._id}
                className="flex items-center gap-4 justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{booking?.customerName || 'Unknown Customer'}</h3>
                    <Badge variant={getStatusColor(booking?.status || 'pending')}>
                      {booking?.status || 'Unknown'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(booking?.bookingDate || '')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(booking?.bookingTime || '')}
                    </div>
                    {booking?.customerEmail && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {booking.customerEmail}
                      </div>
                    )}
                    {booking?.customerPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {booking.customerPhone}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatPrice(booking?.totalAmount || 0)}
                    </div>
                    {booking?.service && (
                      <div className="text-muted-foreground">
                        {booking.service.name}
                      </div>
                    )}
                  </div>

                  {booking?.notes && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      &ldquo;{booking.notes}&rdquo;
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 flex-col md:flex-row">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => booking && openEditDialog(booking)}
                    disabled={isUpdating === booking?._id}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => booking?._id && handleDeleteBooking(booking._id)}
                    disabled={isDeleting === booking?._id}
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
