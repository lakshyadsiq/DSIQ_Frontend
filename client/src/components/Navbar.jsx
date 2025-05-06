import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';

const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-700">
        DSIQ
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6">
      <Link to="/partners" className="text-gray-700 hover:text-blue-600 font-medium">
          App List
        </Link>
        <Link to="/partners" className="text-gray-700 hover:text-blue-600 font-medium">
          Pricing
        </Link>
        <Link to="/services" className="text-gray-700 hover:text-blue-600 font-medium">
          Services
        </Link>
        <Link to="/partners" className="text-gray-700 hover:text-blue-600 font-medium">
          Partners
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
              Profile
            </Link>
            <Button themeColor="dark" fillMode="solid" size="small">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button themeColor="primary" size="small">Login</Button>
            </Link>
            <Link to="/signup">
              <Button fillMode="outline" size="small">Create Account</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
