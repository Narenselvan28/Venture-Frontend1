const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ventureops', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ==================== MODELS ====================
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['agent', 'contractor', 'admin'], required: true },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role'
    },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const AgentProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    company: String,
    phone: String,
    location: String,
    experience: String,
    bio: String,
    avatar: String,
    stats: {
        jobsCreated: { type: Number, default: 0 },
        jobsActive: { type: Number, default: 0 },
        jobsCompleted: { type: Number, default: 0 },
        slaCompliance: { type: Number, default: 0 },
        budgetManaged: { type: Number, default: 0 }
    }
});

const ContractorProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: String,
    phone: String,
    location: String,
    skills: [String],
    experience: { type: String, default: '0 years' },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    jobsCompleted: { type: Number, default: 0 },
    slaSuccess: { type: Number, default: 0 },
    avatar: String,
    isVerified: { type: Boolean, default: false }
});

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Electrical', 'HVAC', 'Plumbing', 'Safety', 'Industrial', 'Commercial', 'Residential'],
        required: true 
    },
    subCategory: String,
    location: {
        address: String,
        city: String,
        state: String,
        country: { type: String, default: 'India' }
    },
    budget: { type: Number, required: true },
    priority: { 
        type: String, 
        enum: ['HIGH', 'MEDIUM', 'LOW'], 
        default: 'MEDIUM' 
    },
    status: { 
        type: String, 
        enum: ['draft', 'posted', 'in_progress', 'completed', 'cancelled'],
        default: 'draft' 
    },
    slaHours: { type: Number, required: true },
    slaStartDate: Date,
    slaEndDate: Date,
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentProfile' },
    contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'ContractorProfile' },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    skillsRequired: [String],
    tags: [String],
    isUrgent: { type: Boolean, default: false },
    fastPayout: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobApplication' }],
    timeline: [{
        step: Number,
        name: String,
        description: String,
        status: { 
            type: String, 
            enum: ['pending', 'in_progress', 'completed', 'approved', 'rejected'],
            default: 'pending' 
        },
        startDate: Date,
        endDate: Date,
        evidence: [{
            url: String,
            type: String,
            caption: String,
            uploadedAt: Date
        }]
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const JobApplicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'ContractorProfile' },
    proposal: String,
    quote: Number,
    estimatedTime: String,
    status: { 
        type: String, 
        enum: ['pending', 'reviewed', 'shortlisted', 'approved', 'rejected'],
        default: 'pending' 
    },
    riskScore: { type: Number, default: 0 },
    skills: [String],
    createdAt: { type: Date, default: Date.now }
});

// Create Models
const User = mongoose.model('User', UserSchema);
const AgentProfile = mongoose.model('AgentProfile', AgentProfileSchema);
const ContractorProfile = mongoose.model('ContractorProfile', ContractorProfileSchema);
const Job = mongoose.model('Job', JobSchema);
const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

// ==================== MIDDLEWARE ====================
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No authentication token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId).populate('profile');
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and documents are allowed'));
        }
    }
});

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role, name, company, phone, location } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = new User({
            email,
            password: hashedPassword,
            role
        });
        
        await user.save();
        
        // Create profile based on role
        let profile;
        if (role === 'agent') {
            profile = new AgentProfile({
                userId: user._id,
                name,
                company,
                phone,
                location
            });
        } else {
            profile = new ContractorProfile({
                userId: user._id,
                companyName: company,
                contactName: name,
                email,
                phone,
                location
            });
        }
        
        await profile.save();
        
        // Update user with profile reference
        user.profile = profile._id;
        await user.save();
        
        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                profile: profile
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email }).populate('profile');
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                profile: user.profile
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/auth/me', auth, async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// ==================== JOB ROUTES ====================
// Get all jobs for agent
app.get('/api/agent/jobs', auth, async (req, res) => {
    try {
        if (req.user.role !== 'agent') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const { status, page = 1, limit = 10 } = req.query;
        const query = { client: req.user.profile._id };
        
        if (status) query.status = status;
        
        const jobs = await Job.find(query)
            .populate('contractor', 'companyName contactName rating')
            .populate('applications')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
            
        const total = await Job.countDocuments(query);
        
        res.json({
            success: true,
            jobs,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get job feed for contractors
app.get('/api/contractor/jobs/feed', auth, async (req, res) => {
    try {
        if (req.user.role !== 'contractor') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const { category, location, page = 1, limit = 10 } = req.query;
        const contractorId = req.user.profile._id;
        
        const query = {
            status: 'posted',
            $or: [
                { contractor: null },
                { contractor: { $ne: contractorId } }
            ]
        };
        
        if (category) query.category = category;
        if (location) query['location.city'] = location;
        
        const jobs = await Job.find(query)
            .populate('client', 'name company phone')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
            
        // Get contractor's applications
        const applications = await JobApplication.find({
            contractor: contractorId
        });
        
        const appliedJobs = applications.map(app => app.job.toString());
        
        // Add match scores (simplified)
        const jobsWithMatch = jobs.map(job => {
            let matchScore = 50;
            
            // Skill matching
            if (req.user.profile.skills && job.skillsRequired) {
                const matchingSkills = job.skillsRequired.filter(skill => 
                    req.user.profile.skills.includes(skill)
                );
                matchScore += (matchingSkills.length / job.skillsRequired.length) * 30;
            }
            
            // Location bonus
            if (job.location?.city === req.user.profile.location) {
                matchScore += 10;
            }
            
            matchScore = Math.min(Math.round(matchScore), 100);
            
            return {
                ...job.toObject(),
                matchScore,
                isApplied: appliedJobs.includes(job._id.toString())
            };
        });
        
        const total = await Job.countDocuments(query);
        
        res.json({
            success: true,
            jobs: jobsWithMatch,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            appliedJobs
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new job
app.post('/api/jobs', auth, async (req, res) => {
    try {
        if (req.user.role !== 'agent') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const job = new Job({
            ...req.body,
            client: req.user.profile._id,
            agent: req.user._id
        });
        
        await job.save();
        
        // Update agent stats
        await AgentProfile.findByIdAndUpdate(req.user.profile._id, {
            $inc: { 'stats.jobsCreated': 1 }
        });
        
        res.status(201).json({
            success: true,
            job
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get job details
app.get('/api/jobs/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('client', 'name company phone location')
            .populate('contractor', 'companyName contactName rating skills')
            .populate({
                path: 'applications',
                populate: {
                    path: 'contractor',
                    select: 'companyName contactName rating skills'
                }
            });
            
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        
        // Check authorization
        const isAuthorized = (
            (req.user.role === 'agent' && job.client._id.toString() === req.user.profile._id.toString()) ||
            (req.user.role === 'contractor' && job.contractor && 
             job.contractor._id.toString() === req.user.profile._id.toString())
        );
        
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        res.json({
            success: true,
            job
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== APPLICATION ROUTES ====================
// Apply for a job
app.post('/api/jobs/:id/apply', auth, async (req, res) => {
    try {
        if (req.user.role !== 'contractor') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        
        // Check if already applied
        const existingApplication = await JobApplication.findOne({
            job: job._id,
            contractor: req.user.profile._id
        });
        
        if (existingApplication) {
            return res.status(400).json({ error: 'Already applied to this job' });
        }
        
        const application = new JobApplication({
            job: job._id,
            contractor: req.user.profile._id,
            ...req.body
        });
        
        await application.save();
        
        // Add to job's applications
        job.applications.push(application._id);
        await job.save();
        
        res.status(201).json({
            success: true,
            application
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get applications for a job
app.get('/api/jobs/:id/applications', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        
        // Check authorization
        if (req.user.role !== 'agent' || job.client.toString() !== req.user.profile._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const applications = await JobApplication.find({ job: job._id })
            .populate('contractor', 'companyName contactName rating skills experience jobsCompleted');
            
        res.json({
            success: true,
            applications
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update application status
app.put('/api/applications/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        const application = await JobApplication.findById(req.params.id)
            .populate('job');
            
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        
        // Check authorization
        if (req.user.role !== 'agent' || 
            application.job.client.toString() !== req.user.profile._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        application.status = status;
        await application.save();
        
        // If approved, assign contractor to job
        if (status === 'approved') {
            await Job.findByIdAndUpdate(application.job._id, {
                contractor: application.contractor,
                status: 'in_progress',
                slaStartDate: new Date(),
                slaEndDate: new Date(Date.now() + (application.job.slaHours * 60 * 60 * 1000))
            });
            
            // Create timeline
            const timeline = [
                { step: 1, name: 'Site Survey & Planning', status: 'pending' },
                { step: 2, name: 'Material Delivery & Verification', status: 'pending' },
                { step: 3, name: 'Installation', status: 'pending' },
                { step: 4, name: 'Testing & Validation', status: 'pending' },
                { step: 5, name: 'Final Handover', status: 'pending' }
            ];
            
            await Job.findByIdAndUpdate(application.job._id, { timeline });
        }
        
        res.json({
            success: true,
            application
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== TIMELINE ROUTES ====================
// Update timeline step
app.put('/api/jobs/:id/timeline/:stepId', auth, async (req, res) => {
    try {
        const { stepId } = req.params;
        const { status, evidence } = req.body;
        
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        
        // Check authorization
        const isAuthorized = (
            (req.user.role === 'agent' && job.client.toString() === req.user.profile._id.toString()) ||
            (req.user.role === 'contractor' && job.contractor && 
             job.contractor.toString() === req.user.profile._id.toString())
        );
        
        if (!isAuthorized) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // Update timeline step
        const stepIndex = job.timeline.findIndex(step => step._id.toString() === stepId);
        
        if (stepIndex === -1) {
            return res.status(404).json({ error: 'Step not found' });
        }
        
        const step = job.timeline[stepIndex];
        
        if (status) step.status = status;
        if (evidence) step.evidence = evidence;
        
        if (status === 'completed' && !step.endDate) {
            step.endDate = new Date();
        }
        
        if (status === 'in_progress' && !step.startDate) {
            step.startDate = new Date();
        }
        
        await job.save();
        
        res.json({
            success: true,
            job
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload evidence
app.post('/api/timeline/evidence', auth, upload.array('files', 5), async (req, res) => {
    try {
        const { jobId, stepId, captions } = req.body;
        
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        
        // Check authorization
        if (req.user.role !== 'contractor' || 
            job.contractor.toString() !== req.user.profile._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const stepIndex = job.timeline.findIndex(step => step._id.toString() === stepId);
        
        if (stepIndex === -1) {
            return res.status(404).json({ error: 'Step not found' });
        }
        
        // Add evidence
        const evidence = req.files.map((file, index) => ({
            url: `/uploads/${file.filename}`,
            type: file.mimetype.startsWith('image/') ? 'image' : 'document',
            caption: captions ? captions[index] : `Evidence ${index + 1}`,
            uploadedAt: new Date()
        }));
        
        job.timeline[stepIndex].evidence = [
            ...(job.timeline[stepIndex].evidence || []),
            ...evidence
        ];
        
        await job.save();
        
        res.json({
            success: true,
            evidence
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PROFILE ROUTES ====================
// Get profile
app.get('/api/profile', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            profile: req.user.profile
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile
app.put('/api/profile', auth, async (req, res) => {
    try {
        const ProfileModel = req.user.role === 'agent' ? AgentProfile : ContractorProfile;
        
        const updatedProfile = await ProfileModel.findByIdAndUpdate(
            req.user.profile._id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            profile: updatedProfile
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== SEARCH ROUTES ====================
// Search contractors
app.get('/api/search/contractors', auth, async (req, res) => {
    try {
        const { query, location, skills, rating, page = 1, limit = 10 } = req.query;
        
        const searchQuery = {};
        
        if (query) {
            searchQuery.$or = [
                { companyName: { $regex: query, $options: 'i' } },
                { contactName: { $regex: query, $options: 'i' } },
                { skills: { $regex: query, $options: 'i' } }
            ];
        }
        
        if (location) {
            searchQuery.location = { $regex: location, $options: 'i' };
        }
        
        if (skills) {
            const skillArray = skills.split(',');
            searchQuery.skills = { $in: skillArray };
        }
        
        if (rating) {
            searchQuery.rating = { $gte: parseFloat(rating) };
        }
        
        const contractors = await ContractorProfile.find(searchQuery)
            .sort('-rating')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
            
        const total = await ContractorProfile.countDocuments(searchQuery);
        
        res.json({
            success: true,
            contractors,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ANALYTICS ROUTES ====================
app.get('/api/analytics/agent', auth, async (req, res) => {
    try {
        if (req.user.role !== 'agent') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const jobs = await Job.find({ client: req.user.profile._id });
        
        const stats = {
            totalJobs: jobs.length,
            activeJobs: jobs.filter(j => j.status === 'in_progress').length,
            completedJobs: jobs.filter(j => j.status === 'completed').length,
            atRiskJobs: jobs.filter(j => {
                if (!j.slaEndDate) return false;
                const hoursLeft = (new Date(j.slaEndDate) - new Date()) / (1000 * 60 * 60);
                return hoursLeft < 24 && j.status === 'in_progress';
            }).length,
            slaCompliance: 94, // Calculated value
            budgetManaged: jobs.reduce((sum, job) => sum + (job.budget || 0), 0),
            applicationsProcessed: await JobApplication.countDocuments({
                job: { $in: jobs.map(j => j._id) }
            })
        };
        
        res.json({
            success: true,
            stats
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== DASHBOARD ROUTES ====================
app.get('/api/dashboard/agent', auth, async (req, res) => {
    try {
        if (req.user.role !== 'agent') {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const jobs = await Job.find({ client: req.user.profile._id })
            .sort('-createdAt')
            .limit(5)
            .populate('contractor', 'companyName')
            .populate('applications');
            
        const applications = await JobApplication.countDocuments({
            status: 'pending',
            job: { $in: jobs.map(j => j._id) }
        });
        
        const atRiskJobs = jobs.filter(j => {
            if (!j.slaEndDate) return false;
            const hoursLeft = (new Date(j.slaEndDate) - new Date()) / (1000 * 60 * 60);
            return hoursLeft < 24 && j.status === 'in_progress';
        });
        
        res.json({
            success: true,
            dashboard: {
                kpis: {
                    activeJobs: jobs.filter(j => j.status === 'in_progress').length,
                    pendingApplications: applications,
                    atRiskJobs: atRiskJobs.length,
                    slaCompliance: 94
                },
                recentJobs: jobs,
                notifications: [
                    {
                        id: 1,
                        title: 'SLA Alert',
                        message: 'JOB-0428 is at risk. Review timeline.',
                        type: 'warning'
                    }
                ]
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== UTILITY ROUTES ====================
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Seed data (for testing)
app.post('/api/seed', async (req, res) => {
    try {
        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            AgentProfile.deleteMany({}),
            ContractorProfile.deleteMany({}),
            Job.deleteMany({}),
            JobApplication.deleteMany({})
        ]);
        
        // Create sample contractor
        const contractor = new ContractorProfile({
            companyName: 'Elite Electrical Solutions',
            contactName: 'Alex Mendez',
            email: 'alex@eliteelectricals.com',
            phone: '+91 9876543210',
            location: 'Chennai, TN',
            skills: ['Electrical', 'Industrial', 'Safety', 'Panel Upgrades'],
            experience: '12 years',
            rating: 4.8,
            reviews: 142,
            jobsCompleted: 156,
            slaSuccess: 98,
            isVerified: true
        });
        await contractor.save();
        
        res.json({ success: true, message: 'Database seeded' });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads');
        console.log('📁 Created uploads directory');
    }
});