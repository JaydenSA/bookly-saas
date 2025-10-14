import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { useState, useEffect } from 'react';
import { UserData, StaffPermissions } from '@/types';

export function usePermissions() {
  const { user: kindeUser, isAuthenticated } = useKindeAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('usePermissions - useEffect triggered:', { isAuthenticated, kindeUserId: kindeUser?.id });
      
      if (!isAuthenticated || !kindeUser) {
        console.log('usePermissions - Not authenticated or no kindeUser, setting loading to false');
        setIsLoading(false);
        return;
      }

      try {
        console.log('usePermissions - Fetching user data for:', kindeUser.id);
        const response = await fetch(`/api/users/me?kindeUserId=${kindeUser.id}`);
        console.log('usePermissions - API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('usePermissions - Fetched user data:', data.user);
          console.log('usePermissions - User permissions:', data.user.permissions);
          setUserData(data.user);
        } else {
          console.error('usePermissions - API response not ok:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('usePermissions - Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, kindeUser]);

  const hasPermission = (permission: keyof StaffPermissions): boolean => {
    console.log('usePermissions - hasPermission called with:', permission, 'userData:', userData);
    
    if (!userData) {
      console.log('usePermissions - No userData available');
      return false;
    }
    
    console.log('usePermissions - User data found:', {
      id: userData.id,
      role: userData.role,
      permissions: userData.permissions,
      hasPermissions: !!userData.permissions
    });
    
    // Owners have all permissions
    if (userData.role === 'owner') {
      console.log('usePermissions - Owner has all permissions');
      return true;
    }
    
    // Staff members need specific permission
    if (userData.role === 'staff') {
      if (userData.permissions) {
        const hasPerm = userData.permissions[permission] || false;
        console.log(`usePermissions - Checking ${permission}:`, hasPerm, 'User permissions:', userData.permissions);
        return hasPerm;
      } else {
        console.log('usePermissions - Staff member has no permissions object');
        return false;
      }
    }
    
    console.log('usePermissions - No permissions found for staff member');
    return false;
  };

  const canManageServices = hasPermission('canManageServices');
  const canManageBookings = hasPermission('canManageBookings');
  const canManageCustomers = hasPermission('canManageCustomers');
  const canViewReports = hasPermission('canViewReports');
  const canManageStaff = hasPermission('canManageStaff');
  const canManageBusiness = hasPermission('canManageBusiness');

  return {
    userData,
    isLoadingPermissions: isLoading,
    isOwner: userData?.role === 'owner',
    isStaff: userData?.role === 'staff',
    hasPermission,
    canManageServices,
    canManageBookings,
    canManageCustomers,
    canViewReports,
    canManageStaff,
    canManageBusiness,
  };
}
