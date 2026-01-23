import React, { useState, useEffect } from "react";
import Login from "./Component/Auth/Login";
import Signup from "./Component/Auth/Signup";
import AgentHome from "./Component/Agent/AgentHome";
import UnifiedNavbar from "./Component/Common/UnifiedNavbar";
import AgentSearch from "./Component/Agent/AgentSearch";
import AgentJobs from "./Component/Agent/AgentJobs";
import AgentApplications from "./Component/Agent/AgentApplications";
import AgentProfile from "./Component/Agent/AgentProfile";

import ContractorDashboard from "./Component/Contractor/ContractorDashboard";
import ContractorJobFeed from "./Component/Contractor/ContractorJobFeed";
import ContractorProfile from "./Component/Contractor/ContractorProfile";
import ContractorSearchJob from "./Component/Contractor/ContractorSearchJob";
import ContractorTimeline from "./Component/Contractor/ContractorTimeline";
import JobDetails from "./Component/Common/JobDetails";
import "./app.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import api from "./services/api";
import ProtectedRoute from "./Component/Auth/ProtectedRoute";

// Navbar Wrapper to handle conditional rendering
const AppNavbar = ({ user }) => {
  const location = useLocation();
  const path = location.pathname;

  // Don't show navbar on auth pages
  if (path.startsWith('/auth') || path === '/') {
    return null;
  }

  return <UnifiedNavbar user={user} />;
};



function App() {
  // Initial user state from localStorage if available
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <AppNavbar user={user} />

        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Public Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />

          {/* Agent Routes - Protected */}
          <Route path="/agent/*" element={
            <ProtectedRoute allowedRoles={['AGENT']}>
              <Routes>
                <Route path="dashboard" element={<AgentHome />} />
                <Route path="search" element={<AgentSearch />} />
                <Route path="jobs" element={<AgentJobs />} />
                <Route path="jobs/:jobId" element={<AgentJobs />} />
                <Route path="applications" element={<AgentApplications />} />
                <Route path="profile" element={<AgentProfile />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Contractor Routes - Protected */}
          <Route path="/contractor/*" element={
            <ProtectedRoute allowedRoles={['CONTRACTOR']}>
              <Routes>
                <Route path="dashboard" element={<ContractorDashboard />} />
                <Route path="jobs" element={<ContractorJobFeed />} />
                <Route path="jobs/:jobId" element={<ContractorJobFeed />} />
                <Route path="search" element={<ContractorSearchJob />} />
                <Route path="timeline" element={<ContractorTimeline />} />
                <Route path="profile" element={<ContractorProfile />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Shared/Common Routes */}
          <Route path="/jobs/:id/details" element={
            <ProtectedRoute allowedRoles={['AGENT', 'CONTRACTOR']}>
              <JobDetails />
            </ProtectedRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
