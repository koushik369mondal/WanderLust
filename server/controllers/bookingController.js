const Booking = require("../models/Booking");
const Destination = require("../models/Destination");

// POST /api/bookings
exports.createBooking = async (req, res) => {
    try {
        const { destinationId, fullName, email, travelers, extras } = req.body;

        const destination = await Destination.findById(destinationId);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }

        const base = destination.basePrice * travelers;

        // later you can calculate extras more precisely
        const extraFee =
            (extras?.food ? 0.1 : 0) * base +
            (extras?.travel ? 0.15 : 0) * base +
            (extras?.wifi ? 0.05 : 0) * base;

        const totalPrice = base + extraFee;

        const booking = await Booking.create({
            destination: destinationId,
            fullName,
            email,
            travelers,
            totalPrice,
            extras
        });

        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ message: "Booking failed", error: err.message });
    }
};

// GET /api/bookings (for user profile / admin)
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("destination");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
