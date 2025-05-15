import React, { useState, useEffect } from 'react';

const AddUser = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    joiningDate: '',
    email: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form data when modal opens
      setFormData({
        name: '',
        position: '',
        joiningDate: '',
        email: '',
      });
      
      // Add a class to the body when modal is open to control background opacity
      document.body.style.overflow = 'hidden';
    } else {
      // Remove the class when modal is closed
      document.body.style.overflow = '';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, position, joiningDate, email } = formData;
    if (!name || !position || !joiningDate || !email) {
      alert('Please fill all fields.');
      return;
    }
    onAddUser(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative border border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-white">Add New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-300">
              Role
            </label>
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-300">
              Joining Date
            </label>
            <input
              id="joiningDate"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition duration-200"
            >
              Add New User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;