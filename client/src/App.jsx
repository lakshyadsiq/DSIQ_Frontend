import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WorkspaceForm from './pages/WorkspaceCreation';
import ModifyWorkspace from './components/ModifyWorkspace';
import Home from './pages/Home';
import HelpPage from './pages/HelpPage';
import Profile from './components/Profile';
import ViewWorkspacesPage from './pages/ViewWorkspace';
import Dashboard from './components/Dashboard';
import ResetPassword from './pages/ResetPassword';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const dispatch = useDispatch();

  // ✅ Access isLoggedIn from Redux store
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Optional: pass login to children like LoginPage/SignupPage
  const handleLogin = () => {
    dispatch(login());
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Home isLoggedIn={isLoggedIn} /> : <WelcomePage isLoggedIn={isLoggedIn} />}
        >
          {isLoggedIn && (
            <>
              <Route index element={<Dashboard isLoggedIn={isLoggedIn} />} />
              <Route path="viewWorkspace" element={<ViewWorkspacesPage isLoggedIn={isLoggedIn}/>} />
              <Route path="workspaceCreate" element={<WorkspaceForm/>}/>
            </>
          )}
        </Route>

        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/signup" element={<SignupPage onSignUp={handleLogin} />} />
        <Route path="/workspaceCreate" element={isLoggedIn ? <WorkspaceForm /> : <Navigate to="/login" />} />
        <Route
          path="/ModifyWorkspace/:id"
          element={isLoggedIn ? <ModifyWorkspace /> : <Navigate to="/login" />}
        />
        <Route path="/help" element={isLoggedIn ? <HelpPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  );
};

export default App;
