"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';
import { useCookie } from 'next-cookie';

export default function Page() {
  const cookie = useCookie('jwtToken');
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
    const response = await axios.post('http://localhost:3000/auth/login', user);

    const { email, access_token } = response.data;
    cookie.set('jwtToken', access_token, {
      maxAge: 60 * 60 * 24,
      sameSite: 'strict',
    });
    const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : '';
   
    console.log(cookie);
    setUser({
      Email: '',
      Password: ''
    });
    navigate.push(`/myHome/${decodedEmail}`);
    console.log(access_token)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-pink-100 to-pink-200">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-6">Log In</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-pink-500">Email:</label>
            <input
              type="email"
              name="Email"
              id="email"
              value={user.Email}
              onChange={handleChange}
              className="mt-2 p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-pink-500">Password:</label>
            <input
              type="password"
              name="Password"
              id="password"
              value={user.Password}
              onChange={handleChange}
              className="mt-2 p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-300 to-pink-400 text-white font-semibold rounded-lg shadow-md hover:from-pink-400 hover:to-pink-500 focus:ring-2 focus:ring-pink-300 transition-all duration-300"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
