import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorkspaceForm from './pages/WorkspaceCreation';
import ModifyWorkspace from './components/ModifyWorkspace';
import Home from './pages/Home';
import { useAuth } from './contexts/AuthContext';
import HelpPage from './pages/HelpPage';
import Profile from './components/Profile';
import ViewWorkspacesPage from './pages/ViewWorkspace';
import Dashboard from './components/Dashboard';

const App = () => {
  const { isLoggedIn, login } = useAuth();

  return (
    <Router>
      <Routes>
        {/* 🔽 Nest routes under Home layout */}
        <Route
          path="/"
          element={isLoggedIn ? <Home isLoggedIn={isLoggedIn} /> : <WelcomePage isLoggedIn={isLoggedIn} />}
        >
          {isLoggedIn && (
            <>
              <Route index element={<Dashboard isLoggedIn={isLoggedIn}/>} />
              <Route path="viewWorkspace" element={<ViewWorkspacesPage />} />
            </>
          )}
        </Route>

        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/signup" element={<SignupPage onSignUp={login} />} />
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
        <Route path="/help" element={isLoggedIn ? <HelpPage/> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
