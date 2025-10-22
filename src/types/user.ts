// User-related types and interfaces

export interface StaffPermissions {
  canManageServices: boolean;
  canManageBookings: boolean;
  canManageCustomers: boolean;
  canViewReports: boolean;
  canManageBusiness: boolean;
}

export interface User {
  _id: string;
  clerkUserId: string;
  name: string;
  email: string;
  role: 'owner' | 'staff';
  businessId?: string;
  phone?: string;
  theme?: 'light' | 'dark' | 'system';
  permissions?: StaffPermissions;
  isActive: boolean;
  createdAt: string;
}

export interface UserData {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  role: 'owner' | 'staff';
  plan: 'free' | 'pro' | 'enterprise';
  businessId?: string;
  phone?: string;
  theme?: 'light' | 'dark' | 'system';
  permissions?: StaffPermissions;
  isActive: boolean;
  createdAt: string;
}
