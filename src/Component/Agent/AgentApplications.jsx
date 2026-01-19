// pages/AgentApplications.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Bell,
  Eye,
  Users,
  Clock,
  Award,
  AlertTriangle,
  FileText,
  BarChart,
  CheckCircle,
  XCircle,
  Download,
  TrendingUp,
  Star,
  Shield,
  Calendar,
  DollarSign,
  MapPin,
  Zap,
  Briefcase,
  MessageSquare,
  GitCompare,
  ExternalLink,
  MoreVertical,
  Plus,
  Mail,
  Phone,
  User,
  Building,
  Target,
  PieChart,
  TrendingDown,
  Check,
  X,
  Activity,
  Award as Trophy,
  Cpu,
  Settings,
  Play,
  Pause,
  RotateCcw,
  DownloadCloud,
  UploadCloud,
  Hash,
  Percent,
  Layers,
  Sparkles,
  Target as Bullseye,
  BarChart2,
  Package,
  Tag,
} from 'lucide-react';

const AgentApplications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedJobs, setExpandedJobs] = useState([]);
  const [selectedAgentApplications, setSelectedAgentApplications] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Enhanced KPI Data with trends
  const kpis = [
    { 
      label: 'Total AgentApplications', 
      value: '142', 
      trend: '+8%', 
      trendUp: true,
      icon: <Package size={20} className="text-blue-500" />,
      color: 'from-blue-50 to-blue-100',
      border: 'border-blue-200'
    },
    { 
      label: 'New Today', 
      value: '24', 
      trend: '+12%', 
      trendUp: true,
      icon: <Zap size={20} className="text-green-500" />,
      color: 'from-green-50 to-emerald-100',
      border: 'border-green-200'
    },
    { 
      label: 'Awaiting Review', 
      value: '38', 
      trend: '-5%', 
      trendUp: false,
      icon: <Clock size={20} className="text-yellow-500" />,
      color: 'from-yellow-50 to-amber-100',
      border: 'border-yellow-200'
    },
    { 
      label: 'Approved', 
      value: '67', 
      trend: '+15%', 
      trendUp: true,
      icon: <CheckCircle size={20} className="text-emerald-500" />,
      color: 'from-emerald-50 to-teal-100',
      border: 'border-emerald-200'
    },
    { 
      label: 'Rejected', 
      value: '32', 
      trend: '+3%', 
      trendUp: false,
      icon: <XCircle size={20} className="text-red-500" />,
      color: 'from-red-50 to-rose-100',
      border: 'border-red-200'
    },
    { 
      label: 'Conversion Rate', 
      value: '47.2%', 
      trend: '+2.4%', 
      trendUp: true,
      icon: <Percent size={20} className="text-purple-500" />,
      color: 'from-purple-50 to-violet-100',
      border: 'border-purple-200'
    },
  ];

  // Enhanced job groups with more data
  const jobGroups = [
    {
      id: 'JOB-0428',
      title: 'Electrical Panel Upgrade',
      location: 'Chennai, TN',
      priority: 'HIGH',
      budget: '₹2,50,000',
      actualBids: '₹2,30,000 - ₹2,60,000',
      slaRemaining: '48h',
      slaStatus: 'ON_TRACK',
      riskLevel: 'Low',
      totalAgentApplications: 8,
      newAgentApplications: 3,
      shortlisted: 2,
      client: 'Global Corp Ltd',
      clientRating: 4.8,
      projectType: 'Industrial',
      startDate: 'Mar 25, 2024',
      photos: 12,
      tags: ['Electrical', 'Safety', 'Industrial'],
      Agentapplications: [
        {
          id: 'APP-001',
          contractor: 'Alex Mendez',
          company: 'Elite Electrical Solutions',
          rating: 4.6,
          reviews: 128,
          pastJobs: 42,
          successRate: 96,
          reliability: 98,
          bidAmount: '₹2,40,000',
          estimatedTime: '3 Days',
          actualTime: '2.5 Days',
          riskScore: 12,
          riskLevel: 'Low',
          appliedTime: '2h ago',
          status: 'new',
          skills: ['Wiring', 'Safety Compliance', 'Circuit Design', 'Automation'],
          proposal: 'Complete panel replacement with smart monitoring and IoT integration. Includes 2-year warranty.',
          email: 'alex@eliteelectricals.com',
          phone: '+91 9876543210',
          location: 'Chennai',
          experience: '8 years',
          certifications: ['ISO 9001', 'Electrical Safety'],
          attachments: 3,
          lastActive: 'Online',
          responseTime: '15 mins',
          portfolio: 'https://portfolio.eliteelectricals.com'
        },
        {
          id: 'APP-002',
          contractor: 'Rahul Sharma',
          company: 'PowerTech Solutions',
          rating: 4.8,
          reviews: 214,
          pastJobs: 67,
          successRate: 98,
          reliability: 99,
          bidAmount: '₹2,55,000',
          estimatedTime: '4 Days',
          actualTime: '3.2 Days',
          riskScore: 8,
          riskLevel: 'Very Low',
          appliedTime: '1d ago',
          status: 'reviewed',
          skills: ['HV Systems', 'Automation', 'Testing', 'Smart Grid'],
          proposal: 'Advanced smart panel with remote monitoring and predictive maintenance capabilities.',
          email: 'rahul@powertech.com',
          phone: '+91 8765432109',
          location: 'Bangalore',
          experience: '12 years',
          certifications: ['ISO 14001', 'LEED'],
          attachments: 5,
          lastActive: '2h ago',
          responseTime: '30 mins',
          portfolio: 'https://powertech-solutions.com'
        },
        {
          id: 'APP-003',
          contractor: 'Karthik Venkat',
          company: 'SafeWires Engineering',
          rating: 4.3,
          reviews: 89,
          pastJobs: 23,
          successRate: 88,
          reliability: 92,
          bidAmount: '₹2,30,000',
          estimatedTime: '5 Days',
          actualTime: '4.8 Days',
          riskScore: 35,
          riskLevel: 'Medium',
          appliedTime: '3h ago',
          status: 'new',
          skills: ['Residential', 'Commercial', 'Safety'],
          proposal: 'Focus on safety compliance with detailed documentation and certification.',
          email: 'karthik@safewires.com',
          phone: '+91 7654321098',
          location: 'Chennai',
          experience: '5 years',
          certifications: ['OSHA'],
          attachments: 2,
          lastActive: 'Online',
          responseTime: '45 mins',
          portfolio: 'https://safewires-eng.com'
        }
      ]
    },
    {
      id: 'JOB-0429',
      title: 'HVAC System Installation - Corporate Office',
      location: 'Bangalore, KA',
      priority: 'MEDIUM',
      budget: '₹4,80,000',
      actualBids: '₹4,50,000 - ₹5,20,000',
      slaRemaining: '72h',
      slaStatus: 'AT_RISK',
      riskLevel: 'Medium',
      totalAgentApplications: 6,
      newAgentApplications: 1,
      shortlisted: 3,
      client: 'Tech Solutions Inc',
      clientRating: 4.6,
      projectType: 'Commercial',
      startDate: 'Mar 28, 2024',
      photos: 8,
      tags: ['HVAC', 'Commercial', 'Energy Efficient'],
      Agentapplications: [
        {
          id: 'APP-004',
          contractor: 'Suresh Kumar',
          company: 'CoolTech Climate Systems',
          rating: 4.7,
          reviews: 156,
          pastJobs: 48,
          successRate: 94,
          reliability: 96,
          bidAmount: '₹4,75,000',
          estimatedTime: '6 Days',
          actualTime: '5.5 Days',
          riskScore: 15,
          riskLevel: 'Low',
          appliedTime: '5h ago',
          status: 'reviewed',
          skills: ['HVAC', 'Ducting', 'Energy Efficient', 'IoT'],
          proposal: 'Energy efficient VRF system with IoT monitoring and smart controls.',
          email: 'suresh@cooltech.com',
          phone: '+91 6543210987',
          location: 'Bangalore',
          experience: '10 years',
          certifications: ['ASHRAE', 'Energy Star'],
          attachments: 4,
          lastActive: '1h ago',
          responseTime: '20 mins',
          portfolio: 'https://cooltech-systems.com'
        }
      ]
    }
  ];

  // Advanced filters
  const advancedFilters = [
    { id: 'budget', label: 'Budget Range', options: ['Under ₹1L', '₹1-3L', '₹3-5L', '₹5L+'] },
    { id: 'experience', label: 'Experience', options: ['1-3 years', '3-5 years', '5-10 years', '10+ years'] },
    { id: 'rating', label: 'Minimum Rating', options: ['4.0+', '4.5+', '4.8+'] },
    { id: 'location', label: 'Location Radius', options: ['Same City', '50km', '100km', 'Anywhere'] }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-500/10 text-blue-700 border border-blue-200';
      case 'reviewed': return 'bg-amber-500/10 text-amber-700 border border-amber-200';
      case 'shortlisted': return 'bg-purple-500/10 text-purple-700 border border-purple-200';
      case 'approved': return 'bg-emerald-500/10 text-emerald-700 border border-emerald-200';
      case 'rejected': return 'bg-rose-500/10 text-rose-700 border border-rose-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'bg-rose-500/10 text-rose-700 border border-rose-200';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-700 border border-amber-200';
      case 'LOW': return 'bg-emerald-500/10 text-emerald-700 border border-emerald-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Very Low': return 'bg-emerald-100 text-emerald-800';
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score < 15) return 'text-emerald-600';
    if (score < 30) return 'text-green-600';
    if (score < 50) return 'text-yellow-600';
    if (score < 75) return 'text-orange-600';
    return 'text-rose-600';
  };

  const ProgressBar = ({ percentage, color = 'bg-blue-500' }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 font-sans">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <Package size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AgentApplications & Proposals</h1>
                  <p className="text-gray-600 mt-1">Review, compare, approve, and manage contractor Agentapplications across all jobs</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2">
                <DownloadCloud size={18} />
                Export
              </button>
              <button 
                onClick={() => setAnalyticsOpen(!analyticsOpen)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2"
              >
                <BarChart size={18} />
                Analytics
              </button>
            </div>
          </div>

          {/* Advanced Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl blur-xl"></div>
            <div className="relative bg-white border border-gray-300 rounded-2xl p-1">
              <div className="flex items-center">
                <div className="flex-1 pl-4">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by Job ID, Title, Contractor, Skills, Location, Proposal content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pr-4">
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                    Advanced Filters
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Settings size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {kpis.map((kpi, index) => (
              <div 
                key={index} 
                className={`bg-white border ${kpi.border} rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${kpi.color}`}>
                    {kpi.icon}
                  </div>
                  <div className={`flex items-center text-sm font-semibold ${kpi.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {kpi.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {kpi.trend}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                <div className="text-sm text-gray-600">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Job List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Job Cards */}
            {jobGroups.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-300 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Job Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                          <Briefcase size={24} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">#{job.id}</span>
                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Building size={14} />
                              <span className="text-sm">{job.client}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin size={14} />
                              <span className="text-sm">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar size={14} />
                              <span className="text-sm">{job.startDate}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Stats Row */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Budget</div>
                              <div className="text-sm font-bold text-gray-900">{job.budget}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Priority</div>
                              <div className={`px-2 py-1 rounded text-xs font-bold inline-block ${getPriorityColor(job.priority)}`}>
                                {job.priority}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">SLA Status</div>
                              <div className={`text-sm font-bold ${job.slaStatus === 'ON_TRACK' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {job.slaRemaining} remaining
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Risk Level</div>
                              <div className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(job.riskLevel)}`}>
                                {job.riskLevel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Panel */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Bell size={18} className="text-blue-500" />
                          <div className="text-sm font-medium text-gray-900">AgentApplications</div>
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-gray-900">{job.totalAgentApplications}</span>
                            {job.newAgentApplications > 0 && (
                              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                +{job.newAgentApplications} new
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => expandedJobs.includes(job.id) ? setExpandedJobs(expandedJobs.filter(id => id !== job.id)) : setExpandedJobs([...expandedJobs, job.id])}
                          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                          {expandedJobs.includes(job.id) ? (
                            <>
                              <ChevronUp size={16} />
                              Hide Agentapplications
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              Show Agentapplications ({job.totalAgentApplications})
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-1">
                          <ExternalLink size={14} />
                          Job Details
                        </button>
                        <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg flex items-center gap-1">
                          <Activity size={14} />
                          Timeline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AgentApplications Grid (Expanded) */}
                {expandedJobs.includes(job.id) && (
                  <div className="p-6 bg-gray-50/50">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-bold text-gray-900">Submitted Proposals</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Sort by:</span>
                        <select className="text-sm border-none bg-transparent focus:outline-none">
                          <option>Best Match</option>
                          <option>Lowest Price</option>
                          <option>Highest Rating</option>
                          <option>Lowest Risk</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {job.Agentapplications.map((app) => (
                        <div key={app.id} className="bg-white rounded-xl border border-gray-300 p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                          {/* Application Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                  <User size={24} className="text-blue-600" />
                                </div>
                                {app.lastActive === 'Online' && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-gray-900">{app.contractor}</h5>
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(app.status)}`}>
                                    {app.status.toUpperCase()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{app.company}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <div className="flex items-center">
                                    <Star size={12} className="text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-bold ml-1">{app.rating}</span>
                                    <span className="text-xs text-gray-500 ml-1">({app.reviews})</span>
                                  </div>
                                  <span className="text-xs text-gray-500">• {app.experience} exp</span>
                                  <span className="text-xs text-emerald-600 font-medium">{app.successRate}% success</span>
                                </div>
                              </div>
                            </div>
                            
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                              <MoreVertical size={18} />
                            </button>
                          </div>

                          {/* Bid Details */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-500 mb-1">Bid Amount</div>
                              <div className="text-lg font-bold text-gray-900">{app.bidAmount}</div>
                              <div className="text-xs text-gray-500">vs Budget: {job.budget}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="text-xs text-gray-500 mb-1">Estimated Time</div>
                              <div className="text-lg font-bold text-gray-900">{app.estimatedTime}</div>
                              <div className="text-xs text-gray-500">Avg: {app.actualTime}</div>
                            </div>
                          </div>

                          {/* Risk & Metrics */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900">Risk Score</span>
                              <span className={`text-sm font-bold ${getRiskScoreColor(app.riskScore)}`}>
                                {app.riskScore}/100
                              </span>
                            </div>
                            <ProgressBar percentage={app.riskScore} color={getRiskScoreColor(app.riskScore).replace('text-', 'bg-')} />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Very Low</span>
                              <span>Very High</span>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-2">Skills</div>
                            <div className="flex flex-wrap gap-1">
                              {app.skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                              {app.skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{app.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setSelectedApplication(app)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-1"
                              >
                                <Eye size={14} />
                                Details
                              </button>
                              <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg flex items-center gap-1">
                                <MessageSquare size={14} />
                                Chat
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleApprove(app.id)}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm font-medium rounded-lg flex items-center gap-1"
                              >
                                <Check size={14} />
                                Approve
                              </button>
                              <button 
                                onClick={() => handleReject(app.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium rounded-lg flex items-center gap-1"
                              >
                                <X size={14} />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Panel - Analytics & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-300 p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={20} className="text-blue-500" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Avg Response Time</div>
                  <div className="text-lg font-bold text-gray-900">2.4 hours</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Avg Rating</div>
                  <div className="text-lg font-bold text-gray-900">4.7/5.0</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Cost Savings</div>
                  <div className="text-lg font-bold text-emerald-600">₹1,24,500</div>
                </div>
              </div>
            </div>

            {/* System Recommendations */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-blue-500" />
                AI Recommendations
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-blue-100">
                  <div className="font-medium text-gray-900 mb-1">Best Match</div>
                  <div className="text-sm text-gray-600">JOB-0428 → Rahul Sharma</div>
                  <div className="text-xs text-emerald-600 mt-1">98% match score</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-blue-100">
                  <div className="font-medium text-gray-900 mb-1">Cost Efficient</div>
                  <div className="text-sm text-gray-600">JOB-0429 → Suresh Kumar</div>
                  <div className="text-xs text-emerald-600 mt-1">Saves ₹25,000</div>
                </div>
              </div>
            </div>

            {/* Workflow Status */}
            <div className="bg-white rounded-2xl border border-gray-300 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Workflow Status</h3>
              <div className="space-y-3">
                {[
                  { label: 'Review Stage', jobs: 8, color: 'bg-blue-500' },
                  { label: 'Shortlisting', jobs: 12, color: 'bg-purple-500' },
                  { label: 'Final Approval', jobs: 4, color: 'bg-emerald-500' },
                  { label: 'Assigned', jobs: 6, color: 'bg-green-500' },
                ].map((stage, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                      <span className="text-sm text-gray-700">{stage.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{stage.jobs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-300 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center">
                  <GitCompare size={20} className="text-blue-500 mb-1" />
                  <span className="text-xs font-medium">Compare</span>
                </button>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center">
                  <DownloadCloud size={20} className="text-green-500 mb-1" />
                  <span className="text-xs font-medium">Export All</span>
                </button>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center">
                  <Filter size={20} className="text-purple-500 mb-1" />
                  <span className="text-xs font-medium">Advanced Filter</span>
                </button>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center">
                  <BarChart size={20} className="text-amber-500 mb-1" />
                  <span className="text-xs font-medium">Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal content would go here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentApplications;