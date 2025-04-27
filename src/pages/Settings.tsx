
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, User, Bell, Shield, LogOut } from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    studyReminders: true,
    darkModePreference: 'system',
    revisionInterval: 7
  });
  const [loading, setLoading] = useState(false);

  // Load user preferences
  useEffect(() => {
    if (user) {
      // Get stored preferences
      try {
        const prefsKey = `jeeTracker_${user.email}_preferences`;
        const storedPrefs = JSON.parse(localStorage.getItem(prefsKey) || '{}');
        
        // Merge with default preferences
        setPreferences(prev => ({
          ...prev,
          ...storedPrefs
        }));
        
        // Load user data
        const users = JSON.parse(localStorage.getItem('jeeTrackerUsers') || '[]');
        const userData = users.find((u: any) => u.email === user.email);
        
        if (userData) {
          setProfileData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    }
  }, [user]);

  // Save preferences
  const savePreferences = () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const prefsKey = `jeeTracker_${user.email}_preferences`;
      localStorage.setItem(prefsKey, JSON.stringify(preferences));
      
      toast({
        title: 'Success',
        description: 'Your preferences have been saved',
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your preferences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem('jeeTrackerUsers') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.email === user.email) {
          // Validate current password if provided
          if (profileData.currentPassword && u.password !== profileData.currentPassword) {
            throw new Error('Current password is incorrect');
          }
          
          // Check if new password matches confirmation
          if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
            throw new Error('New passwords do not match');
          }
          
          return {
            ...u,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            name: `${profileData.firstName} ${profileData.lastName}`,
            ...(profileData.newPassword ? { password: profileData.newPassword } : {})
          };
        }
        return u;
      });
      
      localStorage.setItem('jeeTrackerUsers', JSON.stringify(updatedUsers));
      
      // Update current user session
      if (user && (profileData.firstName || profileData.lastName)) {
        const currentUser = JSON.parse(localStorage.getItem('jeeTrackerCurrentUser') || '{}');
        localStorage.setItem('jeeTrackerCurrentUser', JSON.stringify({
          ...currentUser,
          name: `${profileData.firstName} ${profileData.lastName}`
        }));
      }
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      toast({
        title: 'Success',
        description: 'Your profile has been updated',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update your profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const deleteAccount = () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const users = JSON.parse(localStorage.getItem('jeeTrackerUsers') || '[]');
        const updatedUsers = users.filter((u: any) => u.email !== user.email);
        localStorage.setItem('jeeTrackerUsers', JSON.stringify(updatedUsers));
        
        // Clean up user data
        const userDataKey = `jeeTracker_${user.email}_data`;
        const userPrefsKey = `jeeTracker_${user.email}_preferences`;
        localStorage.removeItem(userDataKey);
        localStorage.removeItem(userPrefsKey);
        
        // Logout
        logout();
        
        toast({
          title: 'Account Deleted',
          description: 'Your account and data have been permanently deleted',
        });
      } catch (error) {
        console.error('Failed to delete account:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete your account',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage your account preferences and application settings.
            </p>
          </div>
          
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-jee-primary" />
                    <CardTitle>Profile Information</CardTitle>
                  </div>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your email address cannot be changed
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={profileData.currentPassword}
                          onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                          placeholder="Enter your current password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                          placeholder="Enter new password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={profileData.confirmPassword}
                          onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={updateProfile} 
                    disabled={loading} 
                    className="mt-4"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5 text-jee-primary" />
                    <CardTitle>User Preferences</CardTitle>
                  </div>
                  <CardDescription>
                    Customize your app experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Study Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="revisionInterval">Default Revision Interval (days)</Label>
                        <Input
                          id="revisionInterval"
                          type="number"
                          min="1"
                          max="30"
                          value={preferences.revisionInterval}
                          onChange={(e) => setPreferences({
                            ...preferences, 
                            revisionInterval: parseInt(e.target.value) || 7
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Appearance</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="darkMode">Dark Mode Preference</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            id="system" 
                            name="darkMode"
                            checked={preferences.darkModePreference === 'system'}
                            onChange={() => setPreferences({...preferences, darkModePreference: 'system'})}
                          />
                          <label htmlFor="system">Follow System Preference</label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            id="light" 
                            name="darkMode"
                            checked={preferences.darkModePreference === 'light'}
                            onChange={() => setPreferences({...preferences, darkModePreference: 'light'})}
                          />
                          <label htmlFor="light">Light Mode</label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            id="dark" 
                            name="darkMode"
                            checked={preferences.darkModePreference === 'dark'}
                            onChange={() => setPreferences({...preferences, darkModePreference: 'dark'})}
                          />
                          <label htmlFor="dark">Dark Mode</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={savePreferences} 
                    disabled={loading}
                    className="mt-4"
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-jee-primary" />
                    <CardTitle>Notifications</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive updates via email
                        </p>
                      </div>
                      <Switch 
                        checked={preferences.emailNotifications} 
                        onCheckedChange={(checked) => setPreferences({
                          ...preferences, 
                          emailNotifications: checked
                        })} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch 
                        checked={preferences.pushNotifications} 
                        onCheckedChange={(checked) => setPreferences({
                          ...preferences, 
                          pushNotifications: checked
                        })} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium">Study Reminders</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive reminders for your study schedule
                        </p>
                      </div>
                      <Switch 
                        checked={preferences.studyReminders} 
                        onCheckedChange={(checked) => setPreferences({
                          ...preferences, 
                          studyReminders: checked
                        })} 
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={savePreferences} 
                    disabled={loading}
                    className="mt-4"
                  >
                    {loading ? 'Saving...' : 'Save Notification Settings'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-jee-primary" />
                    <CardTitle>Account Management</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your account settings and data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Status</h3>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                      <div className="flex justify-between">
                        <span>Account Type:</span>
                        <span className="font-medium">{user?.role === 'admin' ? 'Administrator' : 'Standard User'}</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span>Email:</span>
                        <span className="font-medium">{user?.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Export Your Data</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Download a copy of your data including your progress, revisions, and settings
                    </p>
                    <Button variant="outline">
                      Export Data (JSON)
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Management</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Sign out from all devices
                    </p>
                    <Button 
                      variant="outline"
                      className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out From All Devices
                    </Button>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4 rounded-md">
                      <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Danger Zone</h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1 mb-3">
                        The following actions are irreversible. Please proceed with caution.
                      </p>
                      <Button 
                        variant="destructive"
                        onClick={deleteAccount}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
