
import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import PomodoroTimer from '@/components/dashboard/PomodoroTimer';

const Pomodoro = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Improve focus and productivity with timed work sessions.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <PomodoroTimer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pomodoro;
