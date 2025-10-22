// Booking-related types and interfaces

export interface Client {
  name: string;
  phone?: string;
  email?: string;
}

export interface Booking {
  _id: string;
  businessId: string;
  userId?: string;
  client: Client;
  serviceId: string;
  staffId?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'deposit_paid' | 'paid' | 'refunded';
  totalPrice: number;
  depositAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  serviceId: string;
  staffId: string;
  date: Date;
  startTime: string;
  notes?: string;
}
