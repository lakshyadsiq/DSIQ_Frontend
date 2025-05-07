import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorkspaceForm from './components/WorkspaceForm';
import ModifyWorkspace from './components/ModifyWorkspace';
import HomePage from './pages/Home';
import { ThemeProvider } from './contexts/ThemeContext'

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <HomePage /> : <WelcomePage />
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
    </ThemeProvider>
  );
};

export default App;
