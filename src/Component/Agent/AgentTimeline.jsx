// pages/ExecutionTimeline.jsx
import React, { useState, useEffect } from 'react';
import {
  Clock, CheckCircle, XCircle, AlertCircle, Camera,
  FileText, Download, ZoomIn, GitCompare, MapPin,
  ChevronRight, ChevronLeft, Calendar, User,
  MessageSquare, Send, History, Bell, Settings,
  Filter, Search, Printer, Share2, ExternalLink,
  ThumbsUp, ThumbsDown, RotateCcw, Eye,
  ChevronDown, ChevronUp, Check, X,
  Upload, Image, Video, File, Shield,
  TrendingUp, TrendingDown, Target, Award,
  BarChart, PieChart, Activity, Zap,
  Globe, Navigation, ClockAlert, Timer,
  CalendarClock, CalendarCheck, CalendarX
} from 'lucide-react';

const ExecutionTimeline = () => {
  const [activeStep, setActiveStep] = useState(2);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, audit, analytics
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonMode, setComparisonMode] = useState('before-after');
  const [showAuditLog, setShowAuditLog] = useState(true);
  
  // Job data
  const job = {
    id: 'JOB-0428',
    title: 'Electrical Panel Upgrade - Apollo Hospital',
    category: 'Electrical',
    priority: 'HIGH',
    slaTotal: '72h',
    slaRemaining: '36h 12m',
    status: 'IN PROGRESS',
    riskLevel: 'AT RISK',
    contractor: 'Elite Electrical Solutions',
    contractorContact: 'Alex Mendez',
    startTime: '2024-03-15 09:00',
    expectedEnd: '2024-03-18 17:00',
    location: 'Chennai, TN',
    budget: '₹2,50,000',
    agent: 'Sana Afzal'
  };

  // Timeline steps data
  const timelineSteps = [
    {
      id: 1,
      name: 'Site Survey & Planning',
      description: 'Initial site assessment and planning phase',
      status: 'approved',
      slaDuration: '4h',
      startTime: '2024-03-15 09:00',
      endTime: '2024-03-15 13:00',
      approvedBy: 'Sana Afzal',
      approvedAt: '2024-03-15 13:15',
      evidence: {
        count: 3,
        type: 'photos',
        items: [
          { id: 1, type: 'photo', url: '/api/placeholder/300/200', caption: 'Panel location survey', uploadedAt: '09:30', by: 'Contractor' },
          { id: 2, type: 'photo', url: '/api/placeholder/300/200', caption: 'Electrical diagram', uploadedAt: '10:15', by: 'Contractor' },
          { id: 3, type: 'document', url: '/api/placeholder/300/200', caption: 'Survey checklist', uploadedAt: '12:45', by: 'Contractor' }
        ]
      }
    },
    {
      id: 2,
      name: 'Material Delivery & Verification',
      description: 'Verification of delivered materials and components',
      status: 'approved',
      slaDuration: '6h',
      startTime: '2024-03-15 14:00',
      endTime: '2024-03-15 20:00',
      approvedBy: 'Sana Afzal',
      approvedAt: '2024-03-15 20:30',
      evidence: {
        count: 4,
        type: 'mixed',
        items: [
          { id: 4, type: 'photo', url: '/api/placeholder/300/200', caption: 'Material delivery', uploadedAt: '14:30', by: 'Contractor' },
          { id: 5, type: 'photo', url: '/api/placeholder/300/200', caption: 'Component verification', uploadedAt: '15:45', by: 'Contractor' },
          { id: 6, type: 'document', url: '/api/placeholder/300/200', caption: 'Invoice', uploadedAt: '16:20', by: 'Contractor' },
          { id: 7, type: 'video', url: '/api/placeholder/300/200', caption: 'Quality check video', uploadedAt: '19:15', by: 'Contractor' }
        ]
      }
    },
    {
      id: 3,
      name: 'Panel Installation',
      description: 'Main panel installation and wiring',
      status: 'in-review',
      slaDuration: '12h',
      startTime: '2024-03-16 08:00',
      endTime: '2024-03-16 20:00',
      deadline: '6h remaining',
      evidence: {
        count: 5,
        type: 'photos',
        items: [
          { id: 8, type: 'photo', url: '/api/placeholder/300/200', caption: 'Old panel removal', uploadedAt: '08:45', by: 'Contractor' },
          { id: 9, type: 'photo', url: '/api/placeholder/300/200', caption: 'New panel placement', uploadedAt: '10:30', by: 'Contractor' },
          { id: 10, type: 'photo', url: '/api/placeholder/300/200', caption: 'Wiring in progress', uploadedAt: '13:15', by: 'Contractor' },
          { id: 11, type: 'photo', url: '/api/placeholder/300/200', caption: 'Safety checks', uploadedAt: '15:40', by: 'Contractor' },
          { id: 12, type: 'photo', url: '/api/placeholder/300/200', caption: 'Final installation', uploadedAt: '18:20', by: 'Contractor' }
        ]
      }
    },
    {
      id: 4,
      name: 'Testing & Validation',
      description: 'Electrical testing and system validation',
      status: 'pending',
      slaDuration: '8h',
      startTime: 'TBD',
      expectedStart: '2024-03-17 09:00',
      evidence: {
        count: 0,
        type: 'none'
      }
    },
    {
      id: 5,
      name: 'Final Handover & Documentation',
      description: 'Final documentation and client handover',
      status: 'pending',
      slaDuration: '4h',
      startTime: 'TBD',
      expectedStart: '2024-03-18 14:00',
      evidence: {
        count: 0,
        type: 'none'
      }
    }
  ];

  // Audit log data
  const auditLog = [
    {
      id: 1,
      action: 'Step Approved',
      step: 'Site Survey & Planning',
      user: 'Sana Afzal',
      role: 'Agent',
      timestamp: '2024-03-15 13:15',
      details: 'All survey points verified. Documentation complete.',
      icon: 'check'
    },
    {
      id: 2,
      action: 'Evidence Uploaded',
      step: 'Material Delivery',
      user: 'Alex Mendez',
      role: 'Contractor',
      timestamp: '2024-03-15 19:15',
      details: 'Uploaded 4 items: 3 photos, 1 video',
      icon: 'upload'
    },
    {
      id: 3,
      action: 'Step Approved',
      step: 'Material Delivery',
      user: 'Sana Afzal',
      role: 'Agent',
      timestamp: '2024-03-15 20:30',
      details: 'Materials verified against checklist. Quality satisfactory.',
      icon: 'check'
    },
    {
      id: 4,
      action: 'Step Started',
      step: 'Panel Installation',
      user: 'System',
      role: 'Auto',
      timestamp: '2024-03-16 08:00',
      details: 'Step automatically started after previous approval',
      icon: 'play'
    },
    {
      id: 5,
      action: 'Evidence Uploaded',
      step: 'Panel Installation',
      user: 'Alex Mendez',
      role: 'Contractor',
      timestamp: '2024-03-16 18:20',
      details: 'Uploaded 5 photos of installation process',
      icon: 'upload'
    },
    {
      id: 6,
      action: 'SLA Alert',
      step: 'Panel Installation',
      user: 'System',
      role: 'Auto',
      timestamp: '2024-03-16 19:45',
      details: 'Step approaching deadline: 6h remaining',
      icon: 'alert'
    }
  ];

  // AI Analysis results
  const aiAnalysis = {
    imageQuality: {
      score: 94,
      issues: ['1 blurry image detected', 'All images properly geo-tagged'],
      recommendations: 'Quality acceptable for approval'
    },
    similarityCheck: {
      score: 98,
      issues: ['No duplicate images detected', 'Progressive installation visible'],
      recommendations: 'Installation progression verified'
    },
    complianceCheck: {
      score: 92,
      issues: ['All safety gear visible', 'Proper equipment used'],
      recommendations: 'Compliance satisfactory'
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in-review': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle size={16} className="text-emerald-600" />;
      case 'in-review': return <AlertCircle size={16} className="text-amber-600" />;
      case 'pending': return <Clock size={16} className="text-gray-600" />;
      case 'rejected': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'LOW': return 'bg-emerald-100 text-emerald-800';
      case 'MEDIUM': return 'bg-amber-100 text-amber-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'AT RISK': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEvidenceIcon = (type) => {
    switch(type) {
      case 'photo': return <Image size={16} className="text-blue-600" />;
      case 'video': return <Video size={16} className="text-purple-600" />;
      case 'document': return <FileText size={16} className="text-amber-600" />;
      default: return <File size={16} className="text-gray-600" />;
    }
  };

  const handleApproveStep = () => {
    // In real app, would make API call
    console.log('Step approved:', timelineSteps[activeStep - 1].name);
    console.log('Review notes:', reviewNotes);
    
    // Move to next step
    if (activeStep < timelineSteps.length) {
      setActiveStep(activeStep + 1);
      setReviewNotes('');
    }
  };

  const handleRejectStep = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    // In real app, would make API call
    console.log('Step rejected:', timelineSteps[activeStep - 1].name);
    console.log('Rejection reason:', rejectionReason);
    
    // Reset for re-upload
    setRejectionReason('');
    setReviewNotes('');
    
    // In real app, would notify contractor
    alert('Step rejected. Contractor has been notified to re-upload evidence.');
  };

  const currentStep = timelineSteps.find(step => step.id === activeStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 font-sans pb-6">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Page Header */}
        <div className="bg-white border border-gray-300 rounded-xl p-6 mb-6 shadow-sm sticky top-24 z-40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">Execution Timeline</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                  {job.id}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(job.riskLevel)}`}>
                  {job.riskLevel}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-gray-700">{job.title}</div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span className="text-gray-600">{job.contractor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-gray-600">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-gray-600">Started: {job.startTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* SLA Timer */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <ClockAlert size={20} className="text-amber-600" />
                  <span className="text-sm text-gray-600">SLA Remaining</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{job.slaRemaining}</div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm">
                  Full Details
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm">
                  SLA Document
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'timeline'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setViewMode('audit')}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'audit'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Audit Log
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`px-4 py-2 rounded-lg font-medium ${
              viewMode === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Analytics
          </button>
        </div>

        {viewMode === 'timeline' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Panel - Timeline Navigator */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-300 rounded-xl p-4 sticky top-40">
                <h3 className="font-bold text-gray-900 mb-4">Timeline Steps</h3>
                
                <div className="space-y-1">
                  {timelineSteps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        activeStep === step.id
                          ? 'bg-blue-50 border-blue-200 shadow-sm'
                          : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Timeline Connector */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                            step.status === 'in-review' ? 'bg-amber-100 text-amber-600' :
                            step.status === 'rejected' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {getStatusIcon(step.status)}
                          </div>
                          {index < timelineSteps.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                          )}
                        </div>
                        
                        {/* Step Info */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-gray-900">{step.name}</div>
                            <div className="text-xs text-gray-500">{step.slaDuration}</div>
                          </div>
                          <div className="text-xs text-gray-600 mb-2">{step.description}</div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(step.status)}`}>
                                {step.status.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {step.evidence.count} {step.evidence.type === 'none' ? '' : 'evidence'}
                              </span>
                            </div>
                            
                            {step.status === 'in-review' && (
                              <div className="flex items-center gap-1 text-xs text-amber-600">
                                <Clock size={12} />
                                {step.deadline}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Timeline Summary */}
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">Completed</div>
                      <div className="text-lg font-bold text-gray-900">2/5</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">In Review</div>
                      <div className="text-lg font-bold text-amber-600">1</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">On Time</div>
                      <div className="text-lg font-bold text-emerald-600">100%</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500">SLA Risk</div>
                      <div className="text-lg font-bold text-red-600">Medium</div>
                    </div>
                  </div>
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
                        {currentStep.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600">{currentStep.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Step SLA</div>
                    <div className="text-lg font-bold text-gray-900">{currentStep.slaDuration}</div>
                    {currentStep.deadline && (
                      <div className="text-sm text-amber-600 font-medium">{currentStep.deadline}</div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Contractor</div>
                    <div className="font-medium text-gray-900">{job.contractor}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Start Time</div>
                    <div className="font-medium text-gray-900">{currentStep.startTime}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Evidence Count</div>
                    <div className="font-medium text-gray-900">{currentStep.evidence.count}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Evidence Type</div>
                    <div className="font-medium text-gray-900 capitalize">{currentStep.evidence.type}</div>
                  </div>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="bg-white border border-gray-300 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Uploaded Evidence</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsComparing(!isComparing)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        isComparing 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <GitCompare size={14} className="inline mr-1" />
                      GitCompare
                    </button>
                    <select 
                      value={comparisonMode}
                      onChange={(e) => setComparisonMode(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="before-after">Before/After</option>
                      <option value="side-by-side">Side-by-side</option>
                      <option value="overlay">Overlay</option>
                    </select>
                  </div>
                </div>
                
                {currentStep.evidence.count > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentStep.evidence.items.map((item) => (
                      <div 
                        key={item.id}
                        className="border border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 cursor-pointer group"
                        onClick={() => setSelectedEvidence(item)}
                      >
                        <div className="aspect-video bg-gray-200 relative overflow-hidden">
                          {/* Thumbnail */}
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            {item.type === 'photo' && <Image size={32} className="text-gray-400" />}
                            {item.type === 'video' && <Video size={32} className="text-gray-400" />}
                            {item.type === 'document' && <FileText size={32} className="text-gray-400" />}
                          </div>
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                          
                          {/* Badges */}
                          <div className="absolute top-2 left-2">
                            <div className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                              {item.type.toUpperCase()}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 bg-white rounded shadow-sm hover:bg-gray-100">
                              <Eye size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          <div className="font-medium text-gray-900 text-sm truncate">{item.caption}</div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="text-xs text-gray-500">{item.uploadedAt}</div>
                            <div className="text-xs text-gray-500">By {item.by}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera size={48} className="text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-600">No evidence uploaded yet</div>
                    <div className="text-sm text-gray-500 mt-1">Contractor will upload proof before deadline</div>
                  </div>
                )}
              </div>

              {/* AI Analysis Panel */}
              {currentStep.status === 'in-review' && currentStep.evidence.count > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={20} className="text-blue-600" />
                    <h3 className="font-bold text-gray-900">AI Analysis Results</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-blue-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-gray-900">Image Quality</div>
                        <div className="text-2xl font-bold text-emerald-600">{aiAnalysis.imageQuality.score}%</div>
                      </div>
                      <div className="space-y-2">
                        {aiAnalysis.imageQuality.issues.map((issue, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            {issue}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-sm text-blue-600 font-medium">
                        {aiAnalysis.imageQuality.recommendations}
                      </div>
                    </div>
                    
                    <div className="bg-white border border-blue-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-gray-900">Similarity Check</div>
                        <div className="text-2xl font-bold text-emerald-600">{aiAnalysis.similarityCheck.score}%</div>
                      </div>
                      <div className="space-y-2">
                        {aiAnalysis.similarityCheck.issues.map((issue, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            {issue}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-sm text-blue-600 font-medium">
                        {aiAnalysis.similarityCheck.recommendations}
                      </div>
                    </div>
                    
                    <div className="bg-white border border-blue-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-gray-900">Compliance Check</div>
                        <div className="text-2xl font-bold text-emerald-600">{aiAnalysis.complianceCheck.score}%</div>
                      </div>
                      <div className="space-y-2">
                        {aiAnalysis.complianceCheck.issues.map((issue, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            {issue}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-sm text-blue-600 font-medium">
                        {aiAnalysis.complianceCheck.recommendations}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Agent Action Panel */}
              {currentStep.status === 'in-review' && (
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
                      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-2">Action Impact</div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            ✅ <span className="font-medium">Approve:</span> Move to next step
                          </div>
                          <div className="text-sm">
                            ❌ <span className="font-medium">Reject:</span> Contractor must re-upload
                          </div>
                          <div className="text-sm">
                            ⏱️ <span className="font-medium">Delay:</span> SLA timer continues
                          </div>
                        </div>
                      </div>
                      
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
                        
                        <button className="w-full py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium">
                          Request Additional Evidence
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
                    <Download size={14} className="inline mr-1" />
                    Export
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium">
                    <Printer size={14} className="inline mr-1" />
                    Print
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {auditLog.map((log) => (
                  <div key={log.id} className="flex gap-4 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      {log.icon === 'check' && <CheckCircle size={20} className="text-blue-600" />}
                      {log.icon === 'upload' && <Upload size={20} className="text-green-600" />}
                      {log.icon === 'play' && <Clock size={20} className="text-amber-600" />}
                      {log.icon === 'alert' && <AlertCircle size={20} className="text-red-600" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-gray-900">{log.action}</div>
                        <div className="text-sm text-gray-500">{log.timestamp}</div>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {log.step}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User size={12} />
                          {log.user}
                          <span className="text-gray-400">({log.role})</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Analytics View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-300 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-6">Performance Analytics</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Avg Step Duration</div>
                    <div className="text-2xl font-bold text-gray-900">6.8h</div>
                    <div className="text-xs text-emerald-600">-12% vs target</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Approval Rate</div>
                    <div className="text-2xl font-bold text-gray-900">92%</div>
                    <div className="text-xs text-emerald-600">+7% vs target</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Rejection Rate</div>
                    <div className="text-2xl font-bold text-gray-900">3%</div>
                    <div className="text-xs text-emerald-600">-2% vs target</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">SLA Adherence</div>
                    <div className="text-2xl font-bold text-gray-900">94%</div>
                    <div className="text-xs text-amber-600">-1% vs target</div>
                  </div>
                </div>
                
                {/* Timeline Visualization */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-900 mb-4">Step Completion Timeline</div>
                  <div className="space-y-3">
                    {timelineSteps.map((step) => (
                      <div key={step.id} className="flex items-center">
                        <div className="w-32 text-sm text-gray-600">{step.name}</div>
                        <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              step.status === 'approved' ? 'bg-emerald-500' :
                              step.status === 'in-review' ? 'bg-amber-500' :
                              step.status === 'pending' ? 'bg-gray-400' : 'bg-red-500'
                            }`}
                            style={{ width: step.status === 'pending' ? '0%' : '100%' }}
                          />
                        </div>
                        <div className="w-20 text-right text-sm text-gray-600">{step.slaDuration}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-300 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">SLA Risk Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-gray-600">Current Step Risk</div>
                      <div className="text-sm font-bold text-amber-600">MEDIUM</div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-2/3"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-gray-600">Overall Job Risk</div>
                      <div className="text-sm font-bold text-red-600">HIGH</div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-4/5"></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-300">
                    <div className="text-sm text-gray-900 font-medium mb-2">Recommendations</div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                        <span>Expedite review of current step</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                        <span>Prepare next step requirements</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                        <span>Notify contractor of tight deadlines</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-300 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm">
                    Send SLA Warning to Contractor
                  </button>
                  <button className="w-full px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm">
                    Request Progress Update
                  </button>
                  <button className="w-full px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm">
                    Schedule Quality Check
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Evidence Viewer Modal */}
        {selectedEvidence && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b border-gray-300 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{selectedEvidence.caption}</h3>
                  <div className="text-sm text-gray-600">
                    Uploaded at {selectedEvidence.uploadedAt} by {selectedEvidence.by}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ZoomIn size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Download size={20} />
                  </button>
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
                  {/* Evidence content would go here */}
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">
                      {selectedEvidence.type === 'photo' && '📷'}
                      {selectedEvidence.type === 'video' && '🎥'}
                      {selectedEvidence.type === 'document' && '📄'}
                    </div>
                    <div>{selectedEvidence.type.toUpperCase()} PREVIEW</div>
                    <div className="text-sm text-gray-400 mt-2">(Full viewer implementation)</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-300 flex justify-between">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExecutionTimeline; 