import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { FaGoogle } from 'react-icons/fa';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      alert('Please fill in all fields.');
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
        alert(`Logged in as: ${email}`);
        // Redirect or further actions here
      } else {
        alert(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error processing your request. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md transition-transform duration-300 hover:scale-[1.01]"
      >
        {/* DSIQ Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-600">DSIQ</h1>
          <p className="text-gray-500 text-sm mt-1">Log in to your dashboard</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Welcome Back</h2>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <Input
            type="email"
            placeholder="you@example.com"
            className="w-full"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
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

        <Button primary={true} type="submit" className="w-full !text-white !bg-indigo-600 hover:!bg-indigo-700 mb-4">
          Login
        </Button>

        {/* Google Login Button */}
        <div className="mt-2">
          <button
            type="button"
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-3 transition"
          >
            <FaGoogle className="text-lg" />
            <span>Log in with Google</span>
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 mt-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <a href="#" className="text-indigo-600 hover:underline">Forgot password?</a>
          <a href="/signup" className="text-indigo-600 hover:underline">Create account</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
