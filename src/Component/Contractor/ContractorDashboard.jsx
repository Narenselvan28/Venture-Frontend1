import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Search, Bell, Briefcase, AlertTriangle,
  CheckCircle, Target, Clock, DollarSign,
  Star, FileText, MessageSquare, Upload,
  AlertCircle, Trophy, Zap, ShieldCheck,
  TrendingUp, Download, User, Home, BarChart
} from 'lucide-react';

const ContractorDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    kpis: {
      activeJobs: 0,
      atRiskJobs: 0,
      completed: 0,
      slaCompliance: 0
    },
    ongoingJobs: [],
    attentionItems: [],
    aiSuggestions: [],
    stats: {
      responseTime: 0,
      earnings: 0,
      satisfaction: 0
    }
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get('/contractor/dashboard');
        if (response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // KPI Cards
  const kpis = [
    {
      title: 'Active Jobs',
      value: dashboardData.kpis.activeJobs,
      icon: <Briefcase className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 text-blue-700',
      route: '/contractor/jobs?status=active'
    },
    {
      title: 'At Risk',
      value: dashboardData.kpis.atRiskJobs,
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      color: 'bg-red-50 text-red-700',
      route: '/contractor/jobs?status=at-risk'
    },
    {
      title: 'Completed',
      value: dashboardData.kpis.completed,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-700',
      route: '/contractor/jobs?status=completed'
    },
    {
      title: 'SLA',
      value: `${dashboardData.kpis.slaCompliance}%`,
      icon: <Target className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 text-indigo-700',
      route: '/contractor/performance'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'bg-emerald-100 text-emerald-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm">Performance overview</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 border rounded-lg text-sm w-48"
                />
              </div>
              <button className="relative p-2">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, index) => (
            <button
              key={index}
              onClick={() => navigate(kpi.route)}
              className={`${kpi.color} border rounded-lg p-4 text-left hover:shadow transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-white rounded-lg">
                  {kpi.icon}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{kpi.value}</div>
              <div className="text-sm">{kpi.title}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ongoing Jobs */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Ongoing Jobs</h2>
                <button
                  onClick={() => navigate('/contractor/jobs')}
                  className="text-blue-600 text-sm hover:text-blue-700"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-4">
                {dashboardData.ongoingJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{job.title}</h4>
                        <div className="text-sm text-gray-600 mt-1">#{job.id}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(job.status)}`}>
                        {job.statusText}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-500">Client</div>
                        <div className="text-sm font-medium">{job.client}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Budget</div>
                        <div className="text-sm font-bold">{job.budget}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{job.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/contractor/jobs/${job.id}`)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Attention Needed */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Needs Attention</h2>
              <div className="space-y-3">
                {dashboardData.attentionItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.time}</div>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">SLA Performance</h2>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="251"
                      strokeDashoffset="251 - (251 * dashboardData.kpis.slaCompliance / 100)"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl font-bold text-gray-900">{dashboardData.kpis.slaCompliance}%</div>
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-600 mb-4">
                {dashboardData.kpis.slaCompliance >= 95 ? 'Excellent' : 'Good'} performance
              </div>
              <button
                onClick={() => navigate('/contractor/performance')}
                className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                View Details
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">Response Time</div>
                      <div className="font-bold">{dashboardData.stats.responseTime}h</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-600">Earnings</div>
                      <div className="font-bold">₹{dashboardData.stats.earnings.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                    <div>
                      <div className="text-sm text-gray-600">Rating</div>
                      <div className="font-bold">{dashboardData.stats.satisfaction}/5</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Suggestions
              </h2>
              <div className="space-y-3">
                {dashboardData.aiSuggestions.slice(0, 2).map((suggestion) => (
                  <div key={suggestion.id} className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="font-medium text-gray-900 mb-1">{suggestion.title}</div>
                    <div className="text-sm text-gray-600 mb-2">{suggestion.description}</div>
                    <button className="w-full py-1.5 bg-blue-600 text-white rounded text-sm">
                      {suggestion.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-sm text-gray-500">Rank</div>
                <div className="text-xl font-bold text-gray-900">Top 8%</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-sm text-gray-500">Trust Score</div>
                <div className="text-xl font-bold text-gray-900">88/100</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-sm text-gray-500">Growth</div>
                <div className="text-xl font-bold text-gray-900">+12%</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-3">
          {[
            { icon: <Home className="w-5 h-5" />, label: 'Home', onClick: () => {} },
            { icon: <Briefcase className="w-5 h-5" />, label: 'Jobs', onClick: () => navigate('/contractor/jobs') },
            { icon: <BarChart className="w-5 h-5" />, label: 'Stats', onClick: () => navigate('/contractor/performance') },
            { icon: <User className="w-5 h-5" />, label: 'Profile', onClick: () => navigate('/contractor/profile') },
          ].map((item, index) => (
            <button key={index} onClick={item.onClick} className="flex flex-col items-center p-2">
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;