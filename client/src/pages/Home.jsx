import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchCard from "../components/SearchCard";
import PromotionalSection from "../components/PromotionalSection";

const Home = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch destinations on mount if needed
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 min-h-screen">
                {/* Hero Section */}
                <Hero />

                {/* Search Card */}
                <SearchCard />

                {/* Promotional Section */}
                <PromotionalSection />

                {/* Features Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Why Choose WanderLust?
                            </h2>
                            <p className="text-xl text-gray-600">
                                We make your travel dreams come true
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-8 rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all">
                                <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">🌍</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Global Coverage
                                </h3>
                                <p className="text-gray-600">
                                    Access to over 1 million hotels and destinations worldwide
                                </p>
                            </div>

                            <div className="text-center p-8 rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all">
                                <div className="w-16 h-16 bg-linear-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">💎</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Best Prices
                                </h3>
                                <p className="text-gray-600">
                                    Save up to 30% with our exclusive deals and price match guarantee
                                </p>
                            </div>

                            <div className="text-center p-8 rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 hover:shadow-xl transition-all">
                                <div className="w-16 h-16 bg-linear-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <span className="text-3xl">🛡️</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Secure Booking
                                </h3>
                                <p className="text-gray-600">
                                    Your privacy and security are our top priority
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-linear-to-br from-blue-900 via-blue-700 to-cyan-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join millions of travelers who trust WanderLust for their perfect getaway
                        </p>
                        <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                            Start Planning Now
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-300 py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-white font-bold text-xl mb-4">WanderLust</h3>
                                <p className="text-sm">
                                    Your trusted travel companion for unforgettable adventures.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Company</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Support</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                                        <span className="text-xl">f</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors">
                                        <span className="text-xl">𝕏</span>
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                                        <span className="text-xl">📷</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                            <p>&copy; 2024 WanderLust. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Home;
