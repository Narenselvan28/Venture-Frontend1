const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    location: {
        city: String,
        state: String,
        address: String,
        latitude: Number,
        longitude: Number
    },
    skillsRequired: [String],
    images: [String],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'completed', 'cancelled', 'draft'],
        default: 'open'
    },
    deadline: Date,
    bids: [{
        contractorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        amount: Number,
        proposal: String,
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }],
    fraudDetection: {
        isSuspicious: Boolean,
        riskScore: Number,
        reasons: [String],
        detectedAt: Date,
        confidence: Number
    },
    urgencyScore: {
        type: Number,
        default: 0.5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
