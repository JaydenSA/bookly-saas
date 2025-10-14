'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Key,
  Trash2,
  Save,
  LogOut,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Calendar
} from 'lucide-react';
import { useSnackbar } from '@/hooks/useSnackbar';
import { UserData, UserSettings, UserSettingsFormData } from '@/types';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useTheme } from '@/components/providers/ThemeProvider';

interface SettingsSectionProps {
  userData: UserData;
  onUserUpdate?: (updatedUser: UserData) => void;
}

export default function SettingsSection({ userData, onUserUpdate }: SettingsSectionProps) {
  const { theme, setTheme } = useTheme();
  // Removed isEditing state - general tab is always editable
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'billing'>('general');
  const [editForm, setEditForm] = useState({
    name: userData.name,
    phone: userData.phone || '',
    theme: userData.theme || 'system',
  });
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const { showSuccess, showError, showLoading, dismiss } = useSnackbar();

  // Load user settings from server
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const response = await fetch('/api/user-settings');
        if (response.ok) {
          const data = await response.json();
          setUserSettings(data.userSettings);
        } else {
          console.error('Failed to fetch user settings');
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchUserSettings();
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    showSuccess('Theme updated!', {
      description: `Switched to ${newTheme} theme`,
    });
  };

  const handleSaveProfile = async () => {
    const loadingToast = showLoading('Updating profile...', {
      description: 'Saving your changes',
    });

    try {
      const response = await fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedData = await response.json();
      onUserUpdate?.(updatedData.user);
      
      // Update theme in the theme provider
      if (editForm.theme) {
        setTheme(editForm.theme);
      }
      
      dismiss(loadingToast);
      showSuccess('Profile updated successfully!', {
        description: 'Your changes have been saved',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      dismiss(loadingToast);
      showError('Failed to update profile', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    }
  };

  // Removed handleCancelEdit function - no longer needed since always editable

  // Security functions
  const handlePasswordReset = () => {
    showSuccess('Password Reset', {
      description: 'Please check your email for password reset instructions, or visit your Kinde account settings to change your password.',
    });
  };

  const handleMfaSetup = () => {
    showSuccess('MFA Setup', {
      description: 'Please visit your Kinde account settings to set up Multi-Factor Authentication for enhanced security.',
    });
  };

  const handleLogoutAllSessions = () => {
    showSuccess('Logging out...', {
      description: 'You will be redirected to logout',
    });
    // The LogoutLink component will handle the actual logout
  };


  // Old handleSaveNotifications function removed - replaced with server-side version

  const handleSaveNotifications = async (notifications: UserSettings['notifications']) => {
    const loadingToast = showLoading('Saving notification settings...', {
      description: 'Updating your preferences',
    });

    try {
      const response = await fetch('/api/user-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifications,
          appearance: userSettings?.appearance || { theme: 'system' },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notification settings');
      }

      const data = await response.json();
      setUserSettings(data.userSettings);
      
      dismiss(loadingToast);
      showSuccess('Notification settings saved!', {
        description: 'Your preferences have been updated',
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      dismiss(loadingToast);
      showError('Failed to save notification settings', {
        description: 'Please try again',
      });
    }
  };

  const handleSaveAppearance = async (appearance: UserSettings['appearance']) => {
    const loadingToast = showLoading('Saving appearance settings...', {
      description: 'Updating your preferences',
    });

    try {
      const response = await fetch('/api/user-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifications: userSettings?.notifications || {
            email: true,
            sms: false,
            push: true,
            marketing: false,
          },
          appearance,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save appearance settings');
      }

      const data = await response.json();
      setUserSettings(data.userSettings);
      
      // Update theme in the theme provider
      if (appearance.theme) {
        setTheme(appearance.theme);
      }
      
      dismiss(loadingToast);
      showSuccess('Appearance settings saved!', {
        description: 'Your preferences have been updated',
      });
    } catch (error) {
      console.error('Error saving appearance settings:', error);
      dismiss(loadingToast);
      showError('Failed to save appearance settings', {
        description: 'Please try again',
      });
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="settings-layout">
      {/* Settings Header */}
      <div className="settings-header">
        <div>
          <h2 className="settings-title">Settings</h2>
          <p className="settings-subtitle">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <nav className="settings-nav">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'general' | 'notifications' | 'security' | 'billing')}
                    className={`settings-nav-item ${
                      activeTab === tab.id
                        ? 'settings-nav-item-active'
                        : 'settings-nav-item-inactive'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <div className="settings-card-header">
                  <div>
                    <CardTitle className="settings-card-title">General Settings</CardTitle>
                    <CardDescription className="settings-card-description">Update your personal information and preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="settings-form-field">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="settings-form-field">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="settings-form-field">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">Email cannot be changed. Contact support if needed.</p>
                  </div>
                  <div className="settings-form-field">
                    <Label htmlFor="theme">Theme Preference</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, theme: 'light' })}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          editForm.theme === 'light'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Sun className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">Light</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, theme: 'dark' })}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          editForm.theme === 'dark'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Moon className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">Dark</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, theme: 'system' })}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          editForm.theme === 'system'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Monitor className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">System</div>
                      </button>
                    </div>
                  </div>
                  <div className="settings-form-actions">
                    <Button onClick={handleSaveProfile} className="flex items-center">
                      <Save className="h-4 w-4 mr-1" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="settings-card-title">Notification Preferences</CardTitle>
                <CardDescription className="settings-card-description">Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingSettings ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading notification settings...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                  <div className="settings-switch-item">
                    <div className="settings-switch-content">
                      <Label className="settings-switch-label">Email Notifications</Label>
                      <p className="settings-switch-description">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={userSettings?.notifications.email || false}
                      onCheckedChange={(checked: boolean) => {
                        if (userSettings) {
                          const updatedNotifications = { ...userSettings.notifications, email: checked };
                          handleSaveNotifications(updatedNotifications);
                        }
                      }}
                    />
                  </div>
                  <Separator className="settings-separator" />
                  <div className="settings-switch-item">
                    <div className="settings-switch-content">
                      <Label className="settings-switch-label">SMS Notifications</Label>
                      <p className="settings-switch-description">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={userSettings?.notifications.sms || false}
                      onCheckedChange={(checked: boolean) => {
                        if (userSettings) {
                          const updatedNotifications = { ...userSettings.notifications, sms: checked };
                          handleSaveNotifications(updatedNotifications);
                        }
                      }}
                    />
                  </div>
                  <Separator className="settings-separator" />
                  <div className="settings-switch-item">
                    <div className="settings-switch-content">
                      <Label className="settings-switch-label">Push Notifications</Label>
                      <p className="settings-switch-description">Receive push notifications in browser</p>
                    </div>
                    <Switch
                      checked={userSettings?.notifications.push || false}
                      onCheckedChange={(checked: boolean) => {
                        if (userSettings) {
                          const updatedNotifications = { ...userSettings.notifications, push: checked };
                          handleSaveNotifications(updatedNotifications);
                        }
                      }}
                    />
                  </div>
                  <Separator className="settings-separator" />
                  <div className="settings-switch-item">
                    <div className="settings-switch-content">
                      <Label className="settings-switch-label">Marketing Emails</Label>
                      <p className="settings-switch-description">Receive promotional and marketing emails</p>
                    </div>
                    <Switch
                      checked={userSettings?.notifications.marketing || false}
                      onCheckedChange={(checked: boolean) => {
                        if (userSettings) {
                          const updatedNotifications = { ...userSettings.notifications, marketing: checked };
                          handleSaveNotifications(updatedNotifications);
                        }
                      }}
                    />
                  </div>
                  </div>
                )}
                {/* Save button removed - settings are saved automatically when toggled */}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="settings-card-title">Security Settings</CardTitle>
                <CardDescription className="settings-card-description">Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Password Management */}
                  <div className="settings-switch-item">
                    <div className="settings-switch-content">
                      <Label className="settings-switch-label flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Password
                      </Label>
                      <p className="settings-switch-description">Change your account password</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handlePasswordReset}>
                      <Lock className="h-4 w-4 mr-1" />
                      Change Password
                    </Button>
                  </div>
                  
                  <Separator className="settings-separator" />
                  
                  {/* MFA Setup */}
                  <div className="settings-switch-item">
                    <div className="settings-switch-content">
                      <Label className="settings-switch-label flex items-center">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Two-Factor Authentication
                      </Label>
                      <p className="settings-switch-description">Add an extra layer of security with MFA</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleMfaSetup}>
                      <Smartphone className="h-4 w-4 mr-1" />
                      Setup MFA
                    </Button>
                  </div>
                  
                  <Separator className="settings-separator" />
                  
                  {/* Session Management */}
                  <div className="settings-switch-item">
                    <div className="settings-switch-content">
                      <Label className="settings-switch-label flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Active Sessions
                      </Label>
                      <p className="settings-switch-description">Log out of all devices and sessions</p>
                    </div>
                    <LogoutLink>
                      <Button variant="outline" size="sm" onClick={handleLogoutAllSessions}>
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout All
                      </Button>
                    </LogoutLink>
                  </div>
                  
                  <Separator className="settings-separator" />
                  
                  {/* Business API Keys */}
                  <div className="settings-switch-item">
                    <div className="settings-switch-content">
                        <div>
                            <Label className="settings-switch-label flex items-center">
                                <Key className="h-4 w-4 mr-2" />
                                Business API Keys
                            </Label>
                            <p className="settings-switch-description">Manage API keys for your business integrations</p>
                        </div>
                      
                      {userData.businessId && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-mono">
                              {showApiKey ? 'bkey_1234567890abcdef' : '••••••••••••••••••••'}
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowApiKey(!showApiKey)}
                              >
                                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

            {activeTab === 'billing' && (
             <div className="space-y-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="settings-card-title">Current Plan</CardTitle>
                   <CardDescription className="settings-card-description">Your current subscription details</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                     <div className="space-y-1">
                       <Label className="text-lg font-semibold capitalize text-green-700 dark:text-green-300">{userData.plan} Plan</Label>
                       <p className="text-sm text-green-600 dark:text-green-400">You&apos;re currently on our free plan</p>
                     </div>
                     <div className="text-right">
                       <p className="text-2xl font-bold text-green-700 dark:text-green-300">$0</p>
                       <p className="text-sm text-green-600 dark:text-green-400">per month</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle className="settings-card-title">Premium Plans (Coming Soon)</CardTitle>
                   <CardDescription className="settings-card-description">Upgrade options will be available soon</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="grid gap-4 md:grid-cols-3">
                     <div className="p-4 border rounded-lg">
                       <div className="space-y-2">
                         <h4 className="font-semibold">Starter</h4>
                         <p className="text-2xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                         <ul className="text-sm space-y-1 text-muted-foreground">
                           <li>• Up to 100 bookings/month</li>
                           <li>• Advanced calendar management</li>
                           <li>• SMS & Email notifications</li>
                           <li>• Payment processing</li>
                         </ul>
                         <Button variant="outline" size="sm" className="w-full" disabled>
                           Coming Soon
                         </Button>
                       </div>
                     </div>
                     <div className="p-4 border rounded-lg border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                       <div className="space-y-2">
                         <div className="flex items-center gap-2">
                           <h4 className="font-semibold">Professional</h4>
                           <Badge variant="secondary" className="text-xs">Most Popular</Badge>
                         </div>
                         <p className="text-2xl font-bold">$79<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                         <ul className="text-sm space-y-1 text-muted-foreground">
                           <li>• Up to 500 bookings/month</li>
                           <li>• Advanced scheduling</li>
                           <li>• Multi-location support</li>
                           <li>• Custom integrations</li>
                         </ul>
                         <Button variant="outline" size="sm" className="w-full" disabled>
                           Coming Soon
                         </Button>
                       </div>
                     </div>
                     <div className="p-4 border rounded-lg">
                       <div className="space-y-2">
                         <h4 className="font-semibold">Enterprise</h4>
                         <p className="text-2xl font-bold">$199<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                         <ul className="text-sm space-y-1 text-muted-foreground">
                           <li>• Unlimited bookings</li>
                           <li>• White-label options</li>
                           <li>• Custom integrations</li>
                           <li>• Dedicated account manager</li>
                         </ul>
                         <Button variant="outline" size="sm" className="w-full" disabled>
                           Contact Sales
                         </Button>
                       </div>
                     </div>
                   </div>
                   <div className="p-4 bg-muted rounded-lg">
                     <p className="text-sm text-muted-foreground text-center">
                       Premium features are currently in development. You&apos;ll be notified when upgrade options become available.
                     </p>
                   </div>
                 </CardContent>
               </Card>
             </div>
            )}

        </div>
      </div>
    </div>
  );
}
