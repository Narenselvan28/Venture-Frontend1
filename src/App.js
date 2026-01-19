import AgentHome from "./Component/Agent/AgentHome";
import AgentNavbar from "./Component/Agent/AgentNavbar";
import "./app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgentJobs from "./Component/Agent/AgentJobs";
import AgentApplications from "./Component/Agent/AgentApplications";
import AgentSearch from "./Component/Agent/AgentSearch";
import AgentProfile from "./Component/Agent/AgentProfile";
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
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<AgentHome />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;
