'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Loader2, CheckCircle, XCircle, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSnackbar } from '@/hooks/useSnackbar';
import { Booking } from '@/types';

interface MyBookingsSectionProps {
  userId: string;
}

export default function MyBookingsSection({ userId }: MyBookingsSectionProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        showError('Failed to load bookings', {
          description: 'Please try refreshing the page',
        });
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      showError('Failed to load bookings', {
        description: 'Check your internet connection and try again',
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, showError]);

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId, fetchBookings]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    const loadingToast = showLoading('Cancelling booking...');
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      dismiss(loadingToast);
      showSuccess('Booking cancelled', {
        description: 'Your booking has been successfully cancelled.',
      });
      fetchBookings(); // Refresh the list
    } catch (error) {
      dismiss(loadingToast);
      showError('Failed to cancel booking', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      cancelled: 'destructive',
      completed: 'outline',
    };
    return (
      <Badge variant={variants[status] || 'secondary'} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase() || '??';
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') {
      return bookingDate >= now && booking.status !== 'cancelled' && booking.status !== 'completed';
    } else if (filter === 'past') {
      return bookingDate < now || booking.status === 'completed';
    }
    return true;
  });

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>View and manage your appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-lg text-muted-foreground">Loading bookings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>View and manage your appointments</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('past')}
            >
              Past
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              {filter === 'upcoming' ? 'No upcoming bookings' : filter === 'past' ? 'No past bookings' : 'No bookings found'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Browse businesses and book a service to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const service = typeof booking.serviceId === 'object' ? booking.serviceId as { _id: string; name: string; description?: string } : null;
              const staff = typeof booking.staffId === 'object' ? booking.staffId as { _id: string; firstName: string; lastName: string; role?: string; imageUrl?: string } : null;

              return (
                <Card key={booking._id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">
                            {service?.name || 'Service'}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        {service?.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          R{booking.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </div>

                    {staff && (
                      <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg mb-4">
                        <Avatar className="h-10 w-10">
                          {staff.imageUrl ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={staff.imageUrl}
                                alt={`${staff.firstName} ${staff.lastName}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(staff.firstName, staff.lastName)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {staff.firstName} {staff.lastName}
                          </p>
                          {staff.role && (
                            <p className="text-xs text-muted-foreground">{staff.role}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {booking.notes && (
                      <div className="p-3 bg-muted rounded-lg mb-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {booking.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getStatusIcon(booking.status)}
                        <span>
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {booking.status === 'pending' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

