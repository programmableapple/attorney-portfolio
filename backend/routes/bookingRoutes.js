const express = require('express');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/bookings - list user bookings
router.get('/', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('lawyerId', 'name email sectors avatar')
            .sort({ date: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/bookings - create a booking
router.post('/', protect, async (req, res) => {
    try {
        const { lawyerId, date, notes } = req.body;

        const booking = await Booking.create({
            userId: req.user._id,
            lawyerId,
            date,
            notes,
        });

        const populated = await Booking.findById(booking._id).populate(
            'lawyerId',
            'name email sectors avatar'
        );

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
