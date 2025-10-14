// User-related types and interfaces

import { StaffPermissions } from './staff';

export interface User {
  _id: string;
  kindeUserId: string;
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
  kindeUserId: string;
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
