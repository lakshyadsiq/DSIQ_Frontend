import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/SignupPage';
import WorkspaceForm from './pages/WorkspaceCreation';
import ModifyWorkspace from './components/ModifyWorkspace';
import Home from './pages/Home';
import HelpPage from './pages/HelpPage';
import Profile from './components/Profile';
import ViewWorkspacesPage from './pages/ViewWorkspace';
import Dashboard from './components/Dashboard';
import ResetPassword from './pages/ResetPassword';
import { Toaster } from 'react-hot-toast';
import UsersList from './pages/UsersList';
import SettingsPage from './pages/SettingsPage'
import WorkspaceDetailsPage from './pages/WorkspaceDetailsPage'

const App = () => {
  const dispatch = useDispatch();

  // ✅ Access isLoggedIn from Redux store
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // State to track if at least one workspace exists
  const [hasWorkspace, setHasWorkspace] = useState(false);

  useEffect(() => {
    // Check localStorage for the workspace flag
    const workspaceFlag = localStorage.getItem('hasWorkspace', 'false');
    if (workspaceFlag === 'true') {
      setHasWorkspace(true);
    }
  }, []);


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
              <Route path="viewWorkspace" element={<ViewWorkspacesPage isLoggedIn={isLoggedIn} />} />
              {/* Conditionally render WorkspaceForm based on hasWorkspace flag */}
              {hasWorkspace && <Route path="workspaceCreate" element={<WorkspaceForm hasWorkspace={hasWorkspace} setHasWorkspace={setHasWorkspace}  isLoggedIn={isLoggedIn} />} />}
              <Route path="viewUsersList" element={<UsersList />} />
              {/* Adding nested routes for profile and help to work with breadcrumbs */}
              <Route path="profile" element={<Profile isLoggedIn={isLoggedIn} />} />
              <Route path="ModifyWorkspace/:id" element={<ModifyWorkspace isLoggedIn={isLoggedIn} />} />
              <Route path="workspace/:id" element={<WorkspaceDetailsPage />} />
            </>
          )}
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* These routes are now nested inside the Home layout */}
        {/* We still keep these routes for direct access but they should redirect to nested routes */}
        <Route path="/workspaceCreate" element={isLoggedIn ? <WorkspaceForm hasWorkspace={hasWorkspace} setHasWorkspace={setHasWorkspace}  isLoggedIn={isLoggedIn} /> : <Navigate to="/login" />} />
        {/* <Route path="/ModifyWorkspace/:id" element={isLoggedIn ? <Navigate to={<ModifyWorkspace isLoggedIn={isLoggedIn} />} /> : <Navigate to="/login" />} /> */}
        <Route path="/help" element={isLoggedIn ? <HelpPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isLoggedIn ? <SettingsPage /> : <Navigate to="/login" />} />
        {/* <Route path="/viewUsersList" element={<UsersList/>}/> */}

      </Routes>
      <Toaster position="bottom-right" />
    </Router>
  );
};

export default App;