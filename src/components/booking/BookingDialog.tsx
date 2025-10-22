'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Calendar, Clock, User, Check, Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSnackbar } from '@/hooks/useSnackbar';
import { Service, Staff } from '@/types';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  businessId: string;
  businessName: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookingDialog({
  open,
  onOpenChange,
  service,
  businessId,
  businessName,
}: BookingDialogProps) {
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState<'auth' | 'date' | 'staff' | 'time' | 'confirm'>(user ? 'date' : 'auth');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableStaff, setAvailableStaff] = useState<Staff[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  // Reset function to clear all state
  const resetDialog = () => {
    setStep(user ? 'date' : 'auth');
    setSelectedDate(null);
    setSelectedStaff(null);
    setSelectedTime(null);
    setNotes('');
    setCurrentMonth(new Date());
    setAvailableStaff([]);
    setAvailableTimeSlots([]);
    setIsLoadingStaff(false);
    setIsLoadingSlots(false);
    setIsSubmitting(false);
  };

  // Reset dialog when it opens
  useEffect(() => {
    if (open) {
      resetDialog();
    }
  }, [open]);

  // Reset to auth step if user logs out
  useEffect(() => {
    if (isLoaded && !user && step !== 'auth') {
      setStep('auth');
    } else if (isLoaded && user && step === 'auth') {
      setStep('date');
    }
  }, [user, isLoaded, step]);

  // Fetch available staff when dialog opens
  useEffect(() => {
    if (open && businessId) {
      console.log('BookingDialog opened with service:', service);
      console.log('Service staffIds:', service.staffIds);
      fetchAvailableStaff();
    }
  }, [open, businessId, service]);

  // Fetch time slots when date and staff are selected
  useEffect(() => {
    if (selectedDate && selectedStaff) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate, selectedStaff]);

  const fetchAvailableStaff = async () => {
    setIsLoadingStaff(true);
    try {
      console.log('Fetching staff for businessId:', businessId, 'serviceId:', service._id);
      console.log('Service staffIds:', service.staffIds);
      
      // If the service already has staffIds populated, use them directly
      if (service.staffIds && service.staffIds.length > 0) {
        console.log('Using service staffIds directly');
        setAvailableStaff(service.staffIds);
        setIsLoadingStaff(false);
        return;
      }
      
      // Fallback to API call if staffIds not populated
      const response = await fetch(`/api/staff?businessId=${businessId}&serviceId=${service._id}`);
      console.log('Staff API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Staff data received:', data);
        setAvailableStaff(data.staffMembers || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Staff API error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  const fetchAvailableTimeSlots = async () => {
    if (!selectedDate || !selectedStaff) return;

    setIsLoadingSlots(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(
        `/api/bookings/availability?businessId=${businessId}&staffId=${selectedStaff._id}&date=${dateStr}&duration=${service.duration}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log('Time slots API response:', data);
        console.log('Available time slots:', data.timeSlots);
        setAvailableTimeSlots(data.timeSlots || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Time slots API error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedDate || !selectedStaff || !selectedTime) return;

    setIsSubmitting(true);
    const loadingToast = showLoading('Creating your booking...');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          serviceId: service._id,
          staffId: selectedStaff._id,
          date: selectedDate.toISOString(),
          startTime: selectedTime,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      dismiss(loadingToast);
      showSuccess('Booking created!', {
        description: `Your booking for ${service.name} on ${selectedDate.toLocaleDateString()} at ${selectedTime} has been confirmed.`,
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      dismiss(loadingToast);
      showError('Booking failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(user ? 'date' : 'auth');
    setSelectedDate(null);
    setSelectedStaff(null);
    setSelectedTime(null);
    setNotes('');
    setCurrentMonth(new Date());
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDateSelectable = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return `${first}${last}`.toUpperCase() || '??';
  };

  const renderAuthStep = () => (
    <div className="text-center py-8">
      <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-xl font-semibold mb-2">Sign in to book</h3>
      <p className="text-muted-foreground mb-6">
        Please sign in to make a booking for {service.name}
      </p>
      <SignInButton mode="modal" fallbackRedirectUrl={`/business/${businessId}`}>
        <Button size="lg">
          Sign In to Continue
        </Button>
      </SignInButton>
    </div>
  );

  const renderDateStep = () => {
    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            const isSelectable = isDateSelectable(date);
            const isSelected = selectedDate && date && 
              selectedDate.toDateString() === date.toDateString();

            return (
              <button
                key={index}
                onClick={() => {
                  if (isSelectable && date) {
                    setSelectedDate(date);
                  }
                }}
                disabled={!isSelectable}
                className={`
                  aspect-square p-2 rounded-lg text-sm font-medium transition-colors
                  ${!date ? 'invisible' : ''}
                  ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                  ${isSelectable && !isSelected ? 'hover:bg-secondary' : ''}
                  ${!isSelectable ? 'text-muted-foreground cursor-not-allowed opacity-50' : ''}
                `}
              >
                {date?.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => setStep('staff')}
            disabled={!selectedDate}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  const renderStaffStep = () => (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Select a staff member for your {service.name} appointment
      </p>

      {isLoadingStaff ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : availableStaff.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No staff available for this service</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 mb-6">
          {availableStaff.map((staff) => (
            <Card
              key={staff._id}
              className={`cursor-pointer transition-all ${
                selectedStaff?._id === staff._id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedStaff(staff)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
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
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xl">
                        {getInitials(staff.firstName, staff.lastName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {staff.firstName} {staff.lastName}
                    </h4>
                    {staff.role && (
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                    )}
                    {staff.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {staff.bio}
                      </p>
                    )}
                  </div>
                  {selectedStaff?._id === staff._id && (
                    <Check className="h-6 w-6 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('date')}>
          Back
        </Button>
        <Button
          onClick={() => setStep('time')}
          disabled={!selectedStaff}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const renderTimeStep = () => (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Select a time for {selectedDate?.toLocaleDateString()}
      </p>

      {isLoadingSlots ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : availableTimeSlots.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No time slots available for this date</p>
          <Button variant="outline" className="mt-4" onClick={() => setStep('date')}>
            Choose Different Date
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 mb-6 max-h-64 overflow-y-auto">
            {availableTimeSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? 'default' : 'outline'}
                disabled={!slot.available}
                onClick={() => setSelectedTime(slot.time)}
                className="h-12"
              >
                {slot.time}
              </Button>
            ))}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep('staff')}>
              Back
            </Button>
            <Button
              onClick={() => setStep('confirm')}
              disabled={!selectedTime}
            >
              Continue
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderConfirmStep = () => (
    <div>
      <h3 className="font-semibold text-lg mb-4">Confirm Your Booking</h3>
      
      <div className="space-y-4 mb-6">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <Label className="text-muted-foreground">Service</Label>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-muted-foreground">{service.duration} minutes</p>
            </div>
            
            <div>
              <Label className="text-muted-foreground">Date & Time</Label>
              <p className="font-medium">
                {selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-muted-foreground">{selectedTime}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Staff Member</Label>
              <div className="flex items-center gap-2 mt-1">
                <Avatar className="h-8 w-8">
                  {selectedStaff?.imageUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={selectedStaff.imageUrl}
                        alt={`${selectedStaff.firstName} ${selectedStaff.lastName}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                      {selectedStaff && getInitials(selectedStaff.firstName, selectedStaff.lastName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <p className="font-medium">
                  {selectedStaff?.firstName} {selectedStaff?.lastName}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground">Business</Label>
              <p className="font-medium">{businessName}</p>
            </div>

            <div>
              <Label className="text-muted-foreground">Price</Label>
              <p className="font-medium text-lg">R{service.price.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <div>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any special requests or information..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep('time')}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Booking
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'auth' && 'Sign In Required'}
            {step === 'date' && 'Select Date'}
            {step === 'staff' && 'Choose Staff Member'}
            {step === 'time' && 'Select Time'}
            {step === 'confirm' && 'Confirm Booking'}
          </DialogTitle>
          <DialogDescription>
            Book {service.name} at {businessName}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'auth' && renderAuthStep()}
          {step === 'date' && renderDateStep()}
          {step === 'staff' && renderStaffStep()}
          {step === 'time' && renderTimeStep()}
          {step === 'confirm' && renderConfirmStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}


