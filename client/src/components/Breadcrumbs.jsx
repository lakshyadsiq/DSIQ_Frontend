import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  
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

  // If we're on the root path
  if (pathSegments.length === 0) {
    return (
      <nav className="flex px-5 py-3 text-gray-300 bg-gray-800">
        <ol className="flex items-center space-x-1 md:space-x-3">
          <li className="flex items-center">
            <span className="text-sm font-medium text-gray-300">Dashboard</span>
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav className="flex px-5 py-3 text-gray-300 bg-gray-800">
      <ol className="flex items-center space-x-1 md:space-x-3">
        {/* Home link is always present */}
        <li className="flex items-center">
          <Link to="/" className="text-sm font-medium text-blue-400 hover:text-blue-300">
            Dashboard
          </Link>
        </li>

        {/* Generate breadcrumb items for each path segment */}
        {pathSegments.map((segment, index) => {
          // For path segments that include IDs (like ModifyWorkspace/123)
          if (segment.match(/^\d+$/) && index > 0 && pathSegments[index - 1] === 'ModifyWorkspace') {
            return (
              <li key={index} className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-500" />
                <span className="ml-1 text-sm font-medium text-gray-300">
                  {`Workspace ${segment}`}
                </span>
              </li>
            );
          }

          // Build the path up to the current segment for the link
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          
          // Determine if this is the last segment
          const isLast = index === pathSegments.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-500" />
              {isLast ? (
                <span className="ml-1 text-sm font-medium text-gray-300">
                  {pathNames[segment] || segment}
                </span>
              ) : (
                <Link to={path} className="ml-1 text-sm font-medium text-blue-400 hover:text-blue-300">
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