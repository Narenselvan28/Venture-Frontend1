// pages/AgentSearch.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, MapPin,
  Star, X,
  Loader2, AlertTriangle, Target,
  Building,
  Briefcase, Users, Download, MessageSquare, ChevronDown, ChevronUp,
  FileText, Mail, Phone, ExternalLink, Award, Plus
} from 'lucide-react';
import api from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';

const AgentSearch = () => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [bulkSelect, setBulkSelect] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [error, setError] = useState(null);

  // Data state
  const [contractors, setContractors] = useState([]);
  const [jobListings, setJobListings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    verified: 0,
    highRating: 0,
  });

  // Filter state
  const [filters, setFilters] = useState({
    skills: [],
    location: '',
    rating: '',
    slaScore: '',
    minJobs: '',
    riskLevel: '',
    availability: '',
    companySize: '',
    certifications: [],
    budgetMin: '',
    budgetMax: '',
  });

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('best_match');
  const [inviteMessage, setInviteMessage] = useState('');
  const [responseDeadline, setResponseDeadline] = useState('48');
  // Add this function to your AgentSearch component


  // OR if you want to keep the original functionality, add this function before the return statement
  // Skill categories
  const skillCategories = [
    { id: 'electrical', label: 'Electrical' },
    { id: 'hvac', label: 'HVAC' },
    { id: 'plumbing', label: 'Plumbing' },
    { id: 'data_center', label: 'Data Center' },
    { id: 'hospital', label: 'Hospital' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'residential', label: 'Residential' },
    { id: 'fire_safety', label: 'Fire Safety' },
    { id: 'automation', label: 'Automation' },
    { id: 'solar', label: 'Solar' },
    { id: 'maintenance', label: 'Maintenance' },
  ];

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch contractors
  const fetchContractors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        q: debouncedSearch || undefined,
        ...filters,
        sortBy,
        page: 1,
        limit: 20,
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0)) {
          delete params[key];
        }
      });

      const response = await api.get('/contractors/search', { params });
      const { contractors: fetchedContractors, stats: fetchedStats } = response.data;

      setContractors(fetchedContractors);
      setStats(fetchedStats);

      // Store recent search
      if (debouncedSearch && !recentSearches.includes(debouncedSearch)) {
        const newRecentSearches = [debouncedSearch, ...recentSearches.slice(0, 4)];
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      }
    } catch (err) {
      console.error('Error fetching contractors:', err);
      setError('Failed to load contractors. Please try again.');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters, sortBy]);

  // Fetch jobs for invitation
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoadingJobs(true);
      const response = await api.get('/agent/jobs/open');
      setJobListings(response.data.jobs || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Fetch contractors when filters or search changes
  useEffect(() => {
    fetchContractors();
  }, [fetchContractors]);

  // Fetch jobs when modal opens
  useEffect(() => {
    if (showInviteModal) {
      fetchJobs();
    }
  }, [showInviteModal, fetchJobs]);

  // Handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRemoveRecentSearch = (index) => {
    const newRecentSearches = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
  };

  const handleClearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleBulkToggle = (id) => {
    if (bulkSelect.includes(id)) {
      setBulkSelect(bulkSelect.filter(item => item !== id));
    } else {
      setBulkSelect([...bulkSelect, id]);
    }
  };

  const handleInvite = (contractor) => {
    setSelectedContractor(contractor);
    setShowInviteModal(true);
  };

  const handleBulkInvite = () => {
    if (bulkSelect.length > 0) {
      setShowInviteModal(true);
    }
  };

  const handleSendInvitation = async () => {
    if (!selectedJob) {
      alert('Please select a job');
      return;
    }

    try {
      const contractorIds = selectedContractor ? [selectedContractor._id] : bulkSelect;

      const invitationData = {
        jobId: selectedJob,
        contractorIds,
        message: inviteMessage,
        responseDeadline: `${responseDeadline}h`,
        allowNegotiation: true,
        priority: false,
        requestWorkPlan: true,
      };

      await api.post('/invitations/send', invitationData);

      alert(`Invitation sent to ${contractorIds.length} contractor(s)!`);
      setShowInviteModal(false);
      setInviteMessage('');
      setBulkSelect([]);
    } catch (err) {
      console.error('Error sending invitation:', err);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const handleDownloadList = async () => {
    try {
      const selectedContractorsData = contractors.filter(c => bulkSelect.includes(c._id));

      // Create CSV content
      const headers = ['Name', 'Contact', 'Rating', 'Skills', 'Location', 'Experience', 'Jobs Completed', 'SLA %'];
      const csvContent = [
        headers.join(','),
        ...selectedContractorsData.map(contractor => [
          contractor.name,
          contractor.contactInfo?.email || '',
          contractor.rating,
          contractor.skills.slice(0, 3).join(';'),
          contractor.location,
          contractor.experience,
          contractor.jobsCompleted,
          contractor.slaSuccess
        ].join(','))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contractors-list-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading list:', err);
    }
  };

  // UI helpers
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'VERY_LOW':
      case 'Very Low':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'LOW':
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'MEDIUM':
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'HIGH':
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL':
      case 'Critical':
        return 'bg-purple-100 text-purple-700';
      case 'HIGH':
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'MEDIUM':
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'LOW':
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contractor Search</h1>
              <p className="text-gray-600 mt-1">Find and connect with vetted contractors for your projects</p>
            </div>

            <div className="flex items-center gap-3">
              {bulkSelect.length > 0 && (
                <>
                  <button
                    onClick={handleDownloadList}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                  >
                    <Download size={16} />
                    Export ({bulkSelect.length})
                  </button>
                  <button
                    onClick={handleBulkInvite}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    <MessageSquare size={16} />
                    Invite Selected
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main Search */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by company name, skill, location, or certification..."
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
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600">Recent searches</div>
                <button
                  onClick={handleClearSearches}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full px-3 py-1.5 cursor-pointer transition-colors"
                    onClick={() => handleSearch(search)}
                  >
                    <span className="text-sm text-gray-700">{search}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveRecentSearch(index);
                      }}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setFilters({
                    skills: [],
                    location: '',
                    rating: '',
                    slaScore: '',
                    minJobs: '',
                    riskLevel: '',
                    availability: '',
                    companySize: '',
                    certifications: [],
                    budgetMin: '',
                    budgetMax: '',
                  })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset all
                </button>
              </div>

              {/* Skills Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Skills & Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {skillCategories.map((skill) => (
                    <label key={skill.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.skills.includes(skill.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, skills: [...filters.skills, skill.id] });
                          } else {
                            setFilters({ ...filters, skills: filters.skills.filter(s => s !== skill.id) });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{skill.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Location</h4>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                >
                  <option value="">All Locations</option>
                  <option value="chennai">Chennai</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="hyderabad">Hyderabad</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[
                    { value: '4.5', label: '4.5+ stars' },
                    { value: '4.0', label: '4.0+ stars' },
                    { value: '3.5', label: '3.5+ stars' },
                    { value: '', label: 'Any rating' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={option.value}
                        checked={filters.rating === option.value}
                        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes('immediate')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, availability: [...filters.availability, 'immediate'] });
                        } else {
                          setFilters({ ...filters, availability: filters.availability.filter(a => a !== 'immediate') });
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available Now</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes('week')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, availability: [...filters.availability, 'week'] });
                        } else {
                          setFilters({ ...filters, availability: filters.availability.filter(a => a !== 'week') });
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available This Week</span>
                  </label>
                </div>
              </div>

              <button
                onClick={fetchContractors}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Apply Filters
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h4 className="font-medium text-gray-900 mb-3">Search Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Found</span>
                  <span className="text-sm font-bold text-gray-900">{stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available Now</span>
                  <span className="text-sm font-bold text-green-600">{stats.available}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Verified</span>
                  <span className="text-sm font-bold text-blue-600">{stats.verified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">4.5+ Rating</span>
                  <span className="text-sm font-bold text-amber-600">{stats.highRating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full py-2 bg-white border border-gray-300 rounded-lg flex items-center justify-center gap-2 text-gray-700 font-medium"
              >
                <Filter size={16} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Results Header */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-bold text-gray-900">Contractors</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {isLoading ? 'Loading...' : `${contractors.length} contractors found`}
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">Sort by:</div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="best_match">Best Match</option>
                    <option value="rating_desc">Highest Rating</option>
                    <option value="rating_asc">Lowest Rating</option>
                    <option value="experience_desc">Most Experience</option>
                    <option value="jobs_desc">Most Jobs</option>
                    <option value="sla_desc">Highest SLA</option>
                  </select>
                </div>
              </div>

              {/* Quick Skill Filters */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600 mb-2">Quick filters:</div>
                <div className="flex flex-wrap gap-2">
                  {skillCategories.slice(0, 6).map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => {
                        if (filters.skills.includes(skill.id)) {
                          setFilters({ ...filters, skills: filters.skills.filter(s => s !== skill.id) });
                        } else {
                          setFilters({ ...filters, skills: [...filters.skills, skill.id] });
                        }
                      }}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${filters.skills.includes(skill.id)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                        }`}
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertTriangle className="mx-auto text-red-500 mb-3" size={32} />
                <h3 className="font-medium text-gray-900 mb-2">Error Loading Contractors</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchContractors}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && contractors.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                <Target className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No contractors found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try adjusting your search or filters.`
                    : 'Try searching for specific skills or adjusting your filters to find contractors.'
                  }
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      skills: [],
                      location: '',
                      rating: '',
                      slaScore: '',
                      minJobs: '',
                      riskLevel: '',
                      availability: '',
                      companySize: '',
                      certifications: [],
                      budgetMin: '',
                      budgetMax: '',
                    });
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Contractors List */}
            {!isLoading && !error && contractors.length > 0 && (
              <div className="space-y-4">
                {contractors.map((contractor) => (
                  <div
                    key={contractor._id}
                    className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow ${bulkSelect.includes(contractor._id)
                      ? 'border-blue-500 border-2'
                      : 'border-gray-200'
                      }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Selection Checkbox */}
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={bulkSelect.includes(contractor._id)}
                            onChange={() => handleBulkToggle(contractor._id)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          />
                        </div>

                        {/* Avatar/Logo */}
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          {contractor.logo ? (
                            <img
                              src={contractor.logo}
                              alt={contractor.name}
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <Building size={28} className="text-blue-600" />
                          )}
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900 text-lg">{contractor.name}</h3>
                                {contractor.verified && (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                                    VERIFIED
                                  </span>
                                )}
                                {contractor.premium && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
                                    <Star size={10} />
                                    PREMIUM
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  <span>{contractor.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Briefcase size={14} />
                                  <span>{contractor.experience}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users size={14} />
                                  <span>{contractor.companySize}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getRiskColor(contractor.riskLevel)}`}>
                                  {contractor.riskLevel} Risk
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <Star size={14} className="text-amber-500 fill-amber-500" />
                                  <span className="font-bold text-gray-900 ml-1">{contractor.rating}</span>
                                  <span className="text-xs text-gray-500 ml-1">({contractor.reviews})</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1.5">
                              {contractor.skills.slice(0, 5).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                              {contractor.skills.length > 5 && (
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                                  +{contractor.skills.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs text-gray-500 mb-1">Jobs Completed</div>
                              <div className="text-lg font-bold text-gray-900">{contractor.jobsCompleted}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs text-gray-500 mb-1">SLA Success</div>
                              <div className="text-lg font-bold text-emerald-600">{contractor.slaSuccess}%</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs text-gray-500 mb-1">Response Time</div>
                              <div className="text-lg font-bold text-gray-900">{contractor.avgResponse}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-xs text-gray-500 mb-1">Budget Range</div>
                              <div className="text-sm font-bold text-gray-900">
                                {formatCurrency(contractor.minBudget)} - {formatCurrency(contractor.maxBudget)}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => handleInvite(contractor)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                              <MessageSquare size={16} />
                              Invite to Job
                            </button>
                            <button
                              onClick={() => setSelectedContractor(contractor)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                              <FileText size={16} />
                              View Details
                            </button>
                            <a
                              href={`mailto:${contractor.contactInfo?.email}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                              <Mail size={16} />
                              Contact
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Contractor Sidebar */}
          {selectedContractor && (
            <div className="lg:w-80">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900">Contractor Details</h3>
                  <button
                    onClick={() => setSelectedContractor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Contractor Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                    {selectedContractor.logo ? (
                      <img
                        src={selectedContractor.logo}
                        alt={selectedContractor.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <Building size={36} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedContractor.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="font-bold text-gray-900 ml-1">{selectedContractor.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">• {selectedContractor.reviews} reviews</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{selectedContractor.contact}</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <a
                        href={`mailto:${selectedContractor.contactInfo?.email}`}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {selectedContractor.contactInfo?.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <a
                        href={`tel:${selectedContractor.contactInfo?.phone}`}
                        className="text-sm text-gray-700"
                      >
                        {selectedContractor.contactInfo?.phone}
                      </a>
                    </div>
                    {selectedContractor.contactInfo?.website && (
                      <div className="flex items-center gap-2">
                        <ExternalLink size={14} className="text-gray-400" />
                        <a
                          href={selectedContractor.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                {selectedContractor.certifications?.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Certifications</h5>
                    <div className="space-y-2">
                      {selectedContractor.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Award size={14} className="text-amber-500" />
                          <span className="text-sm text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Projects */}
                {selectedContractor.pastProjects?.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Recent Projects</h5>
                    <div className="space-y-3">
                      {selectedContractor.pastProjects.slice(0, 3).map((project) => (
                        <div key={project.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center">
                              <Star size={12} className="text-amber-500 fill-amber-500" />
                              <span className="text-xs text-gray-700 ml-1">{project.rating}/5</span>
                            </div>
                            {project.budget && (
                              <div className="text-xs text-gray-500">
                                • {formatCurrency(project.budget)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      handleInvite(selectedContractor);
                      setShowInviteModal(true);
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Invite to Job
                  </button>
                  <button
                    onClick={() => window.open(`/contractors/${selectedContractor._id}`, '_blank')}
                    className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Invite to Job</h3>
                  <p className="text-gray-600 mt-1">
                    {selectedContractor
                      ? `Invite ${selectedContractor.name} to your project`
                      : `Invite ${bulkSelect.length} contractors to your project`
                    }
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setSelectedJob('');
                    setInviteMessage('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Select Job */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-gray-900">Select Job</h4>
                </div>

                {isLoadingJobs ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                  </div>
                ) : jobListings.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FileText className="mx-auto text-gray-400 mb-3" size={32} />
                    <p className="text-gray-600 mb-4">No open jobs available</p>
                    <a
                      href="/agent/jobs/create"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      <Plus size={16} />
                      Create New Job
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {jobListings.map((job) => (
                      <label
                        key={job._id}
                        className={`flex p-4 border rounded-xl cursor-pointer transition-all ${selectedJob === job._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                          }`}
                      >
                        <input
                          type="radio"
                          name="job"
                          value={job._id}
                          checked={selectedJob === job._id}
                          onChange={(e) => setSelectedJob(e.target.value)}
                          className="mt-1"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-gray-900">{job.title}</div>
                              <div className="text-sm text-gray-600 mt-1">{job.location}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">{formatCurrency(job.budget)}</div>
                              <div className={`text-xs font-bold px-2 py-1 rounded-full ${getPriorityColor(job.priority)}`}>
                                {job.priority}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                            <div>
                              <div className="text-gray-500">SLA</div>
                              <div className="font-medium">{job.slaRemaining}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Status</div>
                              <div className="font-medium">{job.status}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Posted</div>
                              <div className="font-medium">{formatDate(job.createdAt)}</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Configure Invitation */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-gray-900">Configure Invitation</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Message to Contractor
                    </label>
                    <textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      rows={4}
                      placeholder="Explain the project requirements, timeline, and any special considerations..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Response Deadline
                      </label>
                      <select
                        value={responseDeadline}
                        onChange={(e) => setResponseDeadline(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="24">24 hours</option>
                        <option value="48">48 hours</option>
                        <option value="72">72 hours</option>
                        <option value="168">1 week</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Expected Start Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Allow price negotiation</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Mark as priority invitation</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Request work plan submission</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 3: Review & Send */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-bold text-gray-900">Review & Send</h4>
                </div>

                <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Contractors</span>
                      <span className="text-sm font-bold text-gray-900">
                        {selectedContractor
                          ? selectedContractor.name
                          : `${bulkSelect.length} selected`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Job</span>
                      <span className="text-sm font-bold text-gray-900">
                        {jobListings.find(j => j._id === selectedJob)?.title || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Deadline</span>
                      <span className="text-sm font-bold text-gray-900">{responseDeadline} hours</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendInvitation}
                    disabled={!selectedJob}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedJob
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Send Invitation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSearch;