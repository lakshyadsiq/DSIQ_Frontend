import React from 'react';

const SidebarMenuItem = ({
  icon,
  label,
  isActive = false
}) => {
  return (
    <div
      className={`flex items-center px-6 py-2.5 text-gray-200 hover:bg-gray-700 transition-colors duration-200 cursor-pointer ${isActive ? 'bg-gray-700' : ''}`}
    >
      <span className="mr-3 text-gray-400">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default SidebarMenuItem;
