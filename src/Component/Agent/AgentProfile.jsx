// pages/AgentProfile.jsx
import React, { useState } from 'react';
import { 
  User, Settings, FileText, Shield, Mail, Phone, MapPin, 
  Calendar, Award, Briefcase, CheckCircle, Star, Edit2, 
  Save, X, Camera, Globe, Building, Users, Clock, 
  DollarSign, TrendingUp, AlertTriangle, Plus, Download,
  MessageSquare, Zap, Target, Hash, Percent, Tag,
  ChevronRight, Eye, EyeOff, Key, Bell, Share2, HelpCircle,
  LogOut, CreditCard, ShieldCheck, BellRing
} from 'lucide-react';

const AgentProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'Sana Afzal',
    email: 'sanaafz2@gmail.com',
    phone: '+91 98765 43210',
    location: 'Chennai, Tamil Nadu',
    company: 'VentureOps Services',
    role: 'Senior Agent',
    experience: '5 years',
    bio: 'Experienced service agent specializing in industrial and commercial projects. Focus on quality assurance and contractor management.',
    pin: '',
    notifications: {
      email: true,
      push: true,
      sms: false,
      jobAlerts: true,
      contractorUpdates: true,
      paymentNotifications: true,
    }
  });

  // Recent Activity
  const recentActivity = [
    {
      id: 1,
      action: 'Job Created',
      title: 'Electrical Panel Upgrade - Hospital',
      time: '2 hours ago',
      icon: 'plus',
      status: 'success'
    },
    {
      id: 2,
      action: 'Application Approved',
      title: 'HVAC System Installation',
      time: '1 day ago',
      icon: 'check',
      status: 'success'
    },
    {
      id: 3,
      action: 'Contractor Invited',
      title: 'Elite Electrical Solutions',
      time: '2 days ago',
      icon: 'users',
      status: 'info'
    },
    {
      id: 4,
      action: 'Invoice Processed',
      title: 'JOB-0428 Payment',
      time: '3 days ago',
      icon: 'dollar',
      status: 'success'
    },
    {
      id: 5,
      action: 'SLA Warning',
      title: 'Industrial Plumbing Job',
      time: '5 days ago',
      icon: 'alert',
      status: 'warning'
    }
  ];

  // Stats
  const stats = {
    jobsCreated: 42,
    jobsActive: 8,
    jobsCompleted: 34,
    contractorsInvited: 28,
    applicationsProcessed: 156,
    slaCompliance: 94,
    budgetManaged: '₹2.5Cr',
    avgResponseTime: '2.4h'
  };

  // Recent Projects
  const recentProjects = [
    {
      id: 'JOB-0428',
      title: 'Electrical Panel Upgrade - Hospital',
      status: 'In Progress',
      budget: '₹2,50,000',
      timeline: '15 days',
      contractor: 'Elite Electrical Solutions',
      progress: 65
    },
    {
      id: 'JOB-0429',
      title: 'HVAC System Installation - Corporate',
      status: 'Bidding',
      budget: '₹4,80,000',
      timeline: '30 days',
      contractor: 'CoolTech Climate Systems',
      progress: 20
    },
    {
      id: 'JOB-0427',
      title: 'Data Center Power Backup',
      status: 'Completed',
      budget: '₹15,00,000',
      timeline: '45 days',
      contractor: 'PowerTech Industrial',
      progress: 100
    }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In a real app, you would save to backend here
    console.log('Profile saved:', profileData);
  };

  const handlePinSubmit = () => {
    setShowPinModal(false);
    // In a real app, you would save PIN securely
    console.log('PIN set');
  };

  const handleInviteFriend = () => {
    setShowInviteModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-emerald-100 text-emerald-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (icon) => {
    switch(icon) {
      case 'plus': return <Plus size={14} />;
      case 'check': return <CheckCircle size={14} />;
      case 'users': return <Users size={14} />;
      case 'dollar': return <DollarSign size={14} />;
      case 'alert': return <AlertTriangle size={14} />;
      default: return <CheckCircle size={14} />;
    }
  };

  const getJobStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Bidding': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={16} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={16} /> },
    { id: 'activity', label: 'Activity', icon: <Clock size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 font-sans pb-20 md:pb-6">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleInviteFriend}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium flex items-center gap-2"
            >
              <Share2 size={16} />
              Invite a friend
            </button>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium flex items-center gap-2"
            >
              {isEditing ? <X size={16} /> : <Edit2 size={16} />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
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
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <User size={48} className="text-blue-600" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 p-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50">
                      <Camera size={16} className="text-gray-600" />
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="w-full space-y-4">
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
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
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
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
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
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
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
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
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
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
                  <div className="text-lg font-bold text-blue-600">{stats.jobsActive}</div>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
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
                    <span className="text-gray-700 font-medium">Add PIN</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Settings size={16} className="text-gray-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Settings</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button 
                  onClick={handleInviteFriend}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">Invite a friend</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-red-600">
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
            <div className="bg-white border border-gray-300 rounded-xl overflow-hidden mb-6">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
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
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-500">Jobs Created</div>
                        <Briefcase size={16} className="text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.jobsCreated}</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-500">SLA Compliance</div>
                        <TrendingUp size={16} className="text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-emerald-600">{stats.slaCompliance}%</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-500">Budget Managed</div>
                        <DollarSign size={16} className="text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{stats.budgetManaged}</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
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
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {recentProjects.map((project) => (
                        <div key={project.id} className="border border-gray-300 rounded-xl p-4 hover:border-blue-300">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-medium text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-600 mt-1">{project.id} • {project.contractor}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getJobStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  project.progress === 100 ? 'bg-emerald-500' : 
                                  project.progress > 50 ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Budget</div>
                              <div className="font-medium">{project.budget}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Timeline</div>
                              <div className="font-medium">{project.timeline}</div>
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
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Bidding</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Sort by Date</option>
                      <option>Sort by Budget</option>
                      <option>Sort by Priority</option>
                    </select>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                      Export Projects
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
                          <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{project.id}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{project.title}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getJobStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium">{project.budget}</td>
                            <td className="py-3 px-4 text-gray-700">{project.contractor}</td>
                            <td className="py-3 px-4">
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
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
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-300 rounded-xl">
                      <div className={`p-2 rounded-lg ${getStatusColor(activity.status).replace('text', 'bg').replace('800', '100')}`}>
                        {getStatusIcon(activity.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-gray-900">{activity.action}</div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{activity.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Notification Preferences</h4>
                    <div className="space-y-3">
                      {Object.entries(profileData.notifications).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <BellRing size={16} className="text-gray-400" />
                            <span className="text-gray-700 font-medium">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setProfileData({
                              ...profileData,
                              notifications: {
                                ...profileData.notifications,
                                [key]: e.target.checked
                              }
                            })}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Email Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Primary Email</div>
                          <div className="text-sm text-gray-600">{profileData.email}</div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Change
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Marketing Emails</div>
                          <div className="text-sm text-gray-600">Receive product updates and offers</div>
                        </div>
                        <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
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
                      <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-600">Add an extra layer of security</div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                          Enable
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900">Login Activity</div>
                          <div className="text-sm text-gray-600">Recent login sessions</div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">
                          View
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900">Change Password</div>
                          <div className="text-sm text-gray-600">Update your account password</div>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">
                          Change
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Connected Devices</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-300 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Smartphone size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">iPhone 14 Pro</div>
                            <div className="text-sm text-gray-600">Active now • Chennai, India</div>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Revoke
                        </button>
                      </div>
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
            <div className="p-6 border-b border-gray-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Set PIN</h3>
                <button 
                  onClick={() => setShowPinModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1">Add a PIN for quick account access</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Enter 4-digit PIN</label>
                <div className="flex gap-2 justify-center">
                  {[1,2,3,4].map((digit) => (
                    <input
                      key={digit}
                      type="password"
                      maxLength="1"
                      className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePinSubmit}
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
            <div className="p-6 border-b border-gray-300">
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
                    value="https://ventureops.com/ref/sanaafz2"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm">
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
                  onClick={() => {
                    // Share functionality
                    setShowInviteModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Share via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for Smartphone icon
const Smartphone = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
    <path d="M12 18h.01"></path>
  </svg>
);

// Helper component for Gift icon
const Gift = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="8" width="18" height="4" rx="1"></rect>
    <path d="M12 8v13"></path>
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
  </svg>
);

export default AgentProfile;