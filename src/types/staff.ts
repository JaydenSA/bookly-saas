// Staff-related types and interfaces

export interface Staff {
  _id: string;
  businessId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  isActive: boolean;
  serviceIds: Array<string | { _id: string; name: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  serviceIds?: string[];
}

export interface UpdateStaffData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  isActive?: boolean;
  serviceIds?: string[];
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
  imageUrl: string;
  serviceIds: string[];
}

