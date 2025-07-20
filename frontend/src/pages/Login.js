import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTruck, FaClock, FaBoxOpen, FaCheckCircle } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-indigo-50">
      {/* Left side branding */}
      <div className="flex flex-col justify-center px-12 py-16 w-1/2 max-w-lg">
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <FaTruck className="text-blue-600 text-3xl mr-2" />
            <h1 className="text-3xl font-extrabold text-gray-900">Easy Delivery</h1>
          </div>
          <p className="text-gray-700 text-lg max-w-md">
            Fast, reliable delivery service that brings convenience to your doorstep
          </p>
        </div>
        <div className="space-y-6 max-w-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-200 text-blue-700 mr-4">
              <FaClock />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Fast Delivery</p>
              <p className="text-gray-600 text-sm">Same-day delivery available</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-200 text-green-600 mr-4">
              <FaBoxOpen />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Secure Packaging</p>
              <p className="text-gray-600 text-sm">Your items arrive safely</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-200 text-purple-600 mr-4">
              <FaCheckCircle />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Track Everything</p>
              <p className="text-gray-600 text-sm">Real-time tracking updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-col justify-center bg-white rounded-lg shadow-lg p-10 w-1/2 max-w-md mx-auto my-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-600 mb-8 text-center">Log in to your account</p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full bg-gray-100 rounded-md border border-gray-200 p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full bg-gray-100 rounded-md border border-gray-200 p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
