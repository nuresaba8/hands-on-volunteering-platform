'use client'
import axios from 'axios';
import { useCookie } from 'next-cookie';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
    const jwtToken = useCookie('jwtToken');
    const cookie = jwtToken.get('jwtToken');
    const [roll, setRoll] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]); 
    const [helpRequests, setHelpRequests] = useState<any[]>([]); // Store help requests
    const [searchQuery, setSearchQuery] = useState<string>(''); 
    const [joinedEvents, setJoinedEvents] = useState<Set<number>>(new Set()); 
    const [showJoinedOnly, setShowJoinedOnly] = useState<boolean>(false); 
    const [showHelpRequests, setShowHelpRequests] = useState<boolean>(false); // To toggle showing help requests
    const [userResponses, setUserResponses] = useState<any[]>([]);
    const [showUserResponses, setShowUserResponses] = useState(false);
    

    const { email } = useParams();
    const decodedEmail = typeof email === 'string' ? decodeURIComponent(email) : '';
    const navigate = useRouter();

    const fetchData = async (query: string = '') => {
        try {
            const userResponse = await axios.get(`http://localhost:3000/user/getuser/${decodedEmail}`, {
                headers: { Authorization: `Bearer ${cookie}` },
            });
            const data = userResponse.data;
            setRoll(data);
            const eventResponse = await axios.get(`http://localhost:3000/organizer/search?query=${query}`, {
                headers: { Authorization: `Bearer ${cookie}` },
            });
            const res = await axios.get(`http://localhost:3000/organizer/getjoined/event/${decodedEmail}`, {
                headers: { Authorization: `Bearer ${cookie}` },
            });

            const joinedEventIds = new Set<number>(res.data.map((join: any) => join.Id));
            setJoinedEvents(joinedEventIds);

            if (Array.isArray(eventResponse.data) && eventResponse.data.length > 0) {
                setEvents(eventResponse.data); 
            } else {
                console.warn("No event data found");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchHelpRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/help/requesthelp`, {
                headers: { Authorization: `Bearer ${cookie}` },
            });
            setHelpRequests(response.data); // Store the help requests
            setShowHelpRequests(true); // Show help requests table
        } catch (error) {
            console.error("Error fetching help requests:", error);
        }
    };

    const fetchUserResponses = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/help/userrequests/uday@gmail.com`, {
                headers: { Authorization: `Bearer ${cookie}` },
            });
            setUserResponses(response.data); // Store user responses
            setShowUserResponses(true); // Show user responses table
        } catch (error) {
            console.error("Error fetching user responses:", error);
        }
    };

    const joinEvent = async (eventId: number) => {
        try {
            await axios.post(`http://localhost:3000/organizer/join/${eventId}`, { email: decodedEmail }, {
                headers: { Authorization: `Bearer ${cookie}` },
            });
        } catch (error) {
            console.error("Error joining event:", error);
        }
    };
    const handleDelete = async (id: number) => {
          const res= await axios.delete(`http://localhost:3000/organizer/deleteevent/${id}`, {
            headers: {
              Authorization: `Bearer ${cookie}`,
            },
          });
          setEvents(res.data);
      };

    const handleLogout = () => {
        jwtToken.remove('jwtToken', { path: '/' });
        navigate.push('/auth/login');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData(searchQuery);
    };

    useEffect(() => {
        if (cookie && decodedEmail) {
            fetchData(); 
        }
    }, [cookie, decodedEmail]);

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-72 bg-gradient-to-b from-pink-300 to-pink-400 text-white p-6 shadow-lg">
                <Link href={`/myHome/${decodedEmail}`} className="text-2xl font-bold mb-6 text-center">Dashboard</Link>
                <div className="flex flex-col space-y-4">
                    {roll === 2 ? (
                        <>
                            <Link
                                href={`/components/viewprofile/${decodedEmail}`}
                                className="py-2 px-4 bg-white text-pink-600 font-semibold rounded-lg shadow-md hover:bg-pink-600 hover:text-white transition-all duration-300 text-center"
                            >
                                View Profile
                            </Link>
                            <button
                                onClick={() => setShowJoinedOnly(!showJoinedOnly)}
                                className="py-2 px-4 bg-white text-pink-600 font-semibold rounded-lg shadow-md hover:bg-pink-600 hover:text-white transition-all duration-300 text-center"
                            >
                                {showJoinedOnly ? 'Show All Events' : 'View joined event'}
                            </button>

                            <Link
                                href={`/community/helpresquest/${decodedEmail}`}
                                className="py-2 px-4 bg-white text-pink-600 font-semibold rounded-lg shadow-md hover:bg-pink-600 hover:text-white transition-all duration-300 text-center"
                            >
                                Post help Request
                            </Link>

                            {/* Add Check Request Button */}
                            <button
                                onClick={fetchHelpRequests}
                                className="py-2 px-4 bg-white text-pink-600 font-semibold rounded-lg shadow-md hover:bg-pink-600 hover:text-white transition-all duration-300 text-center"
                            >
                                Check Request
                            </button>
                            {/* Check Response Button for Role 2 */}
                            <button
                                onClick={fetchUserResponses}
                                className="mt-4 py-2 px-4 bg-white text-pink-600 font-semibold rounded-lg shadow-md hover:bg-pink-600 hover:text-white transition-all duration-300 text-center"
                            >
                                Check Response
                            </button>
                            
                        </>
                    ) : (
                        <Link
                            href={`/organizer/createevent/${decodedEmail}`}
                            className="py-2 px-4 bg-white text-pink-600 font-semibold rounded-lg shadow-md hover:bg-pink-600 hover:text-white transition-all duration-300 text-center"
                        >
                            Create Event
                        </Link>
                    )}

                    <button
                        onClick={handleLogout}
                        className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                    >
                        Log Out
                    </button>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-6 bg-white">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome, {decodedEmail}</h2>

                {/* Search Input */}
                {roll === 2 && (
                    <div className="flex justify-end mb-4">
                        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search events..."
                                className="px-4 py-2 border rounded-md focus:outline-none"
                            />
                            <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600">
                                Search
                            </button>
                        </form>
                    </div>
                )}

                {/* Help Requests Table */}
                {showHelpRequests && (
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-pink-500 text-white">
                                    <th className="py-3 px-4 text-left">ID</th>
                                    <th className="py-3 px-4 text-left">Title</th>
                                    <th className="py-3 px-4 text-left">Description</th>
                                    <th className="py-3 px-4 text-left">Help</th>
                                </tr>
                            </thead>
                            <tbody>
                                {helpRequests.map((request: any) => (
                                    <tr key={request.id} className="border-b hover:bg-gray-100">
                                        <td className="py-3 px-4">{request.id}</td>
                                        <td className="py-3 px-4">{request.title}</td>
                                        <td className="py-3 px-4">{request.description}</td>
                                        <td className="py-3 px-4">
                                            <Link
                                                href={`/community/response/${decodedEmail}/${request.id}`}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Response
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* User Responses Table */}
            {showUserResponses && (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-pink-500 text-white">
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">Title</th>
                                <th className="py-3 px-4 text-left">Description</th>
                                <th className="py-3 px-4 text-left">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userResponses.map((response: any) => (
                                <tr key={response.id} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-4">{response.id}</td>
                                    <td className="py-3 px-4">{response.title}</td>
                                    <td className="py-3 px-4">{response.description}</td>
                                    <td className="py-3 px-4">
                                        {response.message ? response.message : "Not responded yet"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

                {/* Events Table */}
            <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-pink-500 text-white">
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Title</th>
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Location</th>
                            <th className="py-3 px-4 text-left">Description</th>
                            {roll !== 2 && <th className="py-3 px-4 text-left">Actions</th>}
                            {roll === 2 && !showJoinedOnly && <th className="py-3 px-4 text-left">Join Now</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {events
                            .filter((event: any) => !showJoinedOnly || joinedEvents.has(event.Id))
                            .map((event: any) => (
                                <tr key={event.Id} className="border-b hover:bg-gray-100">
                                    <td className="py-3 px-4">{event.Id}</td>
                                    <td className="py-3 px-4">{event.title}</td>
                                    <td className="py-3 px-4">{event.date}</td>
                                    <td className="py-3 px-4">{event.location}</td>
                                    <td className="py-3 px-4">{event.description}</td>
                                    {roll === 2 && !showJoinedOnly && (
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => joinEvent(event.Id)}
                                                className={`px-3 py-1 rounded ${joinedEvents.has(event.Id) ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'} ${joinedEvents.has(event.Id) ? 'hover:bg-gray-500' : 'hover:bg-green-600'}`}
                                                disabled={joinedEvents.has(event.Id)}
                                            >
                                                {joinedEvents.has(event.Id) ? 'Joined' : 'Join Now'}
                                            </button>
                                        </td>
                                    )}
                                    {roll !== 2 && (
                                        <td className="py-3 px-4">
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(event.Id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            </div>
        </div>
    );
}
