// Staff-related types and interfaces

export interface StaffPermissions {
  canManageServices: boolean;
  canManageBookings: boolean;
  canManageCustomers: boolean;
  canViewReports: boolean;
  canManageStaff: boolean;
  canManageBusiness: boolean;
}

export interface StaffInvite {
  _id: string;
  businessId: string;
  invitedBy: string;
  email: string;
  role: 'staff';
  permissions: StaffPermissions;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
  expiresAt: string;
  acceptedAt?: string;
  declinedAt?: string;
  acceptedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffMember {
  _id: string;
  kindeUserId: string;
  name: string;
  email: string;
  role: 'staff';
  businessId: string;
  permissions: StaffPermissions;
  isActive: boolean;
  createdAt: string;
}

export interface CreateStaffInviteData {
  email: string;
  permissions: StaffPermissions;
}

export interface UpdateStaffPermissionsData {
  permissions: StaffPermissions;
}

export interface StaffInviteResponse {
  invite: StaffInvite;
  inviteUrl: string;
}
