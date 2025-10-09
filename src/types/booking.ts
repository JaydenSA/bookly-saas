// Booking-related types and interfaces

export interface Client {
  name: string;
  phone?: string;
  email?: string;
}

export interface Booking {
  _id: string;
  businessId: string;
  client: Client;
  serviceId: string;
  staffId?: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'deposit_paid' | 'paid' | 'refunded';
  totalPrice: number;
  depositAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
