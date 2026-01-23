// pages/ContractorJobFeed.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Search, Filter, MapPin, Clock, DollarSign,
  Star, Heart, Eye, Users, Briefcase,
  Building, User, CheckCircle, AlertCircle,
  Flame, Zap, Calendar, FileText, X,
  ChevronRight
} from 'lucide-react';

const ContractorJobFeed = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobListings, setJobListings] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    skills: [],
    location: '',
    category: '',
    budgetMin: '',
    budgetMax: '',
    sortBy: 'latest'
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/jobs');
        if (res.data?.jobs) {
          const formattedJobs = res.data.jobs
            .filter(job => job.status === 'PUBLISHED' || job.status === 'OPEN')
            .map(job => ({
              ...job,
              id: job._id,
              slaStatus: (job.riskState || 'ON_TRACK').toLowerCase().replace('_', '-'),
              matchScore: Math.floor(Math.random() * 20) + 80,
              urgent: job.priority === 'CRITICAL' || job.priority === 'HIGH',
              views: Math.floor(Math.random() * 100),
              applications: Math.floor(Math.random() * 10),
              slaHours: 48,
              company: job.agentId?.companyName || 'Unknown Company',
              agent: job.agentId?.name || 'Unknown Agent',
              agentRating: 4.8,
              posted: new Date(job.createdAt).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short' 
              })
            }));

          setJobListings(formattedJobs);
        }
      } catch (error) {
        console.error("Error fetching job feed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Categories & Skills
  const categories = ['Electrical', 'HVAC', 'Plumbing', 'Safety'];
  const skills = ['Panel Installation', 'Wiring', 'Circuit Design', 'HVAC Installation'];

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      'on-track': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'at-risk': 'bg-amber-100 text-amber-800 border-amber-200',
      'critical': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'on-track': <CheckCircle size={12} />,
      'at-risk': <AlertCircle size={12} />,
      'critical': <Clock size={12} />
    };
    return icons[status] || <Clock size={12} />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'HIGH': 'bg-red-100 text-red-800',
      'MEDIUM': 'bg-amber-100 text-amber-800',
      'LOW': 'bg-blue-100 text-blue-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getMatchColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-gray-600';
  };

  // Action handlers
  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyJob = (jobId) => {
    const job = jobListings.find(job => job.id === jobId);
    if (job) {
      setSelectedJob(job);
      setShowApplyModal(true);
    }
  };

  const handleSubmitApplication = () => {
    if (!selectedJob) return;
    
    setAppliedJobs(prev => 
      prev.includes(selectedJob.id) ? prev : [...prev, selectedJob.id]
    );
    
    alert(`Application submitted for ${selectedJob.title}!`);
    navigate('/contractor/jobs?tab=my-applications');
  };

  // Filter jobs
  const filteredJobs = jobListings.filter(job => {
    if (activeTab === 'my-applications') return appliedJobs.includes(job.id);
    if (activeTab === 'saved') return savedJobs.includes(job.id);
    if (activeTab === 'recommended') return job.matchScore >= 80;
    return true;
  });

  // Tab configuration
  const tabs = [
    { id: 'all', label: 'All Jobs', count: jobListings.length },
    { id: 'my-applications', label: 'My Applications', count: appliedJobs.length },
    { id: 'saved', label: 'Saved Jobs', count: savedJobs.length },
    { 
      id: 'recommended', 
      label: 'Recommended', 
      count: jobListings.filter(j => j.matchScore >= 80).length 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Work</h1>
          <p className="text-gray-600">Discover opportunities that match your skills</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="latest">Latest First</option>
                <option value="budget-high">Budget High → Low</option>
                <option value="budget-low">Budget Low → High</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter size={18} />
                <span className="font-medium">Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
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
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setFilters({
                      skills: [],
                      location: '',
                      category: '',
                      budgetMin: '',
                      budgetMax: '',
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
                          onChange={(e) => setFilters({ 
                            ...filters, 
                            category: e.target.checked ? cat : '' 
                          })}
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
                    {skills.map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.skills.includes(skill)}
                          onChange={(e) => {
                            const newSkills = e.target.checked
                              ? [...filters.skills, skill]
                              : filters.skills.filter(s => s !== skill);
                            setFilters({ ...filters, skills: newSkills });
                          }}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">All Locations</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>

                {/* Budget Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Budget Range (₹)</h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.budgetMin}
                      onChange={(e) => setFilters({ ...filters, budgetMin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.budgetMax}
                      onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Main Feed */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-500">Total Jobs</div>
                <div className="text-xl font-bold text-gray-900">{jobListings.length}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-500">Applied</div>
                <div className="text-xl font-bold text-blue-600">{appliedJobs.length}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-500">Avg. Budget</div>
                <div className="text-xl font-bold text-emerald-600">₹4.5L</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-500">Match Rate</div>
                <div className="text-xl font-bold text-amber-600">86%</div>
              </div>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors ${
                    appliedJobs.includes(job.id) ? 'opacity-90' : ''
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{job.title}</h3>
                          {job.urgent && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                              <Flame size={10} className="inline mr-1" />
                              URGENT
                            </span>
                          )}
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {job.category}
                        </span>
                      </div>
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin size={14} />
                        {job.location}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        getStatusColor(job.slaStatus)
                      }`}>
                        {getStatusIcon(job.slaStatus)}
                        {job.slaStatus === 'on-track' ? 'On time' :
                         job.slaStatus === 'at-risk' ? 'At risk' : 'Critical'}
                      </span>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="p-4">
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
                        <div className={`px-2 py-1 inline-block rounded text-xs font-bold ${
                          getPriorityColor(job.priority)
                        }`}>
                          {job.priority}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Posted</div>
                        <div className="font-medium text-gray-900">{job.posted}</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye size={14} className="text-gray-400" />
                          <span className="text-gray-600">{job.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-gray-400" />
                          <span className="text-gray-600">{job.applications} applied</span>
                        </div>
                      </div>
                      {job.matchScore >= 80 && (
                        <div className={`text-sm font-bold ${getMatchColor(job.matchScore)}`}>
                          <Zap size={14} className="inline mr-1" />
                          {job.matchScore}% Match
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/contractor/jobs/${job.id}`)}
                        className="flex-1 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium"
                      >
                        View Details
                      </button>
                      {appliedJobs.includes(job.id) ? (
                        <button className="flex-1 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium flex items-center justify-center gap-2">
                          <CheckCircle size={16} />
                          Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyJob(job.id)}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
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
                      sortBy: 'latest'
                    });
                    setSearchQuery('');
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
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
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Submit Proposal</h3>
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
              {/* Quote */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Quote & Pricing</h4>
                <input
                  type="number"
                  placeholder="Your quote amount (₹)"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-2"
                />
                <div className="text-sm text-gray-500">
                  Budget: {selectedJob.budget}
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Timeline</h4>
                <input
                  type="date"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-2"
                />
                <div className="text-sm text-gray-500">
                  Client timeline: {selectedJob.timeline}
                </div>
              </div>

              {/* Proposal Details */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Proposal Details</h4>
                <textarea
                  rows="4"
                  placeholder="Explain your approach and experience..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Review */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Review</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="text-sm text-gray-700">
                    <strong>Job:</strong> {selectedJob.title}
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    <strong>Location:</strong> {selectedJob.location}
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    <strong>Application ID:</strong> APP-{Date.now().toString().slice(-6)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Submit Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorJobFeed;