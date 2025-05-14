import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const ProfileDropdown = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Optional: fetch user email from Redux if stored
  // const userEmail = useSelector((state) => state.auth.user?.email || "user@example.com");
  const userEmail = "user@example.com"; // fallback if not stored

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
    <>
      <div className="px-4 py-3 border-b border-gray-700">
        <p className="text-sm font-medium text-white">Signed in as</p>
        <p className="text-sm text-gray-400 truncate">{userEmail}</p>
      </div>

      <div className="py-1">
        <button
          onClick={handleProfileClick}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
        >
          <User className="mr-3 h-4 w-4" />
          Your Profile
        </button>
      </div>

      <div className="py-1 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );
};

export default ProfileDropdown;
