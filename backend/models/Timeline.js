const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    // Legacy Event Sourcing Support
    events: [{
        type: { type: String, required: true },
        description: { type: String, required: true },
        actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
        metadata: mongoose.Schema.Types.Mixed
    }],
    // New Stage-Based Structure
    totalSla: Number,
    stages: [{
        id: String, // Added ID for frontend compatibility
        order: Number,
        name: String,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'in-review', 'completed', 'approved', 'rejected'], // aligned with frontend
            default: 'pending'
        },
        startDate: Date,
        evidence: [{
            type: String,
            caption: String,
            url: String,
            uploadedAt: Date
        }]
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Timeline', timelineSchema);
