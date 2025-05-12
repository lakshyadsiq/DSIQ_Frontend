import React from 'react';
import { useTimeGreeting } from '../hooks/useTimeGreeting';
import Footer from './Footer'

const Dashboard = ({isLoggedIn}) => {
  const greeting = useTimeGreeting();
  const userName = "Name";

  return (
    <div className="flex flex-col h-full">
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #2d3748; /* darker background */
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4a5568; /* lighter thumb */
            border-radius: 20px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #718096; /* even lighter on hover */
          }
          
          /* Firefox scrollbar */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #4a5568 #2d3748;
          }
        `}
      </style>
      
      <div className="flex-grow overflow-y-auto custom-scrollbar px-4 py-66">
        <div className="text-center text-amber-800 dark:text-amber-200 space-y-2">
          <h2 className="text-3xl font-semibold">Main</h2>
          <p className="text-3xl font-semibold">Canvas</p>
        </div>
      </div>
      
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  );
};

export default Dashboard;