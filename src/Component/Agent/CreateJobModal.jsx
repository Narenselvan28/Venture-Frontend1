import React, { useState } from 'react';
import { X, Save, AlertCircle, DollarSign, Clock, MapPin, Briefcase, FileText, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const CreateJobModal = ({ isOpen, onClose, checkJobs }) => {
    const initialFormState = {
        title: '',
        description: '',
        category: '',
        subCategory: '',
        location: {
            address: '',
            city: '',
            state: '',
            country: 'India'
        },
        budget: '',
        priority: 'MEDIUM',
        slaHours: '',
        skillsRequired: '',
        isUrgent: false,
        fastPayout: false
    };

    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate inputs
            if (!formData.title || !formData.description || !formData.category || !formData.budget || !formData.slaHours) {
                throw new Error("Please fill in all required fields.");
            }

            // Process skills (comma separated string to array)
            const payload = {
                ...formData,
                skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean)
            };

            await api.post('/jobs', payload);

            setSuccess(true);
            setTimeout(() => {
                checkJobs(); // Refresh job list
                onClose();
                setFormData(initialFormState); // Reset form
                setSuccess(false);
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.error || err.message || "Failed to create job.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Briefcase className="text-blue-200" />
                            Create New Job
                        </h2>
                        <p className="text-blue-100 mt-1">Fill in the details to post a new job requirement</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all backdrop-blur-md"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-pulse">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center justify-center gap-2">
                            <CheckCircle size={20} />
                            Job posted successfully! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Basic Info Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-blue-500" />
                                Job Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. Industrial HVAC Repair at Sector 4"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="HVAC">HVAC</option>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Safety">Safety</option>
                                        <option value="Industrial">Industrial</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Residential">Residential</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Category</label>
                                    <input
                                        type="text"
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. Maintenance"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                                        placeholder="Describe the job requirements in detail..."
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Location & Requirements */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <MapPin size={18} className="text-blue-500" />
                                Location & Requirements
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                                    <input
                                        type="text"
                                        name="location.address"
                                        value={formData.location.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Site Address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="location.city"
                                        value={formData.location.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="City"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Skills Required</label>
                                    <input
                                        type="text"
                                        name="skillsRequired"
                                        value={formData.skillsRequired}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Comma separated (e.g. Wiring, Cooling)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Budget & Priority */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 flex items-center gap-2">
                                <DollarSign size={18} className="text-blue-500" />
                                Budget & SLA
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Budget (₹) *</label>
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all pl-10"
                                        placeholder="0.00"
                                        required
                                    />
                                    <DollarSign size={18} className="absolute left-3 top-[42px] text-gray-400" />
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">SLA Duration (Hours) *</label>
                                    <input
                                        type="number"
                                        name="slaHours"
                                        value={formData.slaHours}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all pl-10"
                                        placeholder="24"
                                        required
                                    />
                                    <Clock size={18} className="absolute left-3 top-[42px] text-gray-400" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-6 mt-6">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="isUrgent"
                                        checked={formData.isUrgent}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                    />
                                    <span className="text-gray-700 font-medium group-hover:text-blue-700 transition-colors">Mark as Urgent</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="fastPayout"
                                        checked={formData.fastPayout}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                    />
                                    <span className="text-gray-700 font-medium group-hover:text-blue-700 transition-colors">Fast Payout Available</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-gray-700 font-semibold hover:bg-gray-200 transition-all"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Create Job
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateJobModal;
