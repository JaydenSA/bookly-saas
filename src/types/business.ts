// Business-related types and interfaces

export interface Business {
  _id: string;
  name: string;
  slug: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  images?: string[];
  category: string;
  workingHours?: WorkingHours;
  timezone?: string;
  depositPercentage: number;
  ownerId?: string;
  payfastMerchantId?: string;
  ozowApiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkingHours {
  mon: string[];
  tue: string[];
  wed: string[];
  thu: string[];
  fri: string[];
  sat: string[];
  sun: string[];
}

export interface BusinessFormData {
  name: string;
  address: string;
  description: string;
  category: string;
  timezone: string;
  depositPercentage: number;
}

export interface BusinessFormProps {
  formData: BusinessFormData;
  setFormData: (data: BusinessFormData) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  images: string[];
  setImages: (images: string[]) => void;
  onClearGallery: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  submitText: string;
}

export interface BusinessSectionProps {
  userId: string;
}
