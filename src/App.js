import AuthPage from "./Component/Signup";
import AgentHome from "./Component/Agent/AgentHome";
import AgentNavbar from "./Component/Agent/AgentNavbar";
import ContractorNavbar from "./Component/Contractor/ContractorNavbar";
import AgentSearch from "./Component/Agent/AgentSearch";
import AgentJobs from "./Component/Agent/AgentJobs";
import AgentApplications from "./Component/Agent/AgentApplications";
import AgentProfile from "./Component/Agent/AgentProfile";
import ExecutionTimeline from "./Component/Agent/AgentTimeline";
import ContractorDashboard from "./Component/Contractor/ContractorDashboard";
import ContractorJobFeed from "./Component/Contractor/ContractorJobFeed";
import ContractorProfile from "./Component/Contractor/ContractorProfile";
import ContractorJobSearch from "./Component/Contractor/ContractorSearchJob";
import CreateTimeline from "./Component/Contractor/ContractorTimeline";
import "./app.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    // Redirect to appropriate dashboard if role doesn't match
    return <Navigate to={userRole === 'AGENT' ? '/agent/dashboard' : '/contractor/dashboard'} replace />;
  }

  return children;
};

// Navbar Wrapper to handle conditional rendering
const AppNavbar = () => {
  const location = useLocation();
  const path = location.pathname;

  // Don't show navbar on auth page
  if (path === '/auth' || path === '/') {
    return null;
  }

  // Show Contractor Navbar for contractor routes
  if (path.startsWith('/contractor')) {
    return <ContractorNavbar />;
  }

  // Show Agent Navbar for agent routes (defaulting to agent for /home etc for now, or could check role)
  // Also showing Agent nav as default for now if not auth
  return <AgentNavbar />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App bg-gray-50 min-h-screen">
        <AppNavbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Agent Routes */}
          {/* Agent Routes */}
          <Route path="/agent/dashboard" element={<ProtectedRoute allowedRole="AGENT"><AgentHome /></ProtectedRoute>} />
          <Route path="/agent/home" element={<Navigate to="/agent/dashboard" replace />} />
          <Route path="/home" element={<Navigate to="/agent/dashboard" replace />} />
          <Route path="/" element={<ProtectedRoute allowedRole="AGENT"><AgentHome /></ProtectedRoute>} />
          <Route path="/agent/search" element={<ProtectedRoute allowedRole="AGENT"><AgentSearch /></ProtectedRoute>} />
          <Route path="/agent/jobs" element={<ProtectedRoute allowedRole="AGENT"><AgentJobs /></ProtectedRoute>} />
          <Route path="/agent/applications" element={<ProtectedRoute allowedRole="AGENT"><AgentApplications /></ProtectedRoute>} />
          <Route path="/agent/profile" element={<ProtectedRoute allowedRole="AGENT"><AgentProfile /></ProtectedRoute>} />
          <Route path="/agent/timeline" element={<ProtectedRoute allowedRole="AGENT"><ExecutionTimeline /></ProtectedRoute>} />

          {/* Contractor Routes */}
          {/* Contractor Routes */}
          <Route path="/contractor/dashboard" element={<ProtectedRoute allowedRole="CONTRACTOR"><ContractorDashboard /></ProtectedRoute>} />
          <Route path="/contractordashboard" element={<Navigate to="/contractor/dashboard" replace />} />
          <Route path="/contractor/jobs" element={<ProtectedRoute allowedRole="CONTRACTOR"><ContractorJobFeed /></ProtectedRoute>} />
          <Route path="/contractor/profile" element={<ProtectedRoute allowedRole="CONTRACTOR"><ContractorProfile /></ProtectedRoute>} />
          <Route path="/contractor/search" element={<ProtectedRoute allowedRole="CONTRACTOR"><ContractorJobSearch /></ProtectedRoute>} />
          <Route path="/contractor/timeline" element={<ProtectedRoute allowedRole="CONTRACTOR"><CreateTimeline /></ProtectedRoute>} />
          {/* Placeholder for performance if component exists, otherwise redirect to dashboard */}
          <Route path="/contractor/performance" element={<ProtectedRoute allowedRole="CONTRACTOR"><ContractorDashboard /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
