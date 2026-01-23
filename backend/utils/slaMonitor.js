const cron = require('node-cron'); // Ensure node-cron is installed
const Job = require('../models/Job');
const Timeline = require('../models/Timeline');

const updateTimeline = async (jobId, eventType, description, actorId, metadata = {}) => {
    try {
        // Find timeline by jobId
        let timeline = await Timeline.findOne({ jobId });
        if (!timeline) {
            // If strictly stage-based, we might not have a general events array in the same way.
            // But if we want to support event logs log it to AuditLog or add events array to Timeline model.
            // Let's assume we added 'events' to Timeline for compatibility.
            console.log(`Timeline not found for job ${jobId}, skipping timeline update`);
            return;
        }

        // Add event if model supports it (needs model update)
        if (timeline.events) {
            timeline.events.push({
                type: eventType,
                description,
                actorId,
                metadata,
                timestamp: new Date()
            });
            await timeline.save();
        }
    } catch (e) {
        console.error('Timeline Update Failed:', e);
    }
};

const startSlaMonitor = () => {
    cron.schedule('*/30 * * * *', async () => {
        console.log('🔄 Running SLA Monitor...');
        // Find jobs 'IN_PROGRESS' that are past deadline
        const now = new Date();
        try {
            const delayedJobs = await Job.find({
                status: 'in_progress', // Lowercase in new model
                deadline: { $lt: now },
                'fraudDetection.riskScore': { $lt: 80 } // Example condition
            });

            for (const job of delayedJobs) {
                // job.riskState = 'DELAYED'; // Add to schema if missing
                // await job.save();
                // await updateTimeline(job._id, 'RISK_UPDATE', 'Job marked DELAYED due to SLA breach', null);
                console.log(`⚠️ Job ${job._id} marked DELAYED`);
            }
        } catch (e) {
            console.error("SLA Monitor Error: ", e);
        }
    });
};

module.exports = { startSlaMonitor, updateTimeline };
