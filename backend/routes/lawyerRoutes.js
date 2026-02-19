const express = require('express');
const Lawyer = require('../models/Lawyer');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/lawyers - list all lawyers (with optional sector filter)
router.get('/', async (req, res) => {
    try {
        const { sector, search } = req.query;
        let filter = {};

        if (sector) {
            filter.sectors = { $in: [sector] };
        }

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const lawyers = await Lawyer.find(filter).sort({ rating: -1 });
        res.json(lawyers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/lawyers/:id - get single lawyer
router.get('/:id', async (req, res) => {
    try {
        const lawyer = await Lawyer.findById(req.params.id);
        if (!lawyer) {
            return res.status(404).json({ message: 'Lawyer not found' });
        }
        res.json(lawyer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/lawyers/:id/profession - update attorney sectors/profession
// Only the attorney themselves or an admin can update
router.put(
    '/:id/profession',
    protect,
    requireRole('attorney', 'admin'),
    async (req, res) => {
        try {
            const { sectors } = req.body;
            const lawyer = await Lawyer.findById(req.params.id);

            if (!lawyer) {
                return res.status(404).json({ message: 'Lawyer not found' });
            }

            // If attorney, they can only update their own profile
            if (
                req.user.role === 'attorney' &&
                lawyer.userId &&
                lawyer.userId.toString() !== req.user._id.toString()
            ) {
                return res
                    .status(403)
                    .json({ message: 'You can only update your own profession' });
            }

            if (sectors && Array.isArray(sectors)) {
                lawyer.sectors = sectors;
            }

            await lawyer.save();
            res.json(lawyer);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;
