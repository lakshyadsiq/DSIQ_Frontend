import React, { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { FaGoogle } from 'react-icons/fa';  // Import Google icon

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the JWT token (for example, in localStorage or as an HTTP-only cookie)
        localStorage.setItem('authToken', data.token);
        alert(`Logged in as: ${email}`);
        // Redirect or perform actions after successful login
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
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md transition-all duration-300">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Welcome Back</h2>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
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

        <Button primary={true} type="submit" className="w-full text-white mb-4">
          Login
        </Button>

        {/* Google Button with Icon (Static Display) */}
        <div className="mt-4">
          <button
            type="button"
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-3"
          >
            <FaGoogle className="text-lg" />
            <span>Log in with Google</span>
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <a href="#" className="text-indigo-600 hover:underline mr-4">Forgot password?</a>
          <a href="/signup" className="text-indigo-600 hover:underline">Create account</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
