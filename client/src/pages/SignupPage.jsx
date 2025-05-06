import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { FaGoogle } from 'react-icons/fa';  // Import Google icon

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    userType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      userType: e.target.value,
    }));
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password, userType }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Account created for ${fullName} as ${userType}`);
      } else {
        alert(data.message || 'Error creating account');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error processing your request. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md transition-all duration-300">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Create an Account</h2>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            className="w-full"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <Input
            type="email"
            placeholder="email@example.com"
            className="w-full"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
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
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value={type.toLowerCase()}
                  checked={formData.userType === type.toLowerCase()}
                  onChange={handleRadioChange}
                  className="form-radio text-indigo-600"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <Button primary={true} type="submit" className="w-full text-white">
          Sign Up
        </Button>

        {/* Google Button with Icon (Static Display) */}
        <div className="mt-4">
          <button
            type="button"
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-3"
          >
            <FaGoogle className="text-lg" />
            <span>Sign up with Google</span>
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
