const AuditLog = require('../models/AuditLog');

const logAudit = async (entity, entityId, action, actorId, details, req) => {
    try {
        await AuditLog.create({
            entity,
            entityId,
            action,
            actorId,
            details,
            ipAddress: req?.ip || '0.0.0.0'
        });
    } catch (e) {
        console.error('Audit Log Failed:', e);
    }
};

module.exports = logAudit;
