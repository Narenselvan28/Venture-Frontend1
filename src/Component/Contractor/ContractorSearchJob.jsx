import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, MapPin, Clock, DollarSign, Briefcase,
  Building, User, Star, Eye, Users, Heart, X,
  Bookmark, BookmarkCheck, Share2, CheckCircle, Upload
} from 'lucide-react';

const ContractorJobSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [savedJobs, setSavedJobs] = useState(['JOB-0428', 'JOB-0432']);
  const [appliedJobs, setAppliedJobs] = useState(['JOB-0427']);
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    categories: [],
    locations: [],
    budgetMin: '',
    budgetMax: '',
    sortBy: 'best-match'
  });

  const jobListings = [
    {
      id: 'JOB-0428',
      title: 'Electrical Panel Upgrade - Hospital',
      company: 'Apollo Hospitals',
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
      description: 'Upgrade of main electrical panel with safety compliance for hospital facility.',
      skills: ['Electrical', 'Panel Installation', 'Safety Compliance'],
      timeline: '7 days'
    },
    {
      id: 'JOB-0432',
      title: 'HVAC System Installation',
      company: 'Global Tech Solutions',
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
      description: 'Complete HVAC system installation for new corporate office building.',
      skills: ['HVAC Installation', 'VRF Systems', 'IoT'],
      timeline: '14 days'
    },
    {
      id: 'JOB-0435',
      title: 'Data Center Power Backup System',
      company: 'DataSecure Inc.',
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
      description: 'Installation of UPS and generator backup system for data center.',
      skills: ['UPS Installation', 'Generator', 'High Voltage'],
      timeline: '21 days'
    },
    {
      id: 'JOB-0437',
      title: 'Commercial Building LED Retrofit',
      company: 'GreenTech Solutions',
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
      description: 'Retrofit existing lighting system with energy-efficient LED fixtures.',
      skills: ['Lighting', 'Energy Efficiency', 'Retrofit'],
      timeline: '10 days'
    }
  ];

  const categories = ['Electrical', 'HVAC', 'Plumbing', 'Safety'];
  const locations = ['Chennai, TN', 'Bangalore, KA', 'Mumbai, MH', 'Hyderabad, TS'];

  const getStatusColor = (status) => {
    const colors = {
      'on-track': 'bg-emerald-100 text-emerald-800',
      'at-risk': 'bg-amber-100 text-amber-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'CRITICAL': 'bg-red-100 text-red-800',
      'HIGH': 'bg-orange-100 text-orange-800',
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

  const toggleSavedJob = (jobId, e) => {
    e.stopPropagation();
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = () => {
    if (!selectedJob) return;

    if (!appliedJobs.includes(selectedJob.id)) {
      setAppliedJobs([...appliedJobs, selectedJob.id]);
    }

    setShowApplyModal(false);
    alert(`Application submitted for ${selectedJob.title}!`);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      budgetMin: '',
      budgetMax: '',
      sortBy: 'best-match'
    });
    setSearchQuery('');
  };

  const filteredJobs = jobListings.filter(job => {
    if (filters.categories.length > 0 && !filters.categories.includes(job.category)) {
      return false;
    }
    if (filters.locations.length > 0 && !filters.locations.includes(job.location)) {
      return false;
    }
    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (filters.sortBy) {
      case 'best-match':
        return b.matchScore - a.matchScore;
      case 'budget-high':
        return parseInt(b.budget.replace(/[^0-9]/g, '')) - parseInt(a.budget.replace(/[^0-9]/g, ''));
      case 'budget-low':
        return parseInt(a.budget.replace(/[^0-9]/g, '')) - parseInt(b.budget.replace(/[^0-9]/g, ''));
      default:
        return b.matchScore - a.matchScore;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
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
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm"
                >
                  <option value="best-match">Best Match</option>
                  <option value="latest">Latest First</option>
                  <option value="budget-high">Budget High → Low</option>
                  <option value="budget-low">Budget Low → High</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 lg:hidden"
                >
                  <Filter size={18} />
                  <span className="font-medium">Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-28">
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
                  <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, categories: [...filters.categories, category] });
                            } else {
                              setFilters({ ...filters, categories: filters.categories.filter(c => c !== category) });
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
                  <h4 className="font-medium text-gray-900 mb-3">Location</h4>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <label key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.locations.includes(location)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, locations: [...filters.locations, location] });
                            } else {
                              setFilters({ ...filters, locations: filters.locations.filter(l => l !== location) });
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
                  <h4 className="font-medium text-gray-900 mb-3">Budget Range</h4>
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

          {/* Main Job Feed */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Results Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">
                  {sortedJobs.length} jobs found
                </div>
                <div className="text-sm text-gray-600">
                  Showing {sortedJobs.length} of {jobListings.length} jobs
                </div>
              </div>
            </div>

            {/* Empty State */}
            {sortedJobs.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <Search size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedJobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 ${appliedJobs.includes(job.id) ? 'opacity-90' : ''
                    }`}
                >
                  {/* Job Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{job.title}</h3>
                          {job.isNew && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded">
                              NEW
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-sm text-gray-600">
                            <Building size={14} className="inline mr-1" />
                            {job.company}
                          </div>
                          <div className="text-sm text-gray-600">
                            <MapPin size={14} className="inline mr-1" />
                            {job.location}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {job.category}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(job.priority)}`}>
                            {job.priority}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded text-sm font-bold ${getMatchColor(job.matchScore)}`}>
                            {job.matchScore}% Match
                          </div>
                          <button
                            onClick={(e) => toggleSavedJob(job.id, e)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {savedJobs.includes(job.id) ? (
                              <BookmarkCheck size={18} className="text-blue-600" />
                            ) : (
                              <Bookmark size={18} className="text-gray-400" />
                            )}
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">{job.budget}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="p-4">
                    <p className="text-gray-700 text-sm mb-4">{job.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">SLA Status</div>
                        <div className={`px-2 py-1 mt-1 rounded text-xs font-bold ${getStatusColor(job.slaStatus)}`}>
                          {job.slaStatus}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">SLA Hours</div>
                        <div className="font-medium text-gray-900 mt-1">{job.slaHours}h</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Timeline</div>
                        <div className="font-medium text-gray-900 mt-1">{job.timeline}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Proposals</div>
                        <div className="font-medium text-gray-900 mt-1">{job.proposals}</div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2">Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Agent & Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{job.agent}</span>
                        <Star size={12} className="text-amber-500 fill-amber-500 ml-2" />
                        <span className="text-xs text-gray-600">{job.agentRating}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <Eye size={14} className="inline mr-1" />
                        {job.views}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      {appliedJobs.includes(job.id) ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium flex-1 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(job)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex-1"
                        >
                          Apply Now
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/contractor/jobs/${job.id}`)}
                        className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium flex-1"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Apply for Job</h3>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Your Quoted Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your quoted price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Estimated Completion (Days)
                  </label>
                  <input
                    type="number"
                    placeholder="Days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Explain your approach..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default ContractorJobSearch;