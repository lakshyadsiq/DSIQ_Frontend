import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorkspaceForm from './pages/WorkspaceCreation';
import ModifyWorkspace from './components/ModifyWorkspace';
import HomePage from './pages/Home';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <HomePage isLoggedIn = {isLoggedIn} /> : <WelcomePage isLoggedIn = {isLoggedIn} />
            }
          />
          <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/signup" element={<SignupPage onSignUp={() => setIsLoggedIn(true)} />} />
          <Route path="/workspaceCreate" element={isLoggedIn ? <WorkspaceForm /> : <Navigate to="/login" />} />
          <Route
            path="/ModifyWorkspace"
            element={
              isLoggedIn ? (
                <ModifyWorkspace
                  workspace={{
                    id: 1,
                    name: "Demo Workspace",
                    category: "Clothing",
                    brand: "Zara"
                  }}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
  );
};

export default App;
