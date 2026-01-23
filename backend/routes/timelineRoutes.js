const express = require('express');
const router = express.Router();
const Timeline = require('../models/Timeline');
const { protect } = require('../middleware/authMiddleware');

// Get timeline for a job (matching frontend: /api/jobs/:id/timeline -> redirected or handled here)
// Actually frontend might call /api/timeline?jobId=... or /api/jobs/:id/timeline
// Let's support query

router.get('/', protect, async (req, res) => {
    try {
        const { jobId } = req.query;
        if (!jobId) return res.status(400).json({ error: 'jobId required' });

        let timeline = await Timeline.findOne({ jobId });
        if (!timeline) {
            return res.status(404).json({ error: 'Timeline not found' });
        }
        res.json(timeline);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create
router.post('/', protect, async (req, res) => {
    try {
        const newTimeline = await Timeline.create(req.body);
        res.status(201).json(newTimeline);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
