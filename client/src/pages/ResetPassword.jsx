import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasUpperCase: false,
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update password rules specifically for password field
    if (name === 'password') {
      setPasswordRules({
        minLength: value.length >= 8,
        hasNumber: /\d/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        hasUpperCase: /[A-Z]/.test(value),
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = () => {
    const { password, confirmPassword } = formData;
    
    if (!password) {
      toast.error('Please enter a password');
      return false;
    }

    // Check password rules
    if (!passwordRules.minLength) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!passwordRules.hasNumber) {
      toast.error('Password must contain a number');
      return false;
    }
    if (!passwordRules.hasUpperCase) {
      toast.error('Password must contain an uppercase letter');
      return false;
    }
    if (!passwordRules.hasSpecialChar) {
      toast.error('Password must contain a special character');
      return false;
    }

    // Check password match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validatePassword()) {
      try {
        // Simulating password reset logic
        // In a real app, you would call an API here
        toast.success('Password reset successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        toast.error('Failed to reset password');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-white px-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/icon.png" 
            alt="DSIQ Logo" 
            className="h-16 w-auto mx-auto mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/icon.png";
            }}
          />
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Create a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <Input
                type={showPasswords.password ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="!w-full !pr-10"
                value={formData.password}
                onChange={handleChange}
                autocomplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPasswords.password ? (
                  <EyeOff className="!h-5 !w-5" />
                ) : (
                  <Eye className="!h-5 !w-5" />
                )}
              </button>
            </div>
            <div className="pl-2 text-xs text-gray-500 mt-2">
              <p className={`mb-1 ${passwordRules.minLength ? 'text-green-500' : 'text-gray-500'}`}>
                • At least 8 characters
              </p>
              <p className={`mb-1 ${passwordRules.hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                • Contains a number
              </p>
              <p className={`mb-1 ${passwordRules.hasUpperCase ? 'text-green-500' : 'text-gray-500'}`}>
                • Contains an uppercase letter
              </p>
              <p className={`mb-1 ${passwordRules.hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                • Contains a special character
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Input
                type={showPasswords.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                className="w-full pr-10"
                value={formData.confirmPassword}
                onChange={handleChange}
                autocomplete="new-password"
              />
              <button
                type="button"
                className="!absolute !inset-y-0 !right-0 !flex !items-center !px-3 !text-gray-600"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showPasswords.confirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            primary
            type="submit"
            className="w-full !bg-indigo-600 !text-white hover:!bg-indigo-700 mb-4"
          >
            Reset Password
          </Button>

          <div className="text-center text-sm text-gray-500 mt-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-indigo-600 hover:underline"
            >
              Return to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;