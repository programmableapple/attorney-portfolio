const mongoose = require('mongoose');

const expertiseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Sector name is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: 'Briefcase',
        },
        lawyerCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Expertise', expertiseSchema);
