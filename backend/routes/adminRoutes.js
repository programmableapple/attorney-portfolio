const express = require('express');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/users - list all users (admin only)
router.get('/users', protect, requireRole('admin'), async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/admin/users/:id/role - change user role (admin only)
router.put(
    '/users/:id/role',
    protect,
    requireRole('admin'),
    async (req, res) => {
        try {
            const { role } = req.body;
            const allowedRoles = ['client', 'attorney', 'admin'];

            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { role },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;
