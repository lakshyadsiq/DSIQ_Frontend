import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Link } from 'react-router-dom';

const DemoHomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Demo App</h1>
      <p className="text-gray-600 mb-8">Choose an option to continue:</p>
      <div className="space-x-4">
        <Link to="/login">
          <Button primary={true}>Login</Button>
        </Link>
        <Link to="/signup">
          <Button>Sign Up</Button>
        </Link>
        <Link to="/workspaceCreate">
          <Button>Create Workspace</Button>
        </Link>
        <Link to="/ModifyWorkspace">
          <Button>Modify Workspace</Button>
        </Link>
      </div>
    </div>
  );
};

export default DemoHomePage;
