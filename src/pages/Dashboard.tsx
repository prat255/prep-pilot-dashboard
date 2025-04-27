
import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import ProgressChart from '@/components/dashboard/ProgressChart';
import SubjectScores from '@/components/dashboard/SubjectScores';
import StreakCalendar from '@/components/dashboard/StreakCalendar';
import WeakTopics from '@/components/dashboard/WeakTopics';
import UpcomingTests from '@/components/dashboard/UpcomingTests';
import PomodoroTimer from '@/components/dashboard/PomodoroTimer';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Welcome back! Here's your JEE preparation at a glance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <ProgressChart />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <SubjectScores />
            <StreakCalendar />
            <WeakTopics />
            <div className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UpcomingTests />
                <PomodoroTimer />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
