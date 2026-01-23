import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Briefcase, Building,
  Star, Shield, CheckCircle, Edit2,
  Download, Settings, Eye, ChevronRight,
  ShieldCheck, X, Camera, Plus, BarChart
} from 'lucide-react';

const ContractorProfile = () => {
  // const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [contractorProfile, setContractorProfile] = useState({
    business: {
      name: '',
      type: 'PVT_LTD',
      yearEstablished: new Date().getFullYear(),
      gstNumber: '',
      address: '',
      city: '',
      state: '',
      country: '',
      website: '',
    },
    contact: {
      ownerName: '',
      email: '',
      phone: ''
    },
    capabilities: {
      specializations: [],
      serviceCities: [],
      teamSize: '',
    },
    compliance: {
      licenses: [],
      insurance: null
    },
    performance: {
      jobsApplied: 0,
      jobsWon: 0,
      jobsCompleted: 0,
      slaCompliancePercent: 0,
      avgDelayHours: 0,
    },
    ratings: {
      overall: 0,
      reviews: 0
    },
    ml: {
      trustScore: 0,
      deliveryScore: 0,
      qualityScore: 0,
    },
    verification: {
      isEmailVerified: false,
      isPhoneVerified: false,
      isBusinessVerified: false,
    },
    activity: {
      lastLoginAt: null,
    },
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/contractor/profile');
        if (response.data) {
          setContractorProfile(prev => ({
            ...prev,
            ...response.data,
            business: { ...prev.business, ...(response.data.business || {}) },
            contact: { ...prev.contact, ...(response.data.contact || {}) },
            capabilities: { ...prev.capabilities, ...(response.data.capabilities || {}) },
            performance: { ...prev.performance, ...(response.data.performance || {}) },
            ratings: { ...prev.ratings, ...(response.data.ratings || {}) },
          }));
        }
      } catch (error) {
        console.error("Failed to fetch contractor profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={16} /> },
    { id: 'business', label: 'Business', icon: <Building size={16} /> },
    { id: 'capabilities', label: 'Capabilities', icon: <Briefcase size={16} /> },
    { id: 'performance', label: 'Performance', icon: <BarChart size={16} /> },
    { id: 'compliance', label: 'Compliance', icon: <ShieldCheck size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
  ];



  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get business type label
  const getBusinessTypeLabel = (type) => {
    const types = {
      'INDIVIDUAL': 'Individual',
      'FIRM': 'Firm',
      'PVT_LTD': 'Private Limited',
      'LLP': 'LLP',
    };
    return types[type] || type;
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-teal-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-gray-600';
  };

  // Handle edit toggle
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      await api.put('/contractor/profile', contractorProfile);
      setIsEditing(false);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert('Failed to save profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your business profile and settings</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium flex items-center gap-2"
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
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-teal-100 rounded-2xl flex items-center justify-center">
                    <Building size={36} className="text-teal-600" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-1 bg-white border border-gray-300 rounded-full">
                      <Camera size={14} className="text-gray-600" />
                    </button>
                  )}
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">
                  {contractorProfile.business.name}
                </h2>
                <p className="text-gray-600 mb-3 text-center">
                  {getBusinessTypeLabel(contractorProfile.business.type)}
                </p>

                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                  <CheckCircle size={12} />
                  Verified Business
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-700 text-sm">{contractorProfile.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-700 text-sm">{contractorProfile.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-700 text-sm">
                    {contractorProfile.business.city}, {contractorProfile.business.state}
                  </span>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                >
                  Save Changes
                </button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Verification Status */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-700">Email</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${contractorProfile.verification.isEmailVerified
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
                  <div className={`px-2 py-1 rounded text-xs ${contractorProfile.verification.isPhoneVerified
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
                  <div className={`px-2 py-1 rounded text-xs ${contractorProfile.verification.isBusinessVerified
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {contractorProfile.verification.isBusinessVerified ? 'Verified' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap border-b-2 ${activeTab === tab.id
                      ? 'text-teal-600 border-teal-600'
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
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* ML Scores */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">AI Performance Scores</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">Trust Score</div>
                          <div className={`text-lg font-bold ${getScoreColor(contractorProfile.ml.trustScore)}`}>
                            {contractorProfile.ml.trustScore}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-full ${getScoreColor(contractorProfile.ml.trustScore)} bg-current`}
                            style={{ width: `${contractorProfile.ml.trustScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">Delivery Score</div>
                          <div className={`text-lg font-bold ${getScoreColor(contractorProfile.ml.deliveryScore)}`}>
                            {contractorProfile.ml.deliveryScore}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-full ${getScoreColor(contractorProfile.ml.deliveryScore)} bg-current`}
                            style={{ width: `${contractorProfile.ml.deliveryScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">Quality Score</div>
                          <div className={`text-lg font-bold ${getScoreColor(contractorProfile.ml.qualityScore)}`}>
                            {contractorProfile.ml.qualityScore}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-full ${getScoreColor(contractorProfile.ml.qualityScore)} bg-current`}
                            style={{ width: `${contractorProfile.ml.qualityScore}%` }}
                          />
                        </div>
                      </div>
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
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-4">Ratings</h3>
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
                        <div className="text-sm text-gray-500">
                          Based on {contractorProfile.ratings.reviews} reviews
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
                            value={contractorProfile.business.name}
                            onChange={(e) => setContractorProfile({
                              ...contractorProfile,
                              business: { ...contractorProfile.business, name: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-2">{contractorProfile.business.name}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          GST Number
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={contractorProfile.business.gstNumber}
                            onChange={(e) => setContractorProfile({
                              ...contractorProfile,
                              business: { ...contractorProfile.business, gstNumber: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-2">{contractorProfile.business.gstNumber}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Year Established
                        </label>
                        <div className="p-2">{contractorProfile.business.yearEstablished}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Business Type
                        </label>
                        <div className="p-2">{getBusinessTypeLabel(contractorProfile.business.type)}</div>
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
                            value={contractorProfile.business.address}
                            onChange={(e) => setContractorProfile({
                              ...contractorProfile,
                              business: { ...contractorProfile.business, address: e.target.value }
                            })}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-2">{contractorProfile.business.address}</div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={contractorProfile.business.city}
                              onChange={(e) => setContractorProfile({
                                ...contractorProfile,
                                business: { ...contractorProfile.business, city: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <div className="p-2">{contractorProfile.business.city}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">State</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={contractorProfile.business.state}
                              onChange={(e) => setContractorProfile({
                                ...contractorProfile,
                                business: { ...contractorProfile.business, state: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <div className="p-2">{contractorProfile.business.state}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={contractorProfile.business.country}
                              onChange={(e) => setContractorProfile({
                                ...contractorProfile,
                                business: { ...contractorProfile.business, country: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          ) : (
                            <div className="p-2">{contractorProfile.business.country}</div>
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
                            value={contractorProfile.contact.ownerName}
                            onChange={(e) => setContractorProfile({
                              ...contractorProfile,
                              contact: { ...contractorProfile.contact, ownerName: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        ) : (
                          <div className="p-2">{contractorProfile.contact.ownerName}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Email
                        </label>
                        <div className="p-2">{contractorProfile.contact.email}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Phone
                        </label>
                        <div className="p-2">{contractorProfile.contact.phone}</div>
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
                    <div className="flex flex-wrap gap-2">
                      {contractorProfile.capabilities.specializations.map((spec, idx) => (
                        <span key={idx} className="px-3 py-1 bg-teal-100 text-blue-700 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Service Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {contractorProfile.capabilities.serviceCities.map((city, idx) => (
                        <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Capacity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Team Size
                        </label>
                        <div className="p-2">{contractorProfile.capabilities.teamSize} employees</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tab */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-500">Jobs Applied</div>
                      <div className="text-xl font-bold text-gray-900">{contractorProfile.performance.jobsApplied}</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-500">Jobs Won</div>
                      <div className="text-xl font-bold text-gray-900">{contractorProfile.performance.jobsWon}</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-500">Win Rate</div>
                      <div className="text-xl font-bold text-emerald-600">
                        {contractorProfile.performance.jobsApplied > 0
                          ? ((contractorProfile.performance.jobsWon / contractorProfile.performance.jobsApplied) * 100).toFixed(1)
                          : 0}%
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-500">SLA Compliance</div>
                      <div className="text-xl font-bold text-emerald-600">
                        {contractorProfile.performance.slaCompliancePercent}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Performance Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Delay</span>
                        <span className="font-medium text-amber-600">
                          {contractorProfile.performance.avgDelayHours} hours
                        </span>
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
                        onClick={() => setShowLicenseModal(true)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg flex items-center gap-1"
                      >
                        <Plus size={14} />
                        Add License
                      </button>
                    </div>

                    <div className="space-y-3">
                      {contractorProfile.compliance.licenses.map((license, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium text-gray-900 mb-1">{license.name}</div>
                              <div className="text-sm text-gray-600">{license.number}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Eye size={16} className="text-gray-500" />
                              </button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Valid till: {formatDate(license.validTill)}
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
                        onClick={() => setShowInsuranceModal(true)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg flex items-center gap-1"
                      >
                        <Plus size={14} />
                        Add Insurance
                      </button>
                    </div>

                    {contractorProfile.compliance.insurance ? (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="mb-2">
                          <div className="font-medium text-gray-900 mb-1">
                            {contractorProfile.compliance.insurance.provider}
                          </div>
                          <div className="text-sm text-gray-600">
                            Policy: {contractorProfile.compliance.insurance.policyNumber}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Valid till: {formatDate(contractorProfile.compliance.insurance.validTill)}
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Shield size={32} className="text-gray-400 mx-auto mb-3" />
                        <div className="text-gray-600 mb-2">No insurance added</div>
                        <button
                          onClick={() => setShowInsuranceModal(true)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
                        >
                          Add Insurance
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      {['job', 'bid', 'invoice', 'system'].map((key) => (
                        <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div>
                            <div className="font-medium text-gray-900 capitalize">{key} Notifications</div>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5 text-teal-600 rounded border-gray-300"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-red-600">Danger Zone</h3>
                    <button className="w-full text-left p-4 border border-red-300 bg-red-50 hover:bg-red-100 rounded-lg text-red-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">Deactivate Account</div>
                          <div className="text-sm">Temporarily deactivate your account</div>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* License Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Add License</h3>
                <button
                  onClick={() => setShowLicenseModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">License Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">License Number</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowLicenseModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLicenseModal(false);
                    alert('License added successfully');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Add Insurance</h3>
                <button
                  onClick={() => setShowInsuranceModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Insurance Provider</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Policy Number</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowInsuranceModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowInsuranceModal(false);
                    alert('Insurance added successfully');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Insurance
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