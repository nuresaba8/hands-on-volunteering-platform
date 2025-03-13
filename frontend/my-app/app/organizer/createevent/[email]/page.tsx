'use client';
import axios from 'axios';
import { useCookie } from 'next-cookie';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function page() {
    const jwtToken = useCookie('jwtToken');
    const cookie = jwtToken.get('jwtToken');
    console.log(cookie);
    const { email } = useParams();
    const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : '';
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
      console.log(decodedEmail)
    const [users, setUsers] = useState<any>({
        title: '',
        location: '',
        description: '',
    });
    
    const navigate = useRouter();
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setUsers({ ...users, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!users.title || !users.location || !users.description) {
        setError('Please fill in all fields');
        return;
      }
      
      if (!cookie) {
        setError("Authentication token missing.");
        return;
      }
  
      try {
        await axios.post(`http://localhost:3000/organizer/createevent/${decodedEmail}`, users, {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        });
  
        setSuccess('Profile created successfully!');
        setError(undefined);  // Reset any previous error
        setTimeout(() => {
          navigate.push(`/myHome/${email}`);
        }, 2000);  // Redirect after a short delay to show success message
  
      } catch (error: any) {
        if (error.response) {
          setError(`Error: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
          setError('No response received from the server.');
        } else {
          setError('An error occurred while setting up the request.');
        }
      }
    };
  
    return (
      <div className="container mx-auto p-6">
        <Link href={`/myHome/${decodedEmail}`} className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600">
                                Back
                            </Link>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create Event</h2>
          
          {/* Display error or success message */}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
  
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
                  <label className="text-lg font-medium">Location:</label>
                </td>
                <td className="py-2 px-4">
                  <input
                    type="text"
                    name="location"
                    value={users.location}
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
                    Create Event
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    )
}
