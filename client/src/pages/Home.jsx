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
          <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route path='/viewWorkspace' element={<Dashboard/>} />
          </Routes>
        </div>
      </div>
  );
}

export default Home;