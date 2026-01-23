import React from 'react';
import { X, MapPin, Calendar, DollarSign, Clock, FileText } from 'lucide-react';

const JobDetailsModal = ({ isOpen, onClose, job }) => {
    if (!isOpen || !job) return null;

    const getStatusColor = (status) => {
        switch(status) {
            case 'COMPLETED':
            case 'CLOSED':
                return 'bg-green-100 text-green-700';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-700';
            case 'BIDDING':
                return 'bg-yellow-100 text-yellow-700';
            case 'DRAFT':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">

                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-500">#{job.jobCode || job._id?.slice(-6)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(job.status)}`}>
                                {job.status?.replace('_', ' ') || 'Unknown'}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Budget</div>
                            <div className="text-lg font-bold text-gray-900">
                                ₹{job.budget?.toLocaleString() || '0'}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Timeline</div>
                            <div className="text-sm font-medium text-gray-900">
                                {job.slaHours || 'N/A'} hours
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                            <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
                                {job.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <MapPin size={14} />
                                    Location
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {job.location?.city || 'Remote'}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Calendar size={14} />
                                    Posted
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    {formatDate(job.createdAt)}
                                </div>
                            </div>
                        </div>

                        {job.skillsRequired?.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.skillsRequired.slice(0, 5).map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;