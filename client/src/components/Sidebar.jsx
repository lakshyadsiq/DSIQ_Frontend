import React, { useState } from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { 
  BarChart, Briefcase, PiggyBank, Layers, LineChart, 
  LayoutList, PieChart, Keyboard, ChevronDown, ChevronRight,
  Settings
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const [expanded, setExpanded] = useState(['Menu', 'Plans']);

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
      icon: <LayoutList size={20} />,
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
      icon: <PiggyBank size={20} />,
      items: [
        { icon: <BarChart size={18} />, label: 'Plan 1' },
        { icon: <BarChart size={18} />, label: 'Plan 2' },
        { icon: <BarChart size={18} />, label: 'Plan 3' },
      ]
    }
  ];

  const bottomMenuItems = [
    { icon: <Settings size={18} />, label: 'Settings' },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-16'} h-full flex flex-col flex-shrink-0 bg-[#2F2A44] text-white overflow-y-auto transition-all duration-300`}>
      {/* Logo Section */}
      <div className="p-4 h-16 border-b border-[#4A4561] flex items-center justify-center relative">
        {isOpen ? (
          <img 
            src="./1.png" 
            alt="Full Logo" 
            className="h-28 w-auto absolute top-8 left-28 transform -translate-x-1/2 -translate-y-1/2"
          />
        ) : (
          <img 
            src="./icon.png" 
            alt="Logo Icon" 
            className="h-8 w-8" 
          />
        )}
      </div>

      {/* Main Menu Sections */}
      <div className="py-2 flex-grow">
        {menuSections.map((section, index) => (
          <div key={index} className="mb-1">
            {isOpen ? (
              <>
                <div
                  className="px-4 py-2 text-[#A3A1B1] font-medium text-sm cursor-pointer flex items-center justify-between hover:bg-[#3D3850] rounded mx-2"
                  onClick={() => toggleSection(section.title)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{section.icon}</span>
                    <span>{section.title}</span>
                  </div>
                  {expanded.includes(section.title) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
                {expanded.includes(section.title) && (
                  <div className="mt-1">
                    {section.items.map((item, itemIndex) => (
                      <SidebarMenuItem
                        key={itemIndex}
                        icon={item.icon}
                        label={item.label}
                        isOpen={isOpen}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center py-1">
                <div 
                  className="p-2 rounded-md hover:bg-[#1E1A2E] hover:text-white cursor-pointer my-1 transition-colors duration-200"
                  title={section.title}
                >
                  {section.icon}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Menu Items */}
      <div className="pb-4 border-t border-[#4A4561] pt-2">
        {bottomMenuItems.map((item, index) => (
          <div key={index}>
            {isOpen ? (
              <SidebarMenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                isOpen={isOpen}
              />
            ) : (
              <div className="flex flex-col items-center py-1">
                <div 
                  className="p-2 rounded-md hover:bg-[#1E1A2E] hover:text-white cursor-pointer my-1 transition-colors duration-200"
                  title={item.label}
                >
                  {item.icon}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;