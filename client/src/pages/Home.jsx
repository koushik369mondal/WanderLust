import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Home = () => {
    const [status, setStatus] = useState(null)
    const [destinations, setDestinations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchServerStatus()
        fetchDestinations()
    }, [])

    const fetchServerStatus = async () => {
        try {
            const response = await fetch(`${API_URL}/api/status`)
            const data = await response.json()
            setStatus(data)
        } catch (err) {
            setError('Failed to connect to server')
            console.error('Status fetch error:', err)
        }
    }

    const fetchDestinations = async () => {
        try {
            const response = await fetch(`${API_URL}/api/destinations`)
            const data = await response.json()
            setDestinations(data.data || [])
        } catch (err) {
            console.error('Destinations fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        Explore the World with WanderLust
                    </h1>
                    <p className="text-xl mb-8">
                        Discover amazing destinations and create unforgettable memories
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                        Start Exploring
                    </button>
                </div>
            </section>

            {/* Server Status Section */}
            {status && (
                <section className="bg-gray-100 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-4">Server Status</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="border-l-4 border-green-500 pl-4">
                                    <p className="text-sm text-gray-600">Server</p>
                                    <p className="text-lg font-semibold">{status.app}</p>
                                </div>
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <p className="text-sm text-gray-600">Environment</p>
                                    <p className="text-lg font-semibold capitalize">{status.environment}</p>
                                </div>
                                <div className="border-l-4 border-purple-500 pl-4">
                                    <p className="text-sm text-gray-600">Database</p>
                                    <p className="text-lg font-semibold">
                                        {status.database.connected ? (
                                            <span className="text-green-600">✓ Connected</span>
                                        ) : (
                                            <span className="text-red-600">✗ Disconnected</span>
                                        )}
                                    </p>
                                </div>
                                <div className="border-l-4 border-yellow-500 pl-4">
                                    <p className="text-sm text-gray-600">Server Time</p>
                                    <p className="text-sm font-semibold">
                                        {new Date(status.serverTime).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Destinations Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Popular Destinations
                    </h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                            <p className="mt-4 text-gray-600">Loading destinations...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {destinations.map((destination) => (
                                <div
                                    key={destination.id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                                >
                                    <img
                                        src={destination.image}
                                        alt={destination.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{destination.title}</h3>
                                        <p className="text-gray-600 mb-4">
                                            📍 {destination.location}
                                        </p>
                                        <p className="text-gray-700 mb-4 text-sm">
                                            {destination.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-primary">
                                                ${destination.price}
                                            </span>
                                            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2025 WanderLust. All rights reserved.</p>
                    <p className="mt-2 text-gray-400">Built with React, Node.js, Express & MongoDB</p>
                </div>
            </footer>
        </div>
    )
}

export default Home
