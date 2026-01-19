// pages/AgentHome.jsx
import React, { useState } from "react";
import {
  Briefcase,
  FileCheck,
  DollarSign,
  MessageSquare,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Calendar,
  MapPin,
  Star,
} from "lucide-react";

const AgentHome = () => {
  const [activeTimeFilter, setActiveTimeFilter] = useState('week');

  // Recent jobs/invoices data
  const recentJobs = [
    {
      id: "JOB-0428",
      title: "Electrical Panel Upgrade",
      client: "Global Logistics Corp",
      contractor: "Elite Engineering",
      status: "pending", // pending, completed, in_progress
      amount: "$2,240",
      time: "2h ago",
      location: "Chennai",
      priority: "high"
    },
    {
      id: "JOB-0427",
      title: "HVAC System Installation",
      client: "Tech Solutions Inc",
      contractor: "Alpha Builders",
      status: "completed",
      amount: "$1,250",
      time: "1d ago",
      location: "Bangalore",
      priority: "medium"
    },
    {
      id: "JOB-0426",
      title: "Plumbing System Overhaul",
      client: "MediCare Hospital",
      contractor: "Swift Services",
      status: "in_progress",
      amount: "$3,200",
      time: "3h ago",
      location: "Mumbai",
      priority: "high"
    },
    {
      id: "JOB-0425",
      title: "Network Cable Installation",
      client: "Retail Chain Corp",
      contractor: "Prime Contractors",
      status: "pending",
      amount: "$1,750",
      time: "5h ago",
      location: "Delhi",
      priority: "low"
    },
  ];

  // Agent performance data
  const agentPerformance = [
    { 
      name: "Morrisey", 
      score: 9.2, 
      role: "Senior Agent",
      completedJobs: 142,
      rating: 4.9,
      trend: "+12%"
    },
    { 
      name: "Ferdinand", 
      score: 7.5, 
      role: "Field Agent",
      completedJobs: 89,
      rating: 4.7,
      trend: "+5%"
    },
    { 
      name: "Andrew", 
      score: 4.8, 
      role: "Junior Agent",
      completedJobs: 34,
      rating: 4.2,
      trend: "-3%"
    },
  ];

  // Metrics data with improved design
  const metrics = [
    { 
      label: "Active Jobs", 
      value: "28", 
      icon: <Briefcase size={22} />, 
      color: "from-blue-500 to-blue-600", 
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      trend: "+8%",
      description: "Currently ongoing"
    },
    { 
      label: "Applications", 
      value: "45", 
      icon: <FileCheck size={22} />, 
      color: "from-green-500 to-emerald-600", 
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
      trend: "+15%",
      description: "Pending review"
    },
    { 
      label: "Revenue (MTD)", 
      value: "$24.8K", 
      icon: <DollarSign size={22} />, 
      color: "from-purple-500 to-indigo-600", 
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-100",
      trend: "+4%",
      description: "Monthly target"
    },
    { 
      label: "SLA Status", 
      value: "94%", 
      icon: <Shield size={22} />, 
      color: "from-amber-500 to-orange-600", 
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-100",
      trend: "+2%",
      description: "On-time completion"
    },
  ];

  // Time filters
  const timeFilters = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Quarter' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "completed": return <CheckCircle size={14} />;
      case "in_progress": return <Clock size={14} />;
      case "pending": return <AlertTriangle size={14} />;
      default: return null;
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

  const getScoreColor = (score) => {
    if (score < 5) return "bg-gradient-to-r from-red-500 to-red-600";
    if (score > 8) return "bg-gradient-to-r from-green-500 to-emerald-600";
    return "bg-gradient-to-r from-amber-500 to-orange-500";
  };

  const getScoreTextColor = (score) => {
    if (score < 5) return "text-red-600";
    if (score > 8) return "text-green-600";
    return "text-amber-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 font-sans pb-20 md:pb-6">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome & Time Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, Povendran</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your jobs today</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-white border border-gray-200 rounded-xl p-1">
              {timeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveTimeFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTimeFilter === filter.id
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                  <div className={`text-white bg-gradient-to-br ${metric.color} p-2 rounded-lg`}>
                    {metric.icon}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} className="text-green-500" />
                  <span className="text-xs font-bold text-green-600">{metric.trend}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-sm font-medium text-gray-900 mt-1">{metric.label}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Jobs Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase size={20} className="text-blue-600" />
                    Recent Jobs
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Need help? <span className="text-blue-600 font-medium">Create Job</span></p>
                </div>
                <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1">
                  View all <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {recentJobs.map((job) => (
                  <div key={job.id} className="p-5 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm font-bold text-gray-400">#{job.id}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${getStatusColor(job.status)}`}>
                            {getStatusIcon(job.status)}
                            {job.status === 'in_progress' ? 'IN PROGRESS' : job.status.toUpperCase()}
                          </span>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(job.priority)}`}></div>
                            <span className="text-xs text-gray-500">{job.priority} priority</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-gray-400" />
                            <span className="font-medium">{job.client}</span>
                            <span className="text-gray-400 mx-1">→</span>
                            <span>{job.contractor}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-gray-400" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">{job.amount}</div>
                        <div className="text-xs text-gray-500 mt-1">{job.time}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500">SLA: 48 hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium rounded-lg transition-colors">
                          View Details
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Stats Summary */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">22,240</div>
                    <div className="text-xs text-gray-600">Total Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">4</div>
                    <div className="text-xs text-gray-600">Active Jobs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">94%</div>
                    <div className="text-xs text-gray-600">On Track</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Performance Column */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                Agent Performance
              </h2>
              <p className="text-sm text-gray-500 mt-1">Scores out of 10, updated weekly</p>
            </div>
            
            <div className="p-5 space-y-5">
              {agentPerformance.map((agent, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-xl ${getScoreColor(agent.score)} flex items-center justify-center shadow-sm`}>
                        <span className="text-white font-bold text-lg">{agent.score.toFixed(1)}</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-900">{agent.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{agent.role}</span>
                          <div className="flex items-center">
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            <span className="text-xs font-medium ml-1">{agent.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`text-sm font-bold flex items-center gap-1 ${agent.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      <ArrowUpRight size={14} />
                      {agent.trend}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completed Jobs</span>
                      <span className="font-semibold text-gray-900">{agent.completedJobs}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreColor(agent.score)}`}
                        style={{ width: `${(agent.score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Performance Legend */}
            <div className="p-5 border-t border-gray-200 bg-gray-50">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                Performance Scale
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-red-50 rounded-lg border border-red-100">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-xs font-bold text-red-700">{"< 5.0"}</span>
                  <p className="text-xs text-gray-600 mt-1">Needs Review</p>
                </div>
                <div className="text-center p-2 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-xs font-bold text-amber-700">5.0-8.0</span>
                  <p className="text-xs text-gray-600 mt-1">Meeting</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <span className="text-xs font-bold text-green-700">{"> 8.0"}</span>
                  <p className="text-xs text-gray-600 mt-1">Exceeding</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Analytics & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-blue-600" />
              System Health
            </h3>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-3xl font-bold text-gray-900">25°C</div>
                <div className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-2">
                  <CheckCircle size={12} />
                  Optimal Performance
                </div>
              </div>
              <div className="text-5xl">📊</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">System Uptime</span>
                <span className="text-sm font-bold text-gray-900">99.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Response Time</span>
                <span className="text-sm font-bold text-gray-900">42ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Active Sessions</span>
                <span className="text-sm font-bold text-gray-900">142</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:border-blue-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-blue-100">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Create Job</span>
                </div>
              </button>
              <button className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl hover:border-green-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-green-100">
                    <FileCheck size={20} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-green-600">View Applications</span>
                </div>
              </button>
              <button className="p-4 bg-gradient-to-br from-purple-50 to-indigo-100 border border-purple-200 rounded-xl hover:border-purple-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-purple-100">
                    <Download size={20} className="text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600">Export Report</span>
                </div>
              </button>
              <button className="p-4 bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 rounded-xl hover:border-amber-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-amber-100">
                    <Users size={20} className="text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-amber-600">Find Contractor</span>
                </div>
              </button>
            </div>
          </div>

          {/* Transparency & Compliance */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={20} className="text-gray-700" />
              Compliance Status
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Data Security</span>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">100%</span>
                </div>
                <p className="text-xs text-gray-600">End-to-end encryption enabled</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Audit Trail</span>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <p className="text-xs text-gray-600">Full transparency logging</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">GDPR Compliance</span>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Certified</span>
                </div>
                <p className="text-xs text-gray-600">Fully compliant with regulations</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentHome;