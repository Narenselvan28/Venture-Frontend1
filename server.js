/**
 * VENTUREOPS - PRODUCTION BACKEND SERVER
 * 
 * Architecture: Monolithic Node.js/Express
 * Database: MongoDB (Mongoose)
 * Storage: Firebase Admin
 * Auth: JWT (HTTP-Only Cookie + Header Support)
 * 
 * Copyright (c) 2024 VentureOps
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const cron = require('node-cron');
const firebaseAdmin = require('firebase-admin');
const path = require('path');

// Initialize Express
const app = express();

// ==========================================
// 1. CONFIGURATION & SETUP
// ==========================================

// Firebase Setup (Mock if credentials missing for dev)
let bucket;
try {
    if (process.env.FIREBASE_CREDENTIALS) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_BUCKET_URL
        });
        bucket = firebaseAdmin.storage().bucket();
        console.log('✅ Firebase Admin Initialized');
    } else {
        console.log('⚠️ Firebase Credentials missing. File uploads will be mocked.');
    }
} catch (error) {
    console.error('❌ Firebase Init Error:', error.message);
}

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Connection
const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        if (!uri) {
            console.log('⚠️ No MONGODB_URI. Starting In-Memory Mongo...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
        }
        await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${uri}`);

        // Start SLA Monitor
        slaMonitor.start();
    } catch (err) {
        console.error('❌ DB Connection Failed:', err);
        process.exit(1);
    }
};

// ==========================================
// 2. CORE ENTITIES (SCHEMAS)
// ==========================================

const Schema = mongoose.Schema;

// --- 2.1 User & Identity ---
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['AGENT', 'CONTRACTOR', 'ADMIN'], required: true },
    name: { type: String, required: true },
    companyName: String, // For Agents/Contractors
    companyType: String, // For Agents
    designation: String, // For Agents
    specializations: [String], // For Contractors
    phone: String,
    location: {
        city: String,
        state: String,
        country: String
    },
    isVerified: { type: Boolean, default: false },
    stats: {
        jobsCompleted: { type: Number, default: 0 },
        rating: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});

// --- 2.2 Job Core ---
const JobSchema = new Schema({
    jobCode: { type: String, unique: true }, // generated e.g., VOP-2024-001
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },

    // Financials
    budget: { type: Number, required: true },
    currency: { type: String, default: 'USD' },

    // Criticality
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },

    // Lifecycle Status
    status: {
        type: String,
        enum: [
            'DRAFT', 'PUBLISHED', 'BIDDING', 'ASSIGNED',
            'IN_PROGRESS', 'COMPLETION_SUBMITTED',
            'VERIFIED', 'INVOICED', 'CLOSED', 'CANCELLED'
        ],
        default: 'DRAFT'
    },

    // Risk Management
    riskState: { type: String, enum: ['ON_TRACK', 'AT_RISK', 'DELAYED'], default: 'ON_TRACK' },

    // Relationships
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contractorId: { type: Schema.Types.ObjectId, ref: 'User' },

    // SLA Config
    slaTemplateId: { type: Schema.Types.ObjectId, ref: 'SLATemplate' },
    slaDeadline: Date,

    progressPercent: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// --- 2.3 Job Timeline (Event Sourcing) ---
const TimelineEventSchema = new Schema({
    type: { type: String, required: true }, // e.g., STATUS_CHANGE, UPLOAD, COMMENT
    description: { type: String, required: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    metadata: Schema.Types.Mixed
});

const JobTimelineSchema = new Schema({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, unique: true },
    plannedStart: Date,
    plannedEnd: Date,
    actualStart: Date,
    actualEnd: Date,
    events: [TimelineEventSchema]
});

// --- 2.4 Evidence & Documents ---
const JobDocumentSchema = new Schema({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['PHOTO_BEFORE', 'PHOTO_AFTER', 'PHOTO_DURING', 'REPORT', 'INVOICE', 'PLAN'], required: true },
    url: { type: String, required: true }, // Firebase URL
    filename: String,
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    rejectionReason: String,
    uploadedAt: { type: Date, default: Date.now }
});

// --- 2.5 Audit Log ---
const AuditLogSchema = new Schema({
    entity: { type: String, required: true }, // Job, User, Invoice
    entityId: Schema.Types.ObjectId,
    action: { type: String, required: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
    details: Schema.Types.Mixed,
    ipAddress: String,
    timestamp: { type: Date, default: Date.now }
});

// --- 2.6 Applications (Bids) ---
const ApplicationSchema = new Schema({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    contractorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: String,
    quoteAmount: Number,
    estimatedDays: Number,
    status: { type: String, enum: ['PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'], default: 'PENDING' },
    createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);
const JobTimeline = mongoose.model('JobTimeline', JobTimelineSchema);
const JobDocument = mongoose.model('JobDocument', JobDocumentSchema);
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
const Application = mongoose.model('Application', ApplicationSchema);

// ==========================================
// 3. UTILITIES & SERVICES
// ==========================================

// --- 3.1 Auth Utilities ---
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET || 'dev_secret_key_123',
        { expiresIn: '7d' }
    );
};

// --- 3.2 Audit Logger ---
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

// --- 3.3 Timeline Manager ---
const updateTimeline = async (jobId, eventType, description, actorId, metadata = {}) => {
    try {
        await JobTimeline.findOneAndUpdate(
            { jobId },
            {
                $push: {
                    events: {
                        type: eventType,
                        description,
                        actorId,
                        metadata,
                        timestamp: new Date()
                    }
                }
            },
            { upsert: true, new: true }
        );
    } catch (e) {
        console.error('Timeline Update Failed:', e);
    }
};

// --- 3.4 File Upload Service ---
const uploadService = {
    middleware: multer({ storage: multer.memoryStorage() }).single('file'),

    uploadToFirebase: async (file) => {
        if (!bucket) return `https://mock-storage.com/${Date.now()}_${file.originalname}`;

        const blob = bucket.file(`ventureops/${Date.now()}_${file.originalname}`);
        const blobStream = blob.createWriteStream({
            metadata: { contentType: file.mimetype }
        });

        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => reject(err));
            blobStream.on('finish', () => {
                // Get public URL (assuming bucket is public or signed URL needed)
                // For now, return a signed URL valid for long time or public structure
                blob.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then(urls => resolve(urls[0]));
            });
            blobStream.end(file.buffer);
        });
    }
};

// --- 3.5 SLA Monitor (Cron) ---
const slaMonitor = cron.schedule('*/30 * * * *', async () => {
    console.log('🔄 Running SLA Monitor...');
    // Find jobs 'IN_PROGRESS' that are past deadline
    const now = new Date();
    const delayedJobs = await Job.find({
        status: 'IN_PROGRESS',
        slaDeadline: { $lt: now },
        riskState: { $ne: 'DELAYED' }
    });

    for (const job of delayedJobs) {
        job.riskState = 'DELAYED';
        await job.save();
        await updateTimeline(job._id, 'RISK_UPDATE', 'Job marked DELAYED due to SLA breach', null);
        console.log(`⚠️ Job ${job.jobCode} marked DELAYED`);
    }
});

// ==========================================
// 4. MIDDLEWARE
// ==========================================

const protect = async (req, res, next) => {
    let token;

    // 1. Check for Token (Cookie/Header)
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. Dev Mode Bypass (If no token, check for Dev Role Header)
    if (!token && req.headers['x-dev-role']) {
        try {
            const devRole = req.headers['x-dev-role'].toUpperCase();
            const devEmail = `dev-${devRole.toLowerCase()}@ventureops.com`;

            // Find or Create Dev User
            let user = await User.findOne({ email: devEmail });
            if (!user) {
                user = await User.create({
                    email: devEmail,
                    password: await bcrypt.hash('devpass123', 10),
                    name: `Dev ${devRole}`,
                    role: devRole,
                    companyName: 'Dev Corp',
                    companyType: 'STARTUP', // Default for Agent
                    designation: 'Developer',
                    isVerified: true
                });
                console.log(`🛠️ Created Dev User: ${devEmail}`);
            }

            req.user = user;
            return next();
        } catch (error) {
            console.error('Dev Auth Error:', error);
            // Fallthrough to standard unauthorized error
        }
    }

    if (!token) return res.status(401).json({ success: false, error: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key_123');
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Token invalid' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: 'Permission denied' });
        }
        next();
    };
};

// ==========================================
// 5. API ROUTES
// ==========================================

// --- 5.1 Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role, name, companyName, ...others } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'User exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            password: hashedPassword,
            role: role.toUpperCase(),
            name,
            companyName,
            ...others
        });

        const token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await logAudit('User', user._id, 'REGISTER', user._id, { role });

        res.status(201).json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/auth/me', protect, (req, res) => {
    res.json({ success: true, user: req.user });
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out' });
});

// --- 5.2 Job Management (Agent) ---
app.post('/api/jobs', protect, restrictTo('AGENT'), async (req, res) => {
    try {
        const jobCode = `VOP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // Calculate SLA Deadline (default 7 days for now)
        const slaDeadline = new Date();
        slaDeadline.setDate(slaDeadline.getDate() + 7);

        const job = await Job.create({
            ...req.body,
            jobCode,
            agentId: req.user._id,
            status: 'DRAFT',
            slaDeadline
        });

        // Init Timeline
        await JobTimeline.create({ jobId: job._id });
        await updateTimeline(job._id, 'CREATED', 'Job Created as Draft', req.user._id);

        res.status(201).json({ success: true, job });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 5.1 Agent/Job Management ---
app.get('/api/jobs', protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'AGENT') {
            query.agentId = req.user._id;
        } else if (req.user.role === 'CONTRACTOR') {
            // Contractors see PUBLISHED jobs OR jobs assigned to them
            query = {
                $or: [
                    { status: 'PUBLISHED' },
                    { status: 'OPEN' }, // Legacy support
                    { contractorId: req.user._id }
                ]
            };
        }

        const jobs = await Job.find(query).populate('agentId', 'name companyName');
        res.json({ success: true, count: jobs.length, jobs });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/jobs/:id', protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('agentId', 'name companyName')
            .populate('contractorId', 'name companyName');

        if (!job) return res.status(404).json({ error: 'Job not found' });

        res.json({ success: true, job });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/jobs/:id/publish', protect, restrictTo('AGENT'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.agentId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Unauthorized' });

        job.status = 'PUBLISHED';
        await job.save();
        await updateTimeline(job._id, 'PUBLISHED', 'Job opened for bidding', req.user._id);

        res.json({ success: true, job });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/jobs/:id/assign', protect, restrictTo('AGENT'), async (req, res) => {
    try {
        const { contractorId } = req.body;
        const job = await Job.findById(req.params.id);

        job.contractorId = contractorId;
        job.status = 'ASSIGNED';
        await job.save();

        await updateTimeline(job._id, 'ASSIGNED', 'Contractor assigned', req.user._id, { contractorId });
        await logAudit('Job', job._id, 'ASSIGNED', req.user._id, { contractorId });

        res.json({ success: true, job });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 5.3 Contractor Operations ---
app.post('/api/jobs/:id/apply', protect, restrictTo('CONTRACTOR'), async (req, res) => {
    try {
        const { coverLetter, quoteAmount, estimatedDays } = req.body;

        const existing = await Application.findOne({ jobId: req.params.id, contractorId: req.user._id });
        if (existing) return res.status(400).json({ error: 'Already applied' });

        const application = await Application.create({
            jobId: req.params.id,
            contractorId: req.user._id,
            coverLetter,
            quoteAmount,
            estimatedDays
        });

        await updateTimeline(req.params.id, 'APPLICATION_SUBMITTED', 'Contractor applied', req.user._id);

        res.status(201).json({ success: true, application });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/jobs/:id/start', protect, restrictTo('CONTRACTOR'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job.contractorId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not your job' });

        job.status = 'IN_PROGRESS';
        await job.save();

        // Update Actual Start in Timeline
        await JobTimeline.findOneAndUpdate({ jobId: job._id }, { actualStart: new Date() });
        await updateTimeline(job._id, 'STARTED', 'Work started', req.user._id);

        res.json({ success: true, job });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/jobs/:id/upload-proof', protect, uploadService.middleware, async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const url = await uploadService.uploadToFirebase(req.file);
        const type = req.body.type || 'PHOTO_DURING';

        const doc = await JobDocument.create({
            jobId: req.params.id,
            uploaderId: req.user._id,
            type: type,
            filename: req.file.originalname,
            url
        });

        await updateTimeline(req.params.id, 'PROOF_UPLOAD', `Proof ${type} uploaded`, req.user._id, { docId: doc._id });

        res.json({ success: true, document: doc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/jobs/:id/mark-complete', protect, restrictTo('CONTRACTOR'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job.contractorId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not your job' });

        job.status = 'COMPLETION_SUBMITTED';
        job.progressPercent = 100;
        await job.save();

        await updateTimeline(job._id, 'COMPLETION_SUBMITTED', 'Work marked complete', req.user._id);

        res.json({ success: true, job });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/jobs/:id/submit-invoice', protect, restrictTo('CONTRACTOR'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job.contractorId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not your job' });

        job.status = 'INVOICED';
        await job.save();

        await updateTimeline(job._id, 'INVOICE_SUBMITTED', 'Invoice submitted', req.user._id);

        res.json({ success: true, job });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 5.4 Timeline & Monitoring ---
app.get('/api/jobs/:id/timeline', protect, async (req, res) => {
    try {
        const timeline = await JobTimeline.findOne({ jobId: req.params.id }).populate('events.actorId', 'name role');
        res.json({ success: true, timeline });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 VentureOps Server running on port ${PORT}`);
    connectDB();
});

module.exports = app;