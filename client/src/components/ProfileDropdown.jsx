import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const ProfileDropdown = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRole = "Admin";

  const handleProfileClick = () => {
    onClose();
    navigate('/profile');
  };

  const handleSignOut = () => {
    dispatch(logout());
    onClose();
    navigate('/login');
  };

  return (
    <div
      className="w-56 bg-gray-800 text-white rounded-lg shadow-lg ring-1 ring-black/10 animate-dropdown"
    >
      <div className="px-4 py-4 border-b border-gray-700">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Signed in as</p>
        <p className="text-base font-medium text-white truncate">{userRole}</p>
      </div>

      <div className="py-1 transition-all">
        <button
          onClick={handleProfileClick}
          className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 ease-in-out hover:scale-[1.01]"
        >
          <User className="h-4 w-4" />
          Your Profile
        </button>
      </div>

      <div className="py-1 border-t border-gray-700 transition-all">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 transition-all duration-200 ease-in-out hover:scale-[1.01]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;