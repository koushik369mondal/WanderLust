import { FaStar, FaMapMarkerAlt, FaTag, FaArrowRight } from 'react-icons/fa';

const DestinationCard = ({ destination, featured = false, discount = null }) => {
    const { name, location, price, rating, image, description } = destination;

    return (
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={image || `https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80`}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                {/* Featured Badge */}
                {featured && (
                    <div className="absolute top-4 left-4 px-4 py-1.5 bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full shadow-lg">
                        ⭐ Featured
                    </div>
                )}

                {/* Discount Badge */}
                {discount && (
                    <div className="absolute top-4 right-4 w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                        <div className="text-center">
                            <div className="text-xl font-bold leading-none">{discount}%</div>
                            <div className="text-xs">OFF</div>
                        </div>
                    </div>
                )}

                {/* Location */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                    <FaMapMarkerAlt className="text-cyan-300" />
                    <span className="text-sm font-medium">{location || 'Exotic Location'}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {name}
                    </h3>

                    {/* Rating */}
                    {rating && (
                        <div className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg">
                            <FaStar className="text-yellow-300 text-sm" />
                            <span className="font-semibold text-sm">{rating}</span>
                        </div>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {description || 'Discover amazing experiences and create unforgettable memories at this stunning destination.'}
                </p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Starting from</p>
                        <div className="flex items-baseline gap-1">
                            {discount && (
                                <span className="text-sm text-gray-400 line-through">${price}</span>
                            )}
                            <span className="text-2xl font-bold text-blue-600">
                                ${discount ? Math.round(price * (1 - discount / 100)) : price}
                            </span>
                            <span className="text-sm text-gray-500">/night</span>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:gap-3 group-hover:shadow-lg">
                        Book Now
                        <FaArrowRight className="text-sm" />
                    </button>
                </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-2xl transition-all pointer-events-none" />
        </div>
    );
};

const PromotionalSection = () => {
    const destinations = [
        {
            name: 'Santorini Paradise',
            location: 'Santorini, Greece',
            price: 299,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
            description: 'Experience the stunning white-washed buildings and breathtaking sunsets',
            featured: true,
            discount: 25
        },
        {
            name: 'Bali Beach Resort',
            location: 'Bali, Indonesia',
            price: 189,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
            description: 'Tropical paradise with pristine beaches and cultural experiences'
        },
        {
            name: 'Tokyo Luxury Stay',
            location: 'Tokyo, Japan',
            price: 399,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
            description: 'Modern luxury meets traditional Japanese hospitality',
            discount: 15
        },
        {
            name: 'Paris City Center',
            location: 'Paris, France',
            price: 349,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
            description: 'Iconic landmarks and romantic ambiance in the heart of Paris'
        },
        {
            name: 'Maldives Overwater Villa',
            location: 'Maldives',
            price: 599,
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
            description: 'Ultimate luxury in crystal-clear waters with private villas',
            featured: true,
            discount: 20
        },
        {
            name: 'Dubai Desert Resort',
            location: 'Dubai, UAE',
            price: 449,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
            description: 'Luxury meets adventure in the Arabian desert'
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
                        <FaTag className="inline mr-2" />
                        Special Offers
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Trending Destinations
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover handpicked destinations with exclusive deals and unforgettable experiences
                    </p>
                </div>

                {/* Destination Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((destination, index) => (
                        <DestinationCard
                            key={index}
                            destination={destination}
                            featured={destination.featured}
                            discount={destination.discount}
                        />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-xl">
                        View All Destinations
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PromotionalSection;
