// components/AgentNavbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Plus, 
  Home, 
  Briefcase, 
  FileCheck, 
  User, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';

const AgentNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} />, path: '/' },
    { id: 'search', label: 'Search', icon: <Search size={20} />, path: '/search' },
    { id: 'jobs', label: 'Jobs', icon: <Briefcase size={20} />, primary: true, path: '/jobs' },
    { id: 'applications', label: 'Applications', icon: <FileCheck size={20} />, path: '/applications' },
    { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  const activeTab = navItems.find(item => location.pathname === item.path)?.id || 'home';

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleCreateJob = () => {
    navigate('/jobs?create=true');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                className="md:hidden mr-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              {/* Logo - Click to go home */}
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => navigate('/')}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold text-gray-900 tracking-tight">
                    Venture<span className="text-blue-600">Ops</span>
                  </span>
                  <div className="text-[10px] text-gray-500 -mt-1">Professional Services</div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation & Search */}
            <div className="hidden md:flex flex-1 items-center justify-center px-8">
              {/* Navigation Items */}
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`px-4 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Bar (Desktop only) */}
              <form onSubmit={handleSearch} className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search jobs, contractors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
              </form>

              {/* Create Job Button */}
              <button 
                onClick={handleCreateJob}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center space-x-2 shadow-sm hover:shadow transition-all"
              >
                <Plus size={18} />
                <span className="text-sm">Create Job</span>
              </button>

              {/* Notifications */}
              <button 
                onClick={() => navigate('/notifications')}
                className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* User Profile */}
              <div 
                className="flex items-center space-x-2 ml-2 cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center border border-gray-200">
                  <User size={18} className="text-blue-600" />
                </div>
                <div className="hidden lg:block">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">Povendran K.</span>
                    <ChevronDown size={16} className="ml-1 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 -mt-0.5">Agent</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              <form onSubmit={handleSearch} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                />
              </form>
              
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full px-4 py-3 rounded-xl flex items-center space-x-3 ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center p-2 relative ${
                activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
              } ${item.primary ? '-mt-5' : ''}`}
            >
              {item.primary ? (
                <div className={`p-4 rounded-full shadow-lg ${activeTab === item.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200' : 'bg-gray-100 text-gray-600'}`}>
                  {item.icon}
                </div>
              ) : (
                <>
                  <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-blue-50' : ''}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </>
              )}
              
              {/* Active indicator */}
              {activeTab === item.id && !item.primary && (
                <div className="absolute -top-0.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AgentNavbar;