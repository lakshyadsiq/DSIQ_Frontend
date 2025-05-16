// GroupsManagement.jsx
import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Check,
  X,
} from 'lucide-react';

const GroupsManagement = () => {
  // Sample data - in a real app, this would come from your API
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Frontend',
      description: 'Frontend development team',
      tags: ['Engineering', 'Development'],
      memberCount: 8,
      roles: ['Frontend Developer', 'UI/UX Designer'],
      lastUpdated: '2025-05-15'
    },
    {
      id: 2,
      name: 'Backend',
      description: 'Backend development team',
      tags: ['Engineering', 'Development'],
      memberCount: 7,
      roles: ['Backend Developer', 'API Engineer'],
      lastUpdated: '2025-05-14'
    },
    {
      id: 3,
      name: 'DevOps',
      description: 'DevOps and infrastructure team',
      tags: ['Engineering', 'Operations'],
      memberCount: 4,
      roles: ['DevOps Engineer', 'Site Reliability Engineer'],
      lastUpdated: '2025-05-10'
    },
    {
      id: 4,
      name: 'QA',
      description: 'Quality assurance team',
      tags: ['Engineering', 'Testing'],
      memberCount: 5,
      roles: ['QA Engineer', 'Test Automation Engineer'],
      lastUpdated: '2025-05-12'
    },
    {
      id: 5,
      name: 'Product',
      description: 'Product management team',
      tags: ['Management'],
      memberCount: 3,
      roles: ['Product Manager', 'Product Owner'],
      lastUpdated: '2025-05-08'
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    tags: [],
    roles: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('');
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('members');
  const [newTag, setNewTag] = useState('');

  // Sample users data - would come from API in real app
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Frontend Developer', lastActive: '2 hours ago', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Backend Developer', lastActive: '1 day ago', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'DevOps Engineer', lastActive: '30 minutes ago', status: 'active' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'QA Engineer', lastActive: '5 hours ago', status: 'active' },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'Product Manager', lastActive: '1 hour ago', status: 'active' },
    { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'UI/UX Designer', lastActive: '3 days ago', status: 'inactive' },
    { id: 7, name: 'Robert Wilson', email: 'robert@example.com', role: 'API Engineer', lastActive: 'just now', status: 'active' },
    { id: 8, name: 'Lisa Miller', email: 'lisa@example.com', role: 'Test Automation Engineer', lastActive: '12 hours ago', status: 'active' }
  ]);

  // Sample activity data
  const [groupActivity, setGroupActivity] = useState([
    { id: 1, action: 'Exported dashboard data', user: 'John Doe', timestamp: '2025-05-15 10:30', type: 'export' },
    { id: 2, action: 'Created new report', user: 'Jane Smith', timestamp: '2025-05-15 09:15', type: 'create' },
    { id: 3, action: 'Modified API settings', user: 'Mike Johnson', timestamp: '2025-05-14 16:45', type: 'modify' },
    { id: 4, action: 'Ran test suite', user: 'Sarah Williams', timestamp: '2025-05-14 14:20', type: 'execute' },
    { id: 5, action: 'Updated product roadmap', user: 'David Brown', timestamp: '2025-05-13 11:10', type: 'update' }
  ]);

  // Sample permissions data
  const [permissions, setPermissions] = useState({
    'Frontend Developer': ['View dashboards', 'Create reports', 'Export data'],
    'Backend Developer': ['View dashboards', 'API access', 'Database queries'],
    'DevOps Engineer': ['System configuration', 'Deployments', 'Server monitoring'],
    'QA Engineer': ['Test execution', 'Bug reporting', 'Test case management'],
    'Product Manager': ['View all data', 'Manage projects', 'User management']
  });

  // Get all unique tags from groups
  const allTags = [...new Set(groups.flatMap(group => group.tags))];

  // Filter groups based on search and tag filter
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTagFilter ? group.tags.includes(selectedTagFilter) : true;
    return matchesSearch && matchesTag;
  });

  // Get members for selected group
  const groupMembers = selectedGroup ? 
    users.filter(user => selectedGroup.roles.includes(user.role)) : [];

  // Handle creating a new group
  const handleCreateGroup = () => {
    const newGroupObj = {
      id: groups.length + 1,
      name: newGroup.name,
      description: newGroup.description,
      tags: newGroup.tags,
      roles: newGroup.roles,
      memberCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setGroups([...groups, newGroupObj]);
    setNewGroup({ name: '', description: '', tags: [], roles: [] });
    setIsCreatingGroup(false);
  };

  // Handle adding a tag to new group
  const handleAddTag = () => {
    if (newTag && !newGroup.tags.includes(newTag)) {
      setNewGroup({ ...newGroup, tags: [...newGroup.tags, newTag] });
      setNewTag('');
    }
  };

  // Handle removing a tag from new group
  const handleRemoveTag = (tagToRemove) => {
    setNewGroup({ ...newGroup, tags: newGroup.tags.filter(tag => tag !== tagToRemove) });
  };

  // Toggle user selection for bulk actions
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  // Select all/none users for bulk actions
  const toggleSelectAllUsers = () => {
    if (selectedUsers.length === groupMembers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(groupMembers.map(user => user.id));
    }
  };

  // Bulk remove users from group
  const handleBulkRemove = () => {
    // In a real app, this would call an API to update the group
    alert(`Removing ${selectedUsers.length} users from ${selectedGroup.name}`);
    setSelectedUsers([]);
    setBulkActionMode(false);
  };

  // Bulk reassign roles
  const handleBulkReassign = (newRole) => {
    // In a real app, this would call an API to update users' roles
    alert(`Reassigning ${selectedUsers.length} users to ${newRole} role`);
    setSelectedUsers([]);
    setBulkActionMode(false);
  };

  // Send group notification
  const sendGroupNotification = () => {
    alert(`Notification sent to all ${selectedGroup.name} members`);
  };

  // Export group data
  const exportGroupData = (format) => {
    alert(`Exporting ${selectedGroup.name} data as ${format}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Group Management</h2>
        <button 
          onClick={() => setIsCreatingGroup(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </button>
      </div>

      {/* Create Group Modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create New Group</h3>
              <button onClick={() => setIsCreatingGroup(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Frontend Team"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description of the group's purpose"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add tag (press Enter)"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newGroup.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Linked Roles</label>
                <select
                  multiple
                  value={newGroup.roles}
                  onChange={(e) => {
                    const options = [...e.target.options];
                    const selected = options
                      .filter(option => option.selected)
                      .map(option => option.value);
                    setNewGroup({ ...newGroup, roles: selected });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(permissions).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsCreatingGroup(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroup.name || !newGroup.roles.length}
                  className={`px-4 py-2 rounded-md ${!newGroup.name || !newGroup.roles.length ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 gap-6">
        {/* Groups List */}
        <div className={`${selectedGroup ? 'w-1/3' : 'w-full'} bg-white border border-gray-200 rounded-lg overflow-hidden`}>
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3">
              <select
                value={selectedTagFilter}
                onChange={(e) => setSelectedTagFilter(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredGroups.length > 0 ? (
              filteredGroups.map(group => (
                <div 
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedGroup?.id === group.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">{group.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                    </div>
                    <span className="text-xs text-gray-500">{group.memberCount} members</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {group.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Last updated: {group.lastUpdated}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No groups found matching your criteria
              </div>
            )}
          </div>
        </div>
        
        {/* Group Details */}
        {selectedGroup && (
          <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Group Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-800">{selectedGroup.name}</h3>
                  <p className="text-sm text-gray-500">{selectedGroup.description}</p>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedGroup.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('members')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'members'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Members ({groupMembers.length})
                </button>
                <button
                  onClick={() => setActiveTab('permissions')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'permissions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Permissions
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'activity'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Activity
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'members' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      {bulkActionMode ? `${selectedUsers.length} selected` : `${groupMembers.length} members`}
                    </h4>
                    <div className="flex space-x-2">
                      {bulkActionMode ? (
                        <>
                          <button 
                            onClick={handleBulkRemove}
                            className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100"
                          >
                            Remove from Group
                          </button>
                          <div className="relative">
                            <select
                              onChange={(e) => handleBulkReassign(e.target.value)}
                              className="pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              defaultValue=""
                            >
                              <option value="" disabled>Reassign Role</option>
                              {Object.keys(permissions).map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          </div>
                          <button 
                            onClick={() => {
                              setBulkActionMode(false);
                              setSelectedUsers([]);
                            }}
                            className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm rounded-md hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => setBulkActionMode(true)}
                            className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm rounded-md hover:bg-gray-100"
                          >
                            Bulk Actions
                          </button>
                          <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-md hover:bg-blue-100">
                            Add Members
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="overflow-hidden border border-gray-200 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {bulkActionMode && (
                              <input
                                type="checkbox"
                                checked={selectedUsers.length === groupMembers.length && groupMembers.length > 0}
                                onChange={toggleSelectAllUsers}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                            )}
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {groupMembers.length > 0 ? (
                          groupMembers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                {bulkActionMode && (
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => toggleUserSelection(user.id)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.role}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                              No members found in this group
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeTab === 'permissions' && (
                <div>
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Role-Based Permissions</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {selectedGroup.roles.map(role => (
                        <div key={role} className="mb-4 last:mb-0">
                          <h5 className="text-sm font-medium text-gray-800 mb-2">{role}</h5>
                          <div className="flex flex-wrap gap-2">
                            {permissions[role]?.map((perm, idx) => (
                              <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {perm}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Permission Matrix</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Module
                            </th>
                            {selectedGroup.roles.map(role => (
                              <th key={role} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {role}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {['Dashboards', 'Reports', 'Data Export', 'User Management', 'System Settings'].map(module => (
                            <tr key={module}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                {module}
                              </td>
                              {selectedGroup.roles.map(role => (
                                <td key={`${module}-${role}`} className="px-6 py-4 whitespace-nowrap text-center">
                                  {permissions[role]?.some(p => p.toLowerCase().includes(module.toLowerCase())) ? (
                                    <Check className="h-5 w-5 text-green-500 mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-red-500 mx-auto" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'activity' && (
                <div>
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {groupActivity.map(activity => (
                        <div key={activity.id} className="mb-3 pb-3 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium text-gray-800">{activity.user}</div>
                            <div className="text-xs text-gray-500">{activity.timestamp}</div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{activity.action}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Activity Insights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-md p-4">
                        <h5 className="text-xs font-medium text-gray-500 mb-2">Most Active Members</h5>
                        {users.slice(0, 3).map(user => (
                          <div key={user.id} className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{user.name}</span>
                              <span className="text-gray-500">24 actions</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.random() * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white border border-gray-200 rounded-md p-4">
                        <h5 className="text-xs font-medium text-gray-500 mb-2">Activity Types</h5>
                        <div className="flex items-center justify-center h-32">
                          {/* Placeholder for chart */}
                          <div className="text-gray-400 text-sm">Activity chart will appear here</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsManagement;