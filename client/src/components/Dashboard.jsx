import React from 'react';
import { useTimeGreeting } from '../hooks/useTimeGreeting';
import Footer from './Footer';

const Dashboard = ({isLoggedIn}) => {
  const greeting = useTimeGreeting();

  return (
    <div className="flex flex-col h-screen bg-peach text-gray-700">
      {/* Main content with properly hidden scrollbar */}
      <div className="flex-grow overflow-y-auto px-4 py-6 scrollbar-hide">
        <div className="text-center text-gray-800 space-y-2 mb-6">
          <h2 className="text-3xl font-semibold">
            {greeting}
          </h2>
          <p className="text-3xl font-semibold">Main Canvas</p>
        </div>
      </div>
      <Footer isLoggedIn={isLoggedIn} />
      
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Dashboard;