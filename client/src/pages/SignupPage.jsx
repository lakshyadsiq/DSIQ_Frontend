import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const SignupPage = ( {onSignUp} ) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target; 
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setFormData((prevData) => ({ ...prevData, userType: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password,confirmPassword, userType } = formData;

    if (!fullName || !email || !password || !confirmPassword || !userType) {
      toast.error('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, userType }),
      });

      const data = await response.json();
      if (response.ok) {
        // toast.success(`Account created for ${fullName} as ${userType}`);
      } else {
        // toast.error(data.message || 'Error creating account');
        navigate('/')
        onSignUp();
      }
    } catch (error) {
      console.error('Error:', error);
      // toast.error('Something went wrong. Please try again later.');
      navigate('/')
      onSignUp();
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md transition hover:shadow-2xl"
      >
        {/* Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">DSIQ Registration</h1>
          <p className="text-gray-600 mb-6">Empowering Data-Driven Decisions</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            className="w-full"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <Input
            type="email"
            placeholder="email@example.com"
            className="w-full"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            className="w-full"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            className="w-full"
            name="confirmPassword" // ✅ Correct name
            value={formData.confirmPassword}
            onChange={handleChange}
          />

        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Select your role:</p>
          <div className="flex gap-4">
            {['Agency', 'Brand'].map((type) => {
              const value = type.toLowerCase();
              const selected = formData.userType === value;
              return (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-all duration-200 text-sm
                    ${selected ? 'border-indigo-600 bg-indigo-100 text-indigo-800 shadow-sm' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                    focus-within:ring-2 focus-within:ring-indigo-500`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value={value}
                    checked={selected}
                    onChange={handleRadioChange}
                    className="hidden"
                  />
                  <span className="font-medium">{type}</span>
                </label>
              );
            })}
          </div>
        </div>


        <Button primary={true} type="submit" className="w-full !text-white !bg-indigo-600 hover:!bg-indigo-700 rounded-full">
          Sign Up
        </Button>

        {/* Google Sign Up */}
        <div className="mt-4">
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
            <span>Sign up with Google</span>
          </button>
        </div>


        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 font-medium hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;

