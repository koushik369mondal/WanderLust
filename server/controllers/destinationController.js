const Destination = require("../models/Destination");

// GET /api/destinations?search=&minPrice=&maxPrice=
exports.getDestinations = async (req, res) => {
    try {
        const { search, minPrice, maxPrice } = req.query;

        const query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (minPrice || maxPrice) {
            query.basePrice = {};
            if (minPrice) query.basePrice.$gte = Number(minPrice);
            if (maxPrice) query.basePrice.$lte = Number(maxPrice);
        }

        const destinations = await Destination.find(query).sort({ basePrice: 1 });
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// POST /api/destinations  (for seeding/admin use)
exports.createDestination = async (req, res) => {
    try {
        const destination = await Destination.create(req.body);
        res.status(201).json(destination);
    } catch (err) {
        res.status(400).json({ message: "Validation error", error: err.message });
    }
};
