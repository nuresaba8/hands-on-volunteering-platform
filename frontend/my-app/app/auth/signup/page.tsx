"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Page() {
  const navigate = useRouter();
  const [user, setUser] = useState({
    Email: '',
    Password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('User data:', user);
    const response = await axios.post('http://localhost:3000/auth/adduser', user);
    navigate.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 via-pink-200 to-pink-300">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-pink-700 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-pink-600">Email:</label>
            <input
              type="email"
              name="Email"
              id="email"
              value={user.Email}
              onChange={handleChange}
              className="mt-2 p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-pink-600">Password:</label>
            <input
              type="password"
              name="Password"
              id="password"
              value={user.Password}
              onChange={handleChange}
              className="mt-2 p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-pink-500 hover:to-pink-600 focus:ring-2 focus:ring-pink-400 transition-all duration-300"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
