import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const ProfileDropdown = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRole = "Admin";

  const handleSignOut = () => {
    dispatch(logout());
    onClose();
    navigate('/login');
  };

  const menuItems = [
    {
      icon: <User size={16} className="text-gray" />,
      label: "Your Profile",
      action: () => {
        onClose();
        navigate('/profile');
      }
    },
    {
      icon: <LogOut size={16} className="text-danger-red" />,
      label: "Sign Out",
      action: handleSignOut
    }
  ];

  return (
    <div className="bg-white rounded-md w-56">
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-light-gray bg-cream">
        <p className="text-xs text-gray uppercase">Signed in as</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-medium text-dark-gray">{userRole}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`flex items-center justify-between w-full px-4 py-3 text-sm text-left ${
              item.label === "Sign Out" 
                ? "text-danger-red hover:bg-peach" 
                : "text-dark-gray hover:bg-peach"
            } transition-colors`}
          >
            <div className="flex items-center space-x-3">
              <span className="flex items-center justify-center">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>
            {item.label !== "Sign Out" && (
              <ChevronRight size={16} className="text-gray" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileDropdown;