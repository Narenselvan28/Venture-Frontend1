import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import JobTimeline from './JobTimeline';
import { Loader, AlertTriangle, ArrowLeft } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview, timeline
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) {
                    setError("No Job ID provided");
                    setLoading(false);
                    return;
                }

                // Parallel fetch
                const [jobRes, timelineRes] = await Promise.allSettled([
                    api.get(`/jobs/${id}`),
                    api.get(`/timeline?jobId=${id}`)
                ]);

                if (jobRes.status === 'fulfilled') {
                    // Check if response is wrapped or direct
                    setJob(jobRes.value.data.job || jobRes.value.data);
                } else {
                    throw new Error("Failed to fetch job");
                }

                if (timelineRes.status === 'fulfilled') {
                    setTimeline(timelineRes.value.data);
                }

            } catch (err) {
                console.error("Error fetching details:", err);
                setError(err.message || "Failed to load details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleStepUpdate = async (stepId, status, data) => {
        try {
            // Optimistic update
            await api.put(`/timeline/${timeline._id}/stages/${stepId}`, {
                status,
                ...data
            });

            // Refetch timeline
            const res = await api.get(`/timeline?jobId=${id}`);
            setTimeline(res.data);
            alert(`Step updated to ${status}`);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update step");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
                    <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Job</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Nav */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900 truncate">
                            {job?.title}
                        </h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                            ${job?.status === 'completed' ? 'bg-green-100 text-green-800' :
                                job?.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                            {job?.status}
                        </span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'overview'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('timeline')}
                        className={`py-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'timeline'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Timeline & Execution
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`py-4 px-6 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'applications'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Applications ({job?.applications?.length || 0})
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
                                <p className="text-gray-600 whitespace-pre-wrap">{job?.description}</p>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {job?.skillsRequired?.map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Details</h2>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm text-gray-500">Budget</dt>
                                        <dd className="text-lg font-semibold text-gray-900">₹{job?.budget?.toLocaleString()}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Location</dt>
                                        <dd className="text-sm font-medium text-gray-900">{job?.location?.city}, {job?.location?.state}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">SLA Duration</dt>
                                        <dd className="text-sm font-medium text-gray-900">{job?.slaHours} Hours</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Created</dt>
                                        <dd className="text-sm font-medium text-gray-900">{new Date(job?.createdAt).toLocaleDateString()}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <JobTimeline
                        job={job}
                        steps={timeline?.stages || []}
                        logs={timeline?.events || []}
                        role={role}
                        onStepUpdate={handleStepUpdate}
                    />
                )}

                {activeTab === 'applications' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {job?.applications?.length > 0 ? job.applications.map((app) => (
                                <li key={app._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-base font-semibold text-gray-900">
                                                    {app.contractor?.companyName || app.contractor?.contactName || "Unknown Contractor"}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 mb-2">
                                                Skills: {app.contractor?.skills?.join(', ') || 'N/A'}
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {app.proposal || "No proposal details provided."}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-lg font-bold text-gray-900">₹{app.quote?.toLocaleString() || '0'}</div>
                                            <div className="text-xs text-gray-500">{app.estimatedTime || 'No estimate'}</div>
                                            {role === 'AGENT' && app.status === 'pending' && (
                                                <div className="mt-2 flex gap-2 justify-end">
                                                    <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">
                                                        Review
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            )) : (
                                <li className="p-12 text-center">
                                    <div className="text-gray-400 mb-2">No applications yet</div>
                                    <p className="text-sm text-gray-500">Contractors will appear here once they apply.</p>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobDetails;
