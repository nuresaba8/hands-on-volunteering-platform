'use client';
import axios from 'axios';
import { useCookie } from 'next-cookie';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Page() {
  const jwtToken = useCookie('jwtToken');
  const cookie = jwtToken.get('jwtToken');
  const { email } = useParams();
  const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : '';
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  
  const [users, setUsers] = useState<any>({
    name: '',
    gender: '',
    skill: '',
    interest: '',
    volunteer_history: '',
  });

  const navigate = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUsers({ ...users, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!users.name || !users.gender || !users.skill || !users.interest || !users.volunteer_history) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!cookie) {
      setError("Authentication token missing.");
      return;
    }

    try {
      await axios.put(`http://localhost:3000/user/updateprofile/${decodedEmail}`, users, {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });

      setSuccess('Profile updated successfully!');
      setError(undefined);  // Reset any previous error
      setTimeout(() => {
        navigate.push(`/components/viewprofile/${decodedEmail}`);
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
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Update Profile</h2>
        
        {/* Display error or success message */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <table className="min-w-full">
          <tbody>
            <tr>
              <td className="py-2 px-4">
                <label className="text-lg font-medium">Name:</label>
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="name"
                  value={users.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">
                <label className="text-lg font-medium">Gender:</label>
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="gender"
                  value={users.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">
                <label className="text-lg font-medium">Skill:</label>
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="skill"
                  value={users.skill}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">
                <label className="text-lg font-medium">Interest:</label>
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="interest"
                  value={users.interest}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4">
                <label className="text-lg font-medium">Volunteer History:</label>
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="volunteer_history"
                  value={users.volunteer_history}
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
                  Update Profile
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
