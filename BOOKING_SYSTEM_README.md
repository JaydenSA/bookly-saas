# Booking System Documentation

## Overview
A comprehensive booking system that allows clients to book services from businesses, select staff members, choose dates and times, and manage their bookings.

## Features

### 1. **Public Booking Flow**
- **Service Discovery**: Browse businesses and services on the `/discover` page
- **Service Details**: View detailed service information on business pages
- **Book Button**: Click "Book" on any service to start the booking process

### 2. **Authentication Required**
- Users must sign in before making a booking
- Automatic redirect to sign-in if not authenticated
- Seamless continuation after authentication

### 3. **Multi-Step Booking Process**

#### Step 1: Sign In (if needed)
- Prompt to sign in with Clerk authentication
- Redirect back to booking after successful sign-in

#### Step 2: Select Date
- Interactive calendar view
- Shows current month with navigation
- Only allows selecting future dates
- Visual feedback for selected date

#### Step 3: Choose Staff Member
- Displays all staff members who can perform the selected service
- Shows staff photos, names, roles, and bios
- Only staff assigned to the service are shown

#### Step 4: Select Time
- Shows available time slots for the selected date and staff member
- Time slots generated in 30-minute intervals (9 AM - 5 PM)
- Automatically filters out already booked slots
- Duration-aware (accounts for service duration)

#### Step 5: Confirm Booking
- Review all booking details:
  - Service name and duration
  - Date and time
  - Staff member
  - Business name
  - Price
- Add optional notes
- Confirm to create the booking

### 4. **My Bookings Dashboard**
- View all personal bookings in one place
- Filter by:
  - **All**: All bookings
  - **Upcoming**: Future bookings (pending/confirmed)
  - **Past**: Completed or past-date bookings
- Booking details include:
  - Service information
  - Date, time, and duration
  - Staff member assigned
  - Booking status (pending, confirmed, cancelled, completed)
  - Payment status
  - Notes
- **Cancel Bookings**: Cancel pending bookings directly from the dashboard

## Technical Implementation

### Database Models

#### Booking Model (`src/models/Booking.ts`)
```typescript
{
  businessId: ObjectId,        // Business providing the service
  userId: ObjectId,             // User who made the booking
  client: {                     // Client information
    name: string,
    email: string,
    phone: string
  },
  serviceId: ObjectId,          // Service being booked
  staffId: ObjectId,            // Staff member assigned
  date: Date,                   // Booking date
  startTime: string,            // e.g., "09:00"
  endTime: string,              // e.g., "10:00"
  status: enum,                 // pending, confirmed, cancelled, completed
  paymentStatus: enum,          // unpaid, deposit_paid, paid, refunded
  totalPrice: number,
  depositAmount: number,
  notes: string
}
```

### API Endpoints

#### `GET /api/bookings`
- **Query Params**: 
  - `businessId`: Filter by business
  - `userId`: Filter by user (for My Bookings)
- **Returns**: List of bookings with populated service and staff data

#### `POST /api/bookings`
- **Auth**: Required
- **Body**:
  ```json
  {
    "businessId": "...",
    "serviceId": "...",
    "staffId": "...",
    "date": "2025-01-15T00:00:00.000Z",
    "startTime": "09:00",
    "notes": "Optional notes"
  }
  ```
- **Returns**: Created booking with populated data

#### `PUT /api/bookings/:id`
- **Auth**: Required (owner or business manager)
- **Body**: Fields to update (e.g., `{ "status": "cancelled" }`)
- **Returns**: Updated booking

#### `GET /api/bookings/availability`
- **Query Params**:
  - `businessId`: Business ID
  - `staffId`: Staff member ID
  - `date`: Date in ISO format
  - `duration`: Service duration in minutes
- **Returns**: Array of time slots with availability status
  ```json
  {
    "timeSlots": [
      { "time": "09:00", "available": true },
      { "time": "09:30", "available": false },
      ...
    ]
  }
  ```

#### `GET /api/staff`
- **Query Params**:
  - `businessId`: Business ID (public endpoint)
  - `serviceId`: Filter staff by service capability
- **Returns**: Staff members who can perform the service

### Components

#### `BookingDialog` (`src/components/booking/BookingDialog.tsx`)
- Multi-step dialog for creating bookings
- Handles authentication check
- Calendar implementation
- Staff selection
- Time slot selection
- Booking confirmation

#### `MyBookingsSection` (`src/components/dashboard/MyBookingsSection.tsx`)
- Displays user's bookings
- Filtering by status
- Cancel booking functionality
- Responsive design

### Availability Logic

The availability system works as follows:

1. **Time Slot Generation**: Creates 30-minute intervals from 9 AM to 5 PM
2. **Existing Bookings**: Fetches all non-cancelled bookings for the staff member on the selected date
3. **Overlap Detection**: Checks if a potential booking would overlap with existing bookings
4. **Duration-Aware**: Accounts for service duration when checking availability
5. **Business Hours**: Ensures bookings don't extend beyond 5 PM

#### Example:
- Service duration: 60 minutes
- Existing booking: 10:00 - 11:00
- Available slots: 09:00, 09:30, 11:00, 11:30, ... (10:00 and 10:30 are blocked)

## User Flow

### For Clients (Booking a Service)

1. **Discover Services**
   - Browse `/discover` page
   - Search and filter businesses
   - Click on a business to view details

2. **Select Service**
   - View available services
   - Click "Book" on desired service

3. **Sign In** (if needed)
   - Prompted to sign in
   - Continues to booking after authentication

4. **Complete Booking**
   - Select date from calendar
   - Choose staff member
   - Pick available time slot
   - Review and confirm
   - Add optional notes

5. **View Bookings**
   - Go to `/dashboard`
   - See "My Bookings" section
   - View upcoming appointments
   - Cancel if needed

### For Business Owners (Managing Bookings)

1. **Staff Setup**
   - Add staff members in dashboard
   - Assign services to each staff member

2. **View Bookings**
   - "Bookings Section" in dashboard
   - See all bookings for the business
   - Update booking status
   - Manage appointments

## Key Features & Benefits

✅ **User-Friendly**: Intuitive multi-step process
✅ **Visual Calendar**: Easy date selection
✅ **Smart Availability**: Prevents double-bookings
✅ **Staff Selection**: Choose preferred staff member
✅ **Real-time Updates**: Immediate availability checking
✅ **Secure**: Authentication required
✅ **Flexible**: Cancel pending bookings
✅ **Comprehensive**: Full booking history

## Future Enhancements

Potential improvements:
- Email/SMS notifications
- Payment integration
- Recurring bookings
- Booking reminders
- Business hours configuration
- Staff-specific schedules
- Waitlist functionality
- Review and rating system

## Configuration

### Business Hours
Currently hardcoded: 9:00 AM - 5:00 PM
Location: `src/app/api/bookings/availability/route.ts`

### Time Slot Interval
Currently: 30 minutes
Location: `src/app/api/bookings/availability/route.ts`

### Booking Cancellation
- Only pending bookings can be cancelled
- Cancellation available to booking owner and business manager


