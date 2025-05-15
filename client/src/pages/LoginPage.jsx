import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('idle');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
  
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
  
    console.log('Dispatching loginUser...');
    const resultAction = await dispatch(loginUser({ email, password }));
  
    console.log('Result Action:', resultAction);
  
    if (loginUser.fulfilled.match(resultAction)) {
      console.log('Login successful, navigating...');
      navigate('/');
    } else {
      console.log('Login failed or not fulfilled:', resultAction);
    }
  };

  const handleResetSubmit = () => {
    if (!resetEmail) {
      toast.error('Please enter your email.');
      return;
    }

    setResetStatus('sending');

    setTimeout(() => {
      setResetStatus('sent');
      toast.success(`Reset link sent to ${resetEmail}`);
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-white px-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src="/icon.png" alt="DSIQ Logo" className="h-16 w-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Welcome to DSIQ</h2>
          <p className="text-gray-600 mt-2">
            {showReset ? 'Reset your password' : 'Sign in to your account'}
          </p>
        </div>

        {showReset ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="w-full"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.value);
                  setResetStatus('idle');
                }}
                disabled={resetStatus === 'sent'}
              />
            </div>

            <button
              onClick={handleResetSubmit}
              disabled={resetStatus !== 'idle'}
              className={`w-full py-2 px-4 text-white font-semibold rounded-md transition ${
                resetStatus === 'sending'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : resetStatus === 'sent'
                  ? 'bg-green-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {resetStatus === 'sending'
                ? 'Sending...'
                : resetStatus === 'sent'
                ? 'Link Sent!'
                : 'Send Reset Link'}
            </button>

            <button
              onClick={() => {
                setShowReset(false);
                setResetStatus('idle');
              }}
              className="mt-4 w-full text-sm text-indigo-600 hover:underline"
            >
              Return to Login
            </button>
          </>
        ) : (
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full"
                value={formData.email}
                onChange={handleLoginChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full !pr-10"
                  value={formData.password}
                  onChange={handleLoginChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="!h-5 !w-5" />
                  ) : (
                    <Eye className="!h-5 !w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              primary
              type="submit"
              className="w-full !bg-indigo-600 !text-white hover:!bg-indigo-700 mb-4"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>

            <div className="text-center text-sm text-gray-500 mt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowReset(true);
                  setResetStatus('idle');
                }}
                className="text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
              <a href="/register" className="text-indigo-600 hover:underline">
                Create account
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;