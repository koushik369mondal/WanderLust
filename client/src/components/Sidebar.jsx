import { useState } from 'react';
import { FaHome, FaBed, FaPlane, FaCar, FaUmbrellaBeach, FaHeart, FaUser, FaCog, FaBars, FaTimes, FaStar } from 'react-icons/fa';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('home');

    const menuItems = [
        { id: 'home', label: 'Home', icon: FaHome, badge: null },
        { id: 'hotels', label: 'Hotels', icon: FaBed, badge: null },
        { id: 'flights', label: 'Flights', icon: FaPlane, badge: 'New' },
        { id: 'cars', label: 'Car Rental', icon: FaCar, badge: null },
        { id: 'tours', label: 'Tours', icon: FaUmbrellaBeach, badge: null },
        { id: 'favorites', label: 'Favorites', icon: FaHeart, badge: null },
        { id: 'rewards', label: 'Rewards', icon: FaStar, badge: 'New' },
    ];

    const bottomItems = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'settings', label: 'Settings', icon: FaCog },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
                {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30 animate-fade-in"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } w-64 lg:w-20 xl:w-64`}
            >
                <div className="flex flex-col h-full py-6">
                    {/* Logo */}
                    <div className="px-6 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                                <FaUmbrellaBeach className="text-white text-xl" />
                            </div>
                            <span className="font-bold text-xl text-gray-900 lg:hidden xl:block">
                                WanderLust
                            </span>
                        </div>
                    </div>

                    {/* Main Menu Items */}
                    <nav className="flex-1 px-3 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeItem === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveItem(item.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    <Icon className={`text-xl shrink-0 ${isActive ? 'animate-bounce-slow' : ''}`} />
                                    <span className="font-medium lg:hidden xl:block">{item.label}</span>

                                    {/* Badge */}
                                    {item.badge && (
                                        <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full lg:hidden xl:block ${isActive
                                            ? 'bg-white text-blue-600'
                                            : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Bottom Menu Items */}
                    <div className="px-3 space-y-1 border-t border-gray-200 pt-4">
                        {bottomItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeItem === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveItem(item.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="text-xl shrink-0" />
                                    <span className="font-medium lg:hidden xl:block">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* Spacer for main content */}
            <div className="lg:w-20 xl:w-64" />
        </>
    );
};

export default Sidebar;
