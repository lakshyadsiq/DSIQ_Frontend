import React, { useState, useRef, useEffect } from 'react';
import {
  BarChart, Briefcase, PiggyBank, Layers, LineChart,
  PieChart, Keyboard, ChevronDown, ChevronRight,
  Settings
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const [expanded, setExpanded] = useState(['Keyword']);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const [activeItem, setActiveItem] = useState(null);
  const sidebarRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Only show hover popover for items with subitems
  const handleSectionHover = (section, event) => {
    if (isOpen || !section.isDropdown) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      top: rect.top,
      left: rect.left + rect.width
    });
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredSection(section);
    }, 150);
  };

  const handleSectionLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredSection(null);
  };

  const toggleSection = (section) => {
    setExpanded(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleItemClick = (item, subItem = null) => {
    if (subItem) {
      setActiveItem(`${item}-${subItem}`);
    } else {
      setActiveItem(item);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setHoveredSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const mainMenuItems = [
    {
      icon: <BarChart size={18} />,
      label: 'Category Analysis',
      isDropdown: false,
      items: []
    },
    {
      icon: <Briefcase size={18} />,
      label: 'Brand Analysis',
      isDropdown: false,
      items: []
    },
    {
      icon: <Layers size={18} />,
      label: 'Item Level Analysis',
      isDropdown: false,
      items: []
    },
    {
      icon: <LineChart size={18} />,
      label: 'Sponsored AD Tracker',
      isDropdown: false,
      items: []
    },
    {
      icon: <PieChart size={18} />,
      label: 'Share of Voice',
      isDropdown: false,
      items: []
    },
    {
      icon: <Keyboard size={18} />,
      label: 'Keyword',
      isDropdown: true,
      items: [
        { label: 'Keyword Tracker' },
        { label: 'Keyword Planner' }
      ]
    },
  ];

  const bottomMenuItems = [
    {
      icon: <Settings size={18} />,
      label: 'Settings',
      isDropdown: false,
      items: []
    },
  ];

  return (
    <div className="flex">
      <aside
        ref={sidebarRef}
        className={`${isOpen ? 'w-64' : 'w-16'} h-full flex flex-col flex-shrink-0 bg-[#2F2A44] text-white overflow-y-auto transition-all duration-300 relative z-10`}
      >
        {/* Logo */}
        <div className="p-4 h-[64px] border-b border-[#4A4561] flex items-center justify-center relative">
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

        {/* Main Menu */}
        <div className="py-1 flex-grow">
          <div className="mb-1 py-1">
            {mainMenuItems.map((item, index) => (
              <div key={index}>
                {isOpen ? (
                  <>
                    <div
                      className={`relative flex items-center justify-between px-4 py-2 cursor-pointer text-sm font-medium text-[#A3A1B1] hover:bg-[#3D3850] rounded mx-2
                        ${activeItem === item.label || (item.isDropdown && item.items.some(sub => activeItem === `${item.label}-${sub.label}`)) ? 'bg-[#3D3850]' : ''}
                      `}
                      onClick={() => item.isDropdown ? toggleSection(item.label) : handleItemClick(item.label)}
                    >
                      {/* Vertical bar for active main item or any active subitem */}
                      {(activeItem === item.label || (item.isDropdown && item.items.some(sub => activeItem === `${item.label}-${sub.label}`))) && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></div>
                      )}
                      <div className="flex items-center p-2">
                        <span className="mr-2">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.isDropdown &&
                        (expanded.includes(item.label) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        ))}
                    </div>
                    {item.isDropdown && expanded.includes(item.label) && (
                      <div className="mt-1">
                        {item.items.map((subItem, subIndex) => (
                          <div key={subIndex} className="relative">
                            {/* Vertical bar for active subitem */}
                            {activeItem === `${item.label}-${subItem.label}` && (
                              <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></div>
                            )}
                            <div
                              className="pl-12 pr-4 py-2 text-[#A3A1B1] hover:bg-[#3D3850] cursor-pointer flex items-center"
                              onClick={() => handleItemClick(item.label, subItem.label)}
                            >
                              <span>{subItem.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="flex flex-col items-center py-1 relative"
                    onMouseEnter={(e) => handleSectionHover(item, e)}
                    onMouseLeave={handleSectionLeave}
                  >
                    {/* Vertical bar for active main item or any active subitem */}
                    {(activeItem === item.label || (item.isDropdown && item.items.some(sub => activeItem === `${item.label}-${sub.label}`))) && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></div>
                    )}
                    <div
                      className={`p-2 rounded-md ${activeItem === item.label || (item.isDropdown && item.items.some(sub => activeItem === `${item.label}-${sub.label}`)) ? 'bg-[#3D3850]' : 'hover:bg-[#3D3850]'} cursor-pointer my-1`}
                      title={item.label}
                      onClick={() => !item.isDropdown && handleItemClick(item.label)}
                    >
                      {item.icon}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="pb-4">
          {bottomMenuItems.map((item, index) => (
            <div key={index}>
              {isOpen ? (
                <div
                  className={`relative flex items-center px-4 py-2 cursor-pointer text-sm font-medium text-[#A3A1B1] hover:bg-[#3D3850] rounded mx-2 ${activeItem === item.label ? 'bg-[#3D3850]' : ''}`}
                  onClick={() => handleItemClick(item.label)}
                >
                  {/* Vertical bar for active settings */}
                  {activeItem === item.label && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></div>
                  )}
                  <div className="flex items-center p-2">
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center py-1 relative"
                  onMouseEnter={(e) => handleSectionHover(item, e)}
                  onMouseLeave={handleSectionLeave}
                >
                  {/* Vertical bar for active settings */}
                  {activeItem === item.label && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></div>
                  )}
                  <div
                    className={`p-2 rounded-md ${activeItem === item.label ? 'bg-[#3D3850]' : 'hover:bg-[#3D3850]'} cursor-pointer my-1`}
                    title={item.label}
                    onClick={() => handleItemClick(item.label)}
                  >
                    {item.icon}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Hover Popover for collapsed sidebar: only for items with subitems */}
      {!isOpen && hoveredSection && hoveredSection.isDropdown && (
        <div
          className="fixed bg-[#2F2A44] text-white rounded shadow-lg z-50 py-2 min-w-[200px] border border-[#4A4561]"
          style={{
            top: `${hoverPosition.top}px`,
            left: `${hoverPosition.left + 1}px`,
          }}
          onMouseEnter={() => setHoveredSection(hoveredSection)}
          onMouseLeave={handleSectionLeave}
        >
          <div className="px-4 py-2 text-[#A3A1B1] font-medium text-sm border-b border-[#4A4561]">
            {hoveredSection.label}
          </div>
          <div className="mt-1">
            {hoveredSection.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className={`px-4 py-2 hover:bg-[#3D3850] cursor-pointer flex items-center relative
                  ${activeItem === `${hoveredSection.label}-${item.label}` ? 'bg-[#3D3850]' : ''}
                `}
                onClick={() => handleItemClick(hoveredSection.label, item.label)}
              >
                {/* Vertical bar for active subitem in hover popover */}
                {activeItem === `${hoveredSection.label}-${item.label}` && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r"></div>
                )}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
