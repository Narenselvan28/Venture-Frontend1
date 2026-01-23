// pages/AgentApplications.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
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
  TrendingDown,
  Star,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  MessageSquare,
  GitCompare,
  ExternalLink,
  MoreVertical,
  Mail,
  Phone,
  User,
  Building,
  Activity,
  Check,
  X,
  Sparkles,
  Package,
  Percent,
  Settings,
  Loader2,
  BarChart2,
  Target,
  Cpu,
  Shield,
  Zap,
} from 'lucide-react';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import { useDebounce } from '../../hooks/useDebounce';

const AgentApplications = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedJobs, setExpandedJobs] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [jobGroups, setJobGroups] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    approved: 0,
    rejected: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isExporting, setIsExporting] = useState(false);

  // Advanced filter state
  const [filters, setFilters] = useState({
    budget: [],
    experience: [],
    rating: '',
    location: '',
    skills: [],
    contractorType: '',
    submittedAfter: '',
    submittedBefore: '',
  });

  // Constants
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending', color: 'blue' },
    { value: 'REVIEWED', label: 'Reviewed', color: 'amber' },
    { value: 'SHORTLISTED', label: 'Shortlisted', color: 'purple' },
    { value: 'APPROVED', label: 'Approved', color: 'emerald' },
    { value: 'REJECTED', label: 'Rejected', color: 'red' },
  ];

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        search: debouncedSearch || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy,
        ...filters,
      };

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0)) {
          delete params[key];
        }
      });

      const response = await api.get('/agent/applications', { params });
      const { jobs, stats: fetchedStats } = response.data;

      setJobGroups(jobs);
      setStats(fetchedStats);

    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, sortBy, filters]);

  // Fetch applications on mount and when dependencies change
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Helper functions
  const getStatusColor = (status) => {
    const statusMap = {
      'PENDING': 'bg-blue-100 text-blue-800 border-blue-200',
      'NEW': 'bg-blue-100 text-blue-800 border-blue-200',
      'REVIEWED': 'bg-amber-100 text-amber-800 border-amber-200',
      'SHORTLISTED': 'bg-purple-100 text-purple-800 border-purple-200',
      'APPROVED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'ACCEPTED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'REJECTED': 'bg-red-100 text-red-800 border-red-200',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const priorityMap = {
      'CRITICAL': 'bg-purple-100 text-purple-800 border-purple-200',
      'HIGH': 'bg-red-100 text-red-800 border-red-200',
      'MEDIUM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'LOW': 'bg-green-100 text-green-800 border-green-200',
    };
    return priorityMap[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRiskColor = (risk) => {
    const riskMap = {
      'VERY_LOW': 'bg-emerald-100 text-emerald-800',
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'VERY_HIGH': 'bg-red-100 text-red-800',
    };
    return riskMap[risk] || 'bg-gray-100 text-gray-800';
  };

  const getRiskScoreColor = (score) => {
    if (score < 15) return 'text-emerald-600';
    if (score < 30) return 'text-green-600';
    if (score < 50) return 'text-yellow-600';
    if (score < 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskScoreBgColor = (score) => {
    if (score < 15) return 'bg-emerald-500';
    if (score < 30) return 'bg-green-500';
    if (score < 50) return 'bg-yellow-500';
    if (score < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handlers
  const handleApprove = async (applicationId) => {
    try {
      await api.put(`/applications/${applicationId}/approve`);
      alert('Application approved successfully!');
      fetchApplications(); // Refresh data
    } catch (err) {
      console.error('Error approving application:', err);
      alert('Failed to approve application. Please try again.');
    }
  };

  const handleReject = async (applicationId, reason = '') => {
    try {
      await api.put(`/applications/${applicationId}/reject`, { reason });
      alert('Application rejected successfully!');
      fetchApplications(); // Refresh data
    } catch (err) {
      console.error('Error rejecting application:', err);
      alert('Failed to reject application. Please try again.');
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await api.get('/agent/applications/export', {
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchQuery || undefined,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting applications:', err);
      alert('Failed to export applications. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  const toggleJobExpansion = (jobId) => {
    setExpandedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleApplicationSelection = (applicationId) => {
    setSelectedApplications(prev =>
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const handleCompareApplications = () => {
    if (selectedApplications.length < 2) {
      alert('Please select at least 2 applications to compare');
      return;
    }
    // Navigate to comparison page or open comparison modal
    console.log('Compare applications:', selectedApplications);
  };

  // KPI Cards data
  const kpiCards = [
    {
      label: 'Total Applications',
      value: stats.total,
      trend: '+15%',
      trendUp: true,
      icon: Package,
      color: 'from-blue-50 to-blue-100',
      border: 'border-blue-200',
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      trend: '+5%',
      trendUp: false,
      icon: Clock,
      color: 'from-amber-50 to-amber-100',
      border: 'border-amber-200',
    },
    {
      label: 'Approved',
      value: stats.approved,
      trend: '+12%',
      trendUp: true,
      icon: CheckCircle,
      color: 'from-emerald-50 to-emerald-100',
      border: 'border-emerald-200',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      trend: '-3%',
      trendUp: true,
      icon: XCircle,
      color: 'from-red-50 to-red-100',
      border: 'border-red-200',
    },
    {
      label: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      trend: '+2.4%',
      trendUp: true,
      icon: Percent,
      color: 'from-purple-50 to-purple-100',
      border: 'border-purple-200',
    },
    {
      label: 'Shortlisted',
      value: stats.shortlisted,
      trend: '+8%',
      trendUp: true,
      icon: Target,
      color: 'from-violet-50 to-violet-100',
      border: 'border-violet-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Applications & Proposals</h1>
                  <p className="text-gray-600 mt-1">
                    Review, compare, and manage contractor applications across all jobs
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedApplications.length > 0 && (
                <button
                  onClick={handleCompareApplications}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 font-medium"
                >
                  <GitCompare size={18} />
                  Compare ({selectedApplications.length})
                </button>
              )}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Download size={18} />
                )}
                Export
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by job ID, title, contractor, skills, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                >
                  <Filter size={18} />
                  {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price (Low to High)</option>
                  <option value="price_high">Price (High to Low)</option>
                  <option value="rating">Highest Rating</option>
                  <option value="risk">Lowest Risk</option>
                </select>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${statusFilter === status.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  <span>{status.label}</span>
                </button>
              ))}
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Budget Range
                    </label>
                    <div className="space-y-2">
                      {['Under ₹1L', '₹1-3L', '₹3-5L', '₹5L+'].map((range) => (
                        <label key={range} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.budget.includes(range)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({...filters, budget: [...filters.budget, range]});
                              } else {
                                setFilters({...filters, budget: filters.budget.filter(b => b !== range)});
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Experience Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Experience
                    </label>
                    <div className="space-y-2">
                      {['1-3 years', '3-5 years', '5-10 years', '10+ years'].map((exp) => (
                        <label key={exp} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.experience.includes(exp)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({...filters, experience: [...filters.experience, exp]});
                              } else {
                                setFilters({...filters, experience: filters.experience.filter(e => e !== exp)});
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{exp}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Minimum Rating
                    </label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters({...filters, rating: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.8">4.8+ Stars</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setFilters({
                        budget: [],
                        experience: [],
                        rating: '',
                        location: '',
                        skills: [],
                        contractorType: '',
                        submittedAfter: '',
                        submittedBefore: '',
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={fetchApplications}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {kpiCards.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={index}
                  className={`bg-white border ${kpi.border} rounded-xl p-4 hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${kpi.color}`}>
                      <Icon className="text-gray-700" size={20} />
                    </div>
                    <div className={`flex items-center text-sm font-semibold ${kpi.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                      {kpi.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {kpi.trend}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                  <div className="text-sm text-gray-600">{kpi.label}</div>
                </div>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchApplications}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : jobGroups.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || statusFilter !== 'all' || showAdvancedFilters
                    ? 'Try adjusting your search or filters'
                    : 'No applications have been submitted yet'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Job Cards */}
                {jobGroups.map((job) => (
                  <div key={job._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Job Header */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                              <Briefcase className="text-blue-600" size={24} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  #{job.jobCode}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                {job.client && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Building size={14} />
                                    <span className="text-sm">{job.client}</span>
                                  </div>
                                )}
                                {job.location?.city && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <MapPin size={14} />
                                    <span className="text-sm">{job.location.city}</span>
                                  </div>
                                )}
                                {job.createdAt && (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Calendar size={14} />
                                    <span className="text-sm">{formatDate(job.createdAt)}</span>
                                  </div>
                                )}
                              </div>

                              {/* Stats Row */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Budget</div>
                                  <div className="text-sm font-bold text-gray-900">{formatCurrency(job.budget)}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Priority</div>
                                  <div className={`px-2 py-1 rounded text-xs font-bold inline-block ${getPriorityColor(job.priority)}`}>
                                    {job.priority}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Applications</div>
                                  <div className="text-sm font-bold text-gray-900">{job.applicationsCount}</div>
                                </div>
                                {job.deadline && (
                                  <div>
                                    <div className="text-xs text-gray-500 mb-1">Deadline</div>
                                    <div className="text-sm font-bold text-gray-900">{formatDate(job.deadline)}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Panel */}
                        <div className="flex flex-col items-end gap-3">
                          <button
                            onClick={() => toggleJobExpansion(job._id)}
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                          >
                            {expandedJobs.includes(job._id) ? (
                              <>
                                <ChevronUp size={16} />
                                Hide Applications
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />
                                Show Applications ({job.applicationsCount})
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Job Details
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Applications Grid */}
                    {expandedJobs.includes(job._id) && (
                      <div className="p-6 bg-gray-50/50">
                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="font-bold text-gray-900">Submitted Proposals</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                              className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500"
                              onChange={(e) => console.log('Sort applications:', e.target.value)}
                            >
                              <option value="best_match">Best Match</option>
                              <option value="lowest_price">Lowest Price</option>
                              <option value="highest_rating">Highest Rating</option>
                              <option value="lowest_risk">Lowest Risk</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {job.applications.map((app) => (
                            <div
                              key={app._id}
                              className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
                            >
                              {/* Application Header */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                  <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                      {app.contractor?.avatar ? (
                                        <img
                                          src={app.contractor.avatar}
                                          alt={app.contractor.name}
                                          className="w-10 h-10 rounded-full object-cover"
                                        />
                                      ) : (
                                        <User className="text-blue-600" size={24} />
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-bold text-gray-900">{app.contractor?.name}</h5>
                                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(app.status)}`}>
                                        {app.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{app.contractor?.company}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <div className="flex items-center">
                                        <Star size={12} className="text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-bold ml-1">{app.contractor?.rating || 'N/A'}</span>
                                        <span className="text-xs text-gray-500 ml-1">
                                          ({app.contractor?.reviews || 0} reviews)
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500">
                                        • {app.contractor?.experience || 'N/A'} exp
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Selection Checkbox */}
                                <input
                                  type="checkbox"
                                  checked={selectedApplications.includes(app._id)}
                                  onChange={() => toggleApplicationSelection(app._id)}
                                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                              </div>

                              {/* Bid Details */}
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="text-xs text-gray-500 mb-1">Bid Amount</div>
                                  <div className="text-lg font-bold text-gray-900">
                                    {formatCurrency(app.bidAmount)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    vs Budget: {formatCurrency(job.budget)}
                                  </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="text-xs text-gray-500 mb-1">Estimated Time</div>
                                  <div className="text-lg font-bold text-gray-900">
                                    {app.estimatedTime || 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Submitted: {formatDate(app.submittedAt)}
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleViewDetails(app)}
                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-1"
                                  >
                                    <Eye size={14} />
                                    Details
                                  </button>
                                  <button className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg flex items-center gap-1">
                                    <MessageSquare size={14} />
                                    Message
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleApprove(app._id)}
                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm font-medium rounded-lg flex items-center gap-1"
                                  >
                                    <Check size={14} />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(app._id, 'Not selected')}
                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg flex items-center gap-1"
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
            )}
          </div>
        </div>
      </main>

      {/* Application Details Modal */}
      <ApplicationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        application={selectedApplication}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default AgentApplications;