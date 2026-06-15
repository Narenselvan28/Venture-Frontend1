// components/Auth/Signup.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail, Lock, Eye, EyeOff, User, Phone, MapPin,
    UserCircle, BriefcaseBusiness, Zap,
    ChevronLeft, Target, ShieldCheck, TrendingUp, CheckCircle
} from 'lucide-react';
import api from '../../services/api';

const Signup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('AGENT'); // 'AGENT' or 'CONTRACTOR'
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Identity, 2: Professional, 3: Security

    // AGENT Form State
    const [agentForm, setAgentForm] = useState({
        // Step 1: Identity
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
        // Step 1: Identity
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
        }
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
            const licenses = value.split(',').map(l => l.trim());
            setContractorForm(prev => ({ ...prev, licenseNumbers: licenses }));
        } else if (name === 'specializations') {
            const specials = value.split(',').map(s => s.trim());
            setContractorForm(prev => ({ ...prev, specializations: specials }));
        } else if (name === 'serviceCities') {
            const cities = value.split(',').map(c => c.trim());
            setContractorForm(prev => ({ ...prev, serviceCities: cities }));
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

    const handleBasicSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        if (form.password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }
        setStep(2);
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
                email: agentForm.email,
                password: agentForm.password, // Plain text, hashed in backend
                role: 'agent', // Lowercase for backend enum
                name: agentForm.fullName,
                company: agentForm.companyName,
                phone: agentForm.phone,
                location: agentForm.city
            };
        } else {
            userData = {
                email: contractorForm.email,
                password: contractorForm.password,
                role: 'contractor',
                name: contractorForm.fullName,
                company: contractorForm.companyName,
                phone: contractorForm.phone,
                location: contractorForm.city
            };
        }

        try {
            const response = await api.post('/auth/register', userData);
            console.log('Success:', response.data);

            // Auto-login (cookie set by backend)
            // Redirect based on role
            if (role === 'AGENT') {
                navigate('/agent/dashboard');
            } else {
                navigate('/contractor/dashboard');
            }

        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 flex items-center justify-center p-4">
            {/* Main Card */}
            <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5">

                {/* Left Panel - Branding & Info */}
                <div className="lg:col-span-2 bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-12 flex flex-col">
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
                                Create {role} Account
                            </h2>
                            <p className="text-gray-600">
                                Step {step} of 3: {step === 1 ? 'Identity & Login' : step === 2 ? (role === 'AGENT' ? 'Professional & Company' : 'Business & Capability') : 'Security & Preferences'}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Identity</span>
                                <span>{role === 'AGENT' ? 'Professional' : 'Business'}</span>
                                <span>Security</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-teal-600 transition-all duration-300"
                                    style={{ width: `${(step / 3) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Step 1: Identity */}
                        {step === 1 && (
                            <form onSubmit={handleBasicSubmit} className="space-y-6">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-900 mb-4">
                                        Select Account Type:
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleRoleToggle('AGENT')}
                                            className={`p-5 border-2 rounded-xl transition-all duration-200 ${role === 'AGENT'
                                                ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <UserCircle className="w-10 h-10 mb-3 text-teal-600" />
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

                                <div className="space-y-4">
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
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                                            />
                                        </div>
                                    </div>

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
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                                            />
                                        </div>
                                    </div>

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
                                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
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
                                                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

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
                                                className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
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
                                    </div>

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
                                                className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link to="/auth/login" className="text-teal-600 font-bold hover:underline">
                                            Log In
                                        </Link>
                                    </p>
                                    <button
                                        type="submit"
                                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                    >
                                        Next Step
                                        <UserCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 2: Professional */}
                        {step === 2 && (
                            <form onSubmit={handleProfessionalSubmit} className="space-y-6">
                                {/* Simplified for brevity - in real app would have all fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            {role === 'AGENT' ? 'Company Name' : 'Business Name'} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={form.companyName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                                        />
                                    </div>

                                    {role === 'AGENT' ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-2">Company Type <span className="text-red-500">*</span></label>
                                                <select
                                                    name="companyType"
                                                    value={form.companyType}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="ENTERPRISE">Enterprise</option>
                                                    <option value="SME">SME</option>
                                                    <option value="STARTUP">Startup</option>
                                                    <option value="GOVERNMENT">Government</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-900 mb-2">Designation <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="designation"
                                                    value={form.designation}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">Skills (comma separated)</label>
                                            <input
                                                type="text"
                                                name="specializations"
                                                value={form.specializations}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl"
                                            />
                                        </div>
                                    )}

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all"
                                        >
                                            Next Step
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Step 3: Security & Final */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="text-center py-6">
                                    <ShieldCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900">Security Check</h3>
                                    <p className="text-gray-600">Your account is ready to be created.</p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handleFinalSubmit}
                                        disabled={isLoading}
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
