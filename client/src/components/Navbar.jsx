import React, { useState, useRef, useEffect } from 'react';
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
  PinOff,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

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

const sendPinnedAppToBackend = async (app) => {
  try {
    console.log('Sending pinned app to backend:', app);
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
  const [activeApp, setActiveApp] = useState(null);

  // Refs for GSAP animations
  const navRef = useRef(null);
  const workspaceDropdownRef = useRef(null);
  const appDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const workspaceDropdownContentRef = useRef(null);
  const appDropdownContentRef = useRef(null);
  const profileDropdownContentRef = useRef(null);
  const sidebarToggleRef = useRef(null);
  const appButtonRef = useRef(null);
  const workspaceButtonRef = useRef(null);
  const createButtonRef = useRef(null);
  const navButtonsRef = useRef([]);
  const loginButtonsRef = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();

  const isSettingOrHelp = location.pathname === '/settings' || location.pathname === '/help';
  const showMainNav = !isLoggedIn || isSettingOrHelp;

  // GSAP Animation Functions
  const animateDropdownOpen = (element) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transformOrigin: "top center"
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      }
    );
  };

  const animateDropdownClose = (element, onComplete) => {
    gsap.to(element, {
      opacity: 0,
      y: -10,
      scale: 0.95,
      duration: 0.2,
      ease: "power2.in",
      onComplete
    });
  };

  const animateButtonHover = (element, isHovering) => {
    gsap.to(element, {
      scale: isHovering ? 1.05 : 1,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const animateIconRotation = (element, rotation = 180) => {
    gsap.to(element, {
      rotation,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const animateNavbarEntry = () => {
    if (navRef.current) {
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  };

  const animateButtonPress = (element) => {
    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });
  };

  const animatePinIcon = (element, isPinned) => {
    gsap.to(element, {
      scale: isPinned ? 1.2 : 1,
      rotation: isPinned ? 15 : 0,
      duration: 0.3,
      ease: "back.out(1.7)"
    });
  };

  useEffect(() => {
    // Animate navbar on mount
    animateNavbarEntry();

    // Set up hover animations for nav buttons
    navButtonsRef.current.forEach(button => {
      if (button) {
        const handleMouseEnter = () => animateButtonHover(button, true);
        const handleMouseLeave = () => animateButtonHover(button, false);

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          button.removeEventListener('mouseenter', handleMouseEnter);
          button.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    });

    // Set up hover animations for login buttons
    loginButtonsRef.current.forEach(button => {
      if (button) {
        const handleMouseEnter = () => animateButtonHover(button, true);
        const handleMouseLeave = () => animateButtonHover(button, false);

        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          button.removeEventListener('mouseenter', handleMouseEnter);
          button.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    });
  }, [isLoggedIn]);

  useEffect(() => {
    const storedSelectedApp = localStorage.getItem('selectedApp');
    if (storedSelectedApp) {
      try {
        const parsed = JSON.parse(storedSelectedApp);
        setSelectedApp(parsed);
        setActiveApp(parsed);
      } catch (error) {
        console.error('Error parsing stored selected app:', error);
        localStorage.removeItem('selectedApp');
      }
    }

    const fetchPinnedApp = async () => {
      try {
        const response = { success: true, data: null };
        if (response.success && response.data) {
          setPinnedApp(response.data);
          reorderApps(response.data);
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

  useEffect(() => {
    if (selectedApp) {
      setActiveApp(selectedApp);
      localStorage.setItem('selectedApp', JSON.stringify(selectedApp));
    }
  }, [selectedApp]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target)) {
        if (isWorkspaceDropdownOpen && workspaceDropdownContentRef.current) {
          animateDropdownClose(workspaceDropdownContentRef.current, () => {
            setIsWorkspaceDropdownOpen(false);
          });
        }
      }
      if (appDropdownRef.current && !appDropdownRef.current.contains(event.target)) {
        if (isAppDropdownOpen && appDropdownContentRef.current) {
          animateDropdownClose(appDropdownContentRef.current, () => {
            setIsAppDropdownOpen(false);
          });
        }
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        if (isProfileOpen && profileDropdownContentRef.current) {
          animateDropdownClose(profileDropdownContentRef.current, () => {
            setIsProfileOpen(false);
          });
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isWorkspaceDropdownOpen, isAppDropdownOpen, isProfileOpen]);

  useEffect(() => {
    if (isWorkspaceDropdownOpen && workspaceDropdownContentRef.current) {
      animateDropdownOpen(workspaceDropdownContentRef.current);
    }
  }, [isWorkspaceDropdownOpen]);

  useEffect(() => {
    if (isAppDropdownOpen && appDropdownContentRef.current) {
      animateDropdownOpen(appDropdownContentRef.current);
    }
  }, [isAppDropdownOpen]);

  useEffect(() => {
    if (isProfileOpen && profileDropdownContentRef.current) {
      animateDropdownOpen(profileDropdownContentRef.current);
    }
  }, [isProfileOpen]);

  const filteredWorkspaces = mockWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(workspaceSearch.toLowerCase())
  );

  const selectWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
    if (workspaceDropdownContentRef.current) {
      animateDropdownClose(workspaceDropdownContentRef.current, () => {
        setIsWorkspaceDropdownOpen(false);
      });
    }
  };

  const selectApp = (app) => {
    setSelectedApp(app);
    setActiveApp(app);
    localStorage.setItem('selectedApp', JSON.stringify(app));
    if (appDropdownContentRef.current) {
      animateDropdownClose(appDropdownContentRef.current, () => {
        setIsAppDropdownOpen(false);
      });
    }
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
    const pinIcon = e.target.closest('button');

    if (isCurrentlyPinned) {
      const response = await sendPinnedAppToBackend(null);
      if (response.success) {
        setPinnedApp(null);
        setApps([...initialApps]);
        animatePinIcon(pinIcon, false);
      }
    } else {
      const response = await sendPinnedAppToBackend(app);
      if (response.success) {
        setPinnedApp(app);
        reorderApps(app);
        animatePinIcon(pinIcon, true);
      }
    }
  };

  const handleSidebarToggle = () => {
    if (sidebarToggleRef.current) {
      animateButtonPress(sidebarToggleRef.current);
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAppDropdownToggle = () => {
    if (appButtonRef.current) {
      animateButtonPress(appButtonRef.current);
      const chevron = appButtonRef.current.querySelector('[data-chevron]');
      if (chevron) {
        animateIconRotation(chevron, isAppDropdownOpen ? 0 : 180);
      }
    }
    setIsAppDropdownOpen(!isAppDropdownOpen);
  };

  const handleWorkspaceDropdownToggle = () => {
    if (workspaceButtonRef.current) {
      animateButtonPress(workspaceButtonRef.current);
      const chevron = workspaceButtonRef.current.querySelector('[data-chevron]');
      if (chevron) {
        animateIconRotation(chevron, isWorkspaceDropdownOpen ? 0 : 180);
      }
    }
    setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen);
  };

  const handleCreateButtonClick = (e) => {
    e.stopPropagation();
    gsap.to(e.currentTarget, {
      rotate: 180,
      duration: 0.3
    });
    if (createButtonRef.current) {
      animateButtonPress(createButtonRef.current);
    }
    navigate('/workspaceCreate');
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const displayApp = activeApp || pinnedApp || { name: "Apps", icon: "" };

  return (
    <nav
      ref={navRef}
      className={`flex h-16 items-center justify-between ${showMainNav ? "pr-4" : "px-6"} bg-peach hover:bg-white transition-colors duration-300 z-50 relative`}
    // Added z-50 and relative here
    >
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        {isLoggedIn ? (
          <>
            {!showMainNav ? (
              <>
                {/* Sidebar Toggle */}
                <button
                  ref={sidebarToggleRef}
                  onClick={handleSidebarToggle}
                  className="p-2 rounded-md text-gray-600 hover:bg-primary-orange hover:text-white transition-colors duration-300"
                >
                  {isSidebarOpen ? <TableOfContents size={20} /> : <ArrowRightFromLine size={20} />}
                </button>

                {/* Apps Dropdown */}
                <div className="relative" ref={appDropdownRef}>
                  <button
                    ref={appButtonRef}
                    onClick={handleAppDropdownToggle}
                    className="px-4 py-2 bg-gradient-to-r from-primary-orange to-accent-magenta rounded-md flex items-center justify-between min-w-40 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      {displayApp.icon && <span>{displayApp.icon}</span>}
                      <span className="font-medium">{displayApp.name}</span>
                    </div>
                    <ChevronDown size={16} className="ml-2" data-chevron />
                  </button>

                  {isAppDropdownOpen && (
                    <div
                      ref={appDropdownContentRef}
                      className="absolute left-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200"
                    >
                      <div className="px-3 py-2 border-b border-gray-200 bg-cream">
                        <h3 className="text-sm font-medium text-dark-gray">Applications</h3>
                      </div>
                      {apps.map((app) => {
                        const isPinned = pinnedApp && pinnedApp.id === app.id;
                        const isActive = activeApp && activeApp.id === app.id;
                        return (
                          <div
                            key={app.id}
                            className={`w-full text-left px-4 py-3 hover:bg-peach flex items-start space-x-3 cursor-pointer transition-colors duration-300 ${isActive ? 'bg-peach' : ''
                              }`}
                            onClick={() => selectApp(app)}
                          >
                            <span className="text-xl">{app.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-dark-gray">{app.name}</div>
                              <div className="text-xs text-gray-500">{app.description}</div>
                            </div>
                            <button
                              onClick={(e) => togglePinApp(app, e)}
                              className="p-1 text-gray-400 hover:text-primary-orange transition-colors duration-300"
                              title={isPinned ? "Unpin app" : "Pin app"}
                            >
                              {isPinned ?
                                <Pin size={16} className="fill-primary-orange text-primary-orange" /> :
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
                <div className="relative flex items-center" ref={workspaceDropdownRef}>
                  <button
                    ref={workspaceButtonRef}
                    onClick={handleWorkspaceDropdownToggle}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center justify-between min-w-40 text-dark-gray hover:border-primary-orange transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="truncate max-w-32 font-medium">
                        {currentWorkspace.name}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-gray-500" data-chevron />
                  </button>
                  <div className="relative group">
                    <button
                      ref={createButtonRef}
                      className="ml-2 p-2 bg-primary-orange text-white rounded-md hover:bg-accent-magenta transition-colors duration-300 shadow-md"
                      onClick={handleCreateButtonClick}
                    >
                      <Plus size={16} />
                    </button>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                      create new
                    </div>
                  </div>

                  {isWorkspaceDropdownOpen && (
                    <div
                      ref={workspaceDropdownContentRef}
                      className="absolute left-0 top-12 w-72 bg-white rounded-md shadow-lg z-50 border border-gray-200 flex flex-col"
                    >
                      <div className="px-3 py-2 border-b border-gray-200 bg-cream">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search workspaces..."
                            value={workspaceSearch}
                            onChange={(e) => setWorkspaceSearch(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent text-dark-gray"
                          />
                          {workspaceSearch && (
                            <button
                              onClick={() => setWorkspaceSearch('')}
                              className="absolute right-3 top-3 text-gray-400 hover:text-primary-orange"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="max-h-60 overflow-y-auto">
                        {filteredWorkspaces.length > 0 ? (
                          filteredWorkspaces.map(workspace => (
                            <button
                              key={workspace.id}
                              onClick={() => selectWorkspace(workspace)}
                              className={`w-full text-left px-4 py-3 hover:bg-peach flex items-center transition-colors duration-300 ${currentWorkspace.id === workspace.id ? 'bg-peach font-medium' : ''
                                }`}
                            >
                              <span className="text-dark-gray">{workspace.name}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No workspaces found
                          </div>
                        )}
                      </div>

                      <div className="mt-auto border-t border-gray-200 bg-cream">
                        <button
                          onClick={() => {
                            if (workspaceDropdownContentRef.current) {
                              animateDropdownClose(workspaceDropdownContentRef.current, () => {
                                setIsWorkspaceDropdownOpen(false);
                              });
                            }
                            navigate('/viewWorkspace');
                          }}
                          className="w-full text-center py-3 text-primary-orange hover:text-accent-magenta font-medium transition-colors duration-300"
                        >
                          See all workspaces
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <img src="./1.png" alt="Full Logo" className="h-30" />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center">
            <a href="/">
              <img src="./1.png" alt="Company Logo" className="h-12" />
            </a>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {!isSettingOrHelp && isLoggedIn && (
          <>
            <div className="relative group">
              <button
                ref={el => navButtonsRef.current[0] = el}
                className="p-2 rounded-md text-gray-600 hover:text-primary-orange hover:bg-peach transition-colors duration-300"
                aria-label="Help"
                onClick={() => navigate('/help')}
              >
                <HelpCircle size={20} />
              </button>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                Help
              </div>
            </div>

            <div className="relative group">
              <button
                ref={el => navButtonsRef.current[1] = el}
                className="p-2 rounded-md text-gray-600 hover:text-primary-orange hover:bg-peach transition-colors duration-300"
                aria-label="Settings"
                onClick={() => navigate('/settings')}
              >
                <Settings size={20} />
              </button>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                Settings
              </div>
            </div>

            <div className="relative group">
              <button
                ref={el => navButtonsRef.current[2] = el}
                className="p-2 rounded-md text-gray-600 hover:text-primary-orange hover:bg-peach transition-colors duration-300 relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-magenta rounded-full border-2 border-white"></span>
              </button>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                Notifications
              </div>
            </div>
          </>
        )}

        {isLoggedIn ? (
          <div className="relative group" ref={profileDropdownRef}>
            <button
              onClick={handleProfileToggle}
              className="w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-primary-orange transition-all duration-300 flex items-center justify-center"
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
              <div
                ref={profileDropdownContentRef}
                className="absolute right-0 mt-2 w-57 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <ProfileDropdown onClose={() => setIsProfileOpen(false)} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              ref={el => loginButtonsRef.current[0] = el}
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-white border border-primary-orange text-primary-orange rounded-md hover:bg-primary-orange hover:text-white transition-colors duration-300 font-medium"
            >
              Login
            </button>
            <button
              ref={el => loginButtonsRef.current[1] = el}
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-gradient-to-r from-primary-orange to-accent-magenta text-white rounded-md hover:shadow-md transition-all duration-300 font-medium"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;