// pages/ContractorProfile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Briefcase, Building,
  Calendar, Award, Star, Shield, CheckCircle, Edit2,
  Download, Upload, Eye, EyeOff, Settings, Key,
  Bell, Globe, Users, DollarSign, TrendingUp, Target,
  AlertTriangle, FileText, Hash, Link, Clock, Activity,
  BarChart, PieChart, Award as AwardIcon, Trophy, Crown,
  Zap, ShieldCheck, ExternalLink, ChevronRight, ChevronDown,
  ChevronUp, X, Camera, Plus, Trash2, Lock, Unlock,
  Smartphone, MessageSquare, Home, City, Globe as GlobeIcon,
  Target as TargetIcon, Clock as ClockIcon, History,
  TrendingDown, Percent, Hash as HashIcon, FileCheck,
  Building2, CreditCard, ShieldAlert, Check, XCircle,
  AlertCircle, HelpCircle, Info
} from 'lucide-react';

const ContractorProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Contractor Profile Data (from your schema)
  const contractorProfile = {
    _id: 'CONTRACTOR_001',
    userId: 'USER_001',
    
    business: {
      name: 'Elite Electrical Solutions',
      type: 'PVT_LTD',
      yearEstablished: 2012,
      gstNumber: '27AAAAA0000A1Z5',
      address: '123 Industrial Area, Phase 2',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      website: 'www.eliteelectricals.com',
      logoUrl: '/api/placeholder/400/400'
    },

    contact: {
      ownerName: 'Alex Mendez',
      email: 'alex@eliteelectricals.com',
      phone: '+91 98765 43210'
    },

    capabilities: {
      specializations: ['Electrical', 'Industrial', 'High Voltage', 'Automation'],
      serviceCities: ['Chennai', 'Bangalore', 'Hyderabad', 'Pune'],
      teamSize: '21-50',
      maxParallelJobs: 8,
      avgProjectValue: 1500000
    },

    compliance: {
      licenses: [
        {
          name: 'Electrical Contractor License',
          number: 'ECL-2021-0428',
          validTill: '2024-12-31',
          proofUrl: '/docs/license1.pdf',
          status: 'active'
        },
        {
          name: 'High Voltage Certification',
          number: 'HVC-2022-1567',
          validTill: '2025-06-30',
          proofUrl: '/docs/license2.pdf',
          status: 'active'
        },
        {
          name: 'Industrial Safety License',
          number: 'ISL-2023-8923',
          validTill: '2024-09-15',
          proofUrl: '/docs/license3.pdf',
          status: 'expiring'
        }
      ],
      insurance: {
        provider: 'ICICI Lombard',
        policyNumber: 'INS-2023-7845',
        validTill: '2025-03-31',
        coverageAmount: 50000000,
        proofUrl: '/docs/insurance.pdf',
        status: 'active'
      }
    },

    performance: {
      jobsApplied: 289,
      jobsWon: 156,
      jobsCompleted: 148,
      jobsDelayed: 8,
      jobsRejected: 5,
      slaCompliancePercent: 96.2,
      avgDelayHours: 0.8,
      disputeCount: 3,
      penaltyAmountTotal: 45000
    },

    ratings: {
      overall: 4.7,
      quality: 4.8,
      punctuality: 4.6,
      communication: 4.9,
      reviews: 128
    },

    ml: {
      trustScore: 88,
      deliveryScore: 92,
      qualityScore: 94,
      reliabilityScore: 89,
      lastComputedAt: '2024-03-15T10:30:00Z'
    },

    financial: {
      totalEarnings: 42500000,
      totalPenalties: 45000,
      lastPaymentAt: '2024-03-10T14:20:00Z',
      avgPaymentCycle: 14
    },

    security: {
      pinHash: '••••',
      twoFactorEnabled: true
    },

    preferences: {
      notifications: {
        job: true,
        bid: true,
        invoice: true,
        system: true
      },
      language: 'en',
      darkMode: false
    },

    verification: {
      isEmailVerified: true,
      isPhoneVerified: true,
      isBusinessVerified: true,
      verifiedAt: '2023-11-20T09:15:00Z'
    },

    activity: {
      lastLoginAt: '2024-03-15T08:45:00Z',
      lastApplicationAt: '2024-03-14T16:30:00Z',
      lastJobCompletedAt: '2024-03-12T18:20:00Z'
    },

    status: {
      isActive: true,
      isSuspended: false,
      suspensionReason: ''
    },

    createdAt: '2021-05-15T10:00:00Z',
    updatedAt: '2024-03-15T09:00:00Z'
  };

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={16} /> },
    { id: 'business', label: 'Business', icon: <Building size={16} /> },
    { id: 'capabilities', label: 'Capabilities', icon: <Briefcase size={16} /> },
    { id: 'performance', label: 'Performance', icon: <BarChart size={16} /> },
    { id: 'compliance', label: 'Compliance', icon: <ShieldCheck size={16} /> },
    { id: 'financial', label: 'Financial', icon: <DollarSign size={16} /> },
    { id: 'security', label: 'Security', icon: <Lock size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate time ago
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Get business type label
  const getBusinessTypeLabel = (type) => {
    switch(type) {
      case 'INDIVIDUAL': return 'Individual';
      case 'FIRM': return 'Firm';
      case 'PVT_LTD': return 'Private Limited';
      case 'LLP': return 'LLP';
      default: return type;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'expiring': return 'bg-amber-100 text-amber-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get ML score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-gray-600';
  };

  // Get ML score bar color
  const getScoreBarColor = (score) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-gray-500';
  };

  // Handle edit toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle save profile
  const handleSaveProfile = () => {
    setIsEditing(false);
    // API call would go here
    console.log('Saving profile...');
  };

  // Handle add license
  const handleAddLicense = () => {
    setShowLicenseModal(true);
  };

  // Handle add insurance
  const handleAddInsurance = () => {
    setShowInsuranceModal(true);
  };

  // Handle request verification
  const handleRequestVerification = () => {
    setShowVerificationModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your business profile, performance, and settings</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium flex items-center gap-2">
              <Download size={16} />
              Export Profile
            </button>
            <button 
              onClick={handleEditToggle}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <X size={16} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 size={16} />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                    <Building2 size={48} className="text-blue-600" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 p-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50">
                      <Camera size={16} className="text-gray-600" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
                  {contractorProfile.business.name}
                </h2>
                <p className="text-gray-600 mb-3 text-center">
                  {getBusinessTypeLabel(contractorProfile.business.type)}
                </p>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                    <CheckCircle size={12} />
                    Verified Business
                  </div>
                  <div className="text-sm text-gray-500">
                    Member since {new Date(contractorProfile.createdAt).getFullYear()}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-700">{contractorProfile.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-700">{contractorProfile.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-700">
                    {contractorProfile.business.city}, {contractorProfile.business.state}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-gray-400" />
                  <a 
                    href={`https://${contractorProfile.business.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {contractorProfile.business.website}
                  </a>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Experience</div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date().getFullYear() - contractorProfile.business.yearEstablished} years
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Team Size</div>
                  <div className="text-lg font-bold text-gray-900">{contractorProfile.capabilities.teamSize}</div>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Save Changes
                </button>
              )}
            </div>

            {/* Verification Status */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-700">Email</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    contractorProfile.verification.isEmailVerified 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contractorProfile.verification.isEmailVerified ? 'Verified' : 'Pending'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-700">Phone</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    contractorProfile.verification.isPhoneVerified 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contractorProfile.verification.isPhoneVerified ? 'Verified' : 'Pending'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-700">Business</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    contractorProfile.verification.isBusinessVerified 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contractorProfile.verification.isBusinessVerified ? 'Verified' : 'Pending'}
                  </div>
                </div>
              </div>
              
              {!contractorProfile.verification.isBusinessVerified && (
                <button
                  onClick={handleRequestVerification}
                  className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  Request Verification
                </button>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase size={16} className="text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">My Jobs</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <DollarSign size={16} className="text-emerald-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Invoices</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <BarChart size={16} className="text-amber-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Performance</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Settings size={16} className="text-purple-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Settings</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden mb-6">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 ${
                      activeTab === tab.id 
                        ? 'text-blue-600 border-blue-600' 
                        : 'text-gray-600 hover:text-gray-900 border-transparent'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* ML Scores */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Target size={18} className="text-blue-600" />
                      AI Performance Scores
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">Trust Score</div>
                          <div className={`text-lg font-bold ${getScoreColor(contractorProfile.ml.trustScore)}`}>
                            {contractorProfile.ml.trustScore}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreBarColor(contractorProfile.ml.trustScore)}`}
                            style={{ width: `${contractorProfile.ml.trustScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">Delivery Score</div>
                          <div className={`text-lg font-bold ${getScoreColor(contractorProfile.ml.deliveryScore)}`}>
                            {contractorProfile.ml.deliveryScore}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreBarColor(contractorProfile.ml.deliveryScore)}`}
                            style={{ width: `${contractorProfile.ml.deliveryScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">Quality Score</div>
                          <div className={`text-lg font-bold ${getScoreColor(contractorProfile.ml.qualityScore)}`}>
                            {contractorProfile.ml.qualityScore}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreBarColor(contractorProfile.ml.qualityScore)}`}
                            style={{ width: `${contractorProfile.ml.qualityScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">Reliability Score</div>
                          <div className={`text-lg font-bold ${getScoreColor(contractorProfile.ml.reliabilityScore)}`}>
                            {contractorProfile.ml.reliabilityScore}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getScoreBarColor(contractorProfile.ml.reliabilityScore)}`}
                            style={{ width: `${contractorProfile.ml.reliabilityScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Last updated: {formatDate(contractorProfile.ml.lastComputedAt)}
                    </div>
                  </div>

                  {/* Performance Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Performance Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Jobs Completed</span>
                          <span className="font-medium">{contractorProfile.performance.jobsCompleted}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">SLA Compliance</span>
                          <span className="font-medium text-emerald-600">
                            {contractorProfile.performance.slaCompliancePercent}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Average Delay</span>
                          <span className="font-medium text-amber-600">
                            {contractorProfile.performance.avgDelayHours}h
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Dispute Count</span>
                          <span className="font-medium">{contractorProfile.performance.disputeCount}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Ratings & Reviews</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Star size={16} className="text-amber-500 fill-amber-500" />
                            <span className="text-gray-700">Overall Rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{contractorProfile.ratings.overall}</span>
                            <span className="text-sm text-gray-500">/5.0</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Quality</span>
                          <span className="font-medium">{contractorProfile.ratings.quality}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Punctuality</span>
                          <span className="font-medium">{contractorProfile.ratings.punctuality}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Communication</span>
                          <span className="font-medium">{contractorProfile.ratings.communication}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Based on {contractorProfile.ratings.reviews} reviews
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Clock size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Last Login</div>
                            <div className="text-sm text-gray-600">
                              {timeAgo(contractorProfile.activity.lastLoginAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(contractorProfile.activity.lastLoginAt)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <CheckCircle size={16} className="text-emerald-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Last Job Completed</div>
                            <div className="text-sm text-gray-600">
                              {timeAgo(contractorProfile.activity.lastJobCompletedAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(contractorProfile.activity.lastJobCompletedAt)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Briefcase size={16} className="text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Last Job Applied</div>
                            <div className="text-sm text-gray-600">
                              {timeAgo(contractorProfile.activity.lastApplicationAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(contractorProfile.activity.lastApplicationAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Tab */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Business Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            defaultValue={contractorProfile.business.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.business.name}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Business Type
                        </label>
                        {isEditing ? (
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="INDIVIDUAL">Individual</option>
                            <option value="FIRM">Firm</option>
                            <option value="PVT_LTD">Private Limited</option>
                            <option value="LLP">LLP</option>
                          </select>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            {getBusinessTypeLabel(contractorProfile.business.type)}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Year Established
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            defaultValue={contractorProfile.business.yearEstablished}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.business.yearEstablished}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          GST Number
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            defaultValue={contractorProfile.business.gstNumber}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.business.gstNumber}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Full Address
                        </label>
                        {isEditing ? (
                          <textarea
                            defaultValue={contractorProfile.business.address}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.business.address}</div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                          {isEditing ? (
                            <input
                              type="text"
                              defaultValue={contractorProfile.business.city}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.business.city}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">State</label>
                          {isEditing ? (
                            <input
                              type="text"
                              defaultValue={contractorProfile.business.state}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.business.state}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                          {isEditing ? (
                            <input
                              type="text"
                              defaultValue={contractorProfile.business.country}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.business.country}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Website</label>
                          {isEditing ? (
                            <input
                              type="url"
                              defaultValue={contractorProfile.business.website}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.business.website}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Contact Person</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Owner Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            defaultValue={contractorProfile.contact.ownerName}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.contact.ownerName}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            defaultValue={contractorProfile.contact.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.contact.email}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Phone
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            defaultValue={contractorProfile.contact.phone}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.contact.phone}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Capabilities Tab */}
              {activeTab === 'capabilities' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Specializations</h3>
                    {isEditing ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {contractorProfile.capabilities.specializations.map((spec, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">
                            {spec}
                            <button className="ml-1 text-blue-800">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button className="px-3 py-1.5 border border-dashed border-gray-300 rounded-full text-gray-600 hover:border-gray-400">
                          <Plus size={14} className="inline mr-1" />
                          Add Specialization
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {contractorProfile.capabilities.specializations.map((spec, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Service Areas</h3>
                    {isEditing ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {contractorProfile.capabilities.serviceCities.map((city, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">
                            {city}
                            <button className="ml-1 text-emerald-800">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button className="px-3 py-1.5 border border-dashed border-gray-300 rounded-full text-gray-600 hover:border-gray-400">
                          <Plus size={14} className="inline mr-1" />
                          Add City
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {contractorProfile.capabilities.serviceCities.map((city, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                            {city}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Capacity & Scale</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Team Size
                        </label>
                        {isEditing ? (
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                            <option value="1-5">1-5 employees</option>
                            <option value="6-20">6-20 employees</option>
                            <option value="21-50">21-50 employees</option>
                            <option value="51-100">51-100 employees</option>
                            <option value="100+">100+ employees</option>
                          </select>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.capabilities.teamSize} employees</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Max Parallel Jobs
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            defaultValue={contractorProfile.capabilities.maxParallelJobs}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">{contractorProfile.capabilities.maxParallelJobs} jobs</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Avg Project Value
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            defaultValue={contractorProfile.capabilities.avgProjectValue}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">{formatCurrency(contractorProfile.capabilities.avgProjectValue)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <div className="text-sm text-gray-500">Jobs Applied</div>
                      <div className="text-2xl font-bold text-gray-900">{contractorProfile.performance.jobsApplied}</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <div className="text-sm text-gray-500">Jobs Won</div>
                      <div className="text-2xl font-bold text-gray-900">{contractorProfile.performance.jobsWon}</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <div className="text-sm text-gray-500">Win Rate</div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {((contractorProfile.performance.jobsWon / contractorProfile.performance.jobsApplied) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <div className="text-sm text-gray-500">Completion Rate</div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {((contractorProfile.performance.jobsCompleted / contractorProfile.performance.jobsWon) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">SLA Performance</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">SLA Compliance</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-600">
                              {contractorProfile.performance.slaCompliancePercent}%
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500"
                                style={{ width: `${contractorProfile.performance.slaCompliancePercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Average Delay</span>
                          <span className="font-medium text-amber-600">
                            {contractorProfile.performance.avgDelayHours} hours
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Jobs Delayed</span>
                          <span className="font-medium">{contractorProfile.performance.jobsDelayed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Jobs Rejected</span>
                          <span className="font-medium">{contractorProfile.performance.jobsRejected}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Quality Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Dispute Count</span>
                          <span className="font-medium">{contractorProfile.performance.disputeCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Total Penalties</span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(contractorProfile.performance.penaltyAmountTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Avg Penalty per Job</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(contractorProfile.performance.penaltyAmountTotal / contractorProfile.performance.jobsDelayed || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Dispute Rate</span>
                          <span className="font-medium">
                            {((contractorProfile.performance.disputeCount / contractorProfile.performance.jobsCompleted) * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance Tab */}
              {activeTab === 'compliance' && (
                <div className="space-y-6">
                  {/* Licenses */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Business Licenses</h3>
                      <button
                        onClick={handleAddLicense}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-1"
                      >
                        <Plus size={14} />
                        Add License
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {contractorProfile.compliance.licenses.map((license, index) => (
                        <div key={index} className="border border-gray-300 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium text-gray-900 mb-1">{license.name}</div>
                              <div className="text-sm text-gray-600">{license.number}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(license.status)}`}>
                                {license.status.toUpperCase()}
                              </span>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Eye size={16} className="text-gray-500" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-600">
                              Valid till: {formatDate(license.validTill)}
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insurance */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Insurance</h3>
                      <button
                        onClick={handleAddInsurance}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center gap-1"
                      >
                        <Plus size={14} />
                        Add Insurance
                      </button>
                    </div>
                    
                    {contractorProfile.compliance.insurance ? (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-medium text-gray-900 mb-1">
                              {contractorProfile.compliance.insurance.provider}
                            </div>
                            <div className="text-sm text-gray-600">
                              Policy: {contractorProfile.compliance.insurance.policyNumber}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Coverage: {formatCurrency(contractorProfile.compliance.insurance.coverageAmount)}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            contractorProfile.compliance.insurance.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {contractorProfile.compliance.insurance.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-gray-600">
                            Valid till: {formatDate(contractorProfile.compliance.insurance.validTill)}
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Download Certificate
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <ShieldAlert className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <div className="text-gray-600 mb-2">No insurance added</div>
                        <div className="text-sm text-gray-500 mb-4">
                          Add insurance to increase trust score and job opportunities
                        </div>
                        <button
                          onClick={handleAddInsurance}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                          Add Insurance
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Financial Tab */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Earnings Summary</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600">Total Earnings</div>
                          <div className="text-3xl font-bold text-gray-900">
                            {formatCurrency(contractorProfile.financial.totalEarnings)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Total Penalties</div>
                          <div className="text-xl font-bold text-red-600">
                            {formatCurrency(contractorProfile.financial.totalPenalties)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Net Earnings</div>
                          <div className="text-2xl font-bold text-emerald-600">
                            {formatCurrency(contractorProfile.financial.totalEarnings - contractorProfile.financial.totalPenalties)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Payment Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Last Payment</span>
                          <span className="font-medium">
                            {contractorProfile.financial.lastPaymentAt 
                              ? formatDate(contractorProfile.financial.lastPaymentAt)
                              : 'No payments yet'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Average Payment Cycle</span>
                          <span className="font-medium">{contractorProfile.financial.avgPaymentCycle} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-medium">Bank Transfer</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Financial Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="text-sm text-gray-500">Avg Earnings per Job</div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(contractorProfile.financial.totalEarnings / contractorProfile.performance.jobsCompleted)}
                        </div>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="text-sm text-gray-500">Penalty Rate</div>
                        <div className="text-xl font-bold text-amber-600">
                          {((contractorProfile.performance.penaltyAmountTotal / contractorProfile.financial.totalEarnings) * 100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="text-sm text-gray-500">Monthly Avg (Last 6M)</div>
                        <div className="text-xl font-bold text-emerald-600">
                          {formatCurrency(contractorProfile.financial.totalEarnings / 12)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Key className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">PIN Protection</div>
                            <div className="text-sm text-gray-600">4-digit PIN for quick access</div>
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium">
                          {contractorProfile.security.pinHash ? 'Change PIN' : 'Set PIN'}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <ShieldCheck className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                            <div className="text-sm text-gray-600">Add extra security with app-based 2FA</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            contractorProfile.security.twoFactorEnabled 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {contractorProfile.security.twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                          <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium">
                            {contractorProfile.security.twoFactorEnabled ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Session Management</h3>
                    <div className="border border-gray-300 rounded-xl overflow-hidden">
                      <div className="p-4 border-b border-gray-300 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Current Session</div>
                          <div className="text-sm text-gray-600">Chrome on Windows • {formatDate(contractorProfile.activity.lastLoginAt)}</div>
                        </div>
                        <div className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">
                          ACTIVE
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-sm font-medium text-gray-900 mb-2">Active Devices</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">iPhone 14 Pro</span>
                              <span className="text-xs text-gray-500">• Last active: 2 hours ago</span>
                            </div>
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Revoke
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">iPad Pro</span>
                              <span className="text-xs text-gray-500">• Last active: 3 days ago</span>
                            </div>
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Revoke
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      {Object.entries(contractorProfile.preferences.notifications).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div>
                            <div className="font-medium text-gray-900 capitalize">{key} Notifications</div>
                            <div className="text-sm text-gray-600">
                              {key === 'job' && 'Get notified about new job opportunities'}
                              {key === 'bid' && 'Updates on your bid submissions'}
                              {key === 'invoice' && 'Payment and invoice updates'}
                              {key === 'system' && 'Platform announcements and updates'}
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={() => {}}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">App Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Language</div>
                          <div className="text-sm text-gray-600">Platform language preference</div>
                        </div>
                        <select className="px-3 py-1.5 border border-gray-300 rounded-lg">
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="ta">Tamil</option>
                        </select>
                      </div>
                      <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div>
                          <div className="font-medium text-gray-900">Dark Mode</div>
                          <div className="text-sm text-gray-600">Switch to dark theme</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={contractorProfile.preferences.darkMode}
                          onChange={() => {}}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-300">
                    <h3 className="font-bold text-gray-900 mb-4 text-red-600">Danger Zone</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-4 border border-red-300 bg-red-50 hover:bg-red-100 rounded-lg text-red-700 font-medium">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">Deactivate Account</div>
                            <div className="text-sm">Temporarily deactivate your account</div>
                          </div>
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </button>
                      <button className="w-full text-left p-4 border border-red-300 bg-red-50 hover:bg-red-100 rounded-lg text-red-700 font-medium">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">Delete Account</div>
                            <div className="text-sm">Permanently delete your account and all data</div>
                          </div>
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* License Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add License</h3>
                <button 
                  onClick={() => setShowLicenseModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">License Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">License Number</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Valid Till</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Upload Proof</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Drop PDF or image file here</div>
                    <div className="text-xs text-gray-500">Max file size: 5MB</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowLicenseModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowLicenseModal(false);
                    alert('License added successfully');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add License
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insurance Modal */}
      {showInsuranceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add Insurance</h3>
                <button 
                  onClick={() => setShowInsuranceModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Insurance Provider</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Policy Number</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Coverage Amount</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Valid Till</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Upload Certificate</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Drop PDF file here</div>
                    <div className="text-xs text-gray-500">Max file size: 10MB</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowInsuranceModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowInsuranceModal(false);
                    alert('Insurance added successfully');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Insurance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Request Business Verification</h3>
                <button 
                  onClick={() => setShowVerificationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">Verification Requirements</div>
                    <div className="text-sm text-blue-700 mt-1">
                      You need to upload the following documents for business verification:
                    </div>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• Company Registration Certificate</li>
                      <li>• GST Certificate</li>
                      <li>• PAN Card</li>
                      <li>• Address Proof</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Upload Registration Certificate</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Drop PDF or image file here</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Upload GST Certificate</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Drop PDF or image file here</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowVerificationModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowVerificationModal(false);
                    alert('Verification request submitted successfully');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorProfile;