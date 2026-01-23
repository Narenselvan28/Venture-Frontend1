try {
    console.log("Checking backend integrity...");

    // Check Modules
    require('./models/User');
    require('./models/Job');
    require('./models/Timeline');
    require('./models/AuditLog');
    require('./models/Application');
    require('./models/StageEvidence');
    require('./models/Notification');
    console.log("✅ Models loaded successfully");

    // Check Routes
    require('./routes/authRoutes');
    require('./routes/jobRoutes');
    require('./routes/timelineRoutes');
    require('./routes/evidenceRoutes');
    require('./routes/recommendationRoutes');
    console.log("✅ Routes loaded successfully");

    // Check Utils
    require('./utils/auditLogger');
    require('./utils/slaMonitor');
    require('./middleware/authMiddleware');
    console.log("✅ Utils & Middleware loaded successfully");

    // Check Server (without running it)
    const fs = require('fs');
    if (fs.existsSync('./server.js')) {
        console.log("✅ server.js exists");
    } else {
        console.error("❌ server.js missing");
    }

    console.log("Integrity Check Passed!");
    process.exit(0);
} catch (error) {
    console.error("❌ Integrity Check Failed:", error.message);
    console.error(error.stack);
    process.exit(1);
}
