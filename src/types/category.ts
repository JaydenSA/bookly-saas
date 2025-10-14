// Category-related types and interfaces

export interface Category {
  _id: string;
  businessId: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}

export interface CategoriesSectionProps {
  businessId: string;
}
