import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Search,
    Bell,
    Home,
    Briefcase,
    FileCheck,
    User,
    Menu,
    X,
    ChevronDown,
    LayoutDashboard,
    Plus,
    Clock
} from 'lucide-react';
import api from '../../services/api';

const UnifiedNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Dynamic Role Handling
    const role = localStorage.getItem('role') || 'AGENT'; // Default to AGENT if null
    const isAgent = role === 'AGENT';

    // Theme Colors based on Role
    // Unified Teal Theme
    const theme = {
        primary: 'teal',
        gradientFrom: 'from-teal-600',
        gradientTo: 'to-teal-800',
        bgLight: 'bg-teal-50',
        textDark: 'text-teal-900',
        borderLight: 'border-teal-100',
        iconColor: 'text-teal-600',
        shadow: 'shadow-teal-200',
    };

    const agentNavItems = [
        { id: 'home', label: 'Home', icon: <Home size={20} />, path: '/agent/dashboard' },
        { id: 'search', label: 'Search', icon: <Search size={20} />, path: '/agent/search' },
        { id: 'jobs', label: 'Jobs', icon: <Briefcase size={20} />, primary: true, path: '/agent/jobs' },
        { id: 'applications', label: 'Applications', icon: <FileCheck size={20} />, path: '/agent/applications' },
        { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/agent/profile' },
    ];

    const contractorNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/contractor/dashboard' },
        { id: 'jobs', label: 'Find Jobs', icon: <Search size={20} />, path: '/contractor/search' },
        { id: 'my-jobs', label: 'My Jobs', icon: <Briefcase size={20} />, primary: true, path: '/contractor/jobs' },
        { id: 'timeline', label: 'Timeline', icon: <Clock size={20} />, path: '/contractor/timeline' },
        { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/contractor/profile' },
    ];

    const navItems = isAgent ? agentNavItems : contractorNavItems;

    // Determine active tab based on current path
    const activeTab = navItems.find(item => location.pathname.startsWith(item.path))?.id || (isAgent ? 'home' : 'dashboard');

    const handleNavigation = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleAction = () => {
        if (isAgent) {
            navigate('/agent/jobs?create=true');
        } else {
            navigate('/contractor/search');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const searchPath = isAgent ? '/agent/search' : '/contractor/search';
            navigate(`${searchPath}?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            localStorage.removeItem('userRole');
            localStorage.removeItem('user');
            // Force refresh or navigate
            navigate('/auth/login');
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
                                onClick={() => navigate(isAgent ? '/agent/dashboard' : '/contractor/dashboard')}
                            >
                                <div className={`w-9 h-9 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} rounded-lg flex items-center justify-center shadow-sm`}>
                                    <span className="text-white font-bold text-lg">V</span>
                                </div>
                                <div className="ml-3">
                                    <span className="text-xl font-bold text-gray-900 tracking-tight">
                                        Venture<span className={`text-${theme.primary}-600`}>Ops</span>
                                    </span>
                                    <div className="text-[10px] text-gray-500 -mt-1">{isAgent ? 'Professional Services' : 'Contractor Portal'}</div>
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
                                        className={`px-4 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all ${activeTab === item.id
                                            ? `bg-gradient-to-r ${theme.bgLight} to-white ${theme.textDark} border ${theme.borderLight} shadow-sm`
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
                                    placeholder={isAgent ? "Search jobs..." : "Find jobs..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`pl-10 pr-4 py-2 w-64 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-${theme.primary}-100 transition-all text-sm`}
                                />
                            </form>

                            {/* Action Button */}
                            <button
                                onClick={handleAction}
                                className={`hidden lg:flex bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} text-white px-4 py-2.5 rounded-xl font-semibold items-center space-x-2 shadow-sm hover:shadow transition-all`}
                            >
                                {isAgent ? <Plus size={18} /> : <Search size={18} />}
                                <span className="text-sm">{isAgent ? 'Create Job' : 'Find Work'}</span>
                            </button>

                            {/* Notifications */}
                            <button
                                onClick={() => navigate(`/${role.toLowerCase()}/notifications`)}
                                className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            {/* User Profile */}
                            <div className="relative group">
                                <div
                                    className="flex items-center space-x-2 ml-2 cursor-pointer"
                                // Dropdown logic could come here, for now simple profile nav
                                >
                                    <div className={`w-9 h-9 bg-gradient-to-br from-${theme.primary}-100 to-white rounded-xl flex items-center justify-center border border-gray-200`}>
                                        <User size={18} className={theme.iconColor} />
                                    </div>
                                    <div className="hidden lg:block">
                                        <ChevronDown size={16} className="text-gray-400" />
                                    </div>
                                </div>
                                {/* Simple Dropdown for Logout */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover:block">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg"
                                    >
                                        Logout
                                    </button>
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
                                    className={`w-full px-4 py-3 rounded-xl flex items-center space-x-3 ${activeTab === item.id
                                        ? `${theme.bgLight} ${theme.textDark} border ${theme.borderLight}`
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-white' : 'bg-gray-100'}`}>
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
                            className={`flex flex-col items-center p-2 relative ${activeTab === item.id ? theme.textDark : 'text-gray-500'
                                } ${item.primary ? '-mt-5' : ''}`}
                        >
                            {item.primary ? (
                                <div className={`p-4 rounded-full shadow-lg ${activeTab === item.id ? `bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} text-white ${theme.shadow}` : 'bg-gray-100 text-gray-600'}`}>
                                    {item.icon}
                                </div>
                            ) : (
                                <>
                                    <div className={`p-2 rounded-lg ${activeTab === item.id ? theme.bgLight : ''}`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-xs mt-1">{item.label}</span>
                                </>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default UnifiedNavbar;
