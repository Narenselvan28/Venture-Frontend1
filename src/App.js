import AgentHome from "./Component/Agent/AgentHome";
import AgentNavbar from "./Component/Agent/AgentNavbar";
import "./app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgentJobs from "./Component/Agent/AgentJobs";
import AgentApplications from "./Component/Agent/AgentApplications";
import AgentSearch from "./Component/Agent/AgentSearch";
import AgentProfile from "./Component/Agent/AgentProfile";
import ExecutionTimeline from "./Component/Agent/AgentTimeline";
import ContractorJobFeed from "./Component/Contractor/ContractorJobFeed";
import AuthPage from "./Component/Signup";
import ContractorDashboard from "./Component/Contractor/ContractorDashboard";
import ContractorProfile from "./Component/Contractor/ContractorProfile";
import ContractorJobSearch from "./Component/Contractor/ContractorSearchJob";
import CreateTimeline from "./Component/Contractor/ContractorTimeline";
function App() {
  return (
    <BrowserRouter>
     
      <div className="App bg-gray-50 min-h-screen">
        <AgentNavbar />
        <Routes>
          <Route path="/" element={<AgentHome />} />
          <Route path="/home" element={<AgentHome />} />
          <Route path="/search" element={<AgentSearch />} />
          <Route path="/jobs" element={<AgentJobs />} />
          <Route path="/applications" element={<AgentApplications />} />
          <Route path="/profile" element={<AgentProfile />} />
          <Route path="/agenttimeline" element={<ExecutionTimeline/>} />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<AgentHome />} />
          <Route path="/contractorjobs" element={<ContractorJobFeed />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/contractordashboard" element={<ContractorDashboard />} />
          <Route path="/contractorprofile" element={<ContractorProfile />} />
          <Route path="/contractorjobsearch" element={<ContractorJobSearch />} />
          <Route path="/createtimeline" element={<CreateTimeline />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;
