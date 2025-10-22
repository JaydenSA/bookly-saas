// Service-related types and interfaces

export interface Service {
  _id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  businessId: string;
  categoryId?: string | { _id: string; name: string; color: string };
  isActive: boolean;
  depositRequired: boolean;
  staffIds: Array<string | { _id: string; firstName: string; lastName: string; role?: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesSectionProps {
  businessId: string;
}

export interface CreateServiceData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  businessId: string;
  categoryId?: string;
  isActive?: boolean;
  depositRequired?: boolean;
  staffIds?: string[];
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  categoryId?: string;
  isActive?: boolean;
  depositRequired?: boolean;
  staffIds?: string[];
}

export interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
  categoryId: string;
  staffIds: string[];
}
