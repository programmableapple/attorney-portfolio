const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        lawyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lawyer',
            required: true,
        },
        date: {
            type: Date,
            required: [true, 'Booking date is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        notes: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
