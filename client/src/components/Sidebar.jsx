import { useState } from 'react';
import { FaHome, FaBed, FaPlane, FaCar, FaUmbrellaBeach, FaHeart, FaUser, FaCog, FaBars, FaTimes, FaStar, FaBell } from 'react-icons/fa';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('home');

    const menuItems = [
        { id: 'home', label: 'Home', icon: FaHome, badge: null },
        { id: 'hotels', label: 'Hotels', icon: FaBed, badge: null },
        { id: 'flights', label: 'Flights', icon: FaPlane, badge: 'New' },
        { id: 'cars', label: 'Car Rental', icon: FaCar, badge: null },
        { id: 'tours', label: 'Tours', icon: FaUmbrellaBeach, badge: null },
        { id: 'favorites', label: 'Favorites', icon: FaHeart, badge: '3' },
        { id: 'rewards', label: 'Rewards', icon: FaStar, badge: 'New' },
    ];

    const userItems = [
        { id: 'notifications', icon: FaBell, badge: '5' },
        { id: 'profile', icon: FaUser },
        { id: 'settings', icon: FaCog },
    ];

    return (
        <>
            {/* Premium Glassmorphism Navbar */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    background: 'linear-gradient(135deg, rgba(65, 183, 204, 0.95), rgba(72, 118, 203, 0.95), rgba(78, 219, 205, 0.95))',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.1)'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo - Premium */}
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
                                }}
                            >
                                <FaUmbrellaBeach className="text-white text-2xl drop-shadow-lg" />
                            </div>
                            <span className="hidden md:block font-bold text-2xl text-white drop-shadow-2xl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                                WanderLust
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeItem === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveItem(item.id)}
                                        className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group"
                                        style={{
                                            background: isActive
                                                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))'
                                                : 'transparent',
                                            backdropFilter: isActive ? 'blur(10px)' : 'none',
                                            border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                                            boxShadow: isActive ? '0 8px 32px rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : 'none',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                                e.currentTarget.style.backdropFilter = 'blur(10px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.backdropFilter = 'none';
                                            }
                                        }}
                                    >
                                        {isActive && (
                                            <div
                                                className="absolute inset-0 -z-10 opacity-50 rounded-xl"
                                                style={{
                                                    background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent)',
                                                    filter: 'blur(10px)'
                                                }}
                                            />
                                        )}

                                        <Icon className={`text-lg drop-shadow-lg transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-white/80 group-hover:text-white group-hover:scale-110'}`} />
                                        <span className={`font-semibold text-sm drop-shadow-md whitespace-nowrap ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                                            {item.label}
                                        </span>

                                        {item.badge && (
                                            <span
                                                className="px-2 py-0.5 text-xs font-bold rounded-full shadow-lg"
                                                style={{
                                                    background: isActive
                                                        ? 'linear-gradient(135deg, #FFFFFF, #F0F0F0)'
                                                        : 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                                                    color: isActive ? '#3B82F6' : '#FFFFFF',
                                                    textShadow: isActive ? 'none' : '0 1px 2px rgba(0,0,0,0.2)',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)'
                                                }}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Right Section - User Actions */}
                        <div className="flex items-center gap-2">
                            {userItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeItem === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveItem(item.id)}
                                        className="hidden lg:flex relative w-11 h-11 items-center justify-center rounded-xl transition-all duration-300"
                                        style={{
                                            background: isActive
                                                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))'
                                                : 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            boxShadow: isActive ? '0 8px 32px rgba(31, 38, 135, 0.37)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = isActive
                                                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))'
                                                : 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        <Icon className="text-lg text-white drop-shadow-lg" />
                                        {item.badge && (
                                            <span
                                                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full shadow-lg"
                                                style={{
                                                    background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                                                    color: '#FFFFFF',
                                                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                                    border: '2px solid rgba(255, 255, 255, 0.5)'
                                                }}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                {isMobileMenuOpen ? <FaTimes className="text-xl text-white" /> : <FaBars className="text-xl text-white" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div
                            className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl shadow-2xl animate-slide-down"
                            style={{
                                background: 'linear-gradient(135deg, rgba(65, 183, 204, 0.98), rgba(72, 118, 203, 0.98), rgba(78, 219, 205, 0.98))',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            <div className="p-4 space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeItem === item.id;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveItem(item.id);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                                            style={{
                                                background: isActive
                                                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))'
                                                    : 'transparent',
                                                backdropFilter: isActive ? 'blur(10px)' : 'none',
                                                border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                                            }}
                                        >
                                            <Icon className="text-lg text-white drop-shadow-md" />
                                            <span className="font-semibold text-white flex-1 text-left">{item.label}</span>
                                            {item.badge && (
                                                <span
                                                    className="px-2 py-0.5 text-xs font-bold rounded-full"
                                                    style={{
                                                        background: isActive
                                                            ? 'linear-gradient(135deg, #FFFFFF, #F0F0F0)'
                                                            : 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                                                        color: isActive ? '#3B82F6' : '#FFFFFF',
                                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                                    }}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}

                                <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                                    {userItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeItem === item.id;

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setActiveItem(item.id);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                                                style={{
                                                    background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                                }}
                                            >
                                                <Icon className="text-lg text-white drop-shadow-md" />
                                                <span className="font-semibold text-white flex-1 text-left capitalize">{item.id}</span>
                                                {item.badge && (
                                                    <span
                                                        className="px-2 py-0.5 text-xs font-bold rounded-full"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                                                            color: '#FFFFFF',
                                                            border: '1px solid rgba(255, 255, 255, 0.3)'
                                                        }}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Spacer for content below navbar */}
            <div className="h-20" />
        </>
    );
};

export default Navbar;
