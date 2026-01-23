const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Timeline = require('../models/Timeline');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const logAudit = require('../utils/auditLogger');

// Create Job (Agent)
router.post('/', protect, restrictTo('AGENT'), async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user._id,
            status: 'draft' // lowercase to match enum
        });

        // Init Timeline
        await Timeline.create({ jobId: job._id, totalSla: 0, stages: [] });

        await logAudit('Job', job._id, 'CREATE', req.user._id, { title: job.title }, req);

        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get All Jobs (filtered by role)
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'AGENT') {
            query.postedBy = req.user._id;
        } else if (req.user.role === 'CONTRACTOR') {
            // Show Open jobs or assigned
            query = {
                $or: [
                    { status: 'open' },
                    { 'bids.contractorId': req.user._id }
                ]
            };
        }
        const jobs = await Job.find(query);
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Job
router.get('/:id', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
