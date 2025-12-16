// Mock data for demo purposes
const mockDestinations = [
    {
        id: '1',
        title: 'Paris, France',
        location: 'Paris, France',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        description: 'Experience the city of lights, love, and incredible cuisine.'
    },
    {
        id: '2',
        title: 'Tokyo, Japan',
        location: 'Tokyo, Japan',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        description: 'Discover the perfect blend of tradition and modernity.'
    },
    {
        id: '3',
        title: 'Bali, Indonesia',
        location: 'Bali, Indonesia',
        price: 800,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        description: 'Tropical paradise with stunning beaches and rich culture.'
    },
    {
        id: '4',
        title: 'New York City, USA',
        location: 'New York, USA',
        price: 1300,
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
        description: 'The city that never sleeps, full of energy and excitement.'
    },
    {
        id: '5',
        title: 'Santorini, Greece',
        location: 'Santorini, Greece',
        price: 1100,
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
        description: 'Iconic white buildings and breathtaking sunsets.'
    },
    {
        id: '6',
        title: 'Dubai, UAE',
        location: 'Dubai, UAE',
        price: 1400,
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
        description: 'Luxury, innovation, and desert adventures combined.'
    }
];

// GET /api/destinations
exports.getAllDestinations = async (req, res) => {
    try {
        // For now, return mock data
        // Later, this will query the database: await Destination.find()

        res.json({
            success: true,
            count: mockDestinations.length,
            data: mockDestinations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching destinations',
            error: error.message
        });
    }
};
