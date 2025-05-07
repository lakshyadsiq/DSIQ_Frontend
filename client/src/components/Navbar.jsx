import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, Moon, Sun, Settings, Plus, HelpCircle, Box } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, isLoggedIn }) => {
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="flex h-16 items-center justify-between px-4 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 transition-colors duration-300">
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {!isSidebarOpen && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-300 dark:bg-gray-700 rounded-md">
            <Box size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="font-medium text-gray-800 dark:text-gray-200">Logo</span>
          </div>
        )}

        <div className="relative ml-2">
          <button className="px-4 py-1.5 bg-gray-300 dark:bg-gray-700 rounded-md flex items-center text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-200">
            Apps
          </button>
        </div>

        <div className="px-4 py-1.5 bg-gray-300 dark:bg-gray-700 rounded-md flex items-center">
          <span className="text-gray-800 dark:text-gray-200 mr-1">Workspace Name</span>
          <Plus size={16} className="text-gray-600 dark:text-gray-400" />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200">
          <HelpCircle size={20} />
        </button>

        <button 
          onClick={toggleTheme}
          className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200">
          <Settings size={20} />
        </button>

        {isLoggedIn ? (
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all duration-200"
            >
              <img 
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </button>
            <ProfileDropdown 
              isOpen={isProfileOpen} 
              onClose={() => setIsProfileOpen(false)} 
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Login
            </button>
            <button className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
