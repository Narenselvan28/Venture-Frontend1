const mongoose = require('mongoose');

const stageEvidenceSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    stageId: {
        type: String,
        required: true
    },
    contractorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    files: [{
        url: String,
        fileName: String,
        fileType: String,
        size: Number,
        uploadedAt: Date,
        metadata: {
            coordinates: {
                latitude: Number,
                longitude: Number
            },
            timestamp: Date,
            deviceInfo: String,
            locationAccuracy: Number
        }
    }],
    geoData: {
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        },
        address: String,
        accuracy: Number,
        isVerified: Boolean
    },
    metadata: {
        timestamp: Date,
        deviceInfo: String,
        analysisResults: mongoose.Schema.Types.Mixed
    },
    status: {
        type: String,
        enum: ['pending', 'uploaded', 'under_review', 'approved', 'rejected', 'flagged'],
        default: 'pending'
    },
    mlAnalysis: {
        riskScore: Number,
        isFake: Boolean,
        reasons: [String],
        confidence: Number,
        analyzedAt: Date
    },
    review: {
        reviewedBy: mongoose.Schema.Types.ObjectId,
        reviewedAt: Date,
        comments: String,
        rating: Number
    }
}, {
    timestamps: true
});

// Index for geospatial queries
stageEvidenceSchema.index({ 'geoData.coordinates': '2dsphere' });
stageEvidenceSchema.index({ jobId: 1, stageId: 1, contractorId: 1 });

module.exports = mongoose.model('StageEvidence', stageEvidenceSchema);
