// pages/AgentJobs.jsx
import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Eye,
  Users,
  MapPin,
  DollarSign,
  TrendingUp, 
  Loader,
  FileText,
  Download,
  MessageSquare,
  Star,
  Award,
  Zap,
  Shield,
  BarChart,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const navigate=useNavigate;
const AgentJobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Ongoing Agentjobs with completion percentage
  const ongoingAgentJobs = [
    {
      id: "JOB-0428",
      title: "Electrical Panel Upgrade",
      client: "Global Logistics Corp",
      contractor: "Elite Engineering",
      progress: 30,
      status: "in_progress",
      amount: "$2,240",
      timeRemaining: "48h",
      location: "Chennai",
      priority: "high",
      startDate: "2024-03-20",
      slaStatus: "on_track",
      category: "Electrical",
      skills: ["Wiring", "Circuit Design", "Safety"],
      budget: "$2,500",
      photos: 5
    },
    {
      id: "JOB-0427",
      title: "HVAC System Installation",
      client: "Tech Solutions Inc",
      contractor: "Alpha Builders",
      progress: 65,
      status: "in_progress",
      amount: "$3,500",
      timeRemaining: "24h",
      location: "Bangalore",
      priority: "medium",
      startDate: "2024-03-18",
      slaStatus: "at_risk",
      category: "HVAC",
      skills: ["Installation", "Duct Work", "Testing"],
      budget: "$3,800",
      photos: 8
    },
    {
      id: "JOB-0426",
      title: "Plumbing System Overhaul",
      client: "MediCare Hospital",
      contractor: "Swift Services",
      progress: 85,
      status: "in_progress",
      amount: "$4,200",
      timeRemaining: "12h",
      location: "Mumbai",
      priority: "high",
      startDate: "2024-03-15",
      slaStatus: "delayed",
      category: "Plumbing",
      skills: ["Piping", "Drainage", "Water Supply"],
      budget: "$4,500",
      photos: 12
    },
    {
      id: "JOB-0425",
      title: "Network Cable Installation",
      client: "Retail Chain Corp",
      contractor: "Prime Contractors",
      progress: 45,
      status: "in_progress",
      amount: "$1,750",
      timeRemaining: "72h",
      location: "Delhi",
      priority: "low",
      startDate: "2024-03-22",
      slaStatus: "on_track",
      category: "Networking",
      skills: ["CAT6", "Fiber Optic", "Testing"],
      budget: "$2,000",
      photos: 3
    },
  ];

  // Completed Agentjobs data (for pagination)
  const allCompletedAgentJobs = Array.from({ length: 25 }, (_, i) => ({
    id: `JOB-${1000 + i}`,
    title: ["Office Renovation", "Server Room Setup", "Electrical Wiring", "AC Installation", "Security System"][i % 5],
    client: ["Global Corp", "Tech Inc", "Hospital Ltd", "Retail Chain", "Manufacturing"][i % 5],
    contractor: ["Elite Engineering", "Alpha Builders", "Swift Services", "Prime Contractors", "Pro Builders"][i % 5],
    status: "completed",
    amount: `$${(1200 + i * 100).toLocaleString()}`,
    completionDate: `2024-03-${(20 + i % 10)}`,
    location: ["Chennai", "Bangalore", "Mumbai", "Delhi", "Hyderabad"][i % 5],
    rating: 4.5 + (i % 5 * 0.1),
    feedback: i % 3 === 0 ? "Excellent work!" : "Good job, completed on time.",
    category: ["Construction", "IT", "Electrical", "HVAC", "Security"][i % 5],
    invoiceStatus: i % 3 === 0 ? "paid" : "pending"
  }));

  const itemsPerPage = 3;
  const totalPages = Math.ceil(allCompletedAgentJobs.length / itemsPerPage);
  const completedAgentJobs = allCompletedAgentJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Job filters
  const filters = [
    { id: 'all', label: 'All AgentJobs', count: ongoingAgentJobs.length + allCompletedAgentJobs.length },
    { id: 'ongoing', label: 'Ongoing', count: ongoingAgentJobs.length },
    { id: 'completed', label: 'Completed', count: allCompletedAgentJobs.length },
    { id: 'at_risk', label: 'At Risk', count: ongoingAgentJobs.filter(j => j.slaStatus === 'at_risk').length },
    { id: 'delayed', label: 'Delayed', count: ongoingAgentJobs.filter(j => j.slaStatus === 'delayed').length },
  ];

  // Status colors
  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getSLAStatusColor = (status) => {
    switch(status) {
      case "on_track": return "text-green-600 bg-green-50 border-green-200";
      case "at_risk": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "delayed": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getSLAStatusIcon = (status) => {
    switch(status) {
      case "on_track": return <CheckCircle size={14} />;
      case "at_risk": return <AlertTriangle size={14} />;
      case "delayed": return <Clock size={14} />;
      default: return null;
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return 'from-yellow-400 to-yellow-500';
    if (progress < 70) return 'from-orange-400 to-orange-500';
    return 'from-green-400 to-emerald-500';
  };

  const handleViewDetails = () => {
    navigate("/agenttimeline");
    // In a real app, this would navigate to job details page
  };

  const handleCreateJob = () => {
    // Navigate to create job page
    console.log('Navigate to create job');
  };

  const handleApproveInvoice = (jobId) => {
    // Approve invoice logic
    console.log('Approving invoice for:', jobId);
  };

  const handleRejectInvoice = (jobId) => {
    // Reject invoice logic
    console.log('Rejecting invoice for:', jobId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 font-sans pb-20 md:pb-6">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AgentJobs Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage and track all your ongoing and completed Agentjobs</p>
            </div>
            
            <button 
              onClick={handleCreateJob}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-sm hover:shadow transition-all self-start"
            >
              <Plus size={20} />
              <span>Create New Job</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search Agentjobs by ID, title, client, or contractor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-400 focus:outline-none">
                <option>Sort by: Latest</option>
                <option>Sort by: Priority</option>
                <option>Sort by: Deadline</option>
                <option>Sort by: Budget</option>
              </select>
              <button className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
                <Filter size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{filter.label}</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ongoing AgentJobs Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap size={22} className="text-blue-600" />
              Ongoing AgentJobs
            </h2>
            <div className="text-sm text-gray-500">
              {ongoingAgentJobs.length} active Agentjobs
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ongoingAgentJobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Progress Bar Background */}
                <div className="relative h-2">
                  <div className="absolute inset-0 bg-gray-200"></div>
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${getProgressColor(job.progress)}`}
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>

                <div className="p-6">
                  {/* Job Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-bold text-gray-400">#{job.id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${getSLAStatusColor(job.slaStatus)}`}>
                          {getSLAStatusIcon(job.slaStatus)}
                          {job.slaStatus.replace('_', ' ').toUpperCase()}
                        </span>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(job.priority)}`}></div>
                          <span className="text-xs text-gray-500">{job.priority} priority</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">{job.category}</span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{job.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{job.amount}</div>
                      <div className="text-sm text-gray-500">Budget: {job.budget}</div>
                    </div>
                  </div>

                  {/* Progress Info */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress: {job.progress}%</span>
                      <span className="font-medium text-gray-900">
                        {job.progress < 30 ? 'Early Stage' : job.progress < 70 ? 'In Progress' : 'Almost Complete'}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getProgressColor(job.progress)}`}
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Client & Contractor Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">Client</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{job.client}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500">Contractor</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{job.contractor}</div>
                    </div>
                  </div>

                  {/* Timeline & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600">Started: {job.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600">Remaining: {job.timeRemaining}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleViewDetails()}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Completed AgentJobs Section with Pagination */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle size={22} className="text-green-600" />
              Completed AgentJobs
            </h2>
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, allCompletedAgentJobs.length)} of {allCompletedAgentJobs.length} Agentjobs
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {completedAgentJobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Job Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="font-mono text-sm font-bold text-gray-400 mb-2 block">#{job.id}</span>
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">{job.category}</span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{job.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}>
                      COMPLETED
                    </div>
                  </div>

                  {/* Client & Contractor */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">Client:</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{job.client}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">Contractor:</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{job.contractor}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">Amount:</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{job.amount}</span>
                    </div>
                  </div>

                  {/* Rating & Feedback */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-gray-900">{job.rating.toFixed(1)}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        job.invoiceStatus === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {job.invoiceStatus.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 italic">"{job.feedback}"</p>
                    <div className="text-xs text-gray-500 mt-2">Completed: {job.completionDate}</div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleViewDetails()}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-lg flex items-center gap-2 justify-center transition-all"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-2 justify-center transition-colors">
                      <FileText size={16} />
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === i + 1
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Workflow Options Section */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Job Management Workflow</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Create Job */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <Plus size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Create New Job</h3>
              <p className="text-sm text-gray-600 mb-4">Publish new job requests with detailed requirements</p>
              <button 
                onClick={handleCreateJob}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700"
              >
                Start Creating →
              </button>
            </div>

            {/* View Applications */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">View Applications</h3>
              <p className="text-sm text-gray-600 mb-4">Review contractor bids and work plans</p>
              <button className="text-green-600 text-sm font-semibold hover:text-green-700">
                Check Applications →
              </button>
            </div>

            {/* Manage Invoices */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-5">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mb-4">
                <FileText size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Manage Invoices</h3>
              <p className="text-sm text-gray-600 mb-4">Approve or reject job invoices with proof</p>
              <button className="text-purple-600 text-sm font-semibold hover:text-purple-700">
                Review Invoices →
              </button>
            </div>

            {/* View Analytics */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <BarChart size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">View Analytics</h3>
              <p className="text-sm text-gray-600 mb-4">Track performance metrics and SLA compliance</p>
              <button className="text-amber-600 text-sm font-semibold hover:text-amber-700">
                See Analytics →
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Job Details Modal (would be a separate page in real app) */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Job Details: {selectedJob.id}</h3>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Job details would be shown here */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-2">Title: {selectedJob.title}</h4>
                <p className="text-gray-600">Category: {selectedJob.category}</p>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentJobs;