// pages/AgentProfile.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import {
  User,
  Settings,
  FileText,
  Shield,
  Phone,
  MapPin,
  Award,
  Briefcase,
  CheckCircle,
  Edit2,
  Save,
  X,
  Camera,
  Building,
  TrendingUp,
  AlertTriangle,
  Download,
  ChevronRight,
  Key,
  Share2,
  LogOut,
  Smartphone,
  Activity,
  Download as DownloadIcon,
  DollarSign, Clock, Bell, Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AgentProfile = () => {
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    company: '',
    role: '',
    experience: '',
    bio: '',
    avatar: null,
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      jobAlerts: true,
      contractorUpdates: true,
      paymentNotifications: true,
      marketingEmails: true,
    },
  });

  // Activity and stats state
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    contractorsInvited: 0,
    applicationsProcessed: 0,
    slaCompliance: 98,
    budgetManaged: 0,
    avgResponseTime: '2h',
  });
  const [recentProjects, setRecentProjects] = useState([]);

  // PIN state
  const [pin, setPin] = useState(['', '', '', '']);

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={16} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={16} /> },
    { id: 'activity', label: 'Activity', icon: <Activity size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
  ];

  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, statsRes, activityRes, projectsRes] = await Promise.all([
        api.get('/agent/profile'),
        api.get('/agent/profile/stats'),
        api.get('/agent/profile/activity'),
        api.get('/agent/profile/projects'),
      ]);

      if (profileRes.data) {
        setProfileData(prev => ({ ...prev, ...profileRes.data }));
      }

      if (statsRes.data) {
        setStats(statsRes.data);
      }

      if (activityRes.data) {
        setRecentActivity(activityRes.data);
      }

      if (projectsRes.data) {
        setRecentProjects(projectsRes.data);
      }

    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch connected devices
  const fetchConnectedDevices = useCallback(async () => {
    try {
      const response = await api.get('/agent/profile/devices');
      setConnectedDevices(response.data);
    } catch (err) {
      console.error('Error fetching connected devices:', err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProfileData();
    fetchConnectedDevices();
  }, [fetchProfileData, fetchConnectedDevices]);

  // Handlers
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await api.put('/agent/profile', profileData);
      setIsEditing(false);
      // Refresh data
      await fetchProfileData();
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSetPin = async () => {
    try {
      const pinString = pin.join('');
      if (pinString.length !== 4) {
        alert('Please enter a 4-digit PIN');
        return;
      }

      await api.post('/agent/profile/pin', { pin: pinString });
      setShowPinModal(false);
      setPin(['', '', '', '']);
      alert('PIN set successfully!');
    } catch (err) {
      console.error('Error setting PIN:', err);
      alert('Failed to set PIN. Please try again.');
    }
  };

  const handleInviteFriend = async () => {
    try {
      // Generate referral link
      const response = await api.post('/agent/profile/referral');
      const referralLink = response.data.link;

      // In a real app, you would share this link
      navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
      setShowInviteModal(false);
    } catch (err) {
      console.error('Error generating referral link:', err);
      alert('Failed to generate referral link. Please try again.');
    }
  };

  const handleUploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/agent/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfileData(prev => ({ ...prev, avatar: response.data.avatarUrl }));
      alert('Profile picture updated successfully!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert('Failed to upload profile picture. Please try again.');
    }
  };

  const handleToggleTwoFactor = async () => {
    try {
      if (twoFactorEnabled) {
        await api.post('/agent/profile/2fa/disable');
        setTwoFactorEnabled(false);
        alert('Two-factor authentication disabled');
      } else {
        const response = await api.post('/agent/profile/2fa/enable');
        // In a real app, you would show QR code
        setTwoFactorEnabled(true);
        alert('Two-factor authentication enabled');
      }
    } catch (err) {
      console.error('Error toggling 2FA:', err);
      alert('Failed to update two-factor authentication');
    }
  };

  const handleExportData = async () => {
    try {
      const response = await api.get('/agent/profile/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `profile-data-${new Date().toISOString().split('T')[0]}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting data:', err);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      // Clear local storage/tokens and redirect to login
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      // Still redirect to login
      navigate('/login');
    }
  };

  // Helper functions
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getJobStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'BIDDING': return 'bg-amber-100 text-amber-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'job_created': return <Briefcase size={16} />;
      case 'application_reviewed': return <FileText size={16} />;
      case 'payment_processed': return <DollarSign size={16} />;
      case 'profile_updated': return <User size={16} />;
      default: return <Activity size={16} />;
    }
  };

  // PIN input handler
  const handlePinChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Auto-focus next input
      if (value && index < 3) {
        document.getElementById(`pin-${index + 1}`).focus();
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium"
            >
              <Share2 size={16} />
              Invite a friend
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium"
            >
              {isEditing ? <X size={16} /> : <Edit2 size={16} />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-3" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <User size={48} className="text-blue-600" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 p-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 cursor-pointer">
                      <Camera size={16} className="text-gray-600" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleUploadAvatar(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {isEditing ? (
                  <div className="w-full space-y-4">
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      placeholder="Email Address"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{profileData.name}</h2>
                    <p className="text-gray-600 mb-3">{profileData.email}</p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      <CheckCircle size={12} />
                      Verified Agent
                    </div>
                  </>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm"
                      placeholder="Phone Number"
                    />
                  ) : (
                    <span className="text-gray-700">{profileData.phone}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm"
                      placeholder="Location"
                    />
                  ) : (
                    <span className="text-gray-700">{profileData.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Building size={16} className="text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm"
                      placeholder="Company"
                    />
                  ) : (
                    <span className="text-gray-700">{profileData.company}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Award size={16} className="text-gray-400" />
                  <span className="text-gray-700">{profileData.role}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">About</h4>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 text-sm">{profileData.bio}</p>
                )}
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Experience</div>
                  <div className="text-lg font-bold text-gray-900">{profileData.experience}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Jobs Active</div>
                  <div className="text-lg font-bold text-blue-600">{stats.activeJobs}</div>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 ${saving
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowPinModal(true)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Key size={16} className="text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Set PIN</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DownloadIcon size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Export Data</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-red-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <LogOut size={16} className="text-red-600" />
                    </div>
                    <span className="font-medium">Logout</span>
                  </div>
                  <ChevronRight size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-500">Total Jobs</div>
                        <Briefcase size={16} className="text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalJobs}</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-500">SLA Compliance</div>
                        <TrendingUp size={16} className="text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-emerald-600">{stats.slaCompliance}%</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-500">Budget Managed</div>
                        <DollarSign size={16} className="text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.budgetManaged)}</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-500">Avg Response</div>
                        <Clock size={16} className="text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-amber-600">{stats.avgResponseTime}</div>
                    </div>
                  </div>

                  {/* Recent Projects */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Recent Projects</h3>
                      <button
                        onClick={() => navigate('/agent/jobs')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {recentProjects.slice(0, 3).map((project) => (
                        <div
                          key={project._id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-medium text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                #{project.jobCode} • {project.contractor?.name}
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getJobStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{project.progress || 0}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${project.progress === 100
                                  ? 'bg-emerald-500'
                                  : project.progress > 50
                                    ? 'bg-blue-500'
                                    : 'bg-amber-500'
                                  }`}
                                style={{ width: `${project.progress || 0}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Budget</div>
                              <div className="font-medium">{formatCurrency(project.budget)}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Timeline</div>
                              <div className="font-medium">{project.timeline || 'Flexible'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none">
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Draft</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none">
                      <option>Sort by Date</option>
                      <option>Sort by Budget</option>
                      <option>Sort by Priority</option>
                    </select>
                    <button
                      onClick={handleExportData}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      <Download size={14} />
                      Export
                    </button>
                  </div>

                  {/* Projects Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Job ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Title</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Budget</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Contractor</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProjects.map((project) => (
                          <tr key={project._id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">#{project.jobCode}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{project.title}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getJobStatusColor(project.status)}`}>
                                {project.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium">{formatCurrency(project.budget)}</td>
                            <td className="py-3 px-4 text-gray-700">
                              {project.contractor?.name || 'Not assigned'}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => navigate(`/agent/jobs/${project._id}`)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="mx-auto text-gray-400 mb-3" size={32} />
                      <p className="text-gray-600">No recent activity</p>
                    </div>
                  ) : (
                    recentActivity.map((activity) => (
                      <div
                        key={activity._id}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-gray-900">{activity.title}</div>
                            <span className="text-sm text-gray-500">
                              {formatDate(activity.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{activity.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Notification Preferences</h4>
                    <div className="space-y-3">
                      {Object.entries(profileData.preferences).map(([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <Bell size={16} className="text-gray-400" />
                            <span className="text-gray-700 font-medium">
                              {key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                preferences: {
                                  ...profileData.preferences,
                                  [key]: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Email Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Primary Email</div>
                          <div className="text-sm text-gray-600">{profileData.email}</div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Account Security</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-600">Add an extra layer of security</div>
                        </div>
                        <button
                          onClick={handleToggleTwoFactor}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${twoFactorEnabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                          {twoFactorEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Change Password</div>
                          <div className="text-sm text-gray-600">Update your account password</div>
                        </div>
                        <button
                          onClick={() => navigate('/agent/profile/password')}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Connected Devices</h4>
                    <div className="space-y-3">
                      {connectedDevices.map((device) => (
                        <div
                          key={device.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Smartphone size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{device.device}</div>
                              <div className="text-sm text-gray-600">
                                {device.location} • Last active: {formatDate(device.lastActive)}
                              </div>
                            </div>
                          </div>
                          {device.current ? (
                            <span className="text-sm text-emerald-600 font-medium">Current</span>
                          ) : (
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Set PIN</h3>
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPin(['', '', '', '']);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1">Add a 4-digit PIN for quick account access</p>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-4 text-center">
                  Enter 4-digit PIN
                </label>
                <div className="flex gap-3 justify-center">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      id={`pin-${index}`}
                      type="password"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          document.getElementById(`pin-${index - 1}`).focus();
                        }
                      }}
                      className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPin(['', '', '', '']);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetPin}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Set PIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Friend Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Invite a Friend</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1">Share your referral link</p>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Referral Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://ventureops.com/ref/your-code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText('https://ventureops.com/ref/your-code')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Gift size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">Earn ₹1,000 credit</div>
                    <div className="text-sm text-blue-700 mt-1">
                      You'll receive ₹1,000 platform credit for each friend who signs up and creates their first job.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={handleInviteFriend}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Generate Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentProfile;