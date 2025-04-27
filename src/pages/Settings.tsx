
import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

const Settings = () => {
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
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Settings page content will be implemented in the next phase.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
