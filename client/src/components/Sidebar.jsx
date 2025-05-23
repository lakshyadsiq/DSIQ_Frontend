import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import {
  BarChart,
  Briefcase,
  Layers,
  LineChart,
  PieChart,
  Keyboard,
  ChevronDown,
  ChevronRight,
  Cog,
  MessageSquare,
  BookOpen,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Users,
  FileText,
  Zap,
  Clipboard,
  Target,
} from "lucide-react";

const Sidebar = ({ isOpen, selectedApp }) => {
  const [expanded, setExpanded] = useState([]);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const [activeItem, setActiveItem] = useState(null);
  const sidebarRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const expandedHeightsRef = useRef({});
  const subMenuRefs = useRef({});
  const [mainMenuItems, setMainMenuItems] = useState([]);
  const menuItemsRef = useRef([]);

  const handleSectionHover = (section, event) => {
    if (isOpen || !section.isDropdown) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      top: rect.top,
      left: rect.left + rect.width,
    });
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredSection(section);
    }, 150);
  };

  const handleSectionLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredSection(null);
    }, 100);
  };

  const toggleSection = (section) => {
    setExpanded((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    Object.keys(subMenuRefs.current).forEach((key) => {
      if (subMenuRefs.current[key]) {
        expandedHeightsRef.current[key] = subMenuRefs.current[key].scrollHeight || 0;
      }
    });
  }, [expanded, mainMenuItems]);

  // GSAP animations for menu items
  useEffect(() => {
    if (menuItemsRef.current.length > 0) {
      gsap.fromTo(
        menuItemsRef.current,
        {
          opacity: 0,
          x: isOpen ? -20 : 0,
          y: !isOpen ? -20 : 0,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          stagger: 0.05,
          duration: 0.5,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }
  }, [isOpen, mainMenuItems]);

  const getMainMenuItems = () => {
    if (!selectedApp) return [];
    switch (selectedApp.name) {
      case "Digital Shelf iQ":
        return [
          { icon: <BarChart size={18} />, label: "Category Analysis", isDropdown: false, items: [] },
          { icon: <Briefcase size={18} />, label: "Brand Analysis", isDropdown: false, items: [] },
          { icon: <Layers size={18} />, label: "Item Level Analysis", isDropdown: false, items: [] },
          { icon: <LineChart size={18} />, label: "Sponsored AD Tracker", isDropdown: false, items: [] },
          { icon: <PieChart size={18} />, label: "Share of Voice", isDropdown: false, items: [] },
          {
            icon: <Keyboard size={18} />,
            label: "Keyword",
            isDropdown: true,
            items: [{ label: "Keyword Tracker" }, { label: "Keyword Planner" }],
          },
        ];
      case "Shopper iQ":
        return [
          { icon: <MessageSquare size={18} />, label: "Review & Content Minor", isDropdown: false, items: [] },
          { icon: <BookOpen size={18} />, label: "Brand & Category Insights", isDropdown: false, items: [] },
          { icon: <ShoppingBag size={18} />, label: "Ask our AI Chatbot", isDropdown: false, items: [] },
          { icon: <Users size={18} />, label: "Panel Data", isDropdown: false, items: [] },
        ];
      case "Promotion iQ":
        return [
          { icon: <Calendar size={18} />, label: "Promotion Tracker", isDropdown: false, items: [] },
          { icon: <TrendingUp size={18} />, label: "Promotion Planner", isDropdown: false, items: [] },
          { icon: <FileText size={18} />, label: "Activation Partner", isDropdown: false, items: [] },
        ];
      case "Channel AMP":
        return [
          { icon: <BarChart size={18} />, label: "Dashboard", isDropdown: false, items: [] },
          { icon: <Users size={18} />, label: "Profiles", isDropdown: false, items: [] },
          {
            icon: <Target size={18} />,
            label: "Campaign",
            isDropdown: true,
            items: [
              { label: "Ad Groups" },
              { label: "Ads" },
              { label: "Keywords" },
              { label: "Search Terms" },
              { label: "Targets" },
            ],
          },
          { icon: <Zap size={18} />, label: "Automation Rules", isDropdown: false, items: [] },
          { icon: <Clipboard size={18} />, label: "Reporting", isDropdown: false, items: [] },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    setMainMenuItems(getMainMenuItems());
  }, [selectedApp]);

  const bottomMenuItems = [
    {
      icon: <Cog size={22} />,
      label: "App Settings",
      isDropdown: false,
      items: [],
    },
  ];

  return (
    <div className="flex">
      <aside
        ref={sidebarRef}
        className={`
          ${isOpen ? "w-64" : "w-16"}
          h-full flex flex-col flex-shrink-0 bg-white text-dark-gray
          overflow-hidden overflow-y-auto transition-all duration-300 ease-in-out relative z-10
          shadow-lg border-r border-gray-200
        `}
        style={{
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Logo */}
        <div className="p-4 h-[64px] border-b border-gray-200 hover:bg-peach flex items-center justify-center relative">
          <div
            className={`
              absolute inset-0 flex items-center justify-center
              transition-all duration-300 ease-in-out
              ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5 pointer-events-none"}
            `}
            style={{
              transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <img src="./1.png" alt="Full Logo" className="h-33 w-auto" />
          </div>
          <div
            className={`
              transition-all duration-300 ease-in-out
              ${!isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5 pointer-events-none"}
            `}
            style={{
              transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <img src="./icon.png" alt="Logo Icon" className="h-10 w-10" />
          </div>
        </div>

        {/* Main Menu */}
        <div className="py-1 flex-grow">
          <div className="mb-1 py-1">
            {mainMenuItems.map((item, index) => (
              <div key={index} ref={(el) => (menuItemsRef.current[index] = el)}>
                {isOpen ? (
                  <>
                    <div
                      className={`
                        relative flex items-center justify-between px-4 py-2 cursor-pointer text-sm font-medium text-gray-600
                        hover:bg-peach rounded mx-2 group
                        ${
                          activeItem === item.label ||
                          (item.isDropdown && item.items.some((sub) => activeItem === `${item.label}-${sub.label}`))
                            ? "bg-peach"
                            : ""
                        }
                        transition-all duration-200 ease-in-out
                      `}
                      onClick={() => (item.isDropdown ? toggleSection(item.label) : handleItemClick(item.label))}
                    >
                      {(activeItem === item.label ||
                        (item.isDropdown && item.items.some((sub) => activeItem === `${item.label}-${sub.label}`))) && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-primary-orange rounded-r"></div>
                      )}
                      <div
                        className={`
                        flex items-center p-2
                        transition-all duration-300 ease-in-out
                      `}
                      >
                        <span className="mr-2 transition-transform duration-200 ease-in-out group-hover:scale-110 text-primary-orange">
                          {item.icon}
                        </span>
                        <span className="transition-transform duration-200 ease-in-out group-hover:translate-x-1">
                          {item.label}
                        </span>
                      </div>
                      {item.isDropdown && (
                        <div className="transition-transform duration-200 ease-in-out text-gray-500">
                          {expanded.includes(item.label) ? (
                            <ChevronDown
                              size={16}
                              className="transition-transform duration-300 ease-in-out transform rotate-0"
                            />
                          ) : (
                            <ChevronRight
                              size={16}
                              className="transition-transform duration-300 ease-in-out transform rotate-0"
                            />
                          )}
                        </div>
                      )}
                    </div>
                    {item.isDropdown && (
                      <div
                        ref={(el) => (subMenuRefs.current[item.label] = el)}
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: expanded.includes(item.label)
                            ? `${expandedHeightsRef.current[item.label] || 1000}px`
                            : "0px",
                          opacity: expanded.includes(item.label) ? 1 : 0,
                          transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
                        }}
                      >
                        <div className="mt-1">
                          {item.items.map((subItem, subIndex) => (
                            <div
                              key={subIndex}
                              className="relative"
                              style={{
                                transform: expanded.includes(item.label) ? "translateY(0)" : "translateY(-10px)",
                                opacity: expanded.includes(item.label) ? 1 : 0,
                                transition: `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${subIndex * 0.05}s, opacity 0.3s ease ${subIndex * 0.05}s`,
                              }}
                            >
                              {activeItem === `${item.label}-${subItem.label}` && (
                                <div className="absolute left-0 top-0 h-full w-1 bg-primary-orange rounded-r"></div>
                              )}
                              <div
                                className={`
                                  pl-12 pr-4 py-2 text-gray-600 hover:bg-peach cursor-pointer flex items-center group
                                  transition-all duration-200 ease-in-out
                                `}
                                onClick={() => handleItemClick(item.label, subItem.label)}
                              >
                                <span className="transition-transform duration-200 ease-in-out group-hover:translate-x-1">
                                  {subItem.label}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="flex flex-col items-center py-1 relative"
                    onMouseEnter={(e) => handleSectionHover(item, e)}
                    onMouseLeave={handleSectionLeave}
                  >
                    {(activeItem === item.label ||
                      (item.isDropdown && item.items.some((sub) => activeItem === `${item.label}-${sub.label}`))) && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-primary-orange rounded-r"></div>
                    )}
                    <div
                      className={`
                        p-2 rounded-md group
                        ${
                          activeItem === item.label ||
                          (item.isDropdown && item.items.some((sub) => activeItem === `${item.label}-${sub.label}`))
                            ? "bg-peach"
                            : "hover:bg-peach"
                        }
                        cursor-pointer my-1
                        transition-all duration-200 ease-in-out
                        ${!isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
                      `}
                      style={{
                        transition:
                          "background-color 0.2s ease, opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                      title={item.label}
                      onClick={() => !item.isDropdown && handleItemClick(item.label)}
                    >
                      <div className="transition-transform duration-200 ease-in-out group-hover:scale-110 text-primary-orange">
                        {item.icon}
                      </div>
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
            <div key={index} ref={(el) => (menuItemsRef.current[mainMenuItems.length + index] = el)}>
              {isOpen ? (
                <div
                  className={`
                    relative flex items-center px-4 py-2 cursor-pointer text-sm font-medium text-gray-700
                    hover:bg-peach rounded mx-2 group
                    ${activeItem === item.label ? "bg-peach" : ""}
                    transition-all duration-200 ease-in-out
                  `}
                  onClick={() => handleItemClick(item.label)}
                >
                  {activeItem === item.label && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary-orange rounded-r"></div>
                  )}
                  <div
                    className={`
                    flex items-center p-2
                    transition-all duration-300 ease-in-out
                  `}
                  >
                    <span className="mr-2 transition-transform duration-200 ease-in-out group-hover:scale-110 text-primary-orange">
                      {item.icon}
                    </span>
                    <span className="transition-transform duration-200 ease-in-out group-hover:translate-x-1">
                      {item.label}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center py-1 relative"
                  onMouseEnter={(e) => handleSectionHover(item, e)}
                  onMouseLeave={handleSectionLeave}
                >
                  {activeItem === item.label && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary-orange rounded-r"></div>
                  )}
                  <div
                    className={`
                      p-2 rounded-md group
                      ${activeItem === item.label ? "bg-peach" : "hover:bg-peach"}
                      cursor-pointer my-1
                      transition-all duration-200 ease-in-out
                      ${!isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
                    `}
                    style={{
                      transition:
                        "background-color 0.2s ease, opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    title={item.label}
                    onClick={() => handleItemClick(item.label)}
                  >
                    <div className="transition-transform duration-200 ease-in-out group-hover:scale-110 text-primary-orange">
                      {item.icon}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Hover Popover for collapsed sidebar */}
      {!isOpen && hoveredSection && hoveredSection.isDropdown && (
        <div
          className="fixed bg-white text-dark-gray rounded shadow-lg z-50 py-2 min-w-[200px] border border-gray-200 animate-fadeIn"
          style={{
            top: `${hoverPosition.top}px`,
            left: `${hoverPosition.left + 1}px`,
          }}
          onMouseEnter={() => setHoveredSection(hoveredSection)}
          onMouseLeave={handleSectionLeave}
        >
          <div className="px-4 py-2 text-primary-orange font-medium text-sm border-b border-gray-200">
            {hoveredSection.label}
          </div>
          <div className="mt-1">
            {hoveredSection.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className={`px-4 py-2 hover:bg-peach cursor-pointer flex items-center relative group
                  ${activeItem === `${hoveredSection.label}-${item.label}` ? "bg-peach" : ""}
                `}
                style={{
                  animation: `slideIn 0.3s ease-out ${itemIndex * 0.05}s both`,
                }}
                onClick={() => handleItemClick(hoveredSection.label, item.label)}
              >
                {activeItem === `${hoveredSection.label}-${item.label}` && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-primary-orange rounded-r"></div>
                )}
                <span className="transition-transform duration-200 ease-in-out group-hover:translate-x-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateX(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateX(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;