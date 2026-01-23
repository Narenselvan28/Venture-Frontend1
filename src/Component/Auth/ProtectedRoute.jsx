import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();

    // In a real app, you might use a specific auth hook or context
    // For now, checking localStorage as per current api.js pattern
    const role = localStorage.getItem('userRole');

    // Check if user is authenticated (basic check: existence of role)
    // IMPORTANT: The backend 'protect' middleware does the real token verification.
    // This is just for UI redirection.
    if (!role) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Check for role permission
    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect based on their actual role or to unauthorized page
        if (role === 'AGENT') return <Navigate to="/agent/dashboard" replace />;
        if (role === 'CONTRACTOR') return <Navigate to="/contractor/dashboard" replace />;
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
