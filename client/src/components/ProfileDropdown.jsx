import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const ProfileDropdown = ({ onClose }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    onClose();           // Close the dropdown
    navigate('/profile'); // Navigate to the profile page
  };

  return (
    <>
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">Signed in as</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">user@example.com</p>
      </div>

      <div className="py-1">
        <button
          onClick={handleProfileClick}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <User className="mr-3 h-4 w-4" />
          Your Profile
        </button>
      </div>

      <div className="py-1 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            onClose();
            navigate('/login'); 
          }}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );
};

export default ProfileDropdown;
