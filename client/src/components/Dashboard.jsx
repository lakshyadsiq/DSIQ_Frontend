import React from 'react';
import { useTimeGreeting } from '../hooks/useTimeGreeting';

const Dashboard = () => {
  const greeting = useTimeGreeting();
  const userName = "Name";

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {greeting}, {userName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Know Your Market-Know Your Move.
        </p>
      </div>

      <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800 h-[calc(100vh-12rem)] flex items-center justify-center transition-colors duration-300">
        <div className="text-center text-amber-800 dark:text-amber-200 space-y-2">
          <h2 className="text-3xl font-semibold">Main</h2>
          <p className="text-3xl font-semibold">Canvas</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
