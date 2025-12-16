import { useState } from 'react'

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center space-x-2.5">
                        <span className="text-2xl">🌍</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            WanderLust
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <a href="#" className="text-gray-700 hover:text-text px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                            Home
                        </a>
                        <a href="#destinations" className="text-gray-700 hover:text-text px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                            Destinations
                        </a>
                        <a href="#about" className="text-gray-700 hover:text-text px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                            About
                        </a>
                        <a href="#contact" className="text-gray-700 hover:text-text px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                            Contact
                        </a>
                        <div className="h-8 w-px bg-gray-200 mx-2"></div>
                        <button className="bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                            Plan a Trip
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-text hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-3 border-t border-gray-100">
                        <a href="#" className="block text-text hover:text-primary transition-colors font-medium">
                            Home
                        </a>
                        <a href="#destinations" className="block text-text hover:text-primary transition-colors font-medium">
                            Destinations
                        </a>
                        <a href="#about" className="block text-text hover:text-primary transition-colors font-medium">
                            About
                        </a>
                        <a href="#contact" className="block text-text hover:text-primary transition-colors font-medium">
                            Contact
                        </a>
                        <button className="w-full bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md">
                            Get Started
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
