// pages/Search.jsx
import React, { useState, useEffect } from 'react';
import {
  Search as SearchIcon,
  X,
  MapPin,
  Star,
  Clock,
  Award,
  Shield,
  Users,
  Briefcase,
  CheckCircle,
  Calendar,
  DollarSign,
  Filter,
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
  Download,
  FileText,
  MessageSquare,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  Plus,
  Hash,
  Percent,
  Building,
  Globe,
  Tag,
  Check,
  Sparkles,
} from 'lucide-react';

const AgentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Electrical Chennai',
    'HVAC Tier-1',
    'Hospital Maintenance',
    'Industrial Plumbing',
    'Data Center Electrical',
    'Commercial HVAC',
  ]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
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
  const [selectedJob, setSelectedJob] = useState('');
  const [bulkSelect, setBulkSelect] = useState([]);

  // Contractor data
  const contractors = [
    {
      id: 'CTR-001',
      name: 'Elite Electrical Solutions',
      contact: 'Alex Mendez',
      rating: 4.8,
      reviews: 142,
      verified: true,
      specialties: ['Electrical', 'Industrial', 'Safety'],
      skills: ['Panel Upgrades', 'Wiring', 'Circuit Design', 'Automation'],
      location: 'Chennai, TN',
      experience: '12 years',
      jobsCompleted: 156,
      slaSuccess: 98,
      riskLevel: 'Low',
      availability: 'Available Now',
      companySize: 'Medium (50-200)',
      certifications: ['ISO 9001', 'Electrical Safety', 'OSHA'],
      avgResponse: '2 hours',
      avgCompletion: '95% on time',
      minBudget: '₹50,000',
      maxBudget: '₹25,00,000',
      performance: [95, 98, 97, 96, 99, 97, 96],
      pastProjects: [
        { id: 'PJ-001', name: 'Hospital Electrical Upgrade', rating: 4.9 },
        { id: 'PJ-002', name: 'Industrial Panel Replacement', rating: 4.7 },
      ],
      contactInfo: {
        email: 'contact@eliteelectricals.com',
        phone: '+91 9876543210',
        website: 'www.eliteelectricals.com'
      }
    },
    {
      id: 'CTR-002',
      name: 'CoolTech Climate Systems',
      contact: 'Suresh Kumar',
      rating: 4.6,
      reviews: 89,
      verified: true,
      specialties: ['HVAC', 'Commercial', 'Energy Efficient'],
      skills: ['VRF Systems', 'Ducting', 'IoT Monitoring', 'Maintenance'],
      location: 'Bangalore, KA',
      experience: '8 years',
      jobsCompleted: 98,
      slaSuccess: 95,
      riskLevel: 'Low',
      availability: 'Available This Week',
      companySize: 'Small (10-50)',
      certifications: ['ASHRAE', 'Energy Star', 'LEED'],
      avgResponse: '4 hours',
      avgCompletion: '92% on time',
      minBudget: '₹1,00,000',
      maxBudget: '₹15,00,000',
      performance: [92, 94, 93, 95, 94, 92, 93],
      pastProjects: [
        { id: 'PJ-003', name: 'Corporate Office HVAC', rating: 4.8 },
      ],
      contactInfo: {
        email: 'info@cooltechsystems.com',
        phone: '+91 8765432109',
        website: 'www.cooltechsystems.com'
      }
    },
    {
      id: 'CTR-003',
      name: 'PowerTech Industrial Solutions',
      contact: 'Rahul Sharma',
      rating: 4.9,
      reviews: 214,
      verified: true,
      specialties: ['Industrial', 'High Voltage', 'Automation'],
      skills: ['Transformer', 'Switchgear', 'SCADA', 'PLC'],
      location: 'Mumbai, MH',
      experience: '15 years',
      jobsCompleted: 231,
      slaSuccess: 99,
      riskLevel: 'Very Low',
      availability: 'Available Now',
      companySize: 'Large (200+)',
      certifications: ['ISO 14001', 'ISO 45001', 'NEC'],
      avgResponse: '1 hour',
      avgCompletion: '98% on time',
      minBudget: '₹2,00,000',
      maxBudget: '₹50,00,000',
      performance: [97, 98, 99, 98, 99, 98, 97],
      pastProjects: [
        { id: 'PJ-004', name: 'Factory Automation', rating: 4.9 },
        { id: 'PJ-005', name: 'Data Center Power', rating: 5.0 },
      ],
      contactInfo: {
        email: 'sales@powertech.com',
        phone: '+91 7654321098',
        website: 'www.powertech-industry.com'
      }
    },
    {
      id: 'CTR-004',
      name: 'SafeWires Electrical',
      contact: 'Karthik Venkat',
      rating: 4.3,
      reviews: 56,
      verified: true,
      specialties: ['Residential', 'Commercial', 'Safety'],
      skills: ['Wiring', 'Lighting', 'Solar', 'Backup Systems'],
      location: 'Chennai, TN',
      experience: '6 years',
      jobsCompleted: 78,
      slaSuccess: 88,
      riskLevel: 'Medium',
      availability: 'Available Now',
      companySize: 'Small (10-50)',
      certifications: ['Electrical Safety'],
      avgResponse: '6 hours',
      avgCompletion: '85% on time',
      minBudget: '₹25,000',
      maxBudget: '₹10,00,000',
      performance: [85, 87, 86, 88, 85, 86, 87],
      pastProjects: [
        { id: 'PJ-006', name: 'Apartment Complex Wiring', rating: 4.2 },
      ],
      contactInfo: {
        email: 'karthik@safewires.com',
        phone: '+91 6543210987',
        website: 'www.safewires.com'
      }
    },
  ];

  // Job listings for invite modal
  const jobListings = [
    {
      id: 'JOB-0428',
      title: 'Electrical Panel Upgrade - Hospital',
      location: 'Chennai, TN',
      priority: 'HIGH',
      budget: '₹2,50,000',
      slaRemaining: '48h',
      status: 'Unassigned',
      category: 'Electrical',
      posted: '2 days ago'
    },
    {
      id: 'JOB-0429',
      title: 'HVAC System Installation - Corporate',
      location: 'Bangalore, KA',
      priority: 'MEDIUM',
      budget: '₹4,80,000',
      slaRemaining: '72h',
      status: 'Open',
      category: 'HVAC',
      posted: '1 day ago'
    },
    {
      id: 'JOB-0430',
      title: 'Data Center Power Backup',
      location: 'Mumbai, MH',
      priority: 'HIGH',
      budget: '₹15,00,000',
      slaRemaining: '120h',
      status: 'Draft',
      category: 'Industrial',
      posted: '3 days ago'
    },
    {
      id: 'JOB-0431',
      title: 'Commercial Building Lighting',
      location: 'Chennai, TN',
      priority: 'LOW',
      budget: '₹1,20,000',
      slaRemaining: '96h',
      status: 'Unassigned',
      category: 'Electrical',
      posted: '5 days ago'
    },
  ];

  // Skill categories for quick search
  const skillCategories = [
    'Electrical', 'HVAC', 'Plumbing', 'Data Center', 
    'Hospital', 'High Voltage', 'Industrial', 'Commercial',
    'Residential', 'Fire Safety', 'Automation', 'Solar'
  ];

  // Initial empty state
  const isEmptyState = !searchQuery && recentSearches.length === 0;

  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchQuery(query);
      if (!recentSearches.includes(query)) {
        setRecentSearches([query, ...recentSearches.slice(0, 5)]);
      }
    }
  };

  const removeRecentSearch = (index) => {
    setRecentSearches(recentSearches.filter((_, i) => i !== index));
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
  };

  const handleInvite = (contractor) => {
    setSelectedContractor(contractor);
    setShowInviteModal(true);
  };

  const handleBulkToggle = (id) => {
    if (bulkSelect.includes(id)) {
      setBulkSelect(bulkSelect.filter(item => item !== id));
    } else {
      setBulkSelect([...bulkSelect, id]);
    }
  };

  const handleBulkInvite = () => {
    if (bulkSelect.length > 0) {
      setShowInviteModal(true);
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Very Low': return 'bg-emerald-100 text-emerald-800';
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (status) => {
    if (status.includes('Now')) return 'text-emerald-600';
    if (status.includes('Week')) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getAvailabilityDot = (status) => {
    if (status.includes('Now')) return 'bg-emerald-500';
    if (status.includes('Week')) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Contractor Search</h1>
          <p className="text-gray-600">Search and connect with qualified contractors for your projects</p>
        </div>

        {/* Search Bar with Recent Searches */}
        <div className="mb-8">
          <div className="relative mb-4">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by company, skill, location, certification, rating..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">Recent searches:</div>
              <button 
                onClick={clearAllSearches}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {recentSearches.map((search, index) => (
              <div 
                key={index}
                className="flex items-center gap-1 bg-gray-100 border border-gray-300 rounded-full px-3 py-1.5 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSearch(search)}
              >
                <span className="text-sm text-gray-700">{search}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecentSearch(index);
                  }}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Search Chips */}
          <div className="mb-8">
            <div className="text-sm text-gray-600 mb-3">Quick search by skill:</div>
            <div className="flex flex-wrap gap-2">
              {skillCategories.map((skill, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(skill)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {isEmptyState && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <SearchIcon size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Search for Contractors</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              Search for contractors by skill, location, or specialization to find the best match for your project.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {skillCategories.slice(0, 6).map((skill, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(skill)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 font-medium"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {!isEmptyState && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel - Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-300 rounded-lg p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
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
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Skills / Categories</div>
                  <div className="space-y-2">
                    {['Electrical', 'HVAC', 'Plumbing', 'Industrial', 'Commercial', 'Residential'].map((skill) => (
                      <label key={skill} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-blue-600"
                          checked={filters.skills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, skills: [...filters.skills, skill]});
                            } else {
                              setFilters({...filters, skills: filters.skills.filter(s => s !== skill)});
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Location</div>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  >
                    <option value="">Any Location</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Minimum Rating</div>
                  <div className="space-y-2">
                    {['4.5+', '4.0+', '3.5+', 'Any'].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input 
                          type="radio" 
                          name="rating"
                          className="text-blue-600"
                          checked={filters.rating === rating}
                          onChange={() => setFilters({...filters, rating})}
                        />
                        <span className="ml-2 text-sm text-gray-700">{rating}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SLA Score Filter */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">SLA Success</div>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    value={filters.slaScore}
                    onChange={(e) => setFilters({...filters, slaScore: e.target.value})}
                  >
                    <option value="">Any Score</option>
                    <option value="95">95%+</option>
                    <option value="90">90%+</option>
                    <option value="85">85%+</option>
                    <option value="80">80%+</option>
                  </select>
                </div>

                {/* Risk Level Filter */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Risk Level</div>
                  <div className="space-y-2">
                    {['Very Low', 'Low', 'Medium', 'Any'].map((risk) => (
                      <label key={risk} className="flex items-center">
                        <input 
                          type="radio" 
                          name="risk"
                          className="text-blue-600"
                          checked={filters.riskLevel === risk}
                          onChange={() => setFilters({...filters, riskLevel: risk})}
                        />
                        <span className="ml-2 text-sm text-gray-700">{risk}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Availability</div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600"
                        checked={filters.availability === 'now'}
                        onChange={(e) => setFilters({...filters, availability: e.target.checked ? 'now' : ''})}
                      />
                      <span className="ml-2 text-sm text-gray-700">Available Now</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600"
                        checked={filters.availability === 'week'}
                        onChange={(e) => setFilters({...filters, availability: e.target.checked ? 'week' : ''})}
                      />
                      <span className="ml-2 text-sm text-gray-700">Available This Week</span>
                    </label>
                  </div>
                </div>

                {/* Company Size Filter */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Company Size</div>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    value={filters.companySize}
                    onChange={(e) => setFilters({...filters, companySize: e.target.value})}
                  >
                    <option value="">Any Size</option>
                    <option value="small">Small (1-50)</option>
                    <option value="medium">Medium (50-200)</option>
                    <option value="large">Large (200+)</option>
                  </select>
                </div>

                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  Apply Filters
                </button>
              </div>

              {/* Smart Recommendations */}
              <div className="mt-4 bg-white border border-gray-300 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-500" />
                  Smart Features
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                    "Similar to JOB-0428"
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                    "High SLA reliability"
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                    "System shortlist"
                  </button>
                </div>
              </div>
            </div>

            {/* Center Panel - Results */}
            <div className="lg:col-span-2">
              {/* Results Header */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">
                      {contractors.length} contractors found
                      {searchQuery && ` for "${searchQuery}"`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Showing best matches first
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">Sort by:</div>
                    <select className="border-none bg-transparent text-sm font-medium focus:outline-none">
                      <option>Best Match</option>
                      <option>Highest Rating</option>
                      <option>Lowest Risk</option>
                      <option>Most Available</option>
                      <option>Nearest Location</option>
                      <option>Most Completed Jobs</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              {bulkSelect.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-blue-600" />
                      <span className="font-medium text-blue-700">{bulkSelect.length} contractors selected</span>
                    </div>
                    <button 
                      onClick={handleBulkInvite}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                    >
                      Invite Selected to Job
                    </button>
                  </div>
                </div>
              )}

              {/* Contractor Results */}
              <div className="space-y-4">
                {contractors.map((contractor) => (
                  <div 
                    key={contractor.id}
                    className={`bg-white border border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors ${bulkSelect.includes(contractor.id) ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => setSelectedContractor(contractor)}
                  >
                    <div className="flex items-start justify-between">
                      {/* Left Section */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Checkbox for bulk selection */}
                        <input 
                          type="checkbox"
                          className="mt-1"
                          checked={bulkSelect.includes(contractor.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleBulkToggle(contractor.id);
                          }}
                        />
                        
                        {/* Logo/Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <Building size={24} className="text-blue-600" />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{contractor.name}</h3>
                            {contractor.verified && (
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">
                                VERIFIED
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-amber-500 fill-amber-500" />
                              <span className="text-sm font-bold">{contractor.rating}</span>
                              <span className="text-xs text-gray-500">({contractor.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} className="text-gray-400" />
                              <span className="text-sm text-gray-700">{contractor.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase size={14} className="text-gray-400" />
                              <span className="text-sm text-gray-700">{contractor.experience}</span>
                            </div>
                          </div>

                          {/* Specializations */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {contractor.specialties.map((spec, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {spec}
                              </span>
                            ))}
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-xs text-gray-500">Jobs Done</div>
                              <div className="text-sm font-bold text-gray-900">{contractor.jobsCompleted}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">SLA Success</div>
                              <div className="text-sm font-bold text-emerald-600">{contractor.slaSuccess}%</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Response Time</div>
                              <div className="text-sm font-bold text-gray-900">{contractor.avgResponse}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col items-end gap-2">
                        {/* Availability & Risk */}
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getAvailabilityDot(contractor.availability)}`}></div>
                          <span className={`text-xs font-medium ${getAvailabilityColor(contractor.availability)}`}>
                            {contractor.availability}
                          </span>
                        </div>
                        
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(contractor.riskLevel)}`}>
                          {contractor.riskLevel} Risk
                        </span>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInvite(contractor);
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                          >
                            Invite to Job
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedContractor(contractor);
                            }}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Contractor Preview */}
            <div className="lg:col-span-1">
              {selectedContractor ? (
                <div className="bg-white border border-gray-300 rounded-lg p-4 sticky top-24">
                  {/* Contractor Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                        <Building size={32} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{selectedContractor.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                            <span className="text-sm font-bold ml-1">{selectedContractor.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">• Contact: {selectedContractor.contact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500">Experience</div>
                        <div className="text-sm font-bold">{selectedContractor.experience}</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500">Company Size</div>
                        <div className="text-sm font-bold">{selectedContractor.companySize}</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500">SLA Success</div>
                        <div className="text-sm font-bold text-emerald-600">{selectedContractor.slaSuccess}%</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-500">On-time Rate</div>
                        <div className="text-sm font-bold text-emerald-600">{selectedContractor.avgCompletion}</div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedContractor.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">Certifications</div>
                    <div className="space-y-1">
                      {selectedContractor.certifications.map((cert, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Award size={12} className="text-amber-500" />
                          <span className="text-xs text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Past Projects */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">Recent Projects</div>
                    <div className="space-y-2">
                      {selectedContractor.pastProjects.map((project) => (
                        <div key={project.id} className="p-2 bg-gray-50 rounded">
                          <div className="text-xs font-medium text-gray-900">{project.name}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            <span className="text-xs text-gray-700">{project.rating} rating</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-900 mb-1">Budget Range</div>
                    <div className="text-sm text-gray-700">
                      {selectedContractor.minBudget} - {selectedContractor.maxBudget}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleInvite(selectedContractor)}
                      className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Invite to Job
                    </button>
                    <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                      View Full Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                  <Target size={32} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Select a Contractor</h3>
                  <p className="text-gray-600 text-sm">
                    Click on any contractor from the list to view their detailed profile and performance metrics.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Invite to Job Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Send Job Invitation</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Invite {selectedContractor?.name || 'selected contractors'} to work on your project
                  </p>
                </div>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Select Job */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Select Job
                </h4>
                <div className="space-y-3">
                  {jobListings.map((job) => (
                    <label 
                      key={job.id}
                      className={`flex items-start p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${selectedJob === job.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    >
                      <input 
                        type="radio"
                        name="job"
                        value={job.id}
                        checked={selectedJob === job.id}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        className="mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-600 mt-1">{job.location}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{job.budget}</div>
                            <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${job.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {job.priority}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
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
                            <div className="font-medium">{job.posted}</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 2: Configure Invitation */}
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Configure Invitation
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Message to Contractor</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      rows="3"
                      placeholder="Explain the project requirements, timeline, and any special considerations..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Expected Response Date</label>
                      <input 
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Response Deadline</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                        <option>24 hours</option>
                        <option>48 hours</option>
                        <option>3 days</option>
                        <option>1 week</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Allow price negotiation</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Mark as priority invitation</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">Request work plan submission</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 3: Send */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Send Invitation
                </h4>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Contractor:</strong> {selectedContractor?.name || `${bulkSelect.length} contractors`}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Job:</strong> {jobListings.find(j => j.id === selectedJob)?.title || 'Not selected'}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Invitation ID:</strong> INV-{Date.now().toString().slice(-6)}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      // Handle invitation send
                      setShowInviteModal(false);
                      alert(`Invitation sent to ${selectedContractor?.name || `${bulkSelect.length} contractors`}!`);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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