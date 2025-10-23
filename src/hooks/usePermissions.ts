import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { UserData, StaffPermissions } from '@/types';

export function usePermissions() {
  const { user: clerkUser, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !clerkUser) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      // Set up timeout
      const timeoutId = setTimeout(() => {
        setHasTimedOut(true);
      }, 10000); // 10 second timeout

      try {
        const response = await fetch(`/api/users/me?clerkUserId=${clerkUser.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
          clearTimeout(timeoutId);
        } else if (response.status === 404) {
          // User doesn't exist in database yet, create them
          const createResponse = await fetch('/api/users/check-or-create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clerkUserId: clerkUser.id,
              name: clerkUser.fullName || clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || 'User',
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
            }),
          });

          if (createResponse.ok) {
            const createData = await createResponse.json();
            setUserData(createData.user);
            clearTimeout(timeoutId);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, clerkUser]);

  const hasPermission = (permission: keyof StaffPermissions): boolean => {
    if (!userData) {
      return false;
    }
    
    // Owners have all permissions
    if (userData.role === 'owner') {
      return true;
    }
    
    // Staff members need specific permission
    if (userData.role === 'staff') {
      if (userData.permissions) {
        return userData.permissions[permission] || false;
      }
      return false;
    }
    
    return false;
  };

  const canManageServices = hasPermission('canManageServices');
  const canManageBookings = hasPermission('canManageBookings');
  const canManageCustomers = hasPermission('canManageCustomers');
  const canViewReports = hasPermission('canViewReports');
  const canManageBusiness = hasPermission('canManageBusiness');

  return {
    userData,
    isLoadingPermissions: isLoading,
    hasTimedOut,
    isOwner: userData?.role === 'owner',
    isStaff: userData?.role === 'staff',
    hasPermission,
    canManageServices,
    canManageBookings,
    canManageCustomers,
    canViewReports,
    canManageBusiness,
  };
}
