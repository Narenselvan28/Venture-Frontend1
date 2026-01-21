// components/AuthPage.jsx
import React, { useState } from 'react';
import {
  Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Briefcase,
  Building, Calendar, FileText, Shield, CheckCircle, ArrowRight,
  Smartphone, Home, Globe, Award, TrendingUp, UserCircle,
  Building2, Target, X, Users, Clock, DollarSign,
  Award as AwardIcon, Hash, Key, BriefcaseBusiness, ShieldCheck,
  AlertCircle, ChevronRight, ChevronLeft, Upload, Check,
  Link, AlertTriangle, CreditCard, Briefcase as Case,
  Factory, Landmark, Store, Package, Home as HomeIcon,
  FileCheck, FileUp, ShieldAlert, Bell, BellOff,
  MessageSquare, Zap, Star, Target as TargetIcon
} from 'lucide-react';
import api from '../services/api';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('AGENT'); // 'AGENT' or 'CONTRACTOR'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Identity, 2: Professional, 3: Security

  // AGENT Form State
  const [agentForm, setAgentForm] = useState({
    // Step 1: Identity & Login
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    country: 'India',

    // Step 2: Professional & Company
    designation: '',
    experienceYears: '',
    bio: '',
    companyName: '',
    companyType: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyGst: '',
    companyWebsite: '',

    // Step 3: Security & Preferences
    pin: '',
    twoFactorEnabled: false,
    notifications: {
      job: true,
      sla: true,
      invoice: true,
      dispute: true
    }
  });

  // CONTRACTOR Form State
  const [contractorForm, setContractorForm] = useState({
    // Step 1: Identity & Login
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    country: 'India',

    // Step 2: Business & Capability
    companyName: '',
    businessType: '',
    yearEstablished: '',
    gstNumber: '',
    licenseNumbers: [''],
    specializations: [],
    serviceCities: [],
    teamSize: '',
    maxParallelJobs: '',
    avgProjectSize: '',

    // Step 3: Trust & Security
    pin: '',
    twoFactorEnabled: false,
    notifications: {
      job: true,
      bid: true,
      invoice: true,
      system: true
    },
    // Documents would be uploaded via API
  });

  const form = role === 'AGENT' ? agentForm : contractorForm;

  const handleAgentChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1];
      setAgentForm(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked
        }
      }));
    } else {
      setAgentForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleContractorChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1];
      setContractorForm(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked
        }
      }));
    } else if (name === 'licenseNumbers') {
      // Handle array of license numbers
      const licenses = value.split(',').map(l => l.trim());
      setContractorForm(prev => ({
        ...prev,
        licenseNumbers: licenses
      }));
    } else if (name === 'specializations') {
      // Handle multi-select specializations
      const specials = value.split(',').map(s => s.trim());
      setContractorForm(prev => ({
        ...prev,
        specializations: specials
      }));
    } else if (name === 'serviceCities') {
      // Handle multi-city selection
      const cities = value.split(',').map(c => c.trim());
      setContractorForm(prev => ({
        ...prev,
        serviceCities: cities
      }));
    } else {
      setContractorForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleChange = role === 'AGENT' ? handleAgentChange : handleContractorChange;

  const handleRoleToggle = (selectedRole) => {
    setRole(selectedRole);
    setStep(1);
  };

  // Company types
  const companyTypes = [
    { value: 'ENTERPRISE', label: 'Enterprise', icon: <Factory /> },
    { value: 'SME', label: 'SME', icon: <Building2 /> },
    { value: 'STARTUP', label: 'Startup', icon: <Zap /> },
    { value: 'GOVERNMENT', label: 'Government', icon: <Landmark /> }
  ];

  // Business types
  const businessTypes = [
    { value: 'INDIVIDUAL', label: 'Individual', icon: <UserCircle /> },
    { value: 'FIRM', label: 'Firm', icon: <Case /> },
    { value: 'PVT_LTD', label: 'Private Limited', icon: <Building2 /> },
    { value: 'LLP', label: 'LLP', icon: <Package /> }
  ];

  // Specializations
  const specializationOptions = [
    'Electrical', 'HVAC', 'Plumbing', 'Fire Safety',
    'Data Center', 'Industrial', 'Commercial', 'Residential',
    'Solar', 'Automation', 'Security Systems', 'Civil'
  ];

  // Team sizes
  const teamSizeOptions = [
    '1-5', '6-20', '21-50', '51-100', '100+'
  ];

  const handleBasicSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      handleFinalSubmit();
    } else {
      // Basic validation
      if (form.password !== form.confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      if (form.password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
      }
      setStep(2);
    }
  };

  const handleProfessionalSubmit = (e) => {
    e.preventDefault();

    if (role === 'AGENT') {
      if (!agentForm.designation || !agentForm.companyName || !agentForm.companyType) {
        alert("Please fill all required professional details");
        return;
      }
    } else {
      if (!contractorForm.businessType || !contractorForm.specializations.length) {
        alert("Please fill all required business details");
        return;
      }
    }

    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);

    // Prepare data for API based on role
    let userData;

    if (role === 'AGENT') {
      userData = {
        // User collection fields
        email: agentForm.email,
        passwordHash: agentForm.password, // Hash in backend
        role: 'AGENT',

        // Agent profile (main collection)
        personal: {
          fullName: agentForm.fullName,
          email: agentForm.email,
          phone: agentForm.phone,
          location: {
            city: agentForm.city,
            state: agentForm.state,
            country: agentForm.country
          },
          designation: agentForm.designation,
          experienceYears: parseInt(agentForm.experienceYears) || 0,
          bio: agentForm.bio
        },

        company: {
          name: agentForm.companyName,
          type: agentForm.companyType,
          address: agentForm.companyAddress,
          city: agentForm.companyCity,
          state: agentForm.companyState,
          country: 'India',
          gstNumber: agentForm.companyGst || '',
          website: agentForm.companyWebsite || ''
        },

        capabilities: {
          domains: [], // Can be populated later
          maxProjectsHandled: 10 // Default
        },

        performance: {
          jobsCreated: 0,
          jobsAssigned: 0,
          jobsCompleted: 0,
          jobsDelayed: 0,
          slaCompliancePercent: 0,
          avgResponseTimeHours: 0,
          avgJobValue: 0,
          disputeCount: 0,
          escalationCount: 0
        },

        ratings: {
          overall: 0,
          clientFeedbackAvg: 0,
          contractorFeedbackAvg: 0
        },

        ml: {
          trustScore: 50, // Initial score
          efficiencyScore: 0,
          riskScore: 0,
          activityScore: 0,
          lastComputedAt: new Date()
        },

        security: {
          pinHash: agentForm.pin || '',
          twoFactorEnabled: agentForm.twoFactorEnabled
        },

        preferences: {
          notifications: agentForm.notifications,
          language: 'en',
          darkMode: false
        },

        verification: {
          isEmailVerified: false,
          isPhoneVerified: false,
          isCompanyVerified: false
        },

        status: {
          isActive: true,
          isSuspended: false,
          suspensionReason: ''
        }
      };
    } else {
      // CONTRACTOR data
      userData = {
        email: contractorForm.email,
        passwordHash: contractorForm.password,
        role: 'CONTRACTOR',

        business: {
          name: contractorForm.companyName,
          type: contractorForm.businessType,
          yearEstablished: parseInt(contractorForm.yearEstablished) || new Date().getFullYear(),
          gstNumber: contractorForm.gstNumber || '',
          address: contractorForm.companyAddress || '',
          city: contractorForm.city,
          state: contractorForm.state,
          country: contractorForm.country,
          website: contractorForm.companyWebsite || ''
        },

        contact: {
          ownerName: contractorForm.fullName,
          email: contractorForm.email,
          phone: contractorForm.phone
        },

        capabilities: {
          specializations: contractorForm.specializations,
          serviceCities: contractorForm.serviceCities,
          teamSize: contractorForm.teamSize,
          maxParallelJobs: parseInt(contractorForm.maxParallelJobs) || 1,
          avgProjectValue: parseFloat(contractorForm.avgProjectSize) || 0
        },

        compliance: {
          licenses: contractorForm.licenseNumbers.filter(l => l).map(number => ({
            name: 'Trade License',
            number,
            validTill: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            proofUrl: ''
          })),
          insurance: null // Optional
        },

        performance: {
          jobsApplied: 0,
          jobsWon: 0,
          jobsCompleted: 0,
          jobsDelayed: 0,
          jobsRejected: 0,
          slaCompliancePercent: 0,
          avgDelayHours: 0,
          disputeCount: 0,
          penaltyAmountTotal: 0
        },

        ratings: {
          overall: 0,
          quality: 0,
          punctuality: 0,
          communication: 0
        },

        ml: {
          trustScore: 50,
          deliveryScore: 0,
          qualityScore: 0,
          reliabilityScore: 0,
          lastComputedAt: new Date()
        },

        financial: {
          totalEarnings: 0,
          totalPenalties: 0,
          lastPaymentAt: null
        },

        security: {
          pinHash: contractorForm.pin || '',
          twoFactorEnabled: contractorForm.twoFactorEnabled
        },

        preferences: {
          notifications: contractorForm.notifications,
          language: 'en',
          darkMode: false
        },

        verification: {
          isEmailVerified: false,
          isPhoneVerified: false,
          isBusinessVerified: false
        },

        status: {
          isActive: true,
          isSuspended: false,
          suspensionReason: ''
        }
      };
    }

    console.log('Submitting:', { mode, role, userData });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`${mode === 'login' ? 'Login' : 'Registration'} successful!`);
      if (mode === 'register') {
        setStep(1);
        setMode('login');
      }
    }, 1500);
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
      {/* Main Card */}
      <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5">

        {/* Left Panel - Branding & Info */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 flex flex-col">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Target className="w-9 h-9" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">VentureOps</h1>
                <p className="text-blue-200 text-sm">Enterprise Service Management Platform</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 mb-auto">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">ML-Powered Trust Scoring</h3>
                <p className="text-blue-200 text-sm">Real-time trust scores based on performance, compliance, and reliability metrics</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Enterprise Compliance</h3>
                <p className="text-blue-200 text-sm">Full audit trail, GST, CIN, license tracking, and financial compliance</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Intelligent Matching</h3>
                <p className="text-blue-200 text-sm">AI-driven matching based on capabilities, location, and performance history</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 mt-8">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-300" />
              <p className="text-sm">ISO 27001 Certified Security</p>
            </div>
            <p className="text-blue-200 text-xs">Trusted by 750+ enterprises across APAC</p>
          </div>
        </div>

        {/* Right Panel - Forms */}
        <div className="lg:col-span-3 p-10">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              {step > 1 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {mode === 'login' ? 'Welcome Back' : `Create ${role} Account`}
              </h2>
              <p className="text-gray-600">
                {mode === 'login'
                  ? 'Sign in to access your enterprise dashboard'
                  : `Step ${step} of 3: ${step === 1 ? 'Identity & Login' : step === 2 ? (role === 'AGENT' ? 'Professional & Company' : 'Business & Capability') : 'Security & Preferences'}`
                }
              </p>
            </div>

            {/* Progress Bar */}
            {mode === 'register' && step > 1 && (
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Identity</span>
                  <span>{role === 'AGENT' ? 'Professional' : 'Business'}</span>
                  <span>Security</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Step 1: Identity & Login */}
            {(step === 1 || mode === 'login') && (
              <form onSubmit={handleBasicSubmit} className="space-y-6">
                {/* Role Selection (Register only) */}
                {mode === 'register' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-4">
                      Select Account Type:
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleRoleToggle('AGENT')}
                        className={`p-5 border-2 rounded-xl transition-all duration-200 ${role === 'AGENT'
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex flex-col items-center">
                          <UserCircle className="w-10 h-10 mb-3 text-blue-600" />
                          <span className="font-bold text-lg">Agent</span>
                          <p className="text-xs text-gray-600 mt-1 text-center">Manage projects, assign contractors, track SLAs</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleToggle('CONTRACTOR')}
                        className={`p-5 border-2 rounded-xl transition-all duration-200 ${role === 'CONTRACTOR'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex flex-col items-center">
                          <BriefcaseBusiness className="w-10 h-10 mb-3 text-emerald-600" />
                          <span className="font-bold text-lg">Contractor</span>
                          <p className="text-xs text-gray-600 mt-1 text-center">Find projects, submit bids, deliver services</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Common Identity Fields */}
                <div className="space-y-4">
                  {mode === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="Chennai"
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {mode === 'register' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="Tamil Nadu"
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="UAE">UAE</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        minLength="8"
                        className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters with letters and numbers</p>
                  </div>

                  {mode === 'register' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In' : 'Continue to Professional Details'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Professional Details */}
            {mode === 'register' && step === 2 && role === 'AGENT' && (
              <form onSubmit={handleProfessionalSubmit} className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <UserCircle className="text-blue-600" />
                    Professional Information
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Designation <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <AwardIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="designation"
                            value={agentForm.designation}
                            onChange={handleAgentChange}
                            placeholder="Senior Agent / Project Manager"
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Years of Experience <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            name="experienceYears"
                            value={agentForm.experienceYears}
                            onChange={handleAgentChange}
                            placeholder="5"
                            min="0"
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Short Bio / About
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                        <textarea
                          name="bio"
                          value={agentForm.bio}
                          onChange={handleAgentChange}
                          placeholder="Describe your role, expertise, and experience..."
                          rows="3"
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="text-blue-600" />
                    Company Information
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="companyName"
                            value={agentForm.companyName}
                            onChange={handleAgentChange}
                            placeholder="Your Company Name"
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Company Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            name="companyType"
                            value={agentForm.companyType}
                            onChange={handleAgentChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="">Select company type</option>
                            {companyTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Company Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <HomeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="companyAddress"
                          value={agentForm.companyAddress}
                          onChange={handleAgentChange}
                          placeholder="Full address with street and area"
                          required
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Company City
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="companyCity"
                            value={agentForm.companyCity}
                            onChange={handleAgentChange}
                            placeholder="City"
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Company State
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="companyState"
                            value={agentForm.companyState}
                            onChange={handleAgentChange}
                            placeholder="State"
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          GST Number
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="companyGst"
                            value={agentForm.companyGst}
                            onChange={handleAgentChange}
                            placeholder="27AAAAA0000A1Z5"
                            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Company Website
                        </label>
                        <div className="relative">
                          <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="url"
                            name="companyWebsite"
                            value={agentForm.companyWebsite}
                            onChange={handleAgentChange}
                            placeholder="https://company.com"
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  Continue to Security & Preferences
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* Step 2: Contractor Business Details */}
            {mode === 'register' && step === 2 && role === 'CONTRACTOR' && (
              <form onSubmit={handleProfessionalSubmit} className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BriefcaseBusiness className="text-emerald-600" />
                    Business Information
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Company / Firm Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="companyName"
                            value={contractorForm.companyName}
                            onChange={handleContractorChange}
                            placeholder="Your Business Name"
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Business Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            name="businessType"
                            value={contractorForm.businessType}
                            onChange={handleContractorChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          >
                            <option value="">Select business type</option>
                            {businessTypes.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Year Established
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            name="yearEstablished"
                            value={contractorForm.yearEstablished}
                            onChange={handleContractorChange}
                            placeholder="2015"
                            min="1900"
                            max={new Date().getFullYear()}
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          GST Number
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            name="gstNumber"
                            value={contractorForm.gstNumber}
                            onChange={handleContractorChange}
                            placeholder="27AAAAA0000A1Z5"
                            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        License Numbers (comma separated)
                      </label>
                      <div className="relative">
                        <FileCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="licenseNumbers"
                          value={contractorForm.licenseNumbers.join(', ')}
                          onChange={handleContractorChange}
                          placeholder="LIC-12345, ELEC-67890, HVAC-54321"
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TargetIcon className="text-emerald-600" />
                    Capability Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Specializations <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          multiple
                          name="specializations"
                          value={contractorForm.specializations}
                          onChange={handleContractorChange}
                          required
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 h-32"
                        >
                          {specializationOptions.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Service Cities (comma separated) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="serviceCities"
                          value={contractorForm.serviceCities.join(', ')}
                          onChange={handleContractorChange}
                          placeholder="Chennai, Bangalore, Mumbai"
                          required
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Team Size <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            name="teamSize"
                            value={contractorForm.teamSize}
                            onChange={handleContractorChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          >
                            <option value="">Select team size</option>
                            {teamSizeOptions.map(size => (
                              <option key={size} value={size}>{size} employees</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Max Parallel Jobs <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            name="maxParallelJobs"
                            value={contractorForm.maxParallelJobs}
                            onChange={handleContractorChange}
                            placeholder="5"
                            min="1"
                            required
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Average Project Size (₹) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          name="avgProjectSize"
                          value={contractorForm.avgProjectSize}
                          onChange={handleContractorChange}
                          placeholder="250000"
                          min="0"
                          required
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  Continue to Trust & Security
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* Step 3: Security & Preferences */}
            {mode === 'register' && step === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-blue-600" />
                    Security Settings
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        4-digit PIN (Optional)
                      </label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="password"
                          name="pin"
                          value={form.pin}
                          onChange={handleChange}
                          placeholder="****"
                          maxLength="4"
                          pattern="\d{4}"
                          className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">For quick app access (optional)</p>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-blue-100 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                            <div className="text-sm text-gray-600">Add extra security with app-based authentication</div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="twoFactorEnabled"
                          checked={form.twoFactorEnabled}
                          onChange={handleChange}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Bell className="text-blue-600" />
                    Notification Preferences
                  </h3>

                  <div className="space-y-3">
                    {role === 'AGENT' ? (
                      <>
                        <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <span className="font-medium text-gray-900">Job Updates</span>
                          <input
                            type="checkbox"
                            name="notifications.job"
                            checked={agentForm.notifications.job}
                            onChange={handleAgentChange}
                            className="w-4 h-4 text-blue-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <span className="font-medium text-gray-900">SLA Alerts</span>
                          <input
                            type="checkbox"
                            name="notifications.sla"
                            checked={agentForm.notifications.sla}
                            onChange={handleAgentChange}
                            className="w-4 h-4 text-blue-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <span className="font-medium text-gray-900">Invoice Alerts</span>
                          <input
                            type="checkbox"
                            name="notifications.invoice"
                            checked={agentForm.notifications.invoice}
                            onChange={handleAgentChange}
                            className="w-4 h-4 text-blue-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <span className="font-medium text-gray-900">Dispute Alerts</span>
                          <input
                            type="checkbox"
                            name="notifications.dispute"
                            checked={agentForm.notifications.dispute}
                            onChange={handleAgentChange}
                            className="w-4 h-4 text-blue-600"
                          />
                        </label>
                      </>
                    ) : (
                      <>
                        <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <span className="font-medium text-gray-900">Job Notifications</span>
                          <input
                            type="checkbox"
                            name="notifications.job"
                            checked={contractorForm.notifications.job}
                            onChange={handleContractorChange}
                            className="w-4 h-4 text-emerald-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <span className="font-medium text-gray-900">Bid Updates</span>
                          <input
                            type="checkbox"
                            name="notifications.bid"
                            checked={contractorForm.notifications.bid}
                            onChange={handleContractorChange}
                            className="w-4 h-4 text-emerald-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <span className="font-medium text-gray-900">Invoice Updates</span>
                          <input
                            type="checkbox"
                            name="notifications.invoice"
                            checked={contractorForm.notifications.invoice}
                            onChange={handleContractorChange}
                            className="w-4 h-4 text-emerald-600"
                          />
                        </label>
                        <label className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <span className="font-medium text-gray-900">System Announcements</span>
                          <input
                            type="checkbox"
                            name="notifications.system"
                            checked={contractorForm.notifications.system}
                            onChange={handleContractorChange}
                            className="w-4 h-4 text-emerald-600"
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Document Upload Info */}
                {role === 'CONTRACTOR' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="text-amber-600" />
                      Verification Documents Required
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      After registration, you'll need to upload the following documents for verification:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Company Registration Proof
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        License Proof Documents
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Insurance Certificate (Optional)
                      </li>
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isLoading}
                    className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Complete Registration</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Mode Toggle */}
            {step === 1 && (
              <div className="mt-8 pt-6 border-t border-gray-300 text-center">
                <p className="text-gray-600">
                  {mode === 'login' ? "New to VentureOps?" : "Already have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setStep(1);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {mode === 'login' ? 'Create Account' : 'Sign In'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;