import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  X,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  AlertCircle,
  Info
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
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    tags: [],
    roles: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successAction, setSuccessAction] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToReassign, setUserToReassign] = useState(null);
  const [viewMode, setViewMode] = useState('groups'); // 'groups' or 'users'

  // Sample users data - would come from API in real app
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Frontend Developer', lastActive: '2 hours ago', status: 'active', groupId: 1 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Backend Developer', lastActive: '1 day ago', status: 'active', groupId: 2 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'DevOps Engineer', lastActive: '30 minutes ago', status: 'active', groupId: 3 },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'QA Engineer', lastActive: '5 hours ago', status: 'active', groupId: 4 },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'Product Manager', lastActive: '1 hour ago', status: 'active', groupId: null },
    { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'UI/UX Designer', lastActive: '3 days ago', status: 'inactive', groupId: 1 },
    { id: 7, name: 'Robert Wilson', email: 'robert@example.com', role: 'API Engineer', lastActive: 'just now', status: 'active', groupId: 2 },
    { id: 8, name: 'Lisa Miller', email: 'lisa@example.com', role: 'Test Automation Engineer', lastActive: '12 hours ago', status: 'active', groupId: 4 }
  ]);

  // Sample permissions data
  const [permissions, setPermissions] = useState({
    'Frontend Developer': ['View dashboards', 'Create reports', 'Export data'],
    'Backend Developer': ['View dashboards', 'API access', 'Database queries'],
    'DevOps Engineer': ['System configuration', 'Deployments', 'Server monitoring'],
    'QA Engineer': ['Test execution', 'Bug reporting', 'Test case management'],
    'Product Manager': ['View all data', 'Manage projects', 'User management']
  });

  // Update group member counts when users are reassigned
  useEffect(() => {
    const updatedGroups = groups.map(group => {
      const memberCount = users.filter(user => user.groupId === group.id).length;
      return { ...group, memberCount };
    });
    
    setGroups(updatedGroups);
  }, [users]);

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
    users.filter(user => user.groupId === selectedGroup.id) : [];

  // Get unassigned users or users filtered by search
  const filteredUsers = users.filter(user => {
    const matchesSearch = userSearchTerm ? 
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearchTerm.toLowerCase()) : true;
    
    return matchesSearch;
  });

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
    showSuccessNotification('Group created successfully');
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

  // Reassign user to a group
  const assignUserToGroup = (userId, groupId) => {
    // Check if user is already in another group
    const user = users.find(u => u.id === userId);
    if (user && user.groupId !== null && user.groupId !== groupId) {
      // Ask for confirmation before reassigning
      setUserToReassign({userId, oldGroupId: user.groupId, newGroupId: groupId});
      setShowConfirmModal(true);
      return;
    }
    
    // Directly assign if user has no group
    confirmUserAssignment(userId, groupId);
  };

  // Confirm user assignment after modal
  const confirmUserAssignment = (userId, groupId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, groupId };
      }
      return user;
    });
    setUsers(updatedUsers);
    
    setShowConfirmModal(false);
    setUserToReassign(null);
    showSuccessNotification('User assigned successfully');
  };

  // Remove user from group
  const removeUserFromGroup = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, groupId: null };
      }
      return user;
    });
    setUsers(updatedUsers);
    showSuccessNotification('User removed from group');
  };

  // Show success notification
  const showSuccessNotification = (message) => {
    setSuccessAction(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // User Card Component
  const UserCard = ({ user }) => {
    const userGroup = groups.find(g => g.id === user.groupId);
    
    return (
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md mb-2 bg-white hover:shadow-sm">
        <div className="flex items-center overflow-hidden">
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="ml-3 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
            <div className="text-xs text-gray-500 truncate">{user.role}</div>
            {user.groupId && (
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {userGroup?.name || 'Unknown Group'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="ml-2 flex-shrink-0">
          {viewMode === 'users' ? (
            <div className="flex space-x-1">
              {user.groupId ? (
                <button 
                  onClick={() => removeUserFromGroup(user.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove from group"
                >
                  <UserX className="h-4 w-4" />
                </button>
              ) : (
                <select
                  onChange={(e) => assignUserToGroup(user.id, parseInt(e.target.value))}
                  className="text-xs border border-gray-300 rounded p-1"
                  value=""
                >
                  <option value="" disabled>Assign to...</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              )}
            </div>
          ) : selectedGroup ? (
            user.groupId === selectedGroup.id ? (
              <button 
                onClick={() => removeUserFromGroup(user.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove from group"
              >
                <UserX className="h-4 w-4" />
              </button>
            ) : user.groupId ? (
              <button 
                onClick={() => assignUserToGroup(user.id, selectedGroup.id)}
                className="text-blue-500 hover:text-blue-700 p-1"
                title="Reassign to this group"
              >
                <UserPlus className="h-4 w-4" />
              </button>
            ) : (
              <button 
                onClick={() => assignUserToGroup(user.id, selectedGroup.id)}
                className="text-green-500 hover:text-green-700 p-1"
                title="Add to group"
              >
                <UserPlus className="h-4 w-4" />
              </button>
            )
          ) : null}
        </div>
      </div>
    );
  };

  // Group Card Component
  const GroupCard = ({ group }) => {
    const isSelected = selectedGroup?.id === group.id;
    
    return (
      <div 
        onClick={() => {
          setSelectedGroup(group);
          setViewMode('groups');
        }}
        className={`p-4 cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-800">{group.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{group.description}</p>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-xs text-gray-500">{group.memberCount}</span>
          </div>
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
    );
  };

  return (
    <div className="flex flex-col h-full max-w-full">
      {/* Header with view toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 mr-2">Group Management</h2>
          <button 
            onClick={() => setShowInfoModal(true)}
            className="p-1 text-gray-500 hover:text-gray-700"
            title="About one-to-one group assignments"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex space-x-2">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setViewMode('groups')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'groups' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Groups View
            </button>
            <button
              onClick={() => setViewMode('users')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'users' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Users View
            </button>
          </div>
          
          <button 
            onClick={() => setIsCreatingGroup(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </button>
        </div>
      </div>
      
      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                One-to-One Group Assignment
              </h3>
              <button onClick={() => setShowInfoModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <p>In this system, each user can be assigned to only one group at a time. This ensures clear organizational structure and streamlined permission management.</p>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="font-medium text-blue-800 mb-1">Key benefits:</h4>
                <ul className="list-disc pl-5 text-blue-800">
                  <li>Clear organizational hierarchy</li>
                  <li>Simplified access control</li>
                  <li>Reduced permission conflicts</li>
                  <li>Better user accountability</li>
                </ul>
              </div>
              
              <p>When you assign a user to a new group, they will be automatically removed from their previous group.</p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Group Modal */}
      {isCreatingGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
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
                  size={Math.min(5, Object.keys(permissions).length)}
                >
                  {Object.keys(permissions).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple roles</p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  onClick={() => setIsCreatingGroup(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroup.name || !newGroup.roles.length}
                  className={`px-4 py-2 rounded-md ${!newGroup.name || !newGroup.roles.length ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white w-full sm:w-auto`}
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal for Reassigning User */}
      {showConfirmModal && userToReassign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md shadow-lg">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
              <h3 className="text-lg font-medium">Change Group Assignment</h3>
            </div>
            
            <p className="mb-6">
              This user is already assigned to <strong>{groups.find(g => g.id === userToReassign.oldGroupId)?.name}</strong>. 
              Users can only belong to one group at a time. Do you want to move them to <strong>{groups.find(g => g.id === userToReassign.newGroupId)?.name}</strong>?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setUserToReassign(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmUserAssignment(userToReassign.userId, userToReassign.newGroupId)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Notification */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 shadow-lg rounded-md flex items-center z-50">
          <div className="flex-shrink-0">
            <UserCheck className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-800">{successAction}</p>
          </div>
          <button onClick={() => setShowSuccessMessage(false)} className="ml-4 text-green-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {viewMode === 'groups' ? (
          <>
            {/* Groups List - Left sidebar in groups view */}
            <div className={`${selectedGroup ? 'lg:w-1/3' : 'w-full'} bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col`}>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative flex-1 mb-3">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={selectedTagFilter}
                    onChange={(e) => setSelectedTagFilter(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Tags</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map(group => (
                    <GroupCard key={group.id} group={group} />
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No groups found matching your criteria
                  </div>
                )}
              </div>
            </div>
            
            {/* Group Details - Right side in groups view */}
            {selectedGroup && (
              <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">{selectedGroup.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Users className="h-3 w-3 mr-1" />
                      {selectedGroup.memberCount} members
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{selectedGroup.description}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {selectedGroup.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-700">Associated Roles:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedGroup.roles.map(role => (
                        <span key={role} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Group Members List */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-700">Group Members</h4>
                    <div className="relative">
                      <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Find users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* User assignment guidance */}
                  <div className="bg-blue-50 p-3 rounded-md mb-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800">
                        Users can only belong to one group at a time. Adding a user who already belongs to another group will move them from their current group to this one.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <div className="text-sm font-medium text-gray-700">Current Members</div>
                    <div className="h-48 md:h-64 overflow-y-auto border border-gray-100 rounded-md bg-gray-50 p-2">
                      {groupMembers.length > 0 ? (
                        groupMembers.map(user => (
                          <UserCard key={user.id} user={user} />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No members in this group yet
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-700">Available Users</div>
                    <div className="h-48 md:h-64 overflow-y-auto border border-gray-100 rounded-md bg-gray-50 p-2">
                      {filteredUsers.filter(user => user.groupId !== selectedGroup.id).length > 0 ? (
                        filteredUsers
                          .filter(user => user.groupId !== selectedGroup.id)
                          .map(user => (
                            <UserCard key={user.id} user={user} />
                          ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No users available to add
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Users View Mode */
          <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">All Users</h3>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* User assignment guidance */}
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    In this system, each user can only be assigned to one group at a time. Use the dropdown menu to assign users to groups, or click the remove button to unassign a user from their current group.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <UserCard key={user.id} user={user} />
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No users found matching your criteria
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