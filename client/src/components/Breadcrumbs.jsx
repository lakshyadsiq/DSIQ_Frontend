import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';

const Breadcrumbs = () => {
  const location = useLocation();
  const breadcrumbsRef = useRef(null);
  const itemsRef = useRef([]);

  // Get the current path and split it into segments
  const pathSegments = location.pathname.split('/').filter(segment => segment);

  // Map of path segments to user-friendly names
  const pathNames = {
    '': 'Dashboard',
    'viewWorkspace': 'Workspaces',
    'workspaceCreate': 'Create Workspace',
    'ModifyWorkspace': 'Edit Workspace',
    'profile': 'Profile',
  };

  useEffect(() => {
    if (breadcrumbsRef.current) {
      gsap.fromTo(
        breadcrumbsRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    }

    if (itemsRef.current.length > 0) {
      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: 'power2.out',
          delay: 0.3,
        }
      );
    }
  }, [pathSegments]);

  if (pathSegments.length === 0) {
    return (
      <nav ref={breadcrumbsRef} className="flex px-5 py-3 bg-peach">
        <ol className="flex items-center">
          <li ref={el => itemsRef.current[0] = el} className="flex items-center">
            <span className="text-small font-medium text-dark-gray">Dashboard</span>
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav ref={breadcrumbsRef} className="flex px-5 py-3 bg-peach">
      <ol className="flex items-center space-x-2">
        {/* Home link is always present */}
        <li ref={el => itemsRef.current[0] = el} className="flex items-center">
          <Link 
            to="/" 
            className="text-small font-medium text-primary-orange hover:text-accent-magenta transition-colors duration-200"
          >
            Dashboard
          </Link>
        </li>

        {/* Generate breadcrumb items for each path segment */}
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;

          // Handle numeric IDs after ModifyWorkspace
          if (segment.match(/^\d+$/) && index > 0 && pathSegments[index - 1] === 'ModifyWorkspace') {
            return (
              <li key={index} ref={el => itemsRef.current[index + 1] = el} className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray" />
                <span className="ml-2 text-small font-medium text-dark-gray">
                  {`Workspace ${segment}`}
                </span>
              </li>
            );
          }

          return (
            <li key={index} ref={el => itemsRef.current[index + 1] = el} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray" />
              {isLast ? (
                <span className="ml-2 text-small font-medium text-dark-gray">
                  {pathNames[segment] || segment}
                </span>
              ) : (
                <Link 
                  to={path} 
                  className="ml-2 text-small font-medium text-primary-orange hover:text-accent-magenta transition-colors duration-200"
                >
                  {pathNames[segment] || segment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
