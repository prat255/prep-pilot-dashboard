
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all users from localStorage
  useEffect(() => {
    const loadUsers = () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('jeeTrackerUsers') || '[]');
        setUsers(storedUsers);
      } catch (error) {
        console.error('Failed to load users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleUserRoleChange = (userId: string, newRole: 'user' | 'admin') => {
    const updatedUsers = users.map(user => {
      if (user.email === userId) {
        return { ...user, role: newRole };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem('jeeTrackerUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: 'Success',
      description: `User role updated to ${newRole}`,
    });

    // Update current user session if that's the user being modified
    const currentUser = JSON.parse(localStorage.getItem('jeeTrackerCurrentUser') || '{}');
    if (currentUser.email === userId) {
      localStorage.setItem('jeeTrackerCurrentUser', JSON.stringify({
        ...currentUser,
        role: newRole
      }));
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const updatedUsers = users.filter(user => user.email !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('jeeTrackerUsers', JSON.stringify(updatedUsers));
      
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      
      // If selected user is deleted, clear selection
      if (selectedUser === userId) {
        setSelectedUser(null);
      }
    }
  };

  const handleViewUserData = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ WARNING: This will delete ALL application data including users, progress, and settings. This cannot be undone. Are you absolutely sure?')) {
      // Clear all localStorage items related to the app
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('jeeTracker')) {
          localStorage.removeItem(key);
        }
      });
      
      toast({
        title: 'Data Cleared',
        description: 'All application data has been reset',
      });
      
      // Reload the page to reflect changes
      window.location.reload();
    }
  };

  // Get user data by ID
  const getUserData = (userId: string) => {
    const dataKey = `jeeTracker_${userId}_data`;
    try {
      return JSON.parse(localStorage.getItem(dataKey) || '{}');
    } catch (error) {
      console.error('Failed to load user data:', error);
      return {};
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage users and system data.
            </p>
          </div>
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
              <TabsTrigger value="storage">Storage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage user accounts and roles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-jee-primary"></div>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {users.length === 0 ? (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                            No users found
                          </p>
                        ) : (
                          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                              <li key={user.email} className="py-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{user.name || `${user.firstName} ${user.lastName}`}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                    <div className="inline-flex mt-1 items-center rounded bg-jee-muted px-2 py-0.5 text-xs font-medium text-jee-primary">
                                      {user.role || 'user'}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleViewUserData(user.email)}
                                    >
                                      View Data
                                    </Button>
                                    <Select 
                                      defaultValue={user.role || 'user'} 
                                      onValueChange={(value) => handleUserRoleChange(user.email, value as 'user' | 'admin')}
                                    >
                                      <SelectTrigger className="w-24">
                                        <SelectValue placeholder="Role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleDeleteUser(user.email)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>User Data</CardTitle>
                    <CardDescription>
                      {selectedUser ? `Viewing data for ${selectedUser}` : 'Select a user to view their data'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedUser ? (
                      <div className="max-h-96 overflow-y-auto">
                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm overflow-x-auto">
                          {JSON.stringify(getUserData(selectedUser), null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Select a user from the left panel to view their data
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Global application settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="app-name">Application Name</Label>
                    <Input id="app-name" defaultValue="JEETracker+" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input id="support-email" defaultValue="support@jeetracker.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <Select defaultValue="off">
                      <SelectTrigger id="maintenance-mode">
                        <SelectValue placeholder="Maintenance Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on">On</SelectItem>
                        <SelectItem value="off">Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="mt-4">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="storage">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Manage application data and storage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">Danger Zone</h3>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1 mb-3">
                      The actions below can result in irreversible data loss. Proceed with caution.
                    </p>
                    <Button 
                      variant="destructive"
                      onClick={handleClearAllData}
                    >
                      Clear All Application Data
                    </Button>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-md">
                    <h3 className="text-lg font-medium">Storage Information</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Users:</span>
                        <span>{users.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LocalStorage Keys:</span>
                        <span>{Object.keys(localStorage).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LocalStorage Usage:</span>
                        <span>{(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB</span>
                      </div>
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

export default Admin;
