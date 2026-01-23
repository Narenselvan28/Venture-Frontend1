const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['AGENT', 'CONTRACTOR', 'ADMIN'],
        required: true
    },
    name: {
        type: String,
        required: true
    },

    // Specific fields
    companyName: String, // For Agents/Contractors
    companyType: String, // For Agents
    designation: String, // For Agents
    specializations: [String], // For Contractors
    phone: String,

    location: {
        city: String,
        state: String,
        country: String,
        latitude: Number,
        longitude: Number
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    stats: {
        jobsCompleted: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        successRate: { type: Number, default: 0 },
        avgBidAmount: { type: Number, default: 0 }
    },

    fcmToken: String, // For notifications

    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
