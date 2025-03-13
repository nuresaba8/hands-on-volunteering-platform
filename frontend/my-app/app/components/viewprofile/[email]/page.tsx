'use client';
import axios from 'axios';
import { useCookie } from 'next-cookie';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const jwtToken = useCookie('jwtToken');
  const cookie = jwtToken.get('jwtToken');
  const { email } = useParams();
  const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : ''; // Fix: Ensure email is a string
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/get/${decodedEmail}`, {
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        });

        if (response.data) {
          setUser(response.data);
          setError(null);
        } else {
          console.log('No data received');
          setUser(null);
          setError('No profile found for this user.');
        }
      } catch (error: any) {
        console.log('Full error object:', error);

        if (error?.response) {
          console.error('Error fetching profile:', error.response.data || error.response.statusText);
          setError(error.response.data?.message || 'Failed to fetch profile. Please try again.');
        } else if (error?.message) {
          console.error('Error fetching profile:', error.message);
          setError(error.message);
        } else {
          console.error('Unexpected error:', error);
          setError('An unexpected error occurred. Please try again.');
        }

        setUser(null);
      }
    };

    fetchData();
  }, [decodedEmail, cookie]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        )}
        <Link href={`/myHome/${decodedEmail}`} className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600">
                                Back
                            </Link>
        {/* User Profile or Create Profile Message */}
        {user ? (
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">User Profile</h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <span className="w-1/3 font-semibold text-gray-600">Name:</span>
                <span className="w-2/3 text-gray-800">{user.name}</span>
              </div>
              <div className="flex items-center">
                <span className="w-1/3 font-semibold text-gray-600">Gender:</span>
                <span className="w-2/3 text-gray-800">{user.gender}</span>
              </div>
              <div className="flex items-center">
                <span className="w-1/3 font-semibold text-gray-600">Skill:</span>
                <span className="w-2/3 text-gray-800">{user.skill}</span>
              </div>
              <div className="flex items-center">
                <span className="w-1/3 font-semibold text-gray-600">Interest:</span>
                <span className="w-2/3 text-gray-800">{user.interest}</span>
              </div>
              <div className="flex items-center">
                <span className="w-1/3 font-semibold text-gray-600">Volunteer History:</span>
                <span className="w-2/3 text-gray-800">{user.volunteer_history}</span>
              </div>
              <div className="flex justify-center mt-8">
                <Link
                  href={`/components/updateprofile/${decodedEmail}`}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">No profile found for this user.</h2>
            <Link
              href={`/components/createprofile/${decodedEmail}`}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300"
            >
              Create Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}