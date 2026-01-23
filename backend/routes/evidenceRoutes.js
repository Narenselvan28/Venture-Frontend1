const express = require('express');
const router = express.Router();
const StageEvidence = require('../models/StageEvidence');

// Get all evidence
router.get('/', async (req, res) => {
    try {
        const evidence = await StageEvidence.find();
        res.json(evidence);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get evidence by job or stage
router.get('/search', async (req, res) => {
    try {
        const { jobId, stageId } = req.query;
        const query = {};
        if (jobId) query.jobId = jobId;
        if (stageId) query.stageId = stageId;

        const evidence = await StageEvidence.find(query);
        res.json(evidence);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
