'use client';

import { useState } from 'react';
import { Bell, X, UserPlus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/hooks/useNotifications';
import { StaffInvite } from '@/types';
import Link from 'next/link';

export default function NotificationBell() {
  const { notifications, isLoading, markAsRead, hasNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleAcceptInvite = async (invite: StaffInvite) => {
    // Mark as read and redirect to accept page
    await markAsRead(invite._id);
    // Trigger refresh of staff data
    window.dispatchEvent(new CustomEvent('staffDataRefresh'));
    window.location.href = `/accept-invite?token=${invite.token}`;
  };

  const handleDismiss = async (invite: StaffInvite) => {
    await markAsRead(invite._id);
  };

  if (isLoading) {
    return null;
  }

  if (!hasNotifications) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {notifications.length > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {notifications.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 z-50">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Staff Invitations</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                You have {notifications.length} pending invitation{notifications.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((invite) => (
                <div key={invite._id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <UserPlus className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">
                          {(invite.businessId as unknown as { name: string })?.name || 'Business'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Invited by {(invite.invitedBy as unknown as { name: string })?.name || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Expires {new Date(invite.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(invite)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvite(invite)}
                      className="flex-1"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDismiss(invite)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
