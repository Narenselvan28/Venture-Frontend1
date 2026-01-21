// pages/ContractorJobFeed.jsx
import React, { useState } from 'react';
import {
  Search, Filter, MapPin, Clock, DollarSign,
  TrendingUp, Star, Heart, Eye, Users,
  Briefcase, Building, User, CheckCircle,
  AlertCircle, Flame, Zap, Target, Award,
  Calendar, FileText, ExternalLink, Download,
  ChevronDown, ChevronUp, Bookmark, Share2,
  BarChart, PieChart, Bell, MessageSquare,
  Phone, Mail, Navigation, Shield, Lock,
  ChevronRight, ChevronLeft, X, Plus,
  ClockAlert, History, TrendingDown, Hash
} from 'lucide-react';

const ContractorJobFeed = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [savedJobs, setSavedJobs] = useState(['JOB-0428', 'JOB-0432']);
  const [appliedJobs, setAppliedJobs] = useState(['JOB-0427']);
  
  // Filter states
  const [filters, setFilters] = useState({
    skills: [],
    location: '',
    category: '',
    budgetMin: '',
    budgetMax: '',
    slaUrgency: '',
    jobType: '',
    sortBy: 'latest'
  });

  // Job data
  const jobListings = [
    {
      id: 'JOB-0428',
      title: 'Electrical Panel Upgrade - Apollo Hospital',
      category: 'Electrical',
      subCategory: 'Industrial',
      description: 'Upgrade of main electrical panel with safety compliance for hospital facility',
      location: 'Velacherry, Chennai - 600028',
      slaStatus: 'on-track',
      slaHours: '48',
      priority: 'HIGH',
      budget: '₹2,50,000',
      views: '1.2k',
      applications: 120,
      applied: false,
      matchScore: 92,
      company: 'Venture Infra Ltd',
      agent: 'Selvakumar S',
      agentRating: 4.8,
      posted: '3 hours ago',
      urgent: true,
      fastPayout: true,
      images: ['/api/placeholder/400/250'],
      skills: ['Electrical', 'Panel Installation', 'Safety Compliance'],
      timeline: '7 days',
      scope: 'Full panel replacement with safety upgrades'
    },
    {
      id: 'JOB-0429',
      title: 'HVAC System Installation - Corporate Office',
      category: 'HVAC',
      subCategory: 'Commercial',
      description: 'Complete HVAC system installation for new corporate office building',
      location: 'Rajaji Nagar, Bangalore - 560010',
      slaStatus: 'at-risk',
      slaHours: '72',
      priority: 'MEDIUM',
      budget: '₹4,80,000',
      views: '2.1k',
      applications: 86,
      applied: false,
      matchScore: 85,
      company: 'Global Tech Solutions',
      agent: 'Priya Sharma',
      agentRating: 4.9,
      posted: '1 day ago',
      urgent: false,
      fastPayout: true,
      images: ['/api/placeholder/400/250'],
      skills: ['HVAC Installation', 'Commercial', 'VRF Systems'],
      timeline: '14 days',
      scope: 'Complete HVAC installation with IoT integration'
    },
    {
      id: 'JOB-0430',
      title: 'Data Center Power Backup System',
      category: 'Industrial',
      subCategory: 'Data Center',
      description: 'Installation of UPS and generator backup system for data center',
      location: 'Andheri East, Mumbai - 400069',
      slaStatus: 'critical',
      slaHours: '96',
      priority: 'HIGH',
      budget: '₹15,00,000',
      views: '3.4k',
      applications: 45,
      applied: false,
      matchScore: 78,
      company: 'DataSecure Inc.',
      agent: 'Rahul Verma',
      agentRating: 4.7,
      posted: '2 days ago',
      urgent: true,
      fastPayout: false,
      images: ['/api/placeholder/400/250'],
      skills: ['UPS Installation', 'Generator', 'High Voltage'],
      timeline: '21 days',
      scope: 'Complete power backup system with redundancy'
    },
    {
      id: 'JOB-0431',
      title: 'Commercial Building LED Lighting Retrofit',
      category: 'Electrical',
      subCategory: 'Commercial',
      description: 'Retrofit existing lighting system with energy-efficient LED fixtures',
      location: 'Gachibowli, Hyderabad - 500032',
      slaStatus: 'on-track',
      slaHours: '120',
      priority: 'LOW',
      budget: '₹1,20,000',
      views: '0.8k',
      applications: 65,
      applied: false,
      matchScore: 88,
      company: 'GreenTech Solutions',
      agent: 'Arun Kumar',
      agentRating: 4.6,
      posted: '5 hours ago',
      urgent: false,
      fastPayout: true,
      images: ['/api/placeholder/400/250'],
      skills: ['Lighting', 'Energy Efficiency', 'Retrofit'],
      timeline: '10 days',
      scope: 'Complete lighting retrofit across 5 floors'
    },
    {
      id: 'JOB-0432',
      title: 'Hospital Fire Safety System Upgrade',
      category: 'Safety',
      subCategory: 'Healthcare',
      description: 'Upgrade fire detection and suppression system for hospital',
      location: 'Anna Nagar, Chennai - 600040',
      slaStatus: 'at-risk',
      slaHours: '48',
      priority: 'HIGH',
      budget: '₹3,50,000',
      views: '1.5k',
      applications: 32,
      applied: false,
      matchScore: 95,
      company: 'MediSafe Hospitals',
      agent: 'Dr. Sanjay Mehta',
      agentRating: 4.9,
      posted: '8 hours ago',
      urgent: true,
      fastPayout: true,
      images: ['/api/placeholder/400/250'],
      skills: ['Fire Safety', 'Hospital Compliance', 'System Installation'],
      timeline: '15 days',
      scope: 'Complete fire safety system upgrade'
    },
    {
      id: 'JOB-0427',
      title: 'Industrial Plumbing System Maintenance',
      category: 'Plumbing',
      subCategory: 'Industrial',
      description: 'Preventive maintenance of industrial plumbing system',
      location: 'Manesar, Gurgaon - 122051',
      slaStatus: 'on-track',
      slaHours: '168',
      priority: 'LOW',
      budget: '₹85,000',
      views: '0.9k',
      applications: 42,
      applied: true,
      matchScore: 82,
      company: 'Industrial Solutions Ltd',
      agent: 'Vikram Singh',
      agentRating: 4.5,
      posted: '3 days ago',
      urgent: false,
      fastPayout: false,
      images: ['/api/placeholder/400/250'],
      skills: ['Plumbing', 'Maintenance', 'Industrial'],
      timeline: '5 days',
      scope: 'Preventive maintenance and minor repairs'
    }
  ];

  // Categories
  const categories = [
    'Electrical', 'HVAC', 'Plumbing', 'Safety', 
    'Industrial', 'Commercial', 'Residential', 'Data Center'
  ];

  // Skills
  const skills = [
    'Panel Installation', 'Wiring', 'Circuit Design', 'HVAC Installation',
    'VRF Systems', 'Plumbing', 'Fire Safety', 'UPS Installation',
    'Generator', 'Lighting', 'Automation', 'Solar'
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'on-track': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'at-risk': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'on-track': return <CheckCircle size={12} />;
      case 'at-risk': return <AlertCircle size={12} />;
      case 'critical': return <ClockAlert size={12} />;
      default: return <Clock size={12} />;
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

  const getMatchColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-gray-600';
  };

  const getMatchBarColor = (score) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-gray-500';
  };

  const handleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  const handleApplyJob = (jobId) => {
    setSelectedJob(jobListings.find(job => job.id === jobId));
    setShowApplyModal(true);
  };

  const handleViewDetails = (jobId) => {
    setSelectedJob(jobListings.find(job => job.id === jobId));
    setShowJobDetails(true);
  };

  const handleSubmitApplication = () => {
    if (!selectedJob) return;
    
    // Add to applied jobs
    if (!appliedJobs.includes(selectedJob.id)) {
      setAppliedJobs([...appliedJobs, selectedJob.id]);
    }
    
    setShowApplyModal(false);
    // In real app, would make API call
    alert(`Application submitted for ${selectedJob.title}!`);
  };

  // Filter jobs based on active tab
  const filteredJobs = jobListings.filter(job => {
    if (activeTab === 'my-applications') {
      return appliedJobs.includes(job.id);
    }
    if (activeTab === 'saved') {
      return savedJobs.includes(job.id);
    }
    if (activeTab === 'recommended') {
      return job.matchScore >= 80;
    }
    return true; // 'all' tab
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 font-sans pb-6">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Find Work</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and availability</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border border-gray-300 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by title, skill, location, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <select 
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-sm font-medium"
              >
                <option value="latest">Latest First</option>
                <option value="budget-high">Budget High → Low</option>
                <option value="budget-low">Budget Low → High</option>
                <option value="urgent">Urgent First</option>
                <option value="match">Best Match</option>
              </select>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter size={18} />
                <span className="font-medium">Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'all', label: 'All Jobs', count: jobListings.length },
            { id: 'my-applications', label: 'My Applications', count: appliedJobs.length },
            { id: 'saved', label: 'Saved Jobs', count: savedJobs.length },
            { id: 'recommended', label: 'Recommended', count: jobListings.filter(j => j.matchScore >= 80).length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-300 rounded-xl p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">Filters</h3>
                  <button 
                    onClick={() => setFilters({
                      skills: [],
                      location: '',
                      category: '',
                      budgetMin: '',
                      budgetMax: '',
                      slaUrgency: '',
                      jobType: '',
                      sortBy: 'latest'
                    })}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.category === cat}
                          onChange={(e) => setFilters({...filters, category: e.target.checked ? cat : ''})}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Skills</h4>
                  <div className="space-y-2">
                    {skills.slice(0, 5).map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.skills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, skills: [...filters.skills, skill]});
                            } else {
                              setFilters({...filters, skills: filters.skills.filter(s => s !== skill)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      + Show more
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                  <select 
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">All Locations</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>

                {/* Budget Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Budget Range</h4>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.budgetMin}
                      onChange={(e) => setFilters({...filters, budgetMin: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.budgetMax}
                      onChange={(e) => setFilters({...filters, budgetMax: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="text-xs text-gray-500">Enter amount in ₹</div>
                </div>

                {/* SLA Urgency */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">SLA Urgency</h4>
                  <div className="space-y-2">
                    {['Normal', 'At Risk', 'Emergency'].map((urgency) => (
                      <label key={urgency} className="flex items-center">
                        <input
                          type="radio"
                          name="urgency"
                          checked={filters.slaUrgency === urgency.toLowerCase()}
                          onChange={() => setFilters({...filters, slaUrgency: urgency.toLowerCase()})}
                          className="text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{urgency}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Job Type */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
                  <div className="space-y-2">
                    {['Planned', 'Emergency', 'Preventive'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.jobType === type.toLowerCase()}
                          onChange={(e) => setFilters({...filters, jobType: e.target.checked ? type.toLowerCase() : ''})}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Main Feed */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-300 rounded-xl p-4">
                <div className="text-sm text-gray-500">Total Jobs</div>
                <div className="text-2xl font-bold text-gray-900">{jobListings.length}</div>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-4">
                <div className="text-sm text-gray-500">Applied</div>
                <div className="text-2xl font-bold text-blue-600">{appliedJobs.length}</div>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-4">
                <div className="text-sm text-gray-500">Avg. Budget</div>
                <div className="text-2xl font-bold text-emerald-600">₹4.5L</div>
              </div>
              <div className="bg-white border border-gray-300 rounded-xl p-4">
                <div className="text-sm text-gray-500">Match Rate</div>
                <div className="text-2xl font-bold text-amber-600">86%</div>
              </div>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  className={`bg-white border border-gray-300 rounded-xl overflow-hidden hover:border-blue-500 transition-all ${
                    appliedJobs.includes(job.id) ? 'opacity-90' : ''
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-300">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{job.title}</h3>
                          {job.urgent && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                              <Flame size={10} className="inline mr-1" />
                              URGENT
                            </span>
                          )}
                          {job.fastPayout && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                              FAST PAYOUT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {job.category}
                          </span>
                          <span className="text-xs text-gray-500">{job.subCategory}</span>
                        </div>
                      </div>
                      
                      {/* Save Button */}
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        className={`p-2 rounded-lg ${
                          savedJobs.includes(job.id)
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <Heart size={18} fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Location and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin size={14} />
                        {job.location}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(job.slaStatus)}`}>
                        {getStatusIcon(job.slaStatus)}
                        {job.slaStatus === 'on-track' ? 'On time' : 
                         job.slaStatus === 'at-risk' ? 'At risk' : 'Critical'}
                      </span>
                    </div>
                  </div>

                  {/* Job Image */}
                  <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 relative overflow-hidden">
                    {/* Match Score Overlay */}
                    {job.matchScore >= 80 && (
                      <div className="absolute top-3 left-3">
                        <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-1 text-sm font-bold">
                            <Zap size={12} />
                            {job.matchScore}% Match
                          </div>
                          <div className="h-1.5 bg-white/30 rounded-full mt-1 overflow-hidden">
                            <div 
                              className={`h-full ${getMatchBarColor(job.matchScore)}`}
                              style={{ width: `${job.matchScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="p-4 border-b border-gray-300">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye size={14} className="text-gray-400" />
                          <span className="text-gray-600">{job.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-gray-400" />
                          <span className="text-gray-600">{job.applications} applications</span>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${getMatchColor(job.matchScore)}`}>
                        🔥 Good match for you
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Budget</div>
                        <div className="font-bold text-gray-900">{job.budget}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">SLA</div>
                        <div className="font-bold text-gray-900">{job.slaHours} hours</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Priority</div>
                        <div className={`px-2 py-1 inline-block rounded text-xs font-bold ${getPriorityColor(job.priority)}`}>
                          {job.priority}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Posted</div>
                        <div className="font-medium text-gray-900">{job.posted}</div>
                      </div>
                    </div>

                    {/* Company & Agent */}
                    <div className="mb-6">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Company</div>
                          <div className="font-medium text-gray-900">{job.company}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Agent</div>
                          <div className="flex items-center gap-1">
                            <User size={12} className="text-gray-400" />
                            <span className="font-medium text-gray-900">{job.agent}</span>
                            <Star size={12} className="text-amber-500 fill-amber-500" />
                            <span className="text-xs text-gray-600">{job.agentRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewDetails(job.id)}
                        className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium"
                      >
                        View Details
                      </button>
                      {appliedJobs.includes(job.id) ? (
                        <button className="flex-1 py-2.5 bg-emerald-100 text-emerald-700 rounded-xl font-medium flex items-center justify-center gap-2">
                          <CheckCircle size={16} />
                          Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyJob(job.id)}
                          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <Briefcase size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setFilters({
                      skills: [],
                      location: '',
                      category: '',
                      budgetMin: '',
                      budgetMax: '',
                      slaUrgency: '',
                      jobType: '',
                      sortBy: 'latest'
                    });
                    setSearchQuery('');
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Submit Proposal</h3>
                  <p className="text-gray-600 text-sm mt-1">{selectedJob.title}</p>
                </div>
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Quote */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Quote & Pricing
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Your Quote (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter your quote amount"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Budget: {selectedJob.budget}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Breakdown (Optional)
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Breakdown of labor, materials, etc."
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Timeline */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Timeline
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Time Estimate
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Days"
                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <select className="px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                        <option>Days</option>
                        <option>Weeks</option>
                        <option>Months</option>
                      </select>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Client timeline: {selectedJob.timeline}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Proposal */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Proposal Details
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Cover Letter / Notes
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Explain your approach, experience, and why you're the best fit..."
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Attach Proposal (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText size={24} className="text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-600 mb-1">Drop PDF or click to browse</div>
                      <div className="text-xs text-gray-500">Max file size: 10MB</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Review & Submit */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                  Review & Submit
                </h4>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Job:</strong> {selectedJob.title}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Location:</strong> {selectedJob.location}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Application ID:</strong> APP-{Date.now().toString().slice(-6)}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmitApplication}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                  >
                    Submit Proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Job Details</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {selectedJob.id}
                    </span>
                    <span className={`px-2 py-1 text-xs font-bold rounded ${getPriorityColor(selectedJob.priority)}`}>
                      {selectedJob.priority} PRIORITY
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowJobDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Job Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedJob.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {selectedJob.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    {selectedJob.category} • {selectedJob.subCategory}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    Posted {selectedJob.posted}
                  </div>
                </div>
              </div>

              {/* Job Image */}
              <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-6"></div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <div className="text-xs text-gray-500">Budget</div>
                  <div className="text-lg font-bold text-gray-900">{selectedJob.budget}</div>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <div className="text-xs text-gray-500">SLA</div>
                  <div className="text-lg font-bold text-gray-900">{selectedJob.slaHours} hours</div>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <div className="text-xs text-gray-500">Applications</div>
                  <div className="text-lg font-bold text-gray-900">{selectedJob.applications}</div>
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <div className="text-xs text-gray-500">Views</div>
                  <div className="text-lg font-bold text-gray-900">{selectedJob.views}</div>
                </div>
              </div>

              {/* Scope & Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Scope of Work</h4>
                    <p className="text-gray-700">{selectedJob.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Timeline</h4>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <div className="text-sm text-gray-700">
                        <strong>Duration:</strong> {selectedJob.timeline}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        <strong>SLA Deadline:</strong> {selectedJob.slaHours} hours from acceptance
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Company & Agent Sidebar */}
                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3">Company</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        <Building size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{selectedJob.company}</div>
                        <div className="text-sm text-gray-600">Verified Partner</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3">Agent</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                        <User size={24} className="text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{selectedJob.agent}</div>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          <span className="text-sm text-gray-600">{selectedJob.agentRating}/5.0</span>
                          <span className="text-xs text-blue-600 font-medium ml-2">High Success</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-3 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium">
                      Contact Agent
                    </button>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3">Ready to Apply?</h4>
                    {appliedJobs.includes(selectedJob.id) ? (
                      <div className="text-center py-4">
                        <CheckCircle size={32} className="text-emerald-600 mx-auto mb-2" />
                        <div className="font-medium text-emerald-700">Application Submitted</div>
                        <div className="text-sm text-emerald-600">You'll be notified when agent reviews</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setShowJobDetails(false);
                          setShowApplyModal(true);
                        }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorJobFeed;