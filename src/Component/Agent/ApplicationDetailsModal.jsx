import React, { useState } from 'react';
import {
    X, User, Star, Clock, DollarSign, Calendar,
    FileText, CheckCircle, XCircle, Download,
    Building, MapPin, Briefcase, Shield, MessageSquare
} from 'lucide-react';

const ApplicationDetailsModal = ({ isOpen, onClose, application, onApprove, onReject }) => {
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);

    if (!isOpen || !application) return null;

    const { contractor, status, bidAmount, estimatedTime, submittedAt, coverLetter, _id } = application;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const handleRejectSubmit = () => {
        if (rejectReason.trim()) {
            onReject(_id, rejectReason);
            setShowRejectInput(false);
            setRejectReason('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                        <p className="text-sm text-gray-600">Review contractor proposal</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Contractor Info */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                            {contractor?.avatar ? (
                                <img src={contractor.avatar} alt={contractor.name} className="w-16 h-16 rounded-xl object-cover" />
                            ) : (
                                <User className="text-blue-600" size={32} />
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">{contractor?.name || 'Unknown Contractor'}</h4>
                            <p className="text-gray-600 text-sm flex items-center gap-1">
                                <Building size={14} />
                                {contractor?.company || 'Freelancer'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <Star size={14} className="text-amber-500 fill-amber-500" />
                                <span className="text-sm font-medium">{contractor?.rating || 'N/A'}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600">{contractor?.reviews || 0} reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Bid Amount</div>
                            <div className="font-bold text-gray-900">{formatCurrency(bidAmount)}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Timeline</div>
                            <div className="font-bold text-gray-900">{estimatedTime || 'N/A'}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Submitted</div>
                            <div className="font-medium text-gray-900">{formatDate(submittedAt)}</div>
                        </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Cover Letter</h4>
                        <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm">
                            {coverLetter || 'No cover letter provided.'}
                        </div>
                    </div>

                    {/* Contractor Details */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="text-gray-700">{contractor?.location || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-gray-400" />
                            <span className="text-gray-700">{contractor?.experience || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    {showRejectInput ? (
                        <div className="space-y-3">
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Reason for rejection..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                rows={2}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setShowRejectInput(false)} className="px-3 py-1.5 text-gray-600 text-sm">
                                    Cancel
                                </button>
                                <button onClick={handleRejectSubmit} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm">
                                    Confirm Reject
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between">
                            <button onClick={() => setShowRejectInput(true)} className="px-4 py-2 border border-red-200 text-red-700 rounded-lg text-sm">
                                <XCircle size={16} className="inline mr-2" />
                                Reject
                            </button>
                            <button onClick={() => { onApprove(_id); onClose(); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                                <CheckCircle size={16} className="inline mr-2" />
                                Approve
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsModal;