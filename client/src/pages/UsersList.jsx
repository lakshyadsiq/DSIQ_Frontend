import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, ArrowLeft, Edit2, RotateCcw, Search, UserPlus, Filter, KeyRound, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddUser from '../components/AddUser';
import { MdArchive } from "react-icons/md";
import UpdatePasswordModal from '../components/UpdatePasswordModal';

const UsersList = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);

  // List of available roles/positions
  const availableRoles = [
    'Web Developer',
    'UX Designer',
    'Project Manager',
    'Software Engineer',
    'QA Engineer',
    'DevOps Engineer',
    'Product Owner',
    'Scrum Master'
  ];

  const [users, setUsers] = useState([
    { id: 1, name: 'Gita Sharma', email: 'lakshya@example.com', Role: 'Web Developer', archived: false },
    { id: 2, name: 'Ram Verma', email: 'ram@example.com', Role: 'UX Designer', archived: false },
    { id: 3, name: 'Sita Sha', email: 'sita@example.com', Role: 'Project Manager', archived: false },
    { id: 4, name: 'Shyam Sharma', email: 'shyam@example.com', Role: 'Software Engineer', archived: false },
  ]);

  const [filter, setFilter] = useState('all'); // 'all' or 'archived'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', Role: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const handleAddUser = (newUser) => {
    const newId = users.length ? Math.max(...users.map(emp => emp.id)) + 1 : 1;
    const userToAdd = {
      id: newId,
      ...newUser,
      archived: false,
    };
    setUsers((prev) => [...prev, userToAdd]);
    setIsModalOpen(false);
    toast.success(`${newUser.name} has been added successfully!`);
  };

  const handleArchive = (id) => {
    const userToArchive = users.find(user => user.id === id);
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, archived: true } : user
      )
    );
    toast.info(`${userToArchive.name} has been archived`);
  };

  const handleRestore = (id) => {
    const userToRestore = users.find(user => user.id === id);
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, archived: false } : user
      )
    );
    toast.success(`${userToRestore.name} has been restored`);
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditForm({ name: user.name, Role: user.Role });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = (id) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, name: editForm.name, Role: editForm.Role } : user
      )
    );
    setEditUserId(null);
    toast.success("User details updated successfully!");
  };

  const filteredUsers = users.filter(user => {
    // Filter by active/archived status
    const statusMatch = filter === 'all' ? !user.archived : user.archived;

    // Filter by search term
    const searchMatch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Role.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by role
    const roleMatch = roleFilter === 'all' ? true : user.Role === roleFilter;

    return statusMatch && searchMatch && roleMatch;
  });

  const handleUpdatePassword = (userId, newPassword) => {
    console.log(`Password for user ${userId} updated to: ${newPassword}`);
    toast.success("Password updated successfully!");
  };

  const handleExportCSV = () => {
    // This is just a placeholder for future implementation
    toast.info("Export to CSV functionality will be implemented soon");
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    toast.info("Filters cleared");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex-grow p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-4 md:mb-0">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Users
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-200 flex items-center shadow-lg hover:shadow-blue-600/20"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-5 border border-gray-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-4 md:mb-0 w-full md:w-auto">
              <h2 className="text-xl font-semibold text-gray-800 min-w-[140px]">
                {filter === 'all' ? 'All Users' : 'Archived Users'}
              </h2>

              <div className="flex mt-2 md:mt-0">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-l-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition duration-200`}
                >
                  Active ({users.filter(u => !u.archived).length})
                </button>
                <button
                  onClick={() => setFilter('archived')}
                  className={`px-4 py-2 rounded-r-md ${filter === 'archived' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} transition duration-200`}
                >
                  Archived ({users.filter(u => u.archived).length})
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6 border border-gray-300 flex justify-center items-center">
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users by name, email or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  />
                </div>

                <div className="w-full md:w-64">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                  >
                    <option value="all">All Roles</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {filteredUsers.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center border border-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-200">
                <Users className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-700 text-xl font-semibold">
                {filter === 'archived' ? 'No archived users found' : 'No active users found'}
              </p>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                {filter === 'archived'
                  ? 'Archive users from the active list to see them here'
                  : searchTerm || roleFilter !== 'all'
                    ? 'Try adjusting your search or filters to find what you\'re looking for'
                    : 'Add new users to get started with user management'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-800 font-semibold">Name</th>
                    <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-800 font-semibold">Email</th>
                    <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-800 font-semibold">Role</th>
                    <th className="py-3 px-4 border-b border-gray-200 text-center text-gray-800 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100 transition duration-200">
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                        {editUserId === user.id && filter === 'all' ? (
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            className="bg-white text-gray-900 px-3 py-2 rounded w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{user.email}</td>
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                        {editUserId === user.id && filter === 'all' ? (
                          <select
                            name="Role"
                            value={editForm.Role}
                            onChange={handleEditChange}
                            className="bg-white text-gray-900 px-3 py-2 rounded w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select a Role</option>
                            {availableRoles.map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            {user.Role}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                        {filter === 'all' ? (
                          editUserId === user.id ? (
                            <button
                              onClick={() => handleEditSave(user.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-200"
                            >
                              Save Changes
                            </button>
                          ) : (
                            <div className="flex justify-center space-x-2">
                              <div className="relative group">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="p-2 text-yellow-500 hover:text-yellow-600 hover:bg-gray-100 rounded-full transition duration-200"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <span className="absolute -top-4 left-1/2 transform -translate-x-3/5 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                  Edit User
                                </span>
                              </div>

                              <div className="relative group">
                                <button
                                  onClick={() => handleArchive(user.id)}
                                  className="p-2 text-red-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition duration-200"
                                >
                                  <MdArchive size={18} />
                                </button>
                                <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                  Archive User
                                </span>
                              </div>

                              <div className="relative group">
                                <button
                                  onClick={() => {
                                    setSelectedUserForPassword(user);
                                    setIsPasswordModalOpen(true);
                                  }}
                                  className="p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition duration-200"
                                >
                                  <KeyRound size={18} />
                                </button>
                                <span className="absolute -top-4 left-1/2 transform -translate-x-1/5 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                  Update Password
                                </span>
                              </div>
                            </div>
                          )
                        ) : (
                          <button
                            onClick={() => handleRestore(user.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-200 flex align-middle items-center justify-center"
                          >
                            <RotateCcw size={14} className="mr-1" />
                            Restore
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddUser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddUser={handleAddUser}
        availableRoles={availableRoles}
        editingUser={editUserId ? users.find(u => u.id === editUserId) : null}
      />

      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onUpdatePassword={handleUpdatePassword}
        user={selectedUserForPassword}
      />
    </div>
  );
};
export default UsersList;