// pages/AgentJobs.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import {
  Search,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Eye,
  MapPin,
  DollarSign,
  Zap,
  Plus,
  Loader2,
  BarChart3,
  Filter,
  Download,
  ChevronDown,
  X,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateJobModal from './CreateJobModal';
import JobDetailsModal from './JobDetailsModal';

const AgentJobs = () => {
  const navigate = useNavigate();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Data state
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    ongoing: 0,
    completed: 0,
    atRisk: 0,
    delayed: 0,
    draft: 0,
    published: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    category: [],
    location: '',
    budgetMin: '',
    budgetMax: '',
  });

  // Constants
  const itemsPerPage = 8;

  // Status options
  const statusOptions = [
    { value: 'DRAFT', label: 'Draft', color: 'gray' },
    { value: 'PUBLISHED', label: 'Published', color: 'blue' },
    { value: 'BIDDING', label: 'Bidding', color: 'purple' },
    { value: 'ASSIGNED', label: 'Assigned', color: 'teal' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'indigo' },
    { value: 'COMPLETION_SUBMITTED', label: 'Completion Submitted', color: 'green' },
    { value: 'VERIFIED', label: 'Verified', color: 'emerald' },
    { value: 'INVOICED', label: 'Invoiced', color: 'violet' },
    { value: 'CLOSED', label: 'Closed', color: 'green' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
  ];

  // Priority options
  const priorityOptions = [
    { value: 'CRITICAL', label: 'Critical', color: 'purple' },
    { value: 'HIGH', label: 'High', color: 'red' },
    { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
    { value: 'LOW', label: 'Low', color: 'green' },
  ];

  // Filter tabs
  const filterTabs = [
    { id: 'all', label: 'All Jobs', icon: BarChart3 },
    { id: 'ongoing', label: 'Ongoing', icon: Zap },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
    { id: 'at_risk', label: 'At Risk', icon: AlertTriangle },
    { id: 'delayed', label: 'Delayed', icon: Clock },
  ];

  // Sort options
  const sortOptions = [
    { value: 'latest', label: 'Latest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' },
    { value: 'budget_high', label: 'Budget (High to Low)' },
    { value: 'budget_low', label: 'Budget (Low to High)' },
    { value: 'deadline', label: 'Deadline' },
  ];

  // Fetch jobs with filters
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        filter: activeFilter !== 'all' ? activeFilter : undefined,
        sortBy,
        ...filters,
      };

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0)) {
          delete params[key];
        }
      });

      const response = await api.get('/agent/jobs', { params });
      const { jobs: fetchedJobs, stats: fetchedStats } = response.data;

      setJobs(fetchedJobs);
      setStats(fetchedStats);

    } catch (error) {
      console.error("Error fetching agent jobs:", error);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, activeFilter, sortBy, filters]);

  // Fetch jobs on mount and when dependencies change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Helper functions
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    if (!statusOption) return 'bg-gray-100 text-gray-700 border-gray-200';

    const colorMap = {
      gray: 'bg-gray-100 text-gray-700 border-gray-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      teal: 'bg-teal-50 text-teal-700 border-teal-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      violet: 'bg-violet-50 text-violet-700 border-violet-200',
      red: 'bg-red-50 text-red-700 border-red-200',
    };

    return colorMap[statusOption.color] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const priorityOption = priorityOptions.find(opt => opt.value === priority);
    if (!priorityOption) return 'bg-gray-500';

    const colorMap = {
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
    };

    return colorMap[priorityOption.color] || 'bg-gray-500';
  };

  const getPriorityTextColor = (priority) => {
    const priorityOption = priorityOptions.find(opt => opt.value === priority);
    if (!priorityOption) return 'text-gray-600';

    const colorMap = {
      purple: 'text-purple-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      green: 'text-green-600',
    };

    return colorMap[priorityOption.color] || 'text-gray-600';
  };

  const getRiskStateColor = (state) => {
    switch (state) {
      case 'ON_TRACK': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'AT_RISK': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'DELAYED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getRiskStateIcon = (state) => {
    switch (state) {
      case 'ON_TRACK': return <CheckCircle size={14} />;
      case 'AT_RISK': return <AlertTriangle size={14} />;
      case 'DELAYED': return <Clock size={14} />;
      default: return null;
    }
  };



  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleCreateJob = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedJob(null);
  };

  const handleJobCreated = () => {
    setIsCreateModalOpen(false);
    fetchJobs();
  };

  const handleExportJobs = async () => {
    try {
      const response = await api.get('/agent/jobs/export', {
        params: {
          filter: activeFilter !== 'all' ? activeFilter : undefined,
          search: searchQuery || undefined,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `jobs-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting jobs:', error);
      alert('Failed to export jobs. Please try again.');
    }
  };

  // Calculate filtered jobs count for tabs
  const getFilterCount = (filterId) => {
    switch (filterId) {
      case 'all': return stats.total;
      case 'ongoing': return stats.ongoing;
      case 'completed': return stats.completed;
      case 'at_risk': return stats.atRisk;
      case 'delayed': return stats.delayed;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Jobs Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and monitor all your jobs in one place</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportJobs}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                <Download size={18} />
                Export
              </button>
              <button
                onClick={handleCreateJob}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:shadow transition-all duration-200"
              >
                <Plus size={20} />
                <span>Create New Job</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Jobs</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BarChart3 className="text-blue-600" size={18} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Ongoing</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stats.ongoing}</p>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Zap className="text-indigo-600" size={18} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Completed</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stats.completed}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="text-green-600" size={18} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">At Risk</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stats.atRisk}</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="text-yellow-600" size={18} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Delayed</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stats.delayed}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <Clock className="text-red-600" size={18} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Draft</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{stats.draft}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <FileText className="text-gray-600" size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search jobs by title, ID, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
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

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                >
                  <Filter size={18} />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => {
                const Icon = tab.icon;
                const count = getFilterCount(tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${activeFilter === tab.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Status</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {statusOptions.map((status) => (
                      <label key={status.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, status: [...filters.status, status.value] });
                            } else {
                              setFilters({ ...filters, status: filters.status.filter(s => s !== status.value) });
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{status.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Priority</label>
                  <div className="space-y-2">
                    {priorityOptions.map((priority) => (
                      <label key={priority.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.priority.includes(priority.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, priority: [...filters.priority, priority.value] });
                            } else {
                              setFilters({ ...filters, priority: filters.priority.filter(p => p !== priority.value) });
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{priority.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Budget Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.budgetMin}
                      onChange={(e) => setFilters({ ...filters, budgetMin: e.target.value })}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.budgetMax}
                      onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    setFilters({
                      status: [],
                      priority: [],
                      category: [],
                      location: '',
                      budgetMin: '',
                      budgetMax: '',
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={fetchJobs}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Jobs List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
              <div className="col-span-4">Job Details</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2">Budget</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || activeFilter !== 'all' || showFilters
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first job'
                  }
                </p>
                <button
                  onClick={handleCreateJob}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Plus size={20} />
                  Create New Job
                </button>
              </div>
            ) : (
              <>
                {/* Jobs List */}
                <div className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Job Details */}
                        <div className="md:col-span-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${getStatusColor(job.status).split(' ')[0]} bg-opacity-10`}>
                              <FileText className={getStatusColor(job.status).split(' ')[1]} size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-mono text-gray-500">#{job.jobCode || job._id.slice(-6)}</span>
                                {job.riskState && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getRiskStateColor(job.riskState)}`}>
                                    {getRiskStateIcon(job.riskState)}
                                    {job.riskState.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                              <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                                {job.category && (
                                  <span className="truncate">{job.category}</span>
                                )}
                                {job.location?.city && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <div className="flex items-center gap-1">
                                      <MapPin size={14} />
                                      <span className="truncate">{job.location.city}</span>
                                    </div>
                                  </>
                                )}
                                {job.createdAt && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <div className="flex items-center gap-1">
                                      <Calendar size={14} />
                                      <span>{formatDate(job.createdAt)}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="md:col-span-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                            {statusOptions.find(s => s.value === job.status)?.label || job.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Priority */}
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(job.priority)}`} />
                            <span className={`text-sm font-medium ${getPriorityTextColor(job.priority)}`}>
                              {job.priority}
                            </span>
                          </div>
                        </div>

                        {/* Budget */}
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="text-gray-400" size={16} />
                            <span className="font-semibold text-gray-900">{formatCurrency(job.budget)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(job)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                            >
                              <Eye size={16} />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => navigate(`/agent/jobs/${job._id}`)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {stats.total > itemsPerPage && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, stats.total)} of {stats.total} jobs
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        {Array.from({ length: Math.min(5, Math.ceil(stats.total / itemsPerPage)) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-lg font-medium ${currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        {Math.ceil(stats.total / itemsPerPage) > 5 && <span className="px-2">...</span>}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(stats.total / itemsPerPage)))}
                          disabled={currentPage === Math.ceil(stats.total / itemsPerPage)}
                          className={`p-2 rounded-lg ${currentPage === Math.ceil(stats.total / itemsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onJobCreated={handleJobCreated}
      />

      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        job={selectedJob}
      />
    </div>
  );
};

export default AgentJobs;