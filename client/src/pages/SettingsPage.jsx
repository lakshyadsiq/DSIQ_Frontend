import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Users,
  Shield,
  History,
  Database,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Pencil,
  Menu,
  Check,
  AlertTriangle,
  ArchiveRestore,
  X,
} from 'lucide-react';
import { MdArchive } from "react-icons/md"
import UsersList from './UsersList';
import DataExport from '../components/DataExport';
import ActivityLogs from '../components/ActivityLogs';
import CreateRoles from '../components/CreateRoles';
import PrivacyPreferences from '../components/PrivacyPreferences';
import BackupRestore from '../components/BackupRestore';
import Navbar from '../components/Navbar';
import { Card, CardTitle, CardBody, CardSubtitle } from '@progress/kendo-react-layout';
import '@progress/kendo-theme-default/dist/all.css'; 

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
  const [roles, setRoles] = useState([
  {
    id: '1', // Added unique IDs to each role
    name: 'Administrator',
    description: 'Full access to all system features and settings',
    isArchived: false, // Added isArchived property
    permissions: {
        Dashboard: { create: true, read: true, update: true, archived: true },
        Reports: { create: true, read: true, update: true, archived: true },
        "Data Export": { create: true, read: true, update: true, archived: true },
        Settings: { create: true, read: true, update: true, archived: true },
        "API Access": { create: true, read: true, update: true, archived: true },
        Notifications: { create: true, read: true, update: true, archived: true },
        Analytics: { create: true, read: true, update: true, archived: true }
      }
  },
  {
    id: '2', // Added unique IDs to each role
    name: 'Viewer',
    description: 'View-only access to dashboards and reports',
    isArchived: false, // Added isArchived property
    permissions: {
        Dashboard: { create: false, read: true, update: false, archived: false },
        Reports: { create: true, read: true, update: true, archived: false },
        "Data Export": { create: true, read: true, update: false, archived: false },
        Settings: { create: false, read: false, update: false, archived: false },
        "API Access": { create: false, read: true, update: false, archived: false },
        Notifications: { create: false, read: true, update: false, archived: false },
        Analytics: { create: false, read: true, update: false, archived: false }
      }
  },
  {
    id: '3', // Added unique IDs to each role
    name: 'Report Creator',
    description: 'Can create and share reports based on existing dashboards',
    isArchived: false, // Added isArchived property
    permissions: {
        Dashboard: { create: false, read: true, update: false, archived: false },
        Reports: { create: false, read: true, update: false, archived: false },
        "Data Export": { create: false, read: true, update: false, archived: false },
        Settings: { create: false, read: false, update: false, archived: false },
        "API Access": { create: false, read: false, update: false, archived: false },
        Notifications: { create: true, read: true, update: true, archived: false },
        Analytics: { create: false, read: true, update: false, archived: false }
      }
  }
]);
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
      return <CreateRoles onCancel={() => setShowCreateRoleForm(false)} roles={roles} setRoles={setRoles} />;
    }
    switch (activeSubSection) {
      case 'users':
        return <UsersList />;
      case 'roles':
        return <RolesManagement onCreateRole={handleCreateRole} roles={roles} setRoles={setRoles}/>;
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

const RolesManagement = ({ onCreateRole, roles, setRoles }) => {
  // Fixed state management
  const [hoveredRoleId, setHoveredRoleId] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editedRole, setEditedRole] = useState(null);
  const [archiveFilter, setArchiveFilter] = useState('active'); // 'active' or 'archived'
  const [nameError, setNameError] = useState(''); // New state for validation error

  // Initialize edited role when editing starts
  const startEditing = (roleId) => {
    const roleToEdit = roles.find(role => role.id === roleId);
    if (roleToEdit) {
      setEditedRole(JSON.parse(JSON.stringify(roleToEdit)));
      setEditingRoleId(roleId);
      setNameError(''); // Clear any previous errors
    }
  };

  // Check if role name is unique
  const isRoleNameUnique = (name, currentRoleId) => {
    return !roles.some(role => 
      role.name.toLowerCase() === name.toLowerCase() && role.id !== currentRoleId
    );
  };

  // Handle role name change with validation
  const handleRoleNameChange = (e) => {
    const newName = e.target.value;
    setEditedRole({...editedRole, name: newName});
    
    // Validate name uniqueness
    if (!newName.trim()) {
      setNameError('Role name cannot be empty');
    } else if (!isRoleNameUnique(newName, editingRoleId)) {
      setNameError('This role name is already taken');
    } else {
      setNameError('');
    }
  };

  // Save edited role with validation
  const saveEditedRole = () => {
    if (!editedRole?.name?.trim()) {
      setNameError('Role name cannot be empty');
      return;
    }
    
    if (!isRoleNameUnique(editedRole.name, editingRoleId)) {
      setNameError('This role name is already taken');
      return;
    }

    if (editedRole) {
      setRoles(prevRoles => 
        prevRoles.map(role => 
          role.id === editingRoleId ? editedRole : role
        )
      );
      setEditingRoleId(null);
      setEditedRole(null);
      setNameError('');
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingRoleId(null);
    setEditedRole(null);
    setNameError('');
  };

  // Toggle permission value
  const togglePermission = (category, action) => {
    if (editedRole) {
      setEditedRole(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [category]: {
            ...prev.permissions[category],
            [action]: !prev.permissions[category][action]
          }
        }
      }));
    }
  };

  // Archive or restore role
  const toggleArchiveRole = (roleId) => {
    setRoles(prevRoles => 
      prevRoles.map(role => 
        role.id === roleId ? { ...role, isArchived: !role.isArchived } : role
      )
    );
  };

  // Helper function to render permission letters with color coding
  const renderPermissionLetters = (permissions) => {
    return Object.entries(permissions).map(([category, actions]) => {
      return (
        <div key={category} className="mb-1 last:mb-0">
          <h4 className="text-sm font-medium mb-1 text-gray-600">{category}</h4>
          <div className="flex space-x-1">
            {Object.entries(actions).map(([action, enabled]) => (
              <span 
                key={`${category}-${action}`}
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  enabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-50 text-red-400'
                }`}
                title={`${action.toUpperCase()} permission ${enabled ? 'enabled' : 'disabled'}`}
              >
                {action.charAt(0).toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      );
    });
  };

  // Render editable permissions
  const renderEditablePermissions = (permissions) => {
    return Object.entries(permissions).map(([category, actions]) => {
      return (
        <div key={category} className="mb-4 last:mb-0">
          <h4 className="text-sm font-medium mb-2 text-gray-600">{category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(actions).map(([action, enabled]) => (
              <label key={`${category}-${action}`} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => togglePermission(category, action)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{action}</span>
              </label>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="relative p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Roles Management</h2>
      <p className="text-gray-600 mb-6">
        Review existing roles and their assigned permissions. Create new roles or modify existing ones.
      </p>

      {/* Archive filter tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setArchiveFilter('active')}
          className={`px-4 py-2 text-sm font-medium ${archiveFilter === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Active Roles
        </button>
        <button
          onClick={() => setArchiveFilter('archived')}
          className={`px-4 py-2 text-sm font-medium ${archiveFilter === 'archived' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Archived Roles
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-16">
        {roles
          .filter(role => archiveFilter === 'archived' ? role.isArchived : !role.isArchived)
          .map((role) => (
            <div
              key={role.id}
              onMouseEnter={() => setHoveredRoleId(role.id)}
              onMouseLeave={() => setHoveredRoleId(null)}
              className="relative"
            >
              <Card className={`h-full ${role.isArchived ? 'opacity-70' : ''}`}>
                {/* Card Header with role name and description */}
                <div className={`k-card-header border-b ${role.isArchived ? 'bg-gray-100' : 'bg-gray-50'} flex justify-between items-center p-4 relative`}>
                  {editingRoleId === role.id ? (
                    <div className="w-full">
                      <div className="relative">
                        <input
                          type="text"
                          value={editedRole?.name || ''}
                          onChange={handleRoleNameChange}
                          className={`w-full text-xl font-medium text-gray-800 mb-2 p-1 border rounded ${
                            nameError ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {nameError && (
                          <div className="absolute right-0 top-0 flex items-center h-full pr-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                        )}
                      </div>
                      {nameError && (
                        <p className="text-xs text-red-500 mb-2">{nameError}</p>
                      )}
                      <input
                        type="text"
                        value={editedRole?.description || ''}
                        onChange={(e) => setEditedRole({...editedRole, description: e.target.value})}
                        className="w-full text-sm text-gray-600 p-1 border border-gray-300 rounded"
                      />
                    </div>
                  ) : (
                    <div>
                      <CardTitle className="!text-xl font-medium text-gray-800 mb-1">
                        {role.name}
                        {role.isArchived && (
                          <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                            Archived
                          </span>
                        )}
                      </CardTitle>
                      <CardSubtitle className="!text-sm text-gray-600">
                        {role.description}
                      </CardSubtitle>
                    </div>
                  )}
                  <Shield className={`h-6 w-6 ${role.isArchived ? 'text-gray-400' : 'text-gray-500'}`} />
                  
                  {/* Action buttons on hover */}
                  {hoveredRoleId === role.id && editingRoleId !== role.id && (
                    <div 
                      className="absolute top-5 right-14 flex space-x-2 z-10"
                      style={{pointerEvents: 'auto'}}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(role.id);
                        }}
                        className="p-1 bg-white rounded-full shadow-md text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label={`Edit role ${role.name}`}
                        title="Edit role"
                      >
                        <Pencil size={20}/>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleArchiveRole(role.id);
                        }}
                        className="p-1 bg-white rounded-full shadow-md text-red-600 hover:text-red-800 transition-colors"
                        aria-label={role.isArchived ? `Restore role ${role.name}` : `Archive role ${role.name}`}
                        title={role.isArchived ? "Restore role" : "Archive role"}
                      >
                        {role.isArchived ? <ArchiveRestore size={20} /> : <MdArchive size={20} />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Body with Permissions */}
                <CardBody>
                  <h4 className="k-text-sm k-font-medium k-mb-1 mb-3 text-gray-900">Permissions</h4>
                  {editingRoleId === role.id ? (
                    <div className="space-y-4">
                      {editedRole && renderEditablePermissions(editedRole.permissions)}
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEditedRole}
                          className={`px-3 py-1 text-sm text-white rounded flex items-center ${
                            nameError ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                          disabled={!!nameError}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="k-d-flex k-gap-5 !k-flex-wrap">
                      {renderPermissionLetters(role.permissions)}
                    </div>
                  )}
                </CardBody>
              </Card>
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