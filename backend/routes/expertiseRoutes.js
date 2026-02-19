const express = require('express');
const Expertise = require('../models/Expertise');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/expertise - list all sectors
router.get('/', async (req, res) => {
    try {
        const sectors = await Expertise.find().sort({ name: 1 });
        res.json(sectors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/expertise - create new sector (admin only)
router.post('/', protect, requireRole('admin'), async (req, res) => {
    try {
        const { name, description, icon } = req.body;

        const existing = await Expertise.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Sector already exists' });
        }

        const sector = await Expertise.create({ name, description, icon });
        res.status(201).json(sector);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/expertise/:id - update sector (admin only)
router.put('/:id', protect, requireRole('admin'), async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        const sector = await Expertise.findByIdAndUpdate(
            req.params.id,
            { name, description, icon },
            { new: true, runValidators: true }
        );

        if (!sector) {
            return res.status(404).json({ message: 'Sector not found' });
        }

        res.json(sector);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/expertise/:id - delete sector (admin only)
router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
    try {
        const sector = await Expertise.findByIdAndDelete(req.params.id);
        if (!sector) {
            return res.status(404).json({ message: 'Sector not found' });
        }
        res.json({ message: 'Sector deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
