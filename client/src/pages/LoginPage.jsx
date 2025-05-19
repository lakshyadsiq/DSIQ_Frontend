import { useState } from 'react';
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="h-23 w-23 rounded-full flex items-center justify-center text-white font-bold text-xl">
                <img src="/icon.png" alt="DSIQ Logo" className="h-16 w-auto" />
              </div>
            </div>
      
            {/* Form Container */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full">
            
              {showReset ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-700 mb-6">Reset your password</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={resetEmail}
                      onChange={(e) => {
                        setResetEmail(e.target.value);
                        setResetStatus('idle');
                      }}
                      disabled={resetStatus === 'sent'}
                    />
                  </div>

                  <button
                    onClick={handleResetSubmit}
                    disabled={resetStatus !== 'idle'}
                    className={`w-full py-2.5 px-4 text-white font-medium rounded transition ${
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
                <div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-6">Sign in to your account</h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={formData.email}
                      onChange={handleLoginChange}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        className="w-full p-2 border border-gray-300 rounded pr-10"
                        value={formData.password}
                        onChange={handleLoginChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-indigo-600" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                  </div>

                  <button
                    onClick={handleLoginSubmit}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded hover:bg-indigo-700 transition"
                  >
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>

                  <div className="mt-6 flex justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReset(true);
                        setResetStatus('idle');
                      }}
                      className="text-indigo-600 hover:underline"
                    >
                      Forgot Your Password?
                    </button>
                    <a href="/register" className="text-indigo-600 hover:underline">
                      Create account
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="mt-8 text-center">
              <div className="text-xs text-gray-500">
                © 2025 DSIQ, Inc. All rights reserved. | Privacy
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Advertisement */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <div className="flex flex-col justify-center items-center p-8 w-full">
            <div className="max-w-lg text-center">
              <h2 className="text-4xl font-bold mb-6">DSIQ Platform</h2>
              <div className="h-32 w-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center">
                <img src="/icon.png" alt="DSIQ Logo" className="h-24 w-auto" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-4">Coming Soon</h3>
              <p className="text-lg mb-6">Our revolutionary data analytics platform will transform how your business makes decisions.</p>
            </div> 
          </div> 
        </div> 
      </div>
    </div>
  );
};

export default LoginPage;