// Admin panel-related types and interfaces

export interface AdminPanelProps {
  connected: boolean;
  pingOk: boolean;
  userCount: number | null;
  businessCount: number | null;
  serviceCount: number | null;
  bookingCount: number | null;
  errorMessage: string | null;
}

export type TabType = 'dashboard' | 'users' | 'businesses' | 'services' | 'bookings' | 'payments';
