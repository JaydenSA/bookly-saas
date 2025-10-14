import { useState, useEffect } from 'react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { StaffInvite } from '@/types';

export function useNotifications() {
  const { user: kindeUser, isAuthenticated } = useKindeAuth();
  const [notifications, setNotifications] = useState<StaffInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated || !kindeUser) {
        setIsLoading(false);
        return;
      }

      try {
        // Check for pending invites for this user's email
        const response = await fetch(`/api/staff/notifications?email=${encodeURIComponent(kindeUser.email || '')}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.invites || []);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, kindeUser]);

  const markAsRead = async (inviteId: string) => {
    try {
      await fetch(`/api/staff/notifications/${inviteId}/read`, {
        method: 'POST',
      });
      setNotifications(notifications.filter(n => n._id !== inviteId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead,
    hasNotifications: notifications.length > 0
  };
}
