// pages/ContractorJobSearch.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, MapPin, Clock, DollarSign, Briefcase,
  Building, User, Star, Eye, Users, Award, Zap, Flame,
  Calendar, Target, Shield, TrendingUp, ChevronRight,
  ChevronDown, ChevronUp, X, Heart, EyeOff, Download,
  FileText, Upload, MessageSquare, CheckCircle, AlertCircle,
  Award as AwardIcon, Globe, Home, Factory, Landmark,
  Check, Plus, Minus, Sliders, Hash, ExternalLink,
  Bell, Bookmark, BookmarkCheck, TrendingDown, BarChart,
  PieChart, Activity, Target as TargetIcon, Rocket,
  Crown, Zap as ZapIcon,Share2 , Timer, BellRing
} from 'lucide-react';

const ContractorJobSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [savedJobs, setSavedJobs] = useState(['JOB-0428', 'JOB-0432']);
  const [appliedJobs, setAppliedJobs] = useState(['JOB-0427']);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    categories: [],
    locations: [],
    budgetMin: '',
    budgetMax: '',
    jobTypes: [],
    slaUrgency: [],
    companyTypes: [],
    remotePossible: false,
    suitableForSkills: true,
    newJobsToday: false,
    hideApplied: false,
    sortBy: 'best-match'
  });

  // Job data with ML match scores
  const jobListings = [
    {
      id: 'JOB-0428',
      title: 'Electrical Panel Upgrade - Hospital',
      company: 'Apollo Hospitals',
      companyType: 'ENTERPRISE',
      category: 'Electrical',
      location: 'Chennai, TN',
      priority: 'HIGH',
      budget: '₹2,40,000',
      slaHours: '48',
      slaStatus: 'on-track',
      views: '1.2k',
      proposals: 12,
      agent: 'Selvakumar S',
      agentRating: 4.8,
      matchScore: 92,
      posted: '3 hours ago',
      isNew: true,
      isPremium: true,
      isEmergency: false,
      description: 'Upgrade of main electrical panel with safety compliance for hospital facility. Requires certified electrical contractor.',
      skills: ['Electrical', 'Panel Installation', 'Safety Compliance'],
      timeline: '7 days',
      remotePossible: false
    },
    {
      id: 'JOB-0432',
      title: 'HVAC System Installation - Corporate Office',
      company: 'Global Tech Solutions',
      companyType: 'ENTERPRISE',
      category: 'HVAC',
      location: 'Bangalore, KA',
      priority: 'HIGH',
      budget: '₹5,20,000',
      slaHours: '72',
      slaStatus: 'at-risk',
      views: '2.4k',
      proposals: 18,
      agent: 'Priya Sharma',
      agentRating: 4.9,
      matchScore: 88,
      posted: '1 day ago',
      isNew: false,
      isPremium: true,
      isEmergency: true,
      description: 'Complete HVAC system installation for new corporate office building with IoT integration.',
      skills: ['HVAC Installation', 'VRF Systems', 'IoT'],
      timeline: '14 days',
      remotePossible: false
    },
    {
      id: 'JOB-0435',
      title: 'Data Center Power Backup System',
      company: 'DataSecure Inc.',
      companyType: 'ENTERPRISE',
      category: 'Electrical',
      location: 'Mumbai, MH',
      priority: 'CRITICAL',
      budget: '₹18,00,000',
      slaHours: '96',
      slaStatus: 'critical',
      views: '3.8k',
      proposals: 8,
      agent: 'Rahul Verma',
      agentRating: 4.7,
      matchScore: 85,
      posted: '2 days ago',
      isNew: false,
      isPremium: true,
      isEmergency: true,
      description: 'Installation of UPS and generator backup system for Tier-3 data center with redundancy.',
      skills: ['UPS Installation', 'Generator', 'High Voltage'],
      timeline: '21 days',
      remotePossible: false
    },
    {
      id: 'JOB-0437',
      title: 'Commercial Building LED Retrofit',
      company: 'GreenTech Solutions',
      companyType: 'SME',
      category: 'Electrical',
      location: 'Hyderabad, TS',
      priority: 'MEDIUM',
      budget: '₹1,80,000',
      slaHours: '120',
      slaStatus: 'on-track',
      views: '850',
      proposals: 22,
      agent: 'Arun Kumar',
      agentRating: 4.6,
      matchScore: 78,
      posted: '5 hours ago',
      isNew: true,
      isPremium: false,
      isEmergency: false,
      description: 'Retrofit existing lighting system with energy-efficient LED fixtures across 8 floors.',
      skills: ['Lighting', 'Energy Efficiency', 'Retrofit'],
      timeline: '10 days',
      remotePossible: false
    },
    {
      id: 'JOB-0439',
      title: 'Hospital Fire Safety System',
      company: 'MediSafe Hospitals',
      companyType: 'GOVERNMENT',
      category: 'Safety',
      location: 'Chennai, TN',
      priority: 'HIGH',
      budget: '₹3,50,000',
      slaHours: '48',
      slaStatus: 'at-risk',
      views: '1.5k',
      proposals: 9,
      agent: 'Dr. Sanjay Mehta',
      agentRating: 4.9,
      matchScore: 82,
      posted: '8 hours ago',
      isNew: true,
      isPremium: true,
      isEmergency: false,
      description: 'Upgrade fire detection and suppression system for 200-bed hospital facility.',
      skills: ['Fire Safety', 'Hospital Compliance', 'System Installation'],
      timeline: '15 days',
      remotePossible: false
    },
    {
      id: 'JOB-0427',
      title: 'Industrial Plumbing Maintenance',
      company: 'Industrial Solutions Ltd',
      companyType: 'SME',
      category: 'Plumbing',
      location: 'Gurgaon, HR',
      priority: 'LOW',
      budget: '₹95,000',
      slaHours: '168',
      slaStatus: 'on-track',
      views: '920',
      proposals: 14,
      agent: 'Vikram Singh',
      agentRating: 4.5,
      matchScore: 72,
      posted: '3 days ago',
      isNew: false,
      isPremium: false,
      isEmergency: false,
      description: 'Preventive maintenance of industrial plumbing system in manufacturing facility.',
      skills: ['Plumbing', 'Maintenance', 'Industrial'],
      timeline: '5 days',
      remotePossible: false
    },
    {
      id: 'JOB-0441',
      title: 'IT Server Room Cooling',
      company: 'TechCorp India',
      companyType: 'ENTERPRISE',
      category: 'HVAC',
      location: 'Pune, MH',
      priority: 'MEDIUM',
      budget: '₹2,80,000',
      slaHours: '96',
      slaStatus: 'on-track',
      views: '1.1k',
      proposals: 11,
      agent: 'Neha Patel',
      agentRating: 4.7,
      matchScore: 79,
      posted: '1 day ago',
      isNew: false,
      isPremium: true,
      isEmergency: false,
      description: 'Specialized cooling system installation for 24x7 operational server room.',
      skills: ['Precision Cooling', 'Server Room HVAC', 'Redundancy'],
      timeline: '12 days',
      remotePossible: false
    },
    {
      id: 'JOB-0443',
      title: 'Solar Power System Installation',
      company: 'EcoPower Solutions',
      companyType: 'STARTUP',
      category: 'Electrical',
      location: 'Bangalore, KA',
      priority: 'MEDIUM',
      budget: '₹6,50,000',
      slaHours: '144',
      slaStatus: 'on-track',
      views: '1.8k',
      proposals: 6,
      agent: 'Rajesh Kumar',
      agentRating: 4.6,
      matchScore: 76,
      posted: '2 days ago',
      isNew: false,
      isPremium: false,
      isEmergency: false,
      description: 'Complete solar power system installation for commercial building with grid-tie.',
      skills: ['Solar Installation', 'Grid-tie Systems', 'Renewable Energy'],
      timeline: '20 days',
      remotePossible: false
    }
  ];

  // Categories
  const categories = [
    'Electrical', 'HVAC', 'Plumbing', 'Safety', 
    'IT Infrastructure', 'Construction', 'Networking',
    'Automation', 'Solar', 'Civil', 'Fire Safety'
  ];

  // Locations
  const locations = [
    'Chennai, TN', 'Bangalore, KA', 'Mumbai, MH',
    'Hyderabad, TS', 'Delhi, DL', 'Pune, MH',
    'Gurgaon, HR', 'Noida, UP', 'Kolkata, WB'
  ];

  // Job types
  const jobTypes = ['Planned', 'Emergency', 'Preventive', 'Maintenance', 'Installation'];

  // SLA urgency levels
  const slaUrgency = ['Normal', 'At Risk', 'Critical'];

  // Company types
  const companyTypes = [
    { value: 'ENTERPRISE', label: 'Enterprise', icon: <Factory size={14} /> },
    { value: 'SME', label: 'SME', icon: <Building size={14} /> },
    { value: 'GOVERNMENT', label: 'Government', icon: <Landmark size={14} /> },
    { value: 'STARTUP', label: 'Startup', icon: <Rocket size={14} /> }
  ];

  // Quick filter chips
  const quickFilters = [
    { label: 'On Track', value: 'on-track', icon: '🟢' },
    { label: 'At Risk', value: 'at-risk', icon: '🟡' },
    { label: 'Urgent', value: 'urgent', icon: '🔴' },
    { label: 'High Budget', value: 'high-budget', icon: '💰' },
    { label: 'Emergency', value: 'emergency', icon: '⚡' },
    { label: 'Premium', value: 'premium', icon: '🏆' },
    { label: 'New Today', value: 'new-today', icon: '🆕' }
  ];

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'on-track': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'at-risk': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-amber-100 text-amber-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get match color
  const getMatchColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-gray-600';
  };

  // Get match bar color
  const getMatchBarColor = (score) => {
    if (score >= 90) return 'bg-gradient-to-r from-emerald-500 to-green-500';
    if (score >= 80) return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    if (score >= 70) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  // Toggle saved job
  const toggleSavedJob = (jobId, e) => {
    e.stopPropagation();
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };

  // Handle apply
  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  // Handle view details
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    // In real app, navigate to job details page
    navigate(`/contractor/jobs/${job.id}`);
  };

  // Handle submit application
  const handleSubmitApplication = () => {
    if (!selectedJob) return;
    
    // Add to applied jobs
    if (!appliedJobs.includes(selectedJob.id)) {
      setAppliedJobs([...appliedJobs, selectedJob.id]);
    }
    
    setShowApplyModal(false);
    alert(`Application submitted for ${selectedJob.title}!`);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      budgetMin: '',
      budgetMax: '',
      jobTypes: [],
      slaUrgency: [],
      companyTypes: [],
      remotePossible: false,
      suitableForSkills: true,
      newJobsToday: false,
      hideApplied: false,
      sortBy: 'best-match'
    });
    setSearchQuery('');
  };

  // Filter jobs based on filters
  const filteredJobs = jobListings.filter(job => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(job.category)) {
      return false;
    }
    
    // Location filter
    if (filters.locations.length > 0 && !filters.locations.includes(job.location)) {
      return false;
    }
    
    // Budget filter
    const budget = parseInt(job.budget.replace(/[^0-9]/g, ''));
    const minBudget = filters.budgetMin ? parseInt(filters.budgetMin) : 0;
    const maxBudget = filters.budgetMax ? parseInt(filters.budgetMax) : Infinity;
    if (budget < minBudget || budget > maxBudget) {
      return false;
    }
    
    // Hide applied filter
    if (filters.hideApplied && appliedJobs.includes(job.id)) {
      return false;
    }
    
    // New jobs today filter
    if (filters.newJobsToday && !job.isNew) {
      return false;
    }
    
    return true;
  });

  // Sort jobs based on sortBy
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch(filters.sortBy) {
      case 'best-match':
        return b.matchScore - a.matchScore;
      case 'budget-high':
        return parseInt(b.budget.replace(/[^0-9]/g, '')) - parseInt(a.budget.replace(/[^0-9]/g, ''));
      case 'budget-low':
        return parseInt(a.budget.replace(/[^0-9]/g, '')) - parseInt(b.budget.replace(/[^0-9]/g, ''));
      case 'urgent-first':
        const priorityOrder = { 'CRITICAL': 3, 'HIGH': 2, 'MEDIUM': 1, 'LOW': 0 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'latest':
        // Assuming newer jobs have higher IDs or later in array
        return jobListings.indexOf(b) - jobListings.indexOf(a);
      default:
        return b.matchScore - a.matchScore;
    }
  });

  // Get recommended jobs (ML-based)
  const recommendedJobs = jobListings
    .filter(job => job.matchScore >= 85)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by job title, skill, company, city, job code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center gap-3">
                <select 
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-sm font-medium"
                >
                  <option value="best-match">Best Match (ML Score)</option>
                  <option value="latest">Latest First</option>
                  <option value="budget-high">Budget High → Low</option>
                  <option value="budget-low">Budget Low → High</option>
                  <option value="urgent-first">Urgent First</option>
                </select>

                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                  >
                    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                      <div className={`${viewMode === 'grid' ? 'bg-gray-900' : 'bg-gray-400'}`}></div>
                      <div className={`${viewMode === 'grid' ? 'bg-gray-900' : 'bg-gray-400'}`}></div>
                      <div className={`${viewMode === 'grid' ? 'bg-gray-900' : 'bg-gray-400'}`}></div>
                      <div className={`${viewMode === 'grid' ? 'bg-gray-900' : 'bg-gray-400'}`}></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                  >
                    <div className="flex flex-col gap-0.5 w-4 h-4">
                      <div className={`w-full h-1 ${viewMode === 'list' ? 'bg-gray-900' : 'bg-gray-400'}`}></div>
                      <div className={`w-full h-1 ${viewMode === 'list' ? 'bg-gray-900' : 'bg-gray-400'}`}></div>
                      <div className={`w-full h-1 ${viewMode === 'list' ? 'bg-gray-900' : 'bg-gray-400'}`}></div>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2 lg:hidden"
                >
                  <Filter size={18} />
                  <span className="font-medium">Filters</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {quickFilters.map((filter) => (
                <button
                  key={filter.value}
                  className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-1"
                >
                  <span>{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel - Desktop */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-300 rounded-xl p-6 sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">Filters</h3>
                  <button 
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase size={14} />
                    Category
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, categories: [...filters.categories, category]});
                            } else {
                              setFilters({...filters, categories: filters.categories.filter(c => c !== category)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin size={14} />
                    Location
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {locations.map((location) => (
                      <label key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.locations.includes(location)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, locations: [...filters.locations, location]});
                            } else {
                              setFilters({...filters, locations: filters.locations.filter(l => l !== location)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign size={14} />
                    Budget Range
                  </h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
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
                </div>

                {/* Job Type */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.jobTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, jobTypes: [...filters.jobTypes, type]});
                            } else {
                              setFilters({...filters, jobTypes: filters.jobTypes.filter(t => t !== type)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SLA Urgency */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">SLA Urgency</h4>
                  <div className="space-y-2">
                    {slaUrgency.map((urgency) => (
                      <label key={urgency} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.slaUrgency.includes(urgency.toLowerCase())}
                          onChange={(e) => {
                            const value = urgency.toLowerCase();
                            if (e.target.checked) {
                              setFilters({...filters, slaUrgency: [...filters.slaUrgency, value]});
                            } else {
                              setFilters({...filters, slaUrgency: filters.slaUrgency.filter(u => u !== value)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{urgency}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Company Type */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Company Type</h4>
                  <div className="space-y-2">
                    {companyTypes.map((type) => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.companyTypes.includes(type.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, companyTypes: [...filters.companyTypes, type.value]});
                            } else {
                              setFilters({...filters, companyTypes: filters.companyTypes.filter(t => t !== type.value)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                          {type.icon}
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Only Show</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.remotePossible}
                        onChange={(e) => setFilters({...filters, remotePossible: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Remote possible</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.suitableForSkills}
                        onChange={(e) => setFilters({...filters, suitableForSkills: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Suitable for my skills</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.newJobsToday}
                        onChange={(e) => setFilters({...filters, newJobsToday: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">New jobs today</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.hideApplied}
                        onChange={(e) => setFilters({...filters, hideApplied: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Hide applied jobs</span>
                    </label>
                  </div>
                </div>

                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
                  Apply Filters
                </button>
              </div>

              {/* Recommended Jobs Sidebar */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target size={18} className="text-blue-600" />
                  Recommended for You
                </h3>
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="bg-white border border-gray-300 rounded-lg p-4 hover:border-blue-500 cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-gray-900 text-sm">{job.title}</div>
                        <div className={`px-2 py-0.5 rounded text-xs font-bold ${getMatchColor(job.matchScore)}`}>
                          {job.matchScore}%
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">{job.company}</div>
                      <div className="text-sm font-bold text-gray-900">{job.budget}</div>
                      <button
                        onClick={() => handleViewDetails(job)}
                        className="w-full mt-2 py-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Job Feed */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Results Header */}
            <div className="bg-white border border-gray-300 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {sortedJobs.length} jobs found
                    {searchQuery && ` for "${searchQuery}"`}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Sorted by {filters.sortBy === 'best-match' ? 'Best Match (ML Score)' : filters.sortBy}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Showing {sortedJobs.length} of {jobListings.length} total jobs
                </div>
              </div>
            </div>

            {/* Empty State */}
            {sortedJobs.length === 0 && (
              <div className="bg-white border border-gray-300 rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs match your filters</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Job Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                : 'space-y-4'
            }`}>
              {sortedJobs.map((job) => (
                <div 
                  key={job.id}
                  className={`bg-white border border-gray-300 rounded-xl overflow-hidden hover:border-blue-500 transition-colors ${
                    appliedJobs.includes(job.id) ? 'opacity-90' : ''
                  }`}
                >
                  {/* Job Header */}
                  <div className="p-5 border-b border-gray-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                          {job.isEmergency && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                              <Flame size={10} className="inline mr-1" />
                              EMERGENCY
                            </span>
                          )}
                          {job.isPremium && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                              <Crown size={10} className="inline mr-1" />
                              PREMIUM
                            </span>
                          )}
                          {job.isNew && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                              <Zap size={10} className="inline mr-1" />
                              NEW
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Building size={14} />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin size={14} />
                            {job.location}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {job.category}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(job.priority)}`}>
                            {job.priority} PRIORITY
                          </span>
                        </div>
                      </div>
                      
                      {/* Match Score & Save */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-lg text-sm font-bold ${getMatchColor(job.matchScore)} border ${getMatchColor(job.matchScore).replace('text', 'border')}`}>
                            {job.matchScore}% Match
                          </div>
                          <button
                            onClick={(e) => toggleSavedJob(job.id, e)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            {savedJobs.includes(job.id) ? (
                              <BookmarkCheck size={18} className="text-blue-600 fill-blue-600" />
                            ) : (
                              <Bookmark size={18} className="text-gray-400 hover:text-blue-600" />
                            )}
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{job.budget}</div>
                          <div className="text-sm text-gray-600">Total Budget</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="p-5">
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-500">SLA Status</div>
                        <div className={`px-2 py-1 mt-1 rounded text-xs font-bold text-center ${getStatusColor(job.slaStatus)}`}>
                          {job.slaStatus === 'on-track' ? '🟢 On Track' : 
                           job.slaStatus === 'at-risk' ? '🟡 At Risk' : 
                           '🔴 Critical'}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-500">SLA Hours</div>
                        <div className="font-medium text-gray-900 mt-1">{job.slaHours}h</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-500">Timeline</div>
                        <div className="font-medium text-gray-900 mt-1">{job.timeline}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-500">Proposals</div>
                        <div className="font-medium text-gray-900 mt-1">{job.proposals} applied</div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2">Required Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Agent & Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{job.agent}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          <span className="text-xs text-gray-600">{job.agentRating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          {job.views} views
                        </div>
                        <div className="text-gray-500">Posted {job.posted}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-300">
                    <div className="flex items-center gap-3">
                      {appliedJobs.includes(job.id) ? (
                        <button
                          disabled
                          className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium flex-1 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Already Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(job)}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex-1"
                        >
                          Apply Now
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(job)}
                        className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium flex-1"
                      >
                        View Details
                      </button>
                      <button className="p-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg">
                        <Share2 size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700">
                  Previous
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700">2</button>
                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700">3</button>
                <span className="px-2 text-gray-500">...</span>
                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700">8</button>
                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Apply for Job</h3>
                  <p className="text-gray-600 mt-1">{selectedJob.title}</p>
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
              <div className="space-y-6">
                {/* Quoted Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Your Quoted Price (₹)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">₹</span>
                    <input 
                      type="number" 
                      placeholder="Enter your quoted price"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Budget: {selectedJob.budget} • Proposals: {selectedJob.proposals}
                  </div>
                </div>

                {/* Estimated Completion */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Estimated Completion Time
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Days</div>
                      <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Hours</div>
                      <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Job SLA: {selectedJob.slaHours} hours • Timeline: {selectedJob.timeline}
                  </div>
                </div>

                {/* Message to Agent */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Message to Agent
                  </label>
                  <textarea 
                    rows="4"
                    placeholder="Explain why you're the best fit for this job, your approach, relevant experience..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Attach Proposal (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Drop PDF or Word file here</div>
                    <div className="text-xs text-gray-500 mt-1">Max file size: 10MB</div>
                    <button className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                      Browse Files
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Terms & Conditions</div>
                      <div className="text-sm text-blue-700 mt-1">
                        By applying, you agree to the platform's terms and conditions. If selected, you'll be bound by the SLA terms and payment schedule.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitApplication}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Submit Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal for Mobile */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 lg:hidden">
          <div className="bg-white rounded-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button 
                  onClick={() => setShowFiltersModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              {/* Same filters content as desktop */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorJobSearch;