# Simplified Staff System

## Overview
A simplified staff management system with no authentication or account linking - just basic staff member information.

## Features

### Staff Model
Staff members are simple records with:
- ✅ **Basic Info**: First name, last name
- ✅ **Contact**: Email, phone (optional)
- ✅ **Role**: Job title (e.g., "Hairstylist", "Massage Therapist")
- ✅ **Bio**: Brief description
- ✅ **Profile Image**: URL to profile picture
- ✅ **Status**: Active/inactive flag
- ✅ **Service Assignment**: Link to services they can perform

### No Authentication
- Staff members are NOT linked to user accounts
- No invite system
- No login for staff
- Just basic information records (like services)

## Files Created

### Models
- `src/models/Staff.ts` - Mongoose schema for staff members

### Types
- `src/types/staff.ts` - TypeScript interfaces for Staff

### API Routes
- `src/app/api/staff/route.ts` - GET (list) & POST (create)
- `src/app/api/staff/[id]/route.ts` - GET, PUT, DELETE individual staff

### Components
- `src/components/dashboard/StaffSection.tsx` - Full CRUD UI for staff

## Usage

### In Dashboard
Staff section appears for users with `canManageServices` permission, right after Services section.

### CRUD Operations

**Create:**
```typescript
POST /api/staff
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+27 123 456 789",
  "role": "Hairstylist",
  "bio": "10 years experience in styling",
  "imageUrl": "https://example.com/photo.jpg",
  "serviceIds": ["service_id_1", "service_id_2"]
}
```

**Read:**
```typescript
GET /api/staff  // List all for business
GET /api/staff/:id  // Get one
```

**Update:**
```typescript
PUT /api/staff/:id
{
  "firstName": "Updated Name",
  ...
}
```

**Delete:**
```typescript
DELETE /api/staff/:id
```

## UI Features

### Staff Card Display
- Profile picture or initials avatar
- Name and role badge
- Bio (truncated to 2 lines)
- Email and phone icons
- Edit and delete buttons

### Add/Edit Dialog
- All fields in a clean form
- First name & last name required
- All other fields optional
- Responsive grid layout

### Empty State
- Helpful message when no staff
- Quick "Add Staff Member" button

## Integration Points

### With Services
- Staff can be assigned to multiple services via `serviceIds` array
- Services can display which staff members can perform them
- Useful for booking systems where customers can choose a specific staff member

### With Bookings
- Bookings can optionally reference a staff member
- Shows who performed the service

## Benefits of Simplified Approach

✅ **No Complexity**: No authentication, invites, or permissions
✅ **Quick Setup**: Add staff members in seconds
✅ **Flexible**: Easy to extend later if needed
✅ **Maintainable**: Simple CRUD operations
✅ **Works Offline**: Staff info stored in your database

## Future Extensions (Optional)

If you later want to add:
- Staff availability/schedules
- Commission tracking
- Performance metrics
- Client preferences for staff
- Staff-specific booking calendars

All of these can be built on top of this simple foundation!


