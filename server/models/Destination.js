const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Destination', destinationSchema);
