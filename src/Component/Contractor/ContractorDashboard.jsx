// pages/ContractorDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, ChevronRight, Clock, AlertTriangle,
  CheckCircle, TrendingUp, Award, Target, Zap,
  Briefcase, Users, DollarSign, Star, FileText,
  MessageSquare, Upload, Eye, Calendar, BarChart,
  PieChart, Activity, Shield, TrendingDown,
  ArrowRight, Filter, ExternalLink, Download,
  HelpCircle, Settings, ChevronDown, MoreHorizontal,
  ClockAlert, AlertCircle, Check, X, Play,
  Pause, Refresh, Award as AwardIcon, Trophy,
  Crown, TrendingUp as TrendingUpIcon, Target as TargetIcon,
  Lightning, Rocket, Flag, Home, Building,
  MapPin, Phone, Mail, CreditCard, ShieldCheck,User
} from 'lucide-react';

const ContractorDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('this-week');

  // KPI Data
  const kpis = [
    {
      title: 'Active Jobs',
      value: '3',
      change: '+1',
      trend: 'up',
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      route: '/contractor/jobs?status=active'
    },
    {
      title: 'At Risk Jobs',
      value: '1',
      change: '🔴',
      trend: 'warning',
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      route: '/contractor/jobs?status=at-risk'
    },
    {
      title: 'Completed This Month',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-700',
      route: '/contractor/jobs?status=completed'
    },
    {
      title: 'SLA Compliance',
      value: '96.2%',
      change: '+1.2%',
      trend: 'up',
      icon: <Target className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-700',
      route: '/contractor/performance'
    }
  ];

  // Ongoing Jobs
  const ongoingJobs = [
    {
      id: 'JOB-0428',
      title: 'Electrical Panel Upgrade',
      client: 'Apollo Hospital',
      agent: 'Selvakumar S',
      slaRemaining: '18h',
      progress: 70,
      status: 'at-risk',
      statusText: 'AT RISK',
      budget: '₹2,50,000',
      location: 'Chennai, TN',
      priority: 'HIGH'
    },
    {
      id: 'JOB-0429',
      title: 'HVAC System Installation',
      client: 'Global Tech Solutions',
      agent: 'Priya Sharma',
      slaRemaining: '48h',
      progress: 45,
      status: 'on-track',
      statusText: 'ON TRACK',
      budget: '₹4,80,000',
      location: 'Bangalore, KA',
      priority: 'MEDIUM'
    },
    {
      id: 'JOB-0430',
      title: 'Commercial Lighting Retrofit',
      client: 'GreenTech Solutions',
      agent: 'Arun Kumar',
      slaRemaining: '72h',
      progress: 25,
      status: 'on-track',
      statusText: 'ON TRACK',
      budget: '₹1,20,000',
      location: 'Hyderabad, TS',
      priority: 'LOW'
    }
  ];

  // Attention Needed Items
  const attentionItems = [
    {
      id: 1,
      type: 'invoice',
      title: 'Invoice pending approval',
      jobId: 'JOB-0391',
      time: '2 days ago',
      priority: 'medium',
      action: 'Review'
    },
    {
      id: 2,
      type: 'proof',
      title: 'Proof pending upload',
      jobId: 'JOB-0428',
      time: '6 hours ago',
      priority: 'high',
      action: 'Upload'
    },
    {
      id: 3,
      type: 'message',
      title: 'New message from Agent',
      jobId: 'JOB-0429',
      time: '1 hour ago',
      priority: 'low',
      action: 'Reply'
    }
  ];

  // AI Suggestions
  const aiSuggestions = [
    {
      id: 1,
      type: 'deadline',
      title: 'Finish JOB-0428 before 6 PM',
      description: 'Avoid potential penalty of ₹12,000',
      urgency: 'high',
      action: 'Go to Job'
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'You match 3 high value jobs',
      description: 'Total value: ₹28,00,000',
      urgency: 'medium',
      action: 'Find New Jobs'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Reach Top 5% SLA rank',
      description: 'Maintain current streak for 7 more days',
      urgency: 'low',
      action: 'View Performance'
    }
  ];

  // Performance Data
  const slaGrades = [
    { month: 'Jan', score: 94.5 },
    { month: 'Feb', score: 95.2 },
    { month: 'Mar', score: 96.8 },
    { month: 'Apr', score: 97.1 },
    { month: 'May', score: 96.2 },
    { month: 'Jun', score: 95.9 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'on-track': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'at-risk': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-amber-100 text-amber-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttentionIcon = (type) => {
    switch(type) {
      case 'invoice': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'proof': return <Upload className="w-5 h-5 text-amber-600" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSuggestionIcon = (type) => {
    switch(type) {
      case 'deadline': return <ClockAlert className="w-5 h-5 text-red-600" />;
      case 'opportunity': return <DollarSign className="w-5 h-5 text-emerald-600" />;
      case 'achievement': return <Trophy className="w-5 h-5 text-amber-600" />;
      default: return <Zap className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Title */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Performance cockpit for Elite Electrical Solutions</p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">Elite Electrical</div>
                  <div className="text-xs text-gray-500">Contractor</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Time Filter */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Overview</h2>
            <p className="text-gray-600">Your SLA, risk, and job status at a glance</p>
          </div>
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-sm font-medium"
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-3-months">Last 3 Months</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, index) => (
            <button
              key={index}
              onClick={() => navigate(kpi.route)}
              className={`${kpi.color} border rounded-xl p-4 text-left hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {kpi.icon}
                </div>
                <div className={`text-sm font-bold ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {kpi.change}
                </div>
              </div>
              <div className={`text-2xl font-bold ${kpi.textColor} mb-1`}>{kpi.value}</div>
              <div className="text-sm text-gray-600">{kpi.title}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 70% */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ongoing Jobs */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Ongoing Jobs</h3>
                <button 
                  onClick={() => navigate('/contractor/jobs')}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {ongoingJobs.map((job) => (
                  <div key={job.id} className="border border-gray-300 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{job.title}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(job.status)}`}>
                            {job.statusText}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityColor(job.priority)}`}>
                            {job.priority}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{job.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{job.budget}</div>
                        <div className="text-xs text-gray-500">{job.location}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Client</div>
                        <div className="text-sm font-medium">{job.client}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Agent</div>
                        <div className="text-sm font-medium">{job.agent}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">SLA Remaining</div>
                        <div className="text-sm font-medium text-amber-600">{job.slaRemaining}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Progress</div>
                        <div className="text-sm font-medium">{job.progress}%</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            job.status === 'at-risk' ? 'bg-amber-500' : 
                            job.status === 'delayed' ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button 
                        onClick={() => navigate(`/contractor/jobs/${job.id}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
                      >
                        View Job Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attention Needed */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Needs Your Attention
              </h3>

              <div className="space-y-3">
                {attentionItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getAttentionIcon(item.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.jobId} • {item.time}</div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 30% */}
          <div className="space-y-6">
            {/* SLA Grading Chart */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Your SLA Performance</h3>
              
              <div className="flex flex-col items-center mb-6">
                {/* Circular Grade */}
                <div className="relative w-40 h-40 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="8"
                    />
                    {/* Progress Circle */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#4f46e5" 
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset="283 - (283 * 96.2 / 100)"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-gray-900">A</div>
                    <div className="text-sm text-emerald-600 font-medium">96.2%</div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">Top 8%</div>
                  <div className="text-sm text-gray-600">Rank in platform</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Grade</span>
                  <span className="font-medium">A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">SLA Compliance</span>
                  <span className="font-medium text-emerald-600">96.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Delay</span>
                  <span className="font-medium text-amber-600">0.8 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Jobs Completed</span>
                  <span className="font-medium">156</span>
                </div>
              </div>
            </div>

            {/* Risk Monitor */}
            <div className="bg-white border border-amber-300 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Risk Monitor
              </h3>

              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-600">Jobs at risk</div>
                    <div className="text-lg font-bold text-red-600">1</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Potential penalty</div>
                    <div className="text-lg font-bold text-red-600">₹12,000</div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1">Suggested Action</div>
                  <div className="text-sm text-gray-600">"Upload proof for JOB-0428"</div>
                </div>

                <button className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Fix Now
                </button>
              </div>
            </div>

            {/* Trust & Reputation */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                Your Reputation
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Trust Score</div>
                    <div className="text-xl font-bold text-gray-900">88</div>
                    <div className="text-xs text-gray-500">/100</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Rating</div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-xl font-bold text-gray-900">4.7</span>
                    </div>
                    <div className="text-xs text-gray-500">(128 reviews)</div>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-2">Badges Earned</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      SLA Champion
                    </span>
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Fast Responder
                    </span>
                    <span className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Top Performer
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/contractor/profile')}
                  className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                AI Suggestions
              </h3>

              <div className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-white border border-gray-300 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{suggestion.title}</div>
                        <div className="text-sm text-gray-600">{suggestion.description}</div>
                      </div>
                    </div>
                    <button className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
                      {suggestion.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Performance Chart */}
        <div className="mt-6 bg-white border border-gray-300 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">SLA Compliance Trend</h3>
              <p className="text-sm text-gray-600">Last 6 months performance</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium">
                <Download className="w-4 h-4 inline mr-1" />
                Export
              </button>
              <button 
                onClick={() => navigate('/contractor/performance')}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="h-64 flex items-end gap-8 px-4">
            {slaGrades.map((month, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500 mb-2">{month.month}</div>
                <div className="relative w-8">
                  <div 
                    className="w-8 bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                    style={{ height: `${(month.score / 100) * 180}px` }}
                    title={`${month.score}%`}
                  />
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-900 bg-white px-1 rounded">
                    {month.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-gray-600">Target: 95%+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Your Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-sm text-gray-600">Platform Average</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white border border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Response Time</div>
                <div className="text-xl font-bold text-gray-900">2.4h</div>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="text-xs text-emerald-600 mt-2">-15% faster than average</div>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Earnings This Month</div>
                <div className="text-xl font-bold text-gray-900">₹8,42,000</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-xs text-blue-600 mt-2">+12% from last month</div>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Client Satisfaction</div>
                <div className="text-xl font-bold text-gray-900">4.8</div>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
              </div>
            </div>
            <div className="text-xs text-amber-600 mt-2">32 positive reviews</div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 lg:hidden">
        <div className="flex justify-around items-center py-3 px-4">
          <button className="flex flex-col items-center p-2 text-blue-600">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/contractor/jobs')}
            className="flex flex-col items-center p-2 text-gray-500"
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-xs mt-1">Jobs</span>
          </button>
          <button 
            onClick={() => navigate('/contractor/profile')}
            className="flex flex-col items-center p-2 text-gray-500"
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
          <button 
            onClick={() => navigate('/contractor/performance')}
            className="flex flex-col items-center p-2 text-gray-500"
          >
            <BarChart className="w-5 h-5" />
            <span className="text-xs mt-1">Performance</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;