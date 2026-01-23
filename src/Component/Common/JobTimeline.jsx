import React, { useState } from 'react';
import {
    Clock, CheckCircle, XCircle, AlertCircle, Camera,
    FileText, GitCompare, MapPin,
    User, X,
    Bell, History,
    Printer,
    ChevronLeft, ChevronRight,
    Upload,
    ClockAlert
} from 'lucide-react';

const JobTimeline = ({ job, steps = [], logs = [], role = 'viewer', onStepUpdate }) => {
    const [activeStep, setActiveStep] = useState(steps.find(s => s.status === 'in_progress' || s.status === 'in-review')?.id || (steps[0]?.id));
    const [selectedEvidence, setSelectedEvidence] = useState(null);
    const [viewMode, setViewMode] = useState('timeline'); // timeline, audit, analytics
    const [rejectionReason, setRejectionReason] = useState('');
    const [reviewNotes, setReviewNotes] = useState('');
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonMode, setComparisonMode] = useState('before-after');

    // Helper functions
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'in-review': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'in_progress':
            case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle size={16} className="text-emerald-600" />;
            case 'in-review': return <AlertCircle size={16} className="text-amber-600" />;
            case 'in_progress':
            case 'in-progress': return <Clock size={16} className="text-blue-600" />;
            case 'pending': return <Clock size={16} className="text-gray-600" />;
            case 'rejected': return <XCircle size={16} className="text-red-600" />;
            default: return <Clock size={16} className="text-gray-600" />;
        }
    };

    const getRiskColor = (risk) => {
        switch (risk?.toUpperCase()) {
            case 'LOW': return 'bg-emerald-100 text-emerald-800';
            case 'MEDIUM': return 'bg-amber-100 text-amber-800';
            case 'HIGH': return 'bg-red-100 text-red-800';
            case 'AT RISK': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleApproveStep = () => {
        if (onStepUpdate) {
            onStepUpdate(activeStep, 'approved', { notes: reviewNotes });
            setReviewNotes('');
        }
    };

    const handleRejectStep = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        if (onStepUpdate) {
            onStepUpdate(activeStep, 'rejected', { reason: rejectionReason });
            setRejectionReason('');
        }
    };

    const currentStep = steps.find(step => step.id === activeStep) || steps[0];

    if (!currentStep) return <div className="p-8 text-center text-gray-500">No timeline steps available.</div>;

    return (
        <div className="font-sans pb-6">

            {/* Page Header - Job Info */}
            <div className="bg-white border border-gray-300 rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">Execution Timeline</h1>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                                {job?._id ? job._id.toString().slice(-6).toUpperCase() : 'JOB-ID'}
                            </span>
                            {job?.riskLevel && (
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(job.riskLevel)}`}>
                                    {job.riskLevel}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="text-gray-700">{job?.title || 'Job Title'}</div>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-gray-400" />
                                    <span className="text-gray-600">{job?.contractor?.companyName || 'No Contractor'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span className="text-gray-600">{job?.location?.city || job?.location || 'Location'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* SLA Timer */}
                        {job?.slaEndDate && (
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2">
                                    <ClockAlert size={20} className="text-amber-600" />
                                    <span className="text-sm text-gray-600">SLA Check</span>
                                </div>
                                {/* Simplified SLA Logic */}
                                <div className="text-xl font-bold text-gray-900">
                                    {new Date(job.slaEndDate) > new Date() ? 'On Track' : 'Overdue'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'timeline'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Timeline View
                </button>
                <button
                    onClick={() => setViewMode('audit')}
                    className={`px-4 py-2 rounded-lg font-medium ${viewMode === 'audit'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Audit Log
                </button>
            </div>

            {viewMode === 'timeline' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Panel - Timeline Navigator */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-300 rounded-xl p-4 sticky top-40">
                            <h3 className="font-bold text-gray-900 mb-4">Timeline Steps</h3>

                            <div className="space-y-1">
                                {steps.map((step, index) => (
                                    <button
                                        key={step.id || index}
                                        onClick={() => setActiveStep(step.id)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all ${activeStep === step.id
                                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                                            : 'border-transparent hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Timeline Connector */}
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.status).split(' ')[0]
                                                    }`}>
                                                    {getStatusIcon(step.status)}
                                                </div>
                                                {index < steps.length - 1 && (
                                                    <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                                                )}
                                            </div>

                                            {/* Step Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="font-medium text-gray-900">{step.name}</div>
                                                </div>
                                                <div className="text-xs text-gray-600 mb-2 truncate">{step.description}</div>

                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(step.status)}`}>
                                                        {step.status?.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Panel - Step Details */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Step Header */}
                        <div className="bg-white border border-gray-300 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-xl font-bold text-gray-900">{currentStep.name}</h2>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(currentStep.status)}`}>
                                            {currentStep.status?.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600">{currentStep.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Start Time</div>
                                    <div className="font-medium text-gray-900">{currentStep.startDate ? new Date(currentStep.startDate).toLocaleDateString() : 'Not Started'}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Evidence Count</div>
                                    <div className="font-medium text-gray-900">{currentStep.evidence?.length || 0}</div>
                                </div>
                            </div>
                        </div>

                        {/* Evidence Section */}
                        <div className="bg-white border border-gray-300 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900">Uploaded Evidence</h3>
                                <div className="flex gap-2">
                                    {/* Contractor Upload Button */}
                                    {role === 'CONTRACTOR' && currentStep.status === 'in_progress' && (
                                        <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2">
                                            <Upload size={14} />
                                            Upload Proof
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={async (e) => {
                                                    if (e.target.files?.length > 0) {
                                                        // const files = Array.from(e.target.files);
                                                        // Call parent handler or direct API
                                                        // For now, let's assume onStepUpdate can handle 'upload' action or we pass a new prop
                                                        if (onStepUpdate) {
                                                            // We might need a separate handler for uploads involving FormData
                                                            // For simplicity, let's notify parent or alert
                                                            alert("Upload logic to be wired via onEvidenceUpload prop");
                                                            // Ideally: onEvidenceUpload(activeStep, files);
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                    <button
                                        onClick={() => setIsComparing(!isComparing)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${isComparing
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <GitCompare size={14} className="inline mr-1" />
                                        Compare
                                    </button>
                                </div>
                            </div>

                            {currentStep.evidence && currentStep.evidence.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {currentStep.evidence.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 cursor-pointer group"
                                            onClick={() => setSelectedEvidence(item)}
                                        >
                                            <div className="aspect-video bg-gray-200 relative overflow-hidden flex items-center justify-center">
                                                {/* Simple placeholder for images based on URL */}
                                                {item.type?.includes('image') || item.url?.match(/\.(jpeg|jpg|png)$/) ? (
                                                    <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                                                ) : (
                                                    <FileText size={32} className="text-gray-400" />
                                                )}
                                            </div>

                                            <div className="p-3">
                                                <div className="font-medium text-gray-900 text-sm truncate">{item.caption || `Evidence ${idx + 1}`}</div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="text-xs text-gray-500">{item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Camera size={48} className="text-gray-400 mx-auto mb-4" />
                                    <div className="text-gray-600">No evidence uploaded yet</div>
                                </div>
                            )}
                        </div>

                        {/* Agent Action Panel - Only visible for Agents or authorized users */}
                        {role === 'AGENT' && (currentStep.status === 'in-review' || currentStep.status === 'in_progress') && (
                            <div className="bg-white border border-gray-300 rounded-xl p-6">
                                <h3 className="font-bold text-gray-900 mb-4">Step Review & Approval</h3>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Review Notes */}
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Review Notes / Remarks
                                        </label>
                                        <textarea
                                            value={reviewNotes}
                                            onChange={(e) => setReviewNotes(e.target.value)}
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                            placeholder="Add your review comments, observations, or instructions..."
                                        />

                                        {/* Rejection Reason (if rejecting) */}
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Rejection Reason (Required if rejecting)
                                            </label>
                                            <textarea
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                rows="2"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                                placeholder="Specify why this step needs rework..."
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-4">

                                        <div className="space-y-3">
                                            <button
                                                onClick={handleApproveStep}
                                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={18} />
                                                Approve Step
                                            </button>

                                            <button
                                                onClick={handleRejectStep}
                                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={18} />
                                                Reject & Send Back
                                            </button>
                                        </div>

                                        <div className="text-xs text-gray-500 pt-4 border-t border-gray-300">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Bell size={12} />
                                                Contractor will be notified automatically
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <History size={12} />
                                                All actions are logged for audit
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : viewMode === 'audit' ? (
                /* Audit Log View */
                <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-300">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Audit & Compliance Log</h3>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium">
                                    <Printer size={14} className="inline mr-1" />
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {logs.length > 0 ? logs.map((log, idx) => (
                                <div key={idx} className="flex gap-4 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle size={20} className="text-blue-600" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="font-medium text-gray-900">{log.action || 'Action'}</div>
                                            <div className="text-sm text-gray-500">{log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</div>
                                        </div>

                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                {log.step || 'General'}
                                            </span>
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <User size={12} />
                                                {log.user || 'System'}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm">{log.details || 'No details provided'}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-gray-500 text-center">No logs available</div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Evidence Viewer Modal */}
            {selectedEvidence && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="p-4 border-b border-gray-300 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900">{selectedEvidence.caption}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedEvidence(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 flex items-center justify-center">
                            <div className="w-full max-w-2xl aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                                {selectedEvidence.type?.includes('image') || selectedEvidence.url?.match(/\.(jpeg|jpg|png)$/) ? (
                                    <img src={selectedEvidence.url} alt={selectedEvidence.caption} className="max-h-full max-w-full" />
                                ) : (
                                    <div className="text-white">Document Preview Not Available</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobTimeline;
