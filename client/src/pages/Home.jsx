import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Home({ isLoggedIn }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  // Load the selected app from localStorage when the component mounts
  useEffect(() => {
    const storedSelectedApp = localStorage.getItem('selectedApp');
    if (storedSelectedApp) {
      try {
        const parsed = JSON.parse(storedSelectedApp);
        setSelectedApp(parsed);
      } catch (error) {
        console.error('Error parsing stored selected app:', error);
        // Fall back to default if parse error
        setSelectedApp({
          id: 1,
          name: 'Digital Shelf iQ',
          icon: '📊',
          description: 'Product visibility analytics'
        });
      }
    } else {
      // Set default only if no stored app found
      setSelectedApp({
        id: 1,
        name: 'Digital Shelf iQ',
        icon: '📊',
        description: 'Product visibility analytics'
      });
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Only render components once selectedApp is initialized */}
      {selectedApp && (
        <>
          <Sidebar isOpen={isSidebarOpen} selectedApp={selectedApp} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar
              isSidebarOpen={isSidebarOpen}
              isLoggedIn={isLoggedIn}
              setIsSidebarOpen={setIsSidebarOpen}
              selectedApp={selectedApp}
              setSelectedApp={setSelectedApp}
            />
            {/* Content from nested route appears here */}
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
}

export default Home;