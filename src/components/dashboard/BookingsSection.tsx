'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import { useSnackbar } from '@/hooks/useSnackbar';

interface Booking {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

interface BookingsSectionProps {
  businessId: string;
}

export default function BookingsSection({ businessId }: BookingsSectionProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError } = useSnackbar();

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings?businessId=${businessId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showError('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, [businessId, showError]);

  useEffect(() => {
    fetchBookings();
  }, [businessId, fetchBookings]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'outline',
      confirmed: 'default',
      completed: 'secondary',
      cancelled: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bookings
          </CardTitle>
          <CardDescription>
            Loading bookings...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className='mb-8'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Bookings
        </CardTitle>
        <CardDescription>
          Manage customer bookings and appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground">
              Customer bookings will appear here once they start booking your services.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-lg">{booking.serviceName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(booking.date)} at {formatTime(booking.time)}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground">Customer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{booking.customerEmail}</p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                  </div>
                  
                  {booking.customerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{booking.customerPhone}</p>
                        <p className="text-xs text-muted-foreground">Phone</p>
                      </div>
                    </div>
                  )}
                </div>

                {booking.notes && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </p>
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
