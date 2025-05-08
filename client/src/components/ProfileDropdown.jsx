import React from 'react';
import { LogOut, User, Settings as SettingsIcon } from 'lucide-react';

const ProfileDropdown = ({ onClose }) => {
  return (
    <>
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">Signed in as</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">user@example.com</p>
      </div>
      <div className="py-1">
        <a
          href="#"
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <User className="mr-3 h-4 w-4" />
          Your Profile
        </a>
      </div>
      <div className="py-1 border-t border-gray-200 dark:border-gray-700">
        <a
          href="#"
          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </a>
      </div>
    </>
  );
};

export default ProfileDropdown;