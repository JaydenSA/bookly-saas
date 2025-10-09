// UI component-related types and interfaces

export interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export interface AddressInputProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  id?: string;
}

export interface FormItemContextValue {
  id: string;
}
