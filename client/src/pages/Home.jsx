import React, { useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';

function Home({isLoggedIn}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar isSidebarOpen={isSidebarOpen} isLoggedIn={isLoggedIn} setIsSidebarOpen={setIsSidebarOpen}/>
          <Dashboard />
          <footer className={`w-full bg-gray-800 text-gray-400 py-6 px-6 mt-8 shadow-inner`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© 2025 DSIQ Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-sm hover:underline">Privacy Policy</a>
            <a href="#" className="text-sm hover:underline">Terms of Service</a>
            <a href="#" className="text-sm hover:underline">Help Center</a>
          </div>
        </div>
      </footer>
          <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route path='/viewWorkspace' element={<Dashboard/>} />
          </Routes>
        </div>
      </div>
  );
}

export default Home;