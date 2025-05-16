import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCog, 
  Shield, 
  History, 
  Database, 
  Download, 
  Lock, 
  Save,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Clock,
  Calendar,
  BarChart2,
  FileText,
} from 'lucide-react';
import UsersList from './UsersList';

// Main Settings Component
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    'user-management': false,
    'role-management': false,
    'activity-history': false,
    'data-management': false
  });
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

  // Render the appropriate component based on active section/subsection
  const renderContent = () => {
    switch(activeSubSection) {
      case 'users':
        return <UsersList/>;
      case 'groups':
        return <GroupsPlaceholder />;
      case 'roles-overview':
        return <RolesOverview />;
      case 'default-roles':
        return <DefaultRoles />;
      case 'create-roles':
        return <CreateRoles />;
      case 'activity-logs':
        return <ActivityLogs />;
      case 'data-export':
        return <DataExport />;
      case 'privacy-preferences':
        return <PrivacyPreferences />;
      case 'backup-restore':
        return <BackupRestore />;
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
        </div>

        <nav className="p-2">
          {/* User Management Section */}
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
                  onClick={() => handleSubSectionClick('user-management', 'groups')}
                  className={`flex items-center w-full p-2 text-xs rounded-md hover:bg-gray-100 ${activeSubSection === 'groups' ? 'bg-blue-50 text-blue-700' : 'text-gray-500'}`}
                >
                  Groups <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">Coming Soon</span>
                </button>
                <button 
                  onClick={() => handleSubSectionClick('user-management', 'roles-overview')}
                  className={`flex items-center w-full p-2 text-xs rounded-md hover:bg-gray-100 ${activeSubSection === 'roles-overview' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                >
                  Roles Overview
                </button>
              </div>
            )}
          </div>

          {/* Role Management Section */}
          <div className="mb-1">
            <button 
              onClick={() => toggleSection('role-management')}
              className={`flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 ${activeSection === 'role-management' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
            >
              <div className="flex items-center">
                <UserCog className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Role Management</span>
              </div>
              {expandedSections['role-management'] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            
            {expandedSections['role-management'] && (
              <div className="ml-7 mt-1 space-y-1">
                <button 
                  onClick={() => handleSubSectionClick('role-management', 'default-roles')}
                  className={`flex items-center w-full p-2 text-xs rounded-md hover:bg-gray-100 ${activeSubSection === 'default-roles' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                >
                  Default Roles
                </button>
                <button 
                  onClick={() => handleSubSectionClick('role-management', 'create-roles')}
                  className={`flex items-center w-full p-2 text-xs rounded-md hover:bg-gray-100 ${activeSubSection === 'create-roles' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
                >
                  Create Roles
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Welcome Screen Component
const WelcomeScreen = ({ onGetStarted }) => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-white border border-gray-200 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Welcome to the Settings Page</h2>
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

// Groups Placeholder
const GroupsPlaceholder = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Groups</h2>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <UserCog className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Group Management Coming Soon</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          This feature will allow you to create and manage user groups for easier permission management and organization.
        </p>
        <button className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
          Join Waitlist
        </button>
      </div>
    </div>
  );
};

// Roles Overview
const RolesOverview = () => {
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
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Roles Overview</h2>
      <p className="text-gray-600 mb-6">
        Review existing roles and their assigned permissions. This view is read-only.
        To create or modify roles, please go to the Role Management section.
      </p>
      
      <div className="grid gap-6">
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
    </div>
  );
};

// Default Roles
const DefaultRoles = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  
  const defaultRoles = [
    {
      id: 1,
      name: 'Administrator',
      userCount: 3,
      lastModified: '2025-05-01',
      permissions: {
        'User Management': { create: true, read: true, update: true, delete: true },
        'Dashboard': { create: true, read: true, update: true, delete: true },
        'Reports': { create: true, read: true, update: true, delete: true },
        'Settings': { create: true, read: true, update: true, delete: true },
        'API Access': { create: true, read: true, update: true, delete: true }
      }
    },
    {
      id: 2,
      name: 'Analyst',
      userCount: 12,
      lastModified: '2025-04-15',
      permissions: {
        'User Management': { create: false, read: true, update: false, delete: false },
        'Dashboard': { create: true, read: true, update: true, delete: true },
        'Reports': { create: true, read: true, update: true, delete: false },
        'Settings': { create: false, read: true, update: false, delete: false },
        'API Access': { create: false, read: true, update: false, delete: false }
      }
    },
    {
      id: 3,
      name: 'Viewer',
      userCount: 45,
      lastModified: '2025-03-20',
      permissions: {
        'User Management': { create: false, read: false, update: false, delete: false },
        'Dashboard': { create: false, read: true, update: false, delete: false },
        'Reports': { create: false, read: true, update: false, delete: false },
        'Settings': { create: false, read: false, update: false, delete: false },
        'API Access': { create: false, read: false, update: false, delete: false }
      }
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Default Roles</h2>
      <p className="text-gray-600 mb-6">
        These are the predefined system roles. Select a role to view its permission matrix.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {defaultRoles.map((role) => (
          <div 
            key={role.id}
            onClick={() => setSelectedRole(role)}
            className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedRole?.id === role.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'}`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-medium text-gray-800">{role.name}</h3>
              <Shield className={`h-5 w-5 ${selectedRole?.id === role.id ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <div className="text-sm text-gray-500 mb-1">
              <span>{role.userCount} users assigned</span>
            </div>
            <div className="text-xs text-gray-400">
              Last modified: {role.lastModified}
            </div>
          </div>
        ))}
      </div>
      
      {selectedRole && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800">
              {selectedRole.name} Permissions
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Create
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Read
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Update
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(selectedRole.permissions).map(([module, perms], idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {module}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {perms.create ? <div className="h-4 w-4 bg-green-500 rounded-full mx-auto"></div> : <div className="h-4 w-4 bg-gray-200 rounded-full mx-auto"></div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {perms.read ? <div className="h-4 w-4 bg-green-500 rounded-full mx-auto"></div> : <div className="h-4 w-4 bg-gray-200 rounded-full mx-auto"></div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {perms.update ? <div className="h-4 w-4 bg-green-500 rounded-full mx-auto"></div> : <div className="h-4 w-4 bg-gray-200 rounded-full mx-auto"></div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {perms.delete ? <div className="h-4 w-4 bg-green-500 rounded-full mx-auto"></div> : <div className="h-4 w-4 bg-gray-200 rounded-full mx-auto"></div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Create Roles
const CreateRoles = () => {
  const [activeTab, setActiveTab] = useState('details');
  const modules = [
    'User Management',
    'Dashboard',
    'Reports',
    'Data Export',
    'Settings',
    'API Access',
    'Notifications',
    'Analytics'
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Role</h2>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Role Details
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'permissions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Permissions
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assign Users
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'review'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Review & Create
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="role-name" className="block text-sm font-medium text-gray-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                id="role-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Marketing Analyst"
              />
            </div>
            
            <div>
              <label htmlFor="role-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="role-description"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the purpose and scope of this role..."
              ></textarea>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button 
                onClick={() => setActiveTab('permissions')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next: Set Permissions
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'permissions' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800">Permission Matrix</h3>
            <p className="text-sm text-gray-500">Configure access levels for each system module</p>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Create
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Read
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Update
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {modules.map((module, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {module}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button 
                onClick={() => setActiveTab('details')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next: Assign Users
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800">Assign Users to Role</h3>
            <p className="text-sm text-gray-500">Select users to assign this role immediately upon creation</p>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="overflow-hidden border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                            {['JD', 'AR', 'KM', 'TS', 'RB'][idx]}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {['John Doe', 'Anna Rodriguez', 'Kevin Miller', 'Tina Smith', 'Robert Brown'][idx]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {['john.doe@example.com', 'a.rodriguez@example.com', 'k.miller@example.com', 't.smith@example.com', 'r.brown@example.com'][idx]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {['Marketing', 'Sales', 'Finance', 'Product', 'Engineering'][idx]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full" style={{
                          backgroundColor: ['#EFF6FF', '#F3F4F6', '#FEF3C7', '#EFF6FF', '#F3F4F6'][idx],
                          color: ['#1D4ED8', '#4B5563', '#D97706', '#1D4ED8', '#4B5563'][idx]
                        }}>
                          {['Analyst', 'Viewer', 'Admin', 'Analyst', 'Viewer'][idx]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button 
                onClick={() => setActiveTab('permissions')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={() => setActiveTab('review')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next: Review
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'review' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800">Review and Create Role</h3>
            <p className="text-sm text-gray-500">Review role details before creation</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Role Details</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="mb-3">
                    <span className="block text-xs text-gray-500">Name</span>
                    <span className="block text-sm text-gray-800">Marketing Analyst</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Description</span>
                    <span className="block text-sm text-gray-800">Role for marketing team members who need to analyze campaign data and create reports.</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Users to Assign (3)</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                        JD
                      </div>
                      <span className="ml-2 text-sm text-gray-800">John Doe</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                        AR
                      </div>
                      <span className="ml-2 text-sm text-gray-800">Anna Rodriguez</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                        KM
                      </div>
                      <span className="ml-2 text-sm text-gray-800">Kevin Miller</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permission Summary</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-1">Dashboard</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        View
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        Create
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                        Delete
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-1">Reports</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        View
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        Create
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        Edit
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-1">Data Export</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        CSV
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        Excel
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                        API
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-1">Settings</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        View
                      </li>
                      <li className="flex items-center">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                        Edit
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button 
                onClick={() => setActiveTab('users')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Activity Logs
const ActivityLogs = () => {
  // Sample data for visualizations
  const mostActiveUsers = [
    { name: 'John Doe', actions: 126 },
    { name: 'Anna Rodriguez', actions: 98 },
    { name: 'Kevin Miller', actions: 87 },
    { name: 'Tina Smith', actions: 65 },
    { name: 'Robert Brown', actions: 42 }
  ];
  
  const featureUsage = [
    { name: 'Dashboards', count: 432 },
    { name: 'Reports', count: 287 },
    { name: 'Exports', count: 156 },
    { name: 'User Management', count: 89 },
    { name: 'Settings', count: 43 }
  ];
  
  const activityLog = [
    { user: 'John Doe', action: 'Exported sales dashboard', time: '10 minutes ago', icon: Download },
    { user: 'Anna Rodriguez', action: 'Created new user account', time: '1 hour ago', icon: Users },
    { user: 'System', action: 'Automated backup completed', time: '3 hours ago', icon: Save },
    { user: 'Kevin Miller', action: 'Modified privacy settings', time: '5 hours ago', icon: Lock },
    { user: 'Tina Smith', action: 'Created new marketing dashboard', time: 'Yesterday, 3:45 PM', icon: BarChart2 },
    { user: 'Robert Brown', action: 'Generated monthly report', time: 'Yesterday, 10:30 AM', icon: FileText }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Activity History</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Most Active Users */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-base font-medium text-gray-800">Most Active Users</h3>
          </div>
          <div className="p-6">
            {mostActiveUsers.map((user, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="text-sm text-gray-500">{user.actions} actions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(user.actions / mostActiveUsers[0].actions) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Most Used Features */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-base font-medium text-gray-800">Most Used Features</h3>
          </div>
          <div className="p-6">
            {featureUsage.map((feature, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                  <span className="text-sm text-gray-500">{feature.count} uses</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(feature.count / featureUsage[0].count) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Activity Log */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-base font-medium text-gray-800">Recent Activity</h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <Calendar className="h-4 w-4 mr-1" />
              Filter by Date
            </button>
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <Users className="h-4 w-4 mr-1" />
              Filter by User
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {activityLog.map((item, index) => (
            <div key={index} className="flex items-start p-4">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                {item.icon && <item.icon className="h-4 w-4 text-gray-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-800">{item.user}</h4>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {item.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <button className="text-sm text-gray-600 hover:text-gray-900">Previous</button>
          <span className="text-sm text-gray-600">Page 1 of 10</span>
          <button className="text-sm text-blue-600 hover:text-blue-800">Next</button>
        </div>
      </div>
    </div>
  );
};

// Data Export
const DataExport = () => {
  const exportOptions = [
    { id: 'csv', label: 'CSV (.csv)', icon: FileText },
    { id: 'excel', label: 'Excel (.xlsx)', icon: FileText },
    { id: 'pdf', label: 'PDF Document (.pdf)', icon: FileText },
    { id: 'json', label: 'JSON (.json)', icon: FileText }
  ];
  
  const scheduledExports = [
    {
      name: 'Weekly Sales Report',
      format: 'PDF',
      frequency: 'Every Monday at 8:00 AM',
      recipients: ['john.doe@example.com', 'marketing@example.com'],
      nextRun: '2025-05-19 08:00'
    },
    {
      name: 'Monthly User Activity',
      format: 'Excel',
      frequency: 'First day of month at 6:00 AM',
      recipients: ['exec@example.com', 'analytics@example.com'],
      nextRun: '2025-06-01 06:00'
    },
    {
      name: 'Daily Error Logs',
      format: 'CSV',
      frequency: 'Daily at 11:59 PM',
      recipients: ['tech@example.com'],
      nextRun: '2025-05-16 23:59'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Data Export</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-base font-medium text-gray-800">Export Data</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label htmlFor="export-type" className="block text-sm font-medium text-gray-700 mb-1">
                  What would you like to export?
                </label>
                <select
                  id="export-type"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="report">Report</option>
                  <option value="user-data">User Activity Data</option>
                  <option value="system-logs">System Logs</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select what to include:
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="include-charts"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="include-charts" className="ml-2 text-sm text-gray-700">
                      Charts and visualizations
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="include-data"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="include-data" className="ml-2 text-sm text-gray-700">
                      Raw data tables
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="include-annotations"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="include-annotations" className="ml-2 text-sm text-gray-700">
                      Notes and annotations
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="include-metadata"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="include-metadata" className="ml-2 text-sm text-gray-700">
                      Query metadata
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export format:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {exportOptions.map((option) => (
                    <div key={option.id} className="border border-gray-200 rounded-md p-3 flex flex-col items-center cursor-pointer hover:bg-blue-50 hover:border-blue-500">
                      <option.icon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Export Now
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="text-base font-medium text-gray-800">Schedule Exports</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                <Plus className="h-4 w-4 mr-1" /> New
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {scheduledExports.map((item, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {item.format}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="inline-block mr-1"><Clock className="h-3 w-3 inline-block" /></span>
                    {item.frequency}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    <span className="inline-block mr-1"><Calendar className="h-3 w-3 inline-block" /></span>
                    Next run: {item.nextRun}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.recipients.map((recipient, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {recipient}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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

// Backup & Restore Placeholder (to be implemented)
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