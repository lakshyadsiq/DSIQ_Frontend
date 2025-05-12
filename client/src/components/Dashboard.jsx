import React from 'react';
import { useTimeGreeting } from '../hooks/useTimeGreeting';

const Dashboard = () => {
  const greeting = useTimeGreeting();
  const userName = "Name";

  return (
    <div className="flex-1 overflow-auto ">
      <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 h-full flex items-center justify-center transition-colors duration-300">
        <div className="text-center text-amber-800 dark:text-amber-200 space-y-2">
          <h2 className="text-3xl font-semibold">Main</h2>
          <p className="text-3xl font-semibold">Canvas</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
