import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Users } from 'lucide-react';
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
    <div className="bg-gray-900 text-white rounded shadow-lg w-48 md:w-56 lg:w-55 transition-all">
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="text-xs md:text-sm text-gray-400 uppercase">SIGNED IN AS</p>
        <p className="text-sm md:text-base font-medium">Admin</p>
      </div>
      
      <div className="border-b border-gray-800">
        <button
          onClick={handleProfileClick}
          className="flex items-center w-full gap-3 px-4 py-3 text-sm md:text-base hover:bg-gray-800 transition-colors"
        >
          <User className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          Your Profile
        </button>
      </div>
      
      <div>
        <button
          onClick={handleSignOut}
          className="flex items-center w-full gap-3 px-4 py-3 text-sm md:text-base text-red-400 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-4 w-4 md:h-5 md:w-5" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;