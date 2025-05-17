// GroupsManagement.jsx
import { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  Users,
  UserPlus,
  UserMinus
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
  const [userSearchTerm, setUserSearchTerm] = useState('');

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

  // Track which users are in which groups
  const [groupMemberships, setGroupMemberships] = useState({
    1: [1, 6], // Frontend group has users 1 and 6
    2: [2, 7], // Backend group has users 2 and 7
    3: [3],    // DevOps group has user 3
    4: [4, 8]  // QA group has users 4 and 8
  });

  // State for drag and drop
  const [draggingUserId, setDraggingUserId] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(null); // 'group' or 'available'

  // Sample permissions data
  const [permissions, setPermissions] = useState({
    'Frontend Developer': ['View dashboards', 'Create reports', 'Export data'],
    'Backend Developer': ['View dashboards', 'API access', 'Database queries'],
    'DevOps Engineer': ['System configuration', 'Deployments', 'Server monitoring'],
    'QA Engineer': ['Test execution', 'Bug reporting', 'Test case management'],
    'Product Manager': ['View all data', 'Manage projects', 'User management']
  });

  // Update group member counts when groupMemberships changes
  useEffect(() => {
    if (!selectedGroup) return;
    
    const updatedGroups = groups.map(group => {
      const memberCount = groupMemberships[group.id]?.length || 0;
      return { ...group, memberCount };
    });
    
    setGroups(updatedGroups);
  }, [groupMemberships]);

  // Get all unique tags from groups
  const allTags = [...new Set(groups.flatMap(group => group.tags))];

  // Filter groups based on search and tag filter
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) || group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTagFilter ? group.tags.includes(selectedTagFilter) : true;
    return matchesSearch && matchesTag;
  });

  // Get members for selected group
  const groupMembers = selectedGroup ? 
    users.filter(user => groupMemberships[selectedGroup.id]?.includes(user.id)) : [];

  // Get available users (not in the selected group)
  const availableUsers = selectedGroup ? 
    users.filter(user => !groupMemberships[selectedGroup.id]?.includes(user.id)) : [];

  // Filter users based on search
  const filteredAvailableUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

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
    // Initialize empty member list for the new group
    setGroupMemberships(prev => ({
      ...prev,
      [newGroupObj.id]: []
    }));
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

  // Drag and Drop handling
  const handleDragStart = (userId) => {
    setDraggingUserId(userId);
  };

  const handleDragOver = (e, dropArea) => {
    e.preventDefault();
    setIsDraggingOver(dropArea);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(null);
  };

  const handleDrop = (e, dropArea) => {
    e.preventDefault();
    if (!draggingUserId || !selectedGroup) return;

    if (dropArea === 'group') {
      // Add user to group
      if (!groupMemberships[selectedGroup.id].includes(draggingUserId)) {
        setGroupMemberships(prev => ({
          ...prev,
          [selectedGroup.id]: [...prev[selectedGroup.id], draggingUserId]
        }));
      }
    } else if (dropArea === 'available') {
      // Remove user from group
      setGroupMemberships(prev => ({
        ...prev,
        [selectedGroup.id]: prev[selectedGroup.id].filter(id => id !== draggingUserId)
      }));
    }

    setDraggingUserId(null);
    setIsDraggingOver(null);
  };

  // Explicitly add a user to the selected group
  const addUserToGroup = (userId) => {
    if (!selectedGroup) return;
    
    setGroupMemberships(prev => ({
      ...prev,
      [selectedGroup.id]: [...prev[selectedGroup.id], userId]
    }));
  };

  // Explicitly remove a user from the selected group
  const removeUserFromGroup = (userId) => {
    if (!selectedGroup) return;
    
    setGroupMemberships(prev => ({
      ...prev,
      [selectedGroup.id]: prev[selectedGroup.id].filter(id => id !== userId)
    }));
  };

  // Render user card for drag and drop
  const UserCard = ({ user, inGroup }) => {
    return (
      <div 
        draggable
        onDragStart={() => handleDragStart(user.id)}
        className="flex items-center justify-between p-3 border border-gray-200 rounded-md mb-2 bg-white cursor-move hover:shadow-sm"
      >
        <div className="flex items-center overflow-hidden">
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="ml-3 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
            <div className="text-xs text-gray-500 truncate">{user.role}</div>
          </div>
        </div>
        <div className="ml-2 flex-shrink-0">
          {inGroup ? (
            <button 
              onClick={() => removeUserFromGroup(user.id)}
              className="text-red-500 hover:text-red-700 p-1"
              title="Remove from group"
            >
              <UserMinus className="h-4 w-4" />
            </button>
          ) : (
            <button 
              onClick={() => addUserToGroup(user.id)}
              className="text-green-500 hover:text-green-700 p-1"
              title="Add to group"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6">
        {/* Groups List */}
        <div className={`${selectedGroup ? 'lg:w-1/3 md:w-full' : 'w-full'} bg-white border border-gray-200 rounded-lg overflow-hidden`}>
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
          
          <div className="divide-y divide-gray-200 max-h-96 lg:max-h-full overflow-y-auto">
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
        
        {/* Group Details and Drag-Drop Area */}
        {selectedGroup && (
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            {/* Available Users */}
            <div className="md:w-1/2 bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-md font-medium text-gray-800 mb-2">Available Users</h3>
                <div className="relative">
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
              
              <div 
                className={`p-4 h-64 md:h-96 overflow-y-auto ${isDraggingOver === 'available' ? 'bg-gray-100' : ''}`}
                onDragOver={(e) => handleDragOver(e, 'available')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'available')}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="text-sm text-gray-500">
                    Drag users from the group to remove them or use the button
                  </div>
                </div>
                
                {filteredAvailableUsers.length > 0 ? (
                  filteredAvailableUsers.map(user => (
                    <UserCard key={user.id} user={user} inGroup={false} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No users available to add to this group
                  </div>
                )}
              </div>
            </div>
            
            {/* Group Users */}
            <div className="md:w-1/2 bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-md font-medium text-gray-800">{selectedGroup.name}: Members</h3>
                <p className="text-sm text-gray-500">{groupMembers.length} users in this group</p>
              </div>
              
              <div 
                className={`p-4 h-64 md:h-96 overflow-y-auto ${isDraggingOver === 'group' ? 'bg-gray-100' : ''}`}
                onDragOver={(e) => handleDragOver(e, 'group')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'group')}
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="text-sm text-gray-500">
                    Drag users here to add them to the group or use the button
                  </div>
                </div>
                
                {groupMembers.length > 0 ? (
                  groupMembers.map(user => (
                    <UserCard key={user.id} user={user} inGroup={true} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No members in this group yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsManagement;