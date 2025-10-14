'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Copy, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Clock,
  UserCheck,
  UserX,
  Shield,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useSnackbar } from '@/hooks/useSnackbar';
import { StaffMember, StaffInvite, CreateStaffInviteData, StaffPermissions } from '@/types';

interface StaffSectionProps {
  businessId: string;
}

export default function StaffSection({ businessId }: StaffSectionProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [invites, setInvites] = useState<StaffInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    permissions: {
      canManageServices: false,
      canManageBookings: true,
      canManageCustomers: false,
      canViewReports: false,
      canManageStaff: false,
      canManageBusiness: false,
    }
  });
  const [editForm, setEditForm] = useState<StaffPermissions>({
    canManageServices: false,
    canManageBookings: true,
    canManageCustomers: false,
    canViewReports: false,
    canManageStaff: false,
    canManageBusiness: false,
  });
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setIsLoading(true);
      const [staffResponse, invitesResponse] = await Promise.all([
        fetch('/api/staff/members'),
        fetch('/api/staff/invites')
      ]);

      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        console.log('Staff members data:', staffData.staffMembers);
        setStaffMembers(staffData.staffMembers || []);
      }

      if (invitesResponse.ok) {
        const invitesData = await invitesResponse.json();
        setInvites(invitesData.invites || []);
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
      showError('Failed to load staff data');
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for refresh events and add periodic refresh
  useEffect(() => {
    const handleRefresh = () => {
      fetchStaffData();
    };

    // Listen for custom refresh events
    window.addEventListener('staffDataRefresh', handleRefresh);
    
    // Add periodic refresh every 30 seconds to catch any missed updates
    const interval = setInterval(fetchStaffData, 30000);
    
    return () => {
      window.removeEventListener('staffDataRefresh', handleRefresh);
      clearInterval(interval);
    };
  }, []);

  const handleSendInvite = async () => {
    const loadingToast = showLoading('Sending invite...', {
      description: 'Creating staff invitation',
    });

    try {
      const response = await fetch('/api/staff/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to send invite');
      }

      const data = await response.json();
      setInvites([data.invite, ...invites]);
      setIsInviteDialogOpen(false);
      setInviteForm({
        email: '',
        permissions: {
          canManageServices: false,
          canManageBookings: true,
          canManageCustomers: false,
          canViewReports: false,
          canManageStaff: false,
          canManageBusiness: false,
        }
      });

      dismiss(loadingToast);
      showSuccess('Invite sent successfully!', {
        description: `Invitation sent to ${inviteForm.email}. ${data.emailSent ? 'Email sent!' : 'Copy the invite link if needed.'}`,
      });
    } catch (error) {
      console.error('Error sending invite:', error);
      dismiss(loadingToast);
      showError('Failed to send invite', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const handleUpdatePermissions = async () => {
    if (!editingMember) return;

    const loadingToast = showLoading('Updating permissions...', {
      description: 'Saving staff member permissions',
    });

    try {
      console.log('Updating permissions for member:', editingMember._id, 'with data:', editForm);
      
      const response = await fetch(`/api/staff/members/${editingMember._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions: editForm }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update permissions');
      }

      const data = await response.json();
      console.log('Response from update permissions:', data);
      
      setStaffMembers(staffMembers.map(member => 
        member._id === editingMember._id ? data.staffMember : member
      ));

      dismiss(loadingToast);
      showSuccess('Permissions updated successfully!');
      setIsEditDialogOpen(false);
      setEditingMember(null);
      
      // Refresh staff members to get updated data
      fetchStaffData();
    } catch (error) {
      console.error('Error updating permissions:', error);
      dismiss(loadingToast);
      showError('Failed to update permissions', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const handleDeactivateStaff = async (memberId: string) => {
    const loadingToast = showLoading('Deactivating staff member...', {
      description: 'Removing staff access',
    });

    try {
      const response = await fetch(`/api/staff/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to deactivate staff member');
      }

      setStaffMembers(staffMembers.filter(member => member._id !== memberId));

      dismiss(loadingToast);
      showSuccess('Staff member deactivated successfully!');
    } catch (error) {
      console.error('Error deactivating staff member:', error);
      dismiss(loadingToast);
      showError('Failed to deactivate staff member', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const handleReactivateStaff = async (memberId: string) => {
    const loadingToast = showLoading('Reactivating staff member...', {
      description: 'Restoring staff access',
    });

    try {
      const response = await fetch(`/api/staff/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reactivate staff member');
      }

      const data = await response.json();
      console.log('Reactivated staff member:', data.staffMember);

      dismiss(loadingToast);
      showSuccess('Staff member reactivated successfully!', {
        description: 'Staff member has been restored to active status',
      });

      // Refresh staff members
      fetchStaffData();
    } catch (error) {
      console.error('Error reactivating staff member:', error);
      dismiss(loadingToast);
      showError('Failed to reactivate staff member', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const handleDeleteInvite = async (inviteId: string) => {
    const loadingToast = showLoading('Deleting invite...', {
      description: 'Removing staff invitation',
    });

    try {
      const response = await fetch(`/api/staff/invites/${inviteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete invite');
      }

      setInvites(invites.filter(invite => invite._id !== inviteId));

      dismiss(loadingToast);
      showSuccess('Invite deleted successfully!');
    } catch (error) {
      console.error('Error deleting invite:', error);
      dismiss(loadingToast);
      showError('Failed to delete invite', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  const openEditDialog = (member: StaffMember) => {
    setEditingMember(member);
    
    // Ensure permissions always exist with default values
    const permissions = member.permissions || {
      canManageServices: false,
      canManageBookings: true,
      canManageCustomers: false,
      canViewReports: false,
      canManageStaff: false,
      canManageBusiness: false,
    };
    
    console.log('Opening edit dialog for member:', { id: member._id, permissions });
    setEditForm(permissions);
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="default" className="flex items-center gap-1"><Check className="h-3 w-3" />Accepted</Badge>;
      case 'declined':
        return <Badge variant="destructive" className="flex items-center gap-1"><X className="h-3 w-3" />Declined</Badge>;
      case 'expired':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading staff data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Staff Management</h3>
          <p className="text-sm text-muted-foreground">Manage your team members and their permissions</p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Staff Member</DialogTitle>
              <DialogDescription>
                Send an invitation to a new staff member with specific permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="staff@example.com"
                />
              </div>
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="canManageBookings" className="text-sm">Manage Bookings</Label>
                    <Switch
                      id="canManageBookings"
                      checked={inviteForm.permissions.canManageBookings}
                      onCheckedChange={(checked) => setInviteForm({
                        ...inviteForm,
                        permissions: { ...inviteForm.permissions, canManageBookings: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="canManageServices" className="text-sm">Manage Services</Label>
                    <Switch
                      id="canManageServices"
                      checked={inviteForm.permissions.canManageServices}
                      onCheckedChange={(checked) => setInviteForm({
                        ...inviteForm,
                        permissions: { ...inviteForm.permissions, canManageServices: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="canManageCustomers" className="text-sm">Manage Customers</Label>
                    <Switch
                      id="canManageCustomers"
                      checked={inviteForm.permissions.canManageCustomers}
                      onCheckedChange={(checked) => setInviteForm({
                        ...inviteForm,
                        permissions: { ...inviteForm.permissions, canManageCustomers: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="canViewReports" className="text-sm">View Reports</Label>
                    <Switch
                      id="canViewReports"
                      checked={inviteForm.permissions.canViewReports}
                      onCheckedChange={(checked) => setInviteForm({
                        ...inviteForm,
                        permissions: { ...inviteForm.permissions, canViewReports: checked }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendInvite} disabled={!inviteForm.email}>
                Send Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Members
              </CardTitle>
              <CardDescription>
                Team members with access to your business dashboard
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStaffData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {staffMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Staff Members</h3>
              <p className="text-muted-foreground mb-4">
                Invite team members to help manage your business
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {staffMembers.map((member) => {
                // Ensure isActive is always a boolean
                const isActive = member.isActive === undefined ? true : member.isActive;
                
                // Ensure permissions always exist with default values
                const permissions = member.permissions || {
                  canManageServices: false,
                  canManageBookings: true,
                  canManageCustomers: false,
                  canViewReports: false,
                  canManageStaff: false,
                  canManageBusiness: false,
                };
                
                console.log('Rendering member:', { 
                  id: member._id, 
                  name: member.name, 
                  isActive, 
                  role: member.role,
                  permissions 
                });
                return (
                <div key={member._id} className={`flex items-center justify-between p-4 border rounded-lg ${!isActive ? 'opacity-60 bg-muted/30' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                      {isActive ? (
                        <UserCheck className="h-5 w-5 text-primary" />
                      ) : (
                        <UserX className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        {isActive ? (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">Staff</Badge>
                        {permissions.canManageServices && (
                          <Badge variant="secondary" className="text-xs">Services</Badge>
                        )}
                        {permissions.canManageBookings && (
                          <Badge variant="secondary" className="text-xs">Bookings</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(member)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeactivateStaff(member._id)}
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleReactivateStaff(member._id)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Reactivate
                      </Button>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Pending Invitations
                </CardTitle>
                <CardDescription>
                  Staff invitations that haven&apos;t been accepted yet
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchStaffData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invites.map((invite) => (
                <div key={invite._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(invite.status)}
                        {invite.permissions.canManageServices && (
                          <Badge variant="secondary" className="text-xs">Services</Badge>
                        )}
                        {invite.permissions.canManageBookings && (
                          <Badge variant="secondary" className="text-xs">Bookings</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const inviteUrl = `${window.location.origin}/accept-invite?token=${invite.token}`;
                        navigator.clipboard.writeText(inviteUrl);
                        showSuccess('Invite link copied!', {
                          description: 'Share this link with the invited person',
                        });
                      }}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteInvite(invite._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Permissions Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Permissions</DialogTitle>
            <DialogDescription>
              Update permissions for {editingMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-canManageBookings" className="text-sm">Manage Bookings</Label>
                  <Switch
                    id="edit-canManageBookings"
                    checked={editForm.canManageBookings}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, canManageBookings: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-canManageServices" className="text-sm">Manage Services</Label>
                  <Switch
                    id="edit-canManageServices"
                    checked={editForm.canManageServices}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, canManageServices: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-canManageCustomers" className="text-sm">Manage Customers</Label>
                  <Switch
                    id="edit-canManageCustomers"
                    checked={editForm.canManageCustomers}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, canManageCustomers: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-canViewReports" className="text-sm">View Reports</Label>
                  <Switch
                    id="edit-canViewReports"
                    checked={editForm.canViewReports}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, canViewReports: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePermissions}>
              Update Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
