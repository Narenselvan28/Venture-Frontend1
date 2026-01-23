const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Check for Token (Cookie/Header)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. Dev Mode Bypass (If no token, check for Dev Role Header)
    if (!token && req.headers['x-dev-role']) {
        try {
            const devRole = req.headers['x-dev-role'].toUpperCase();
            // Allow bypassing auth for development if configured
            // In a real app, this should be behind a flag or strict env check
            if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_AUTH === 'true') {
                // Mock a user or find a dev user
                const devUser = await User.findOne({ role: devRole }).sort({ createdAt: 1 });
                if (devUser) {
                    req.user = devUser;
                    return next();
                }
            }
        } catch (error) {
            console.error('Dev Auth Error:', error);
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

module.exports = { protect, restrictTo };
