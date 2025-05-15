import React, { useState } from 'react';
import { Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddUser from '../components/AddUser';

const UsersList = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'johndoe@example.com', position: 'Web Developer'},
    { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', position: 'UX Designer'},
    { id: 3, name: 'Michael Brown', email: 'michaelbrown@example.com', position: 'Project Manager'},
    { id: 4, name: 'Emily Clark', email: 'emilyclark@example.com', position: 'Software Engineer'},
  ]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();


  const handleAddUser = (newUser) => {
    const newId = users.length ? Math.max(...users.map(emp => emp.id)) + 1 : 1;
    const userToAdd = {
      id: newId,
      ...newUser,
    };
    setUsers((prev) => [...prev, userToAdd]);
    setIsModalOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col p-6 bg-gray-900 h-screen relative">
      <button
        onClick={handleBack}
        className="flex items-center mb-4 text-blue-400 hover:text-blue-300 transition duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform duration-200 hover:translate-x-1" />
        <span>Back to Dashboard</span>
      </button>
      <h1 className="text-2xl font-bold mb-4 text-white">User List</h1>
      <div className="bg-gray-800 rounded-lg shadow-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">All Users</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-200"
          >
            Add New User
          </button>
        </div>
        <div className="mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md mr-2 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'} transition duration-200`}
          >
            Total User
          </button>
        </div>
        <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-gray-300">Name</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-gray-300">Email</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-gray-300">Position</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700 transition duration-200">
                <td className="py-2 px-4 border-b border-gray-700 text-gray-100">{user.name}</td>
                <td className="py-2 px-4 border-b border-gray-700 text-gray-100">{user.email}</td>
                <td className="py-2 px-4 border-b border-gray-700 text-gray-100">{user.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddUser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default UsersList;

