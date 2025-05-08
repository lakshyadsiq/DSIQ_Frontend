import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { FaGoogle } from 'react-icons/fa';

const SignupPage = ({ onSignUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
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
    const { fullName, email, password, userType } = formData;

    if (!fullName || !email || !password || !userType) {
      alert('Please fill in all fields.');
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
        alert(`Account created for ${fullName} as ${userType}`);
      } else {
        // alert(data.message || 'Error creating account');
        onSignUp();
        navigate('/workspaceCreate');
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('There was an error processing your request. Please try again later.');
      onSignUp();
      navigate('/workspaceCreate');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md transition-transform duration-300 hover:scale-[1.01]"
      >
        {/* DSIQ Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-600">DSIQ</h1>
          <p className="text-gray-500 text-sm mt-1">Empowering Data-Driven Decisions</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create Your Account</h2>

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

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">You are a:</p>
          <div className="flex gap-4">
            {['Agency', 'Brand'].map((type) => (
              <label
                key={type}
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition ${formData.userType === type.toLowerCase()
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                    : 'border-gray-300 hover:bg-gray-100'
                  }`}
              >
                <input
                  type="radio"
                  name="userType"
                  value={type.toLowerCase()}
                  checked={formData.userType === type.toLowerCase()}
                  onChange={handleRadioChange}
                  className="form-radio text-indigo-600 hidden"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <Button primary={true} type="submit" className="w-full !text-white !bg-indigo-600 hover:!bg-indigo-700">
          Sign Up
        </Button>

        {/* Google Sign Up */}
        <div className="mt-4">
          <button
            type="button"
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-3 transition"
          >
            <FaGoogle className="text-lg" />
            <span>Sign up with Google</span>
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
