import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Users,
  Shield,
  History,
  Database,
  Save,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Menu,
  X,
  Plus
} from 'lucide-react';
import UsersList from './UsersList';
import DataExport from '../components/DataExport';
import ActivityLogs from '../components/ActivityLogs';
import CreateRoles from '../components/CreateRoles';
import Navbar from '../components/Navbar';

// Main Settings Component
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    'user-management': false,
    'activity-history': false,
    'data-management': false
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    setActiveSection(section);
  };

  const handleSubSectionClick = (section, subSection) => {
    setActiveSection(section);
    setActiveSubSection(subSection);
    setExpandedSections(prev => ({
      ...prev,
      [section]: true
    }));
    setShowCreateRoleForm(false); // Reset create role form visibility when switching subsections
  };

  // Handler for Get Started button from WelcomeScreen
  const handleGetStarted = () => {
    setExpandedSections(prev => ({
      ...prev,
      'user-management': true
    }));
    setActiveSection('user-management');
    setActiveSubSection('users');
  };

  const handleCreateRole = () => {
    setShowCreateRoleForm(true);
  };

  // Render the appropriate component based on active section/subsection
  const renderContent = () => {
    if (activeSubSection === 'roles' && showCreateRoleForm) {
      return <CreateRoles onCancel={() => setShowCreateRoleForm(false)} />;
    }

    switch (activeSubSection) {
      case 'users':
        return <UsersList />;
      case 'roles':
        return <RolesManagement onCreateRole={handleCreateRole} />;
      case 'activity-logs':
        return <ActivityLogs />;
      case 'data-export':
        return <DataExport />;
      case 'privacy-preferences':
        return <PrivacyPreferences />;
      case 'backup-restore':
        return <BackupRestore />;
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="flex h-screen bg-gray-50">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden fixed top-4 left-4 z-20">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-white shadow-md text-gray-700"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Sidebar - responsive with overlay on mobile */}
        <div
          className={`fixed md:static inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition duration-200 ease-in-out md:transition-none z-10 
        w-64 lg:w-72 xl:w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0`}
        >
          <div className="p-4 border-b border-gray-200 flex items-center">
            <div className="relative group flex items-center">
              <button
                onClick={handleBack}
                className="mr-2 transition-transform duration-200 group-hover:-translate-x-0.5 flex-shrink-0"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <span className="absolute -top-6 left-1/2 mt-1 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-md">
                Back
              </span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
          </div>

          <nav className="p-2">
            {/* User Management Section - Now with consolidated Roles section */}
            <div className="mb-1">
              <button
                onClick={() => toggleSection('user-management')}
                className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 ${activeSection === 'user-management' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">User Management</span>
                </div>
                {expandedSections['user-management'] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {expandedSections['user-management'] && (
                <div className="ml-7 mt-1 space-y-1">
                  <button
                    onClick={() => handleSubSectionClick('user-management', 'users')}
                    className={`flex items-center w-full p-2 text-xs rounded-md hover:bg-gray-100 ${activeSubSection === 'users' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                  >
                    Users
                  </button>

                  <button
                    onClick={() => handleSubSectionClick('user-management', 'roles')}
                    className={`flex items-center w-full p-2 text-xs rounded-md hover:bg-gray-100 ${activeSubSection === 'roles' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                  >
                    Roles
                  </button>
                </div>
              )}
            </div>

            {/* Activity History Section */}
            <div className="mb-1">
              <button
                onClick={() => toggleSection('activity-history')}
                className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 ${activeSection === 'activity-history' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
              >
                <div className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Activity History</span>
                </div>
                {expandedSections['activity-history'] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {expandedSections['activity-history'] && (
                <div className="ml-7 mt-1 space-y-1">
                  <button
                    onClick={() => handleSubSectionClick('activity-history', 'activity-logs')}
                    className={`flex items-center w-full p-2 text-xs rounded-md hover:bg-gray-100 ${activeSubSection === 'activity-logs' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                  >
                    Activity Logs
                  </button>
                </div>
              )}
            </div>

            {/* Data Management Section */}
            <div className="mb-1">
              <button
                onClick={() => toggleSection('data-management')}
                className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 ${activeSection === 'data-management' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
              >
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Data Management</span>
                </div>
                {expandedSections['data-management'] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>

              {expandedSections['data-management'] && (
                <div className="ml-7 mt-1 space-y-1">
                  <button
                    onClick={() => handleSubSectionClick('data-management', 'data-export')}
                    className={`flex items-center w-full p-2 text-xs rounded-md hover:bg-gray-100 ${activeSubSection === 'data-export' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                  >
                    Data Export
                  </button>
                  <button
                    onClick={() => handleSubSectionClick('data-management', 'privacy-preferences')}
                    className={`flex items-center w-full p-2 text-xs rounded-md hover:bg-gray-100 ${activeSubSection === 'privacy-preferences' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                  >
                    Privacy Preferences
                  </button>
                  <button
                    onClick={() => handleSubSectionClick('data-management', 'backup-restore')}
                    className={`flex items-center w-full p-2 text-xs rounded-md hover:bg-gray-100 ${activeSubSection === 'backup-restore' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                  >
                    Backup & Restore
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 xl:p-8 max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Welcome Screen Component
const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-white border border-gray-200 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 text-center">Welcome to the Settings Page</h2>
      <p className="text-gray-600 mb-8 text-center">
        Manage users, roles, and data settings to optimize your experience. Get started by managing your users.
      </p>
      <button
        onClick={onGetStarted}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow"
      >
        Get Started
      </button>
    </div>
  );
};
const createRoleButtonStyles = `
  .floating-create-role-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
    cursor: pointer;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 50;
    border: none;
    outline: none;
  }

  .floating-create-role-btn:hover {
    width: 11rem;
    border-radius: 2rem;
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
    background: linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%);
  }

  .floating-create-role-btn:active {
    transform: scale(0.95);
  }

  .floating-create-role-btn .icon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .floating-create-role-btn:hover .icon {
    left: 1.25rem;
    transform: translateX(0) rotate(360deg);
  }

  .floating-create-role-btn .text {
    position: absolute;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-1rem);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .floating-create-role-btn:hover .text {
    opacity: 1;
    transform: translateX(1.75rem);
  }

  /* Pulse animation */
  @keyframes role-pulse {
    0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7); }
    70% { box-shadow: 0 0 0 12px rgba(124, 58, 237, 0); }
    100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
  }

  .floating-create-role-btn::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: role-pulse 2s infinite;
  }

  .floating-create-role-btn:hover::after {
    animation: none;
    opacity: 0;
  }
`;

// Roles Management Component with Create Role Button
const RolesManagement = ({ onCreateRole }) => {
  const roles = [
    {
      name: 'Administrator',
      description: 'Full access to all system features and settings',
      permissions: [
        'User Management', 'Role Management', 'Data Management',
        'Dashboard Creation', 'Analytics Access', 'Report Generation',
        'System Configuration', 'API Access', 'Data Export'
      ]
    },
    {
      name: 'Analyst',
      description: 'Can create dashboards and analyze data but cannot modify system settings',
      permissions: [
        'Dashboard Creation', 'Analytics Access', 'Report Generation',
        'Data Export'
      ]
    },
    {
      name: 'Viewer',
      description: 'View-only access to dashboards and reports',
      permissions: [
        'Analytics Access', 'View Reports'
      ]
    },
    {
      name: 'Report Creator',
      description: 'Can create and share reports based on existing dashboards',
      permissions: [
        'Analytics Access', 'Report Generation', 'Data Export'
      ]
    }
  ];

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Roles Management</h2>
      <p className="text-gray-600 mb-6">
        Review existing roles and their assigned permissions. Create new roles or modify existing ones.
      </p>

      <div className="grid gap-6 md:grid-cols-2 mb-16">
        {roles.map((role, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{role.name}</h3>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
              <Shield className="h-6 w-6 text-gray-400" />
            </div>
            <div className="px-6 py-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, permIndex) => (
                  <span
                    key={permIndex}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed create role button */}
      <div className="fixed bottom-6 right-6 z-10">
        <style>{createRoleButtonStyles}</style>
        <button
          className="floating-create-role-btn"
          onClick={onCreateRole}
          aria-label="Create new role"
        >
          <div className="icon">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text">Create Role</span>
        </button>
      </div>
    </div>
  );
};

// Privacy Preferences
const PrivacyPreferences = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Privacy Preferences</h2>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-base font-medium text-gray-800">Data Visibility & Anonymization</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">User Activity Tracking</h4>
                  <p className="text-xs text-gray-500">Track user activity for analytics and improvement</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" id="toggle-user-tracking" className="sr-only" defaultChecked />
                  <label htmlFor="toggle-user-tracking" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                    <span className="absolute left-1 top-1 block h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-in-out transform translate-x-0 checked:translate-x-4"></span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Anonymize User Data</h4>
                  <p className="text-xs text-gray-500">Remove personally identifiable information from analytics</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" id="toggle-anonymize" className="sr-only" defaultChecked />
                  <label htmlFor="toggle-anonymize" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                    <span className="absolute left-1 top-1 block h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-in-out transform translate-x-0 checked:translate-x-4"></span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Data Sharing with Third Parties</h4>
                  <p className="text-xs text-gray-500">Allow data to be shared with integrated third-party services</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" id="toggle-data-sharing" className="sr-only" defaultChecked />
                  <label htmlFor="toggle-data-sharing" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                    <span className="absolute left-1 top-1 block h-4 w-4 rounded-full bg-white transition-transform duration-200 ease-in-out transform translate-x-0 checked:translate-x-4"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>
                For more information on how we handle data privacy, please refer to our <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Backup & Restore Placeholder
const BackupRestore = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Backup & Restore</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <Save className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Backup & Restore Coming Soon</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Manage data backups and restore points, set retention policies, and automate cleanup processes.
        </p>
        <button className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
          Notify Me
        </button>
      </div>
    </div>
  );
};