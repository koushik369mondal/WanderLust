import { useState } from 'react';
import { FaBed, FaPlane, FaCar, FaUmbrellaBeach, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';

const SearchCard = () => {
    const [activeTab, setActiveTab] = useState('hotels');
    const [searchData, setSearchData] = useState({
        destination: '',
        checkIn: '',
        checkOut: '',
        guests: 1
    });

    const tabs = [
        { id: 'hotels', label: 'Hotels', icon: FaBed },
        { id: 'flights', label: 'Flights', icon: FaPlane },
        { id: 'cars', label: 'Cars', icon: FaCar },
        { id: 'tours', label: 'Tours', icon: FaUmbrellaBeach }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search:', searchData);
    };

    return (
        <div className="relative -mt-24 z-10 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto scrollbar-hide">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-8 py-5 text-base font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/50'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="text-xl" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Destination */}
                            <div className="relative md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Where are you going?
                                </label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type="text"
                                        placeholder="City, destination, or hotel name"
                                        value={searchData.destination}
                                        onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300"
                                    />
                                </div>
                            </div>

                            {/* Check-in Date */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Check-in
                                </label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={searchData.checkIn}
                                        onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300"
                                    />
                                </div>
                            </div>

                            {/* Check-out Date */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Check-out
                                </label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={searchData.checkOut}
                                        onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300"
                                    />
                                </div>
                            </div>

                            {/* Guests */}
                            <div className="relative md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Guests & Rooms
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={searchData.guests}
                                        onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none hover:border-blue-300 appearance-none bg-white cursor-pointer"
                                    >
                                        <option>1 Guest, 1 Room</option>
                                        <option>2 Guests, 1 Room</option>
                                        <option>3 Guests, 1 Room</option>
                                        <option>4 Guests, 2 Rooms</option>
                                        <option>5+ Guests, 2+ Rooms</option>
                                    </select>
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="md:col-span-2 flex items-end">
                                <button
                                    type="submit"
                                    className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-lg"
                                >
                                    <FaSearch className="text-xl" />
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="text-sm text-gray-600">Popular searches:</span>
                            {['Paris', 'Tokyo', 'New York', 'London', 'Dubai'].map((city) => (
                                <button
                                    key={city}
                                    type="button"
                                    onClick={() => setSearchData({ ...searchData, destination: city })}
                                    className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-full transition-colors"
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SearchCard;
