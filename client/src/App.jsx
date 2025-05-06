import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorkspaceForm from './components/WorkspaceForm';
import ModifyWorkspace from './components/ModifyWorkspace';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/workspaceCreate" element={<WorkspaceForm />} />
        <Route
          path="/ModifyWorkspace"
          element={
            <ModifyWorkspace
              workspace={{
                id: 1,
                name: "Demo Workspace",
                category: "Clothing",
                brand: "Zara"
              }}
            />
          }
        />

      </Routes>
    </Router>
  );
};

export default App;
