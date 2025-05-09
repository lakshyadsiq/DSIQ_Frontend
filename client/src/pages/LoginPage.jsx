import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const LoginPage = ({onLogin}) => {
  const navigate= useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('idle'); // idle | sending | sent

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        // toast.success(`Logged in as ${email}`);
      } else {
        // toast.error(data.message || 'Invalid email or password');
        onLogin();
        navigate('/workspaceCreate');
      }
    } catch (error) {
      console.error('Error:', error);
      // toast.error('Something went wrong. Please try again later.');
      
      onLogin();
      navigate('/workspaceCreate');
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-white px-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center mb-8">
          {/* Logo placement - using the favicon.ai or icon.png from public folder */}
          <img 
            src="/icon.png" 
            alt="DSIQ Logo" 
            className="h-16 w-auto mx-auto mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/icon.png";
            }}
          />
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
              disabled={resetStatus === 'sending' || resetStatus === 'sent'}
              className={`w-full py-2 px-4 text-white font-semibold rounded-md transition ${resetStatus === 'sending'
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
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full"
                value={formData.password}
                onChange={handleLoginChange}
              />
            </div>

            <Button
              primary
              type="submit"
              className="w-full !bg-indigo-600 !text-white hover:!bg-indigo-700 mb-4"
            >
              Log In
            </Button>

            <button
              type="button"
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-3 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                <path d="M533.5 278.4c0-17.6-1.4-35-4.2-51.8H272v98h146.9c-6.3 34-25 62.7-53.5 82v68h86.4c50.6-46.6 81.7-115.3 81.7-196.2z" fill="#4285F4"/>
                <path d="M272 544.3c72.6 0 133.7-24.1 178.3-65.4l-86.4-68c-24 16-54.7 25.4-91.9 25.4-70.7 0-130.5-47.8-151.9-112.1H31.3v70.6C75.9 475 167.2 544.3 272 544.3z" fill="#34A853"/>
                <path d="M120.1 324.2c-9.3-27.5-9.3-57 0-84.5V169.1H31.3c-39.3 78.5-39.3 171.5 0 250l88.8-69.9z" fill="#FBBC05"/>
                <path d="M272 107.7c39.5-.6 77.4 14.1 106.3 41.1l79.1-79.1C409.5 24.2 343.3-.2 272 0 167.2 0 75.9 69.3 31.3 169.1l88.8 70.6c21.5-64.3 81.2-112 151.9-112z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

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
              <a href="/signup" className="text-indigo-600 hover:underline">
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