// pages/AgentJobs.jsx (or AgentHome.jsx based on your error)
import React, { useState, useEffect } from 'react';
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
  Plus,
  Loader2,
  BarChart3,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateJobModal from './CreateJobModal';
import JobDetailsModal from './JobDetailsModal';

const AgentJobs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    ongoing: 0,
    completed: 0,
    atRisk: 0,
    delayed: 0
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {
        page: currentPage,
        limit: 10,
        sortBy,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        filter: activeFilter !== 'all' ? activeFilter : undefined
      };

      // Remove undefined params
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

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
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, sortBy, statusFilter, priorityFilter, activeFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchJobs();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(stats.total / itemsPerPage);

  const filters = [
    { id: 'all', label: 'All Jobs', count: stats.total },
    { id: 'ongoing', label: 'Ongoing', count: stats.ongoing },
    { id: 'completed', label: 'Completed', count: stats.completed },
    { id: 'at_risk', label: 'At Risk', count: stats.atRisk },
    { id: 'delayed', label: 'Delayed', count: stats.delayed },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'BIDDING', label: 'Bidding' },
    { value: 'ASSIGNED', label: 'Assigned' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'CRITICAL', label: 'Critical' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priority', label: 'Priority' },
    { value: 'budget', label: 'Budget' },
    { value: 'deadline', label: 'Deadline' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
      PUBLISHED: 'bg-blue-50 text-blue-700 border-blue-200',
      BIDDING: 'bg-purple-50 text-purple-700 border-purple-200',
      ASSIGNED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      COMPLETED: 'bg-green-50 text-green-700 border-green-200',
      CLOSED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      CANCELLED: 'bg-red-50 text-red-700 border-red-200',
      COMPLETION_SUBMITTED: 'bg-teal-50 text-teal-700 border-teal-200',
      VERIFIED: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      INVOICED: 'bg-violet-50 text-violet-700 border-violet-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      CRITICAL: 'bg-purple-500',
      HIGH: 'bg-red-500',
      MEDIUM: 'bg-yellow-500',
      LOW: 'bg-green-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getPriorityTextColor = (priority) => {
    const colors = {
      CRITICAL: 'text-purple-600',
      HIGH: 'text-red-600',
      MEDIUM: 'text-yellow-600',
      LOW: 'text-green-600',
    };
    return colors[priority] || 'text-gray-600';
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Jobs Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage and monitor all your jobs in one place</p>
            </div>

            <button
              onClick={handleCreateJob}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow transition-all duration-200"
            >
              <Plus size={20} />
              <span>Create New Job</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BarChart3 className="text-blue-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Ongoing</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.ongoing}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Clock className="text-yellow-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">At Risk</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.atRisk}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="text-red-600" size={20} />
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
                  placeholder="Search jobs by title, ID, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>

                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>

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
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeFilter === filter.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  <span>{filter.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                  Retry
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first job'}
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
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                  <div className="col-span-4">Job Details</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Priority</div>
                  <div className="col-span-2">Budget</div>
                  <div className="col-span-2">Actions</div>
                </div>

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
                            <div>
                              <h3 className="font-semibold text-gray-900">{job.title}</h3>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm font-mono text-gray-500">#{job.jobCode}</span>
                                {job.location && (
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <MapPin size={14} />
                                    <span>{job.location.city || 'Remote'}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Calendar size={14} />
                                  <span>{formatDate(job.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="md:col-span-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                            {job.status.replace('_', ' ')}
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
                {totalPages > 1 && (
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
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                        {totalPages > 5 && <span className="px-2">...</span>}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
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

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onJobCreated={handleJobCreated}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        job={selectedJob}
      />
    </div>
  );
};

export default AgentJobs;