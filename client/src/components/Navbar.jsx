import React, { useState, useRef, useEffect } from 'react';
import './navbar.css'; 
import {
  TableOfContents,
  Bell,
  Settings,
  Plus,
  HelpCircle,
  ArrowRightFromLine,
  ChevronDown,
  Search,
  X,
  Pin,
  PinOff
} from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useNavigate } from 'react-router-dom';

const initialApps = [
  { id: 1, name: 'Digital Shelf iQ', icon: '📊', description: 'Product visibility analytics' },
  { id: 2, name: 'Shopper iQ', icon: '🛒', description: 'Consumer behavior insights' },
  { id: 3, name: 'Promotion iQ', icon: '💰', description: 'Promotional performance tracking' },
  { id: 4, name: 'Channel AMP', icon: '📈', description: 'Amplify your channel strategy' },
];

const mockWorkspaces = [
  { id: 1, name: "Marketing Team" },
  { id: 2, name: "Sales Analytics" },
  { id: 3, name: "Product Development" },
  { id: 4, name: "Customer Support" },
  { id: 5, name: "Executive Dashboard" },
  { id: 6, name: "Q4 2024 Campaign" },
  { id: 7, name: "European Markets" },
  { id: 8, name: "Asia Pacific Region" },
];

// Mock API function to send pinned app to backend
const sendPinnedAppToBackend = async (app) => {
  // In a real implementation, this would be an API call
  try {
    console.log('Sending pinned app to backend:', app);
    // Mock successful API call
    return { success: true, data: app };
  } catch (error) {
    console.error('Error sending pinned app to backend:', error);
    return { success: false, error };
  }
};

const Navbar = ({ isSidebarOpen, setIsSidebarOpen, isLoggedIn, selectedApp, setSelectedApp }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [workspaceSearch, setWorkspaceSearch] = useState('');
  const [currentWorkspace, setCurrentWorkspace] = useState({ id: 1, name: "Marketing Team" });
  const [pinnedApp, setPinnedApp] = useState(null);
  const [apps, setApps] = useState([...initialApps]);
  const [activeApp, setActiveApp] = useState(null); // New state to track the active app
  const workspaceDropdownRef = useRef(null);
  const appDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load selectedApp from localStorage on mount
  useEffect(() => {
    // First try to load from localStorage
    const storedSelectedApp = localStorage.getItem('selectedApp');
    if (storedSelectedApp) {
      try {
        const parsed = JSON.parse(storedSelectedApp);
        setSelectedApp(parsed); // Set in parent component
        setActiveApp(parsed); // Also track locally
      } catch (error) {
        console.error('Error parsing stored selected app:', error);
        localStorage.removeItem('selectedApp');
      }
    }
    
    // Then fetch pinned app (only used if no selectedApp is found)
    const fetchPinnedApp = async () => {
      try {
        // Simulated backend response
        const response = { success: true, data: null }; // No pinned app initially
        
        if (response.success && response.data) {
          setPinnedApp(response.data);
          reorderApps(response.data);
          
          // Only use pinned app as active if no selectedApp was found
          if (!storedSelectedApp) {
            setActiveApp(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching pinned app:', error);
      }
    };
    
    fetchPinnedApp();
  }, []);

  // Update the active app whenever selectedApp changes from props
  useEffect(() => {
    if (selectedApp) {
      setActiveApp(selectedApp);
      localStorage.setItem('selectedApp', JSON.stringify(selectedApp));
    }
  }, [selectedApp]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target)) {
        setIsWorkspaceDropdownOpen(false);
      }
      if (appDropdownRef.current && !appDropdownRef.current.contains(event.target)) {
        setIsAppDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredWorkspaces = mockWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(workspaceSearch.toLowerCase())
  );

  const selectWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
    setIsWorkspaceDropdownOpen(false);
  };

  const selectApp = (app) => {
    setSelectedApp(app);
    setActiveApp(app);
    localStorage.setItem('selectedApp', JSON.stringify(app));
    setIsAppDropdownOpen(false);
  };

  const reorderApps = (pinned) => {
    const updated = [...initialApps];
    const index = updated.findIndex(a => a.id === pinned.id);
    if (index > -1) {
      const [app] = updated.splice(index, 1);
      updated.unshift(app);
    }
    setApps(updated);
  };

  const togglePinApp = async (app, e) => {
    e.stopPropagation();
    const isCurrentlyPinned = pinnedApp && pinnedApp.id === app.id;

    if (isCurrentlyPinned) {
      // Send null to backend to unpin
      const response = await sendPinnedAppToBackend(null);
      if (response.success) {
        setPinnedApp(null);
        setApps([...initialApps]);
      }
    } else {
      // Send app to backend to pin
      const response = await sendPinnedAppToBackend(app);
      if (response.success) {
        setPinnedApp(app);
        reorderApps(app);
      }
    }
  };

  // Use activeApp as the primary source for displaying the selected app
  const displayApp = activeApp || (pinnedApp || { name: "Apps" });

  return (
    <nav className="flex !h-[64px] items-center justify-between px-4 bg-gray-800 border-b border-gray-700 transition-colors duration-300">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            {/* Sidebar Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-700"
            >
              {isSidebarOpen ? <TableOfContents size={20} /> : <ArrowRightFromLine size={20} />}
            </button>

            {/* Apps Dropdown */}
            <div className="relative" ref={appDropdownRef}>
              <button
                onClick={() => setIsAppDropdownOpen(!isAppDropdownOpen)}
                className="px-4 py-1.5 bg-gray-700 rounded-md flex items-center justify-between min-w-40 text-gray-200 "
              >
                <div className="flex items-center space-x-2">
                  {displayApp.icon && <span>{displayApp.icon}</span>}
                  <span>{displayApp.name}</span>
                </div>
                <ChevronDown size={16} className="ml-2" />
              </button>

              {isAppDropdownOpen && (
                <div className="absolute left-0 mt-1 w-72 bg-gray-900 rounded-md shadow-lg py-2 z-50 border border-gray-700">
                  {apps.map((app) => {
                    const isPinned = pinnedApp && pinnedApp.id === app.id;
                    const isActive = activeApp && activeApp.id === app.id;
                    return (
                      <div
                        key={app.id}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-800 flex items-start space-x-2 cursor-pointer ${
                          isActive ? 'bg-gray-800' : ''
                        }`}
                        onClick={() => selectApp(app)}
                      >
                        <span className="text-xl">{app.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-200">{app.name}</div>
                          <div className="text-xs text-gray-400">{app.description}</div>
                        </div>
                        <button 
                          onClick={(e) => togglePinApp(app, e)}
                          className="p-1 text-gray-400 hover:text-gray-300"
                          title={isPinned ? "Unpin app" : "Pin app"}
                        >
                          {isPinned ? 
                            <Pin size={16} className="fill-blue-500 text-blue-500" /> : 
                            <PinOff size={16} />
                          }
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Workspace Dropdown */}
            <div className="relative flex" ref={workspaceDropdownRef}>
              <button
                onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                className="px-4 py-1.5 bg-gray-700 rounded-md flex items-center justify-between min-w-40"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-gray-200 truncate max-w-32">
                    {currentWorkspace.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChevronDown size={16} className="text-gray-200" />
                </div>
              </button>
              <div className="relative group">
                <button
                  className="p-2.5 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/workspaceCreate');
                  }}
                >
                  <Plus size={16} />
                </button>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                  create new
                </div>
              </div>

              {isWorkspaceDropdownOpen && (
                <div className="absolute left-0 mt-10 w-72 bg-gray-900 rounded-md shadow-lg z-50 border border-gray-700 flex flex-col">
                  <div className="px-3 py-2 border-b border-gray-700">
                    <div className="relative">
                      <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search workspaces..."
                        value={workspaceSearch}
                        onChange={(e) => setWorkspaceSearch(e.target.value)}
                        className="pl-8 pr-8 py-2 w-full bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                      />
                      {workspaceSearch && (
                        <button
                          onClick={() => setWorkspaceSearch('')}
                          className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-300"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredWorkspaces.length > 0 ? (
                      filteredWorkspaces.map(workspace => (
                        <button
                          key={workspace.id}
                          onClick={() => selectWorkspace(workspace)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center ${
                            currentWorkspace.id === workspace.id ? 'bg-gray-800' : ''
                          }`}
                        >
                          <span className="text-gray-200">{workspace.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-400 text-center">
                        No workspaces found
                      </div>
                    )}
                  </div>

                  <div className="mt-auto border-t border-gray-700">
                    <button
                      onClick={() => {
                        setIsWorkspaceDropdownOpen(false);
                        navigate('/viewWorkspace');
                      }}
                      className="w-full text-center py-2 text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      See all workspaces
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <a href="/">
              <img src="./1.png" alt="Company Logo" className="h-36 w-auto object-contain" />
            </a>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Help button with tooltip */}
        <div className="relative group">
          <button
            className="p-2 rounded-md text-gray-200 hover:bg-gray-600 transition-colors duration-200"
            aria-label="Help"
            onClick={() => navigate('/help')}
          >
            <HelpCircle size={20} />
          </button>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
            Help
          </div>
        </div>

        {/* Settings button with tooltip */}
        <div className="relative group">
          <button 
            className="p-2 rounded-md text-gray-200 hover:bg-gray-600 transition-colors duration-200" 
            aria-label="Settings"
            onClick={() => navigate('/settings')}
          >
            <Settings size={20} />
          </button>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
            Settings
          </div>
        </div>

        {/* Notifications button with tooltip */}
        <div className="relative group">
          <button 
            className="p-2 rounded-md text-gray-200 hover:bg-gray-600 transition-colors duration-200" 
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
          </button>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
            Notifications
          </div>
        </div>

        {isLoggedIn ? (
          <div className="relative group">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full bg-gray-400 overflow-hidden hover:ring-2 hover:ring-gray-300 transition-all duration-200 flex items-center justify-center"
              aria-label="User menu"
              aria-expanded={isProfileOpen}
            >
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
              Profile
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-55.5 bg-gray-800 rounded-md shadow-lg py-0 z-50 border border-gray-700">
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