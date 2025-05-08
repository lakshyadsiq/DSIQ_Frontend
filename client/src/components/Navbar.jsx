import React, { useState } from 'react';
import {
  TableOfContents,
  Bell,
  Settings,
  Plus,
  HelpCircle,
  ArrowRightFromLine,
  ChevronDown
} from 'lucide-react';
import { DropDownButton } from '@progress/kendo-react-buttons';
import ProfileDropdown from './ProfileDropdown';
import { useNavigate } from 'react-router-dom';

const apps = [
  { name: 'Digital Shelf iQ', icon: '📊', description: 'Product visibility analytics' },
  { name: 'Shopper iQ', icon: '🛒', description: 'Consumer behavior insights' },
  { name: 'Promotion iQ', icon: '💰', description: 'Promotional performance tracking' },
  { name: 'Channel AMP', icon: '📈', description: 'Amplify your channel strategy' },
];

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, isLoggedIn }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const renderAppItem = (li, itemProps) => {
    const app = itemProps?.dataItem;
    if (!app) return <div className="p-2 text-gray-500">Unknown App</div>;
  
    return (
      <>
        <span className="text-xl mr-3">{app.icon}</span>
        <div>
          <div className="font-medium text-gray-800 dark:text-gray-200">{app.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{app.description}</div>
        </div>
      </>
    );
  };

  return (
    <nav className="flex h-16 items-center justify-between px-4 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 transition-colors duration-300">
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            {/* Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle sidebar"
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? <TableOfContents size={20} /> : <ArrowRightFromLine size={20} />}
            </button>
            {/* Apps Dropdown */}
            <div className="relative">
              <DropDownButton
                text={
                  <span className="flex items-center space-x-1">
                    <span>Apps</span>
                    <ChevronDown size={16} />
                  </span>
                }
                icon="none"
                items={apps}
                itemRender={renderAppItem}
                popupSettings={{ animate: true, popupClass: 'apps-dropdown-popup' }}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-md px-3 py-1.5"
              />
            </div>

            {/* Workspace Button */}
            <div className="px-4 py-1.5 bg-gray-300 dark:bg-gray-700 rounded-md flex items-center space-x-2">
              <span className="text-gray-800 dark:text-gray-200">Workspace Name</span>
              <button
                className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                aria-label="Create new workspace"
                onClick={()=>{navigate('/workspaceCreate')}}
              >
                <Plus size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <img src="./1.png" alt="Company Logo" className="h-12 w-auto object-contain" />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200" aria-label="Help">
          <HelpCircle size={20} />
        </button>

        <button className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200" aria-label="Settings">
          <Settings size={20} />
        </button>

        <div className="relative">
          <button className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200" aria-label="Notifications">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
          </button>
        </div>

        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all duration-200 flex items-center justify-center"
              aria-label="User menu"
              aria-expanded={isProfileOpen}
            >
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <ProfileDropdown onClose={() => setIsProfileOpen(false)} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Login</button>
            <button className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition">Sign Up</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
