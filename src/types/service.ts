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
  createdAt: string;
  updatedAt: string;
}

export interface ServicesSectionProps {
  businessId: string;
}
