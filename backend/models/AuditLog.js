const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    entity: {
        type: String,
        required: true
    }, // Job, User, Invoice
    entityId: mongoose.Schema.Types.ObjectId,
    action: {
        type: String,
        required: true
    },
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
