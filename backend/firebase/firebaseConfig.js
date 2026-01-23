const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// This module exports helper functions, but admin init happens in server.js mostly. 
// However, ensuring singleton usage is good.

let initialized = false;

module.exports = {
    initializeFirebase: () => {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
            initialized = true;
        }
        return admin;
    },

    // Real-time database helpers
    getDatabase: () => admin.database(),

    // Storage helpers
    getStorage: () => admin.storage().bucket(),

    // Auth helpers
    verifyToken: async (token) => {
        try {
            if (!admin.apps.length) module.exports.initializeFirebase();
            const decodedToken = await admin.auth().verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            throw new Error('Invalid token');
        }
    },

    // Send notification
    sendNotification: async (token, title, body, data = {}) => {
        try {
            if (!admin.apps.length) module.exports.initializeFirebase();
            const message = {
                notification: {
                    title,
                    body
                },
                data,
                token
            };

            const response = await admin.messaging().send(message);
            return response;
        } catch (error) {
            console.error('Notification error:', error);
            throw error;
        }
    },

    // Upload file to Firebase Storage
    uploadFile: async (fileBuffer, fileName, metadata = {}) => {
        try {
            if (!admin.apps.length) module.exports.initializeFirebase();
            const bucket = admin.storage().bucket();
            const file = bucket.file(fileName);

            await file.save(fileBuffer, {
                metadata: {
                    contentType: metadata.contentType || 'application/octet-stream',
                    metadata: {
                        ...metadata,
                        uploadedAt: new Date().toISOString()
                    }
                }
            });

            await file.makePublic();

            return {
                url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
                fileName,
                size: fileBuffer.length
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    },

    // Get signed URL for private files
    getSignedUrl: async (fileName, expiresIn = 3600) => {
        try {
            if (!admin.apps.length) module.exports.initializeFirebase();
            const bucket = admin.storage().bucket();
            const file = bucket.file(fileName);

            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + expiresIn * 1000
            });

            return url;
        } catch (error) {
            console.error('Signed URL error:', error);
            throw error;
        }
    }
};
