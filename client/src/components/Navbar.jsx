const Navbar = () => {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-primary">
                            🌍 WanderLust
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-700 hover:text-primary transition">
                            Home
                        </a>
                        <a href="#" className="text-gray-700 hover:text-primary transition">
                            Destinations
                        </a>
                        <a href="#" className="text-gray-700 hover:text-primary transition">
                            About
                        </a>
                        <a href="#" className="text-gray-700 hover:text-primary transition">
                            Contact
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="text-gray-700 hover:text-primary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
