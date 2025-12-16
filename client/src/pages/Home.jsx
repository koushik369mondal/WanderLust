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
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
                        alt="Travel destination"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-teal-700/70"></div>
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Find your next<br />adventure
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
                        Discover breathtaking destinations and create memories that last forever
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-gray-900 px-8 py-4 rounded-xl text-base font-semibold hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl">
                            Explore Destinations
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-white hover:text-gray-900 transition-all duration-200">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>



            {/* Featured Destinations */}
            <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <p className="text-secondary font-medium text-sm uppercase tracking-wider mb-3">Trending Now</p>
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
                        <p className="text-gray-600 text-xl max-w-2xl font-light">
                            Handpicked experiences curated by travel experts
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 text-lg">{error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {destinations.map((destination) => (
                                <div
                                    key={destination.id}
                                    className="bg-white rounded-3xl overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
                                >
                                    {/* Image */}
                                    <div className="relative h-72 overflow-hidden">
                                        <img
                                            src={destination.image}
                                            alt={destination.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                            ${destination.price}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-gray-500 text-sm font-medium">{destination.location}</p>
                                        </div>
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">{destination.title}</h3>
                                        <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">{destination.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-5 h-5 text-accent-yellow" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-gray-900 font-semibold text-sm">4.9</span>
                                                <span className="text-gray-500 text-sm">(124)</span>
                                            </div>
                                            <span className="text-primary font-medium text-sm group-hover:underline">View details →</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-gradient-to-br from-primary via-blue-600 to-secondary px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">Ready for your next adventure?</h2>
                    <p className="text-xl text-white/80 mb-10 font-light max-w-2xl mx-auto">
                        Join thousands of travelers who trust us to create unforgettable journeys
                    </p>
                    <button className="bg-white text-gray-900 px-10 py-4 rounded-xl text-base font-semibold hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl">
                        Start Planning
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🌍</span>
                            <span className="text-xl font-bold">WanderLust</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 text-sm">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Destinations</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            © 2025 WanderLust. Built with passion for explorers worldwide.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Home
