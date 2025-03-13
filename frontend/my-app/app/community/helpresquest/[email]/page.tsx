'use client';
import axios from 'axios';
import { useCookie } from 'next-cookie';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function page() {
  
    const jwtToken = useCookie('jwtToken');
    const cookie = jwtToken.get('jwtToken');
    console.log(cookie);
    const { email } = useParams();
    const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : '';
      console.log(decodedEmail)
    const [users, setUsers] = useState<any>({
        title: '',
        description: '',
    });
    const navigate = useRouter();

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setUsers({ ...users, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

        await axios.post(`http://localhost:3000/help/requesthelp/${decodedEmail}`, users, {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        });
          navigate.push(`/myHome/${email}`);
    };
  
    return (
      <div className="container mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Help Post</h2>
          <table className="min-w-full">
            <tbody>
              <tr>
                <td className="py-2 px-4">
                  <label className="text-lg font-medium">Title:</label>
                </td>
                <td className="py-2 px-4">
                  <input
                    type="text"
                    name="title"
                    value={users.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4">
                  <label className="text-lg font-medium">Description:</label>
                </td>
                <td className="py-2 px-4">
                  <input
                    type="text"
                    name="description"
                    value={users.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="py-4 text-center">
                  <button
                    type="submit"
                    className="w-auto py-1 px-3 bg-gradient-to-r from-pink-300 to-pink-400 text-white font-semibold rounded-lg shadow-md hover:from-pink-400 hover:to-pink-500 focus:ring-2 focus:ring-pink-300 transition-all duration-300"
                  >
                    Post
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    )
}
