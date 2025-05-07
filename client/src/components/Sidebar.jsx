import React, { useState } from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { BarChart, Briefcase, Layers, LineChart, PieChart, Keyboard, Box } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const [expanded, setExpanded] = useState([]);

  const toggleSection = (section) => {
    setExpanded(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const menuSections = [
    {
      title: 'Menu',
      items: [
        { icon: <BarChart size={18} />, label: 'Category Analysis' },
        { icon: <Briefcase size={18} />, label: 'Brand Analysis' },
        { icon: <Layers size={18} />, label: 'Item Level Analysis' },
        { icon: <LineChart size={18} />, label: 'Sponsored AD Tracker' },
        { icon: <PieChart size={18} />, label: 'Share of Voice' },
        { icon: <Keyboard size={18} />, label: 'Keyboard' },
      ]
    },
    {
      title: 'Plans',
      items: [
        { icon: <BarChart size={18} />, label: 'Plan 1' },
        { icon: <BarChart size={18} />, label: 'Plan 2' },
        { icon: <BarChart size={18} />, label: 'plan 3' },
      ]
    }
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-0'} h-full flex-shrink-0 bg-gray-600 dark:bg-gray-800 text-white overflow-y-auto transition-all duration-300`}>
      <div className="p-4 border-b border-gray-500 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Box size={24} className="text-gray-300" />
          <span className="text-xl font-semibold text-gray-200">Logo</span>
        </div>
      </div>
      <div className="py-4">
        {menuSections.map((section, index) => (
          <div key={index} className="mb-6">
            <div
              className="px-6 py-2 text-gray-300 font-medium text-sm"
              onClick={() => toggleSection(section.title)}
            >
              {section.title}
            </div>
            <div className="mt-2">
              {section.items.map((item, itemIndex) => (
                <SidebarMenuItem
                  key={itemIndex}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
