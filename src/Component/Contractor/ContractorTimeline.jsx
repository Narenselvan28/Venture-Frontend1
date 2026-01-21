// pages/CreateTimeline.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Trash2, Edit2, Save, X, Clock, Calendar,
  Target, AlertCircle, CheckCircle, Lock, Unlock,
  Upload, Image, FileText, Video, Download,
  ChevronUp, ChevronDown, Copy, Settings, Eye,
  BarChart, Zap, Users, Building, MapPin,
  DollarSign, Shield, CalendarClock, Timer,
  Hash, Link, ExternalLink, Star, Crown,
  MessageSquare, Send, History, Filter,
  Grid, List, Layout, Type, Hash as HashIcon,
  Briefcase, Home, Factory, Building2,
  Wrench, Tool, Cpu, Zap as ZapIcon,
  Thermometer, Droplets, Wifi, Server,
  AlertTriangle, FileCheck, FileX, Truck
} from 'lucide-react';

const CreateTimeline = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [isEditing, setIsEditing] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [activeStageId, setActiveStage] = useState('stage-1'); // Add this line
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Master timeline configuration
  const [timelineConfig, setTimelineConfig] = useState({
    // Basic info
    jobId: jobId || 'JOB-' + Math.floor(Math.random() * 10000),
    workOrderCode: `WO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
    title: '',
    category: '',
    jobType: 'PLANNED',
    priority: 'MEDIUM',
    criticality: 'NORMAL',
    
    // Ownership
    company: {
      name: '',
      id: ''
    },
    agent: {
      name: '',
      id: ''
    },
    contractor: {
      name: '',
      id: ''
    },
    client: {
      name: '',
      siteLocation: ''
    },
    
    // SLA Configuration
    sla: {
      templateId: '',
      totalDuration: 72, // hours
      warnings: {
        earlyWarning: 24, // hours before deadline
        finalWarning: 6,  // hours before deadline
        breachAlert: 1    // hour before breach
      },
      penalties: {
        perHourDelay: 1000,
        maxPenalty: 50000
      }
    },
    
    // Timeline Structure
    stages: [],
    
    // Evidence Requirements
    evidenceRequirements: {
      mandatory: ['before', 'after'],
      optional: ['during'],
      maxFilesPerStage: 10,
      allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'],
      maxFileSize: 10 // MB
    },
    
    // Review Settings
    reviewSettings: {
      autoApproval: false,
      requireAgentApproval: true,
      requireClientApproval: false,
      maxReviewTime: 24, // hours
      escalationTime: 4   // hours after review deadline
    },
    
    // Notifications
    notifications: {
      contractor: {
        stageStart: true,
        deadlineWarning: true,
        reviewRequired: true,
        approved: true,
        rejected: true
      },
      agent: {
        evidenceUploaded: true,
        reviewDeadline: true,
        slaBreachRisk: true
      },
      client: {
        stageComplete: false,
        jobComplete: true
      }
    },
    
    // AI Settings
    aiSettings: {
      enableImageAnalysis: true,
      enableSimilarityCheck: true,
      enableComplianceCheck: true,
      qualityThreshold: 80, // percentage
      autoRejectBelow: 50   // percentage
    },
    
    // Access Control
    permissions: {
      canEditTimeline: ['agent', 'admin'],
      canUploadEvidence: ['contractor'],
      canApprove: ['agent'],
      canReject: ['agent', 'client'],
      canViewAnalytics: ['agent', 'admin', 'client']
    },
    
    // Audit & Compliance
    compliance: {
      requireGpsTagging: true,
      requireTimeStamp: true,
      requireFaceInPhotos: false,
      requireSafetyGear: true,
      checklist: []
    }
  });

  // Stage templates for quick creation
  const stageTemplates = [
    {
      id: 'survey',
      name: 'Site Survey',
      icon: <MapPin size={16} />,
      description: 'Initial site assessment and planning',
      defaultSla: 4,
      defaultEvidence: ['before', 'during'],
      checklist: ['Site photos', 'Measurements', 'Risk assessment']
    },
    {
      id: 'material',
      name: 'Material Delivery',
      icon: <Truck size={16} />,
      description: 'Delivery and verification of materials',
      defaultSla: 6,
      defaultEvidence: ['before', 'after'],
      checklist: ['Delivery photos', 'Invoice verification', 'Quality check']
    },
    {
      id: 'installation',
      name: 'Installation',
      icon: <Wrench size={16} />,
      description: 'Main installation work',
      defaultSla: 12,
      defaultEvidence: ['before', 'during', 'after'],
      checklist: ['Progress photos', 'Safety compliance', 'Quality check']
    },
    {
      id: 'testing',
      name: 'Testing & Validation',
      icon: <CheckCircle size={16} />,
      description: 'Testing and system validation',
      defaultSla: 8,
      defaultEvidence: ['during', 'after'],
      checklist: ['Test results', 'Compliance certificate', 'Client sign-off']
    },
    {
      id: 'handover',
      name: 'Final Handover',
      icon: <FileCheck size={16} />,
      description: 'Documentation and client handover',
      defaultSla: 4,
      defaultEvidence: ['after'],
      checklist: ['Completion certificate', 'Documentation', 'Training']
    }
  ];

  // Sample stages data
  const [stages, setStages] = useState([
    {
      id: 'stage-1',
      order: 1,
      name: 'Site Survey & Planning',
      description: 'Initial site assessment and planning phase',
      category: 'survey',
      slaDuration: 4, // hours
      startTrigger: 'manual', // manual, auto_after_previous, scheduled
      dependencies: [],
      evidenceRequirements: {
        mandatory: ['before', 'after'],
        minPhotos: 3,
        checklist: ['Site photos', 'Measurements', 'Risk assessment']
      },
      approvalRequirements: {
        requireAgentApproval: true,
        requireClientApproval: false,
        autoApproveAfter: null // hours
      },
      notifications: {
        onStart: true,
        onDeadlineWarning: true,
        onCompletion: true
      },
      status: 'draft'
    },
    {
      id: 'stage-2',
      order: 2,
      name: 'Material Delivery & Verification',
      description: 'Verification of delivered materials and components',
      category: 'material',
      slaDuration: 6,
      startTrigger: 'auto_after_previous',
      dependencies: ['stage-1'],
      evidenceRequirements: {
        mandatory: ['before', 'after'],
        minPhotos: 2,
        checklist: ['Delivery photos', 'Invoice verification', 'Quality check']
      },
      approvalRequirements: {
        requireAgentApproval: true,
        requireClientApproval: false,
        autoApproveAfter: 12
      },
      notifications: {
        onStart: true,
        onDeadlineWarning: true,
        onCompletion: true
      },
      status: 'draft'
    }
  ]);

  // Add new stage
  const addStage = (template = null) => {
    const newStage = {
      id: `stage-${Date.now()}`,
      order: stages.length + 1,
      name: template ? template.name : `Stage ${stages.length + 1}`,
      description: template ? template.description : '',
      category: template ? template.id : 'custom',
      slaDuration: template ? template.defaultSla : 8,
      startTrigger: 'auto_after_previous',
      dependencies: stages.length > 0 ? [`stage-${stages.length}`] : [],
      evidenceRequirements: {
        mandatory: template ? template.defaultEvidence : ['before', 'after'],
        minPhotos: 2,
        checklist: template ? [...template.checklist] : ['Completion proof']
      },
      approvalRequirements: {
        requireAgentApproval: true,
        requireClientApproval: false,
        autoApproveAfter: null
      },
      notifications: {
        onStart: true,
        onDeadlineWarning: true,
        onCompletion: true
      },
      status: 'draft'
    };
    
    setStages([...stages, newStage]);
    setActiveStage(newStage.id);
  };

  // Update stage
  const updateStage = (stageId, updates) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, ...updates } : stage
    ));
  };

  // Remove stage
  const removeStage = (stageId) => {
    if (stages.length <= 1) {
      alert('Timeline must have at least one stage');
      return;
    }
    
    const filteredStages = stages.filter(stage => stage.id !== stageId);
    
    // Reorder remaining stages
    const reordered = filteredStages.map((stage, index) => ({ ...stage, order: index + 1 }));
    
    setStages(reordered);
    setActiveStage(reordered[0]?.id || null);
  };

  // Move stage up/down
  const moveStage = (stageId, direction) => {
    const index = stages.findIndex(s => s.id === stageId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === stages.length - 1)
    ) return;

    const newStages = [...stages];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap orders
    [newStages[index].order, newStages[newIndex].order] = 
    [newStages[newIndex].order, newStages[index].order];
    
    // Swap positions
    [newStages[index], newStages[newIndex]] = 
    [newStages[newIndex], newStages[index]];
    
    setStages(newStages);
  };

  // Validate timeline
  const validateTimeline = () => {
    const errors = {};
    
    if (!timelineConfig.title.trim()) {
      errors.title = 'Job title is required';
    }
    
    if (!timelineConfig.category) {
      errors.category = 'Category is required';
    }
    
    if (stages.length === 0) {
      errors.stages = 'At least one stage is required';
    }
    
    stages.forEach((stage, index) => {
      if (!stage.name.trim()) {
        errors[`stage-${stage.id}-name`] = `Stage ${index + 1} name is required`;
      }
      
      if (stage.slaDuration <= 0) {
        errors[`stage-${stage.id}-sla`] = `Stage ${index + 1} must have positive SLA duration`;
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save timeline
  const handleSave = () => {
    if (!validateTimeline()) {
      alert('Please fix validation errors before saving');
      return;
    }
    
    const fullConfig = {
      ...timelineConfig,
      stages: stages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In real app, save to backend
    console.log('Saving timeline:', fullConfig);
    setIsEditing(false);
    alert('Timeline saved successfully!');
  };

  // Publish timeline
  const handlePublish = () => {
    if (!validateTimeline()) {
      alert('Please fix validation errors before publishing');
      return;
    }
    
    const fullConfig = {
      ...timelineConfig,
      stages: stages.map(stage => ({ ...stage, status: 'published' })),
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In real app, publish to backend
    console.log('Publishing timeline:', fullConfig);
    setIsEditing(false);
    alert('Timeline published successfully!');
    navigate(`/execution/${timelineConfig.jobId}`);
  };

  // Calculate total SLA
  const totalSla = stages.reduce((total, stage) => total + stage.slaDuration, 0);
  
  // Get stage by id
  const activeStage = stages.find(stage => stage.id === activeStageId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white border border-gray-300 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Create Timeline' : 'Timeline Preview'}
                </h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                  {timelineConfig.jobId}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {timelineConfig.workOrderCode}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[300px]">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={timelineConfig.title}
                    onChange={(e) => setTimelineConfig({...timelineConfig, title: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      validationErrors.title ? 'border-red-300' : 'border-gray-300'
                    } ${!isEditing ? 'bg-gray-100' : ''}`}
                    placeholder="Enter job title"
                  />
                  {validationErrors.title && (
                    <div className="text-red-600 text-sm mt-1">{validationErrors.title}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Category *
                  </label>
                  <select
                    value={timelineConfig.category}
                    onChange={(e) => setTimelineConfig({...timelineConfig, category: e.target.value})}
                    disabled={!isEditing}
                    className={`px-3 py-2 border rounded-lg ${validationErrors.category ? 'border-red-300' : 'border-gray-300'} ${!isEditing ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">Select category</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Safety">Safety</option>
                    <option value="IT">IT Infrastructure</option>
                  </select>
                  {validationErrors.category && (
                    <div className="text-red-600 text-sm mt-1">{validationErrors.category}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Priority
                  </label>
                  <select
                    value={timelineConfig.priority}
                    onChange={(e) => setTimelineConfig({...timelineConfig, priority: e.target.value})}
                    disabled={!isEditing}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium flex items-center gap-2"
              >
                {isEditing ? <Eye size={16} /> : <Edit2 size={16} />}
                {isEditing ? 'Preview' : 'Edit'}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2"
              >
                <Save size={16} />
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Publish Timeline
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Timeline Structure */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Timeline Structure</h2>
                <div className="flex gap-2">
                  {isEditing && (
                    <button
                      onClick={() => addStage()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Add Stage
                    </button>
                  )}
                  <div className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                    {stages.length} Stages
                  </div>
                </div>
              </div>

              {validationErrors.stages && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {validationErrors.stages}
                </div>
              )}

              {/* Stage Templates */}
              {isEditing && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Quick Templates</h3>
                  <div className="flex flex-wrap gap-2">
                    {stageTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => addStage(template)}
                        className="px-3 py-2 border border-gray-300 hover:border-blue-300 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                      >
                        {template.icon}
                        <span className="text-sm font-medium">{template.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stages List */}
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={`border rounded-xl p-4 transition-all ${
                      activeStageId === stage.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white'
                    }`}
                    onClick={() => setActiveStage(stage.id)}
                  >
                    {/* Stage Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {stage.order}
                          </div>
                          {index < stages.length - 1 && (
                            <div className="w-0.5 h-6 bg-gray-300 mt-1"></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            {isEditing ? (
                              <input
                                type="text"
                                value={stage.name}
                                onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                                className={`text-lg font-bold text-gray-900 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none ${
                                  validationErrors[`stage-${stage.id}-name`] ? 'border-red-300' : ''
                                }`}
                                placeholder="Stage name"
                              />
                            ) : (
                              <h3 className="text-lg font-bold text-gray-900">{stage.name}</h3>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {stage.slaDuration}h SLA
                              </span>
                              {stage.category !== 'custom' && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                  {stage.category}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {isEditing ? (
                            <textarea
                              value={stage.description}
                              onChange={(e) => updateStage(stage.id, { description: e.target.value })}
                              className="w-full text-sm text-gray-600 bg-transparent border border-transparent rounded focus:border-gray-300 focus:outline-none"
                              placeholder="Stage description"
                              rows="2"
                            />
                          ) : (
                            <p className="text-sm text-gray-600">{stage.description}</p>
                          )}
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveStage(stage.id, 'up');
                            }}
                            disabled={index === 0}
                            className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveStage(stage.id, 'down');
                            }}
                            disabled={index === stages.length - 1}
                            className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeStage(stage.id);
                            }}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Stage Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-11">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">SLA Duration (hours)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={stage.slaDuration}
                            onChange={(e) => updateStage(stage.id, { slaDuration: parseInt(e.target.value) || 0 })}
                            className={`w-full px-2 py-1 border rounded text-sm ${
                              validationErrors[`stage-${stage.id}-sla`] ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        ) : (
                          <div className="text-sm font-medium">{stage.slaDuration} hours</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start Trigger</label>
                        {isEditing ? (
                          <select
                            value={stage.startTrigger}
                            onChange={(e) => updateStage(stage.id, { startTrigger: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="manual">Manual Start</option>
                            <option value="auto_after_previous">Auto After Previous</option>
                            <option value="scheduled">Scheduled</option>
                          </select>
                        ) : (
                          <div className="text-sm font-medium capitalize">
                            {stage.startTrigger.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Dependencies</label>
                        <div className="text-sm font-medium">
                          {stage.dependencies.length > 0 
                            ? `Depends on ${stage.dependencies.length} stage(s)` 
                            : 'No dependencies'}
                        </div>
                      </div>
                    </div>

                    {/* Evidence Requirements */}
                    <div className="mt-4 ml-11">
                      <div className="flex items-center gap-2 mb-2">
                        <Image size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Evidence Requirements</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {stage.evidenceRequirements.mandatory.map((req, idx) => (
                          <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
                            {req.toUpperCase()} (Required)
                          </span>
                        ))}
                        {stage.evidenceRequirements.checklist.map((item, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {stages.length === 0 && (
                <div className="text-center py-12">
                  <Clock size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No stages added yet</h3>
                  <p className="text-gray-600 mb-6">Add stages to create your timeline structure</p>
                  <button
                    onClick={() => addStage()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto"
                  >
                    <Plus size={18} />
                    Add First Stage
                  </button>
                </div>
              )}
            </div>

            {/* SLA Configuration */}
            <div className="bg-white border border-gray-300 rounded-xl p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">SLA Configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Timeline Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Stages</span>
                      <span className="font-medium">{stages.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total SLA Duration</span>
                      <span className="font-bold text-blue-600">{totalSla} hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Expected Completion</span>
                      <span className="font-medium">
                        {new Date(Date.now() + totalSla * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Penalty Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Per Hour Delay Penalty (₹)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={timelineConfig.sla.penalties.perHourDelay}
                          onChange={(e) => setTimelineConfig({
                            ...timelineConfig,
                            sla: {
                              ...timelineConfig.sla,
                              penalties: {
                                ...timelineConfig.sla.penalties,
                                perHourDelay: parseInt(e.target.value) || 0
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                      ) : (
                        <div className="font-medium">₹{timelineConfig.sla.penalties.perHourDelay}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Maximum Penalty (₹)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={timelineConfig.sla.penalties.maxPenalty}
                          onChange={(e) => setTimelineConfig({
                            ...timelineConfig,
                            sla: {
                              ...timelineConfig.sla,
                              penalties: {
                                ...timelineConfig.sla.penalties,
                                maxPenalty: parseInt(e.target.value) || 0
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                      ) : (
                        <div className="font-medium">₹{timelineConfig.sla.penalties.maxPenalty}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Warning Settings */}
              <div className="mt-6 pt-6 border-t border-gray-300">
                <h3 className="font-medium text-gray-900 mb-4">Warning Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Early Warning (hours before)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={timelineConfig.sla.warnings.earlyWarning}
                        onChange={(e) => setTimelineConfig({
                          ...timelineConfig,
                          sla: {
                            ...timelineConfig.sla,
                            warnings: {
                              ...timelineConfig.sla.warnings,
                              earlyWarning: parseInt(e.target.value) || 0
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    ) : (
                      <div className="font-medium">{timelineConfig.sla.warnings.earlyWarning} hours</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Final Warning (hours before)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={timelineConfig.sla.warnings.finalWarning}
                        onChange={(e) => setTimelineConfig({
                          ...timelineConfig,
                          sla: {
                            ...timelineConfig.sla,
                            warnings: {
                              ...timelineConfig.sla.warnings,
                              finalWarning: parseInt(e.target.value) || 0
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    ) : (
                      <div className="font-medium">{timelineConfig.sla.warnings.finalWarning} hours</div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Breach Alert (hours before)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={timelineConfig.sla.warnings.breachAlert}
                        onChange={(e) => setTimelineConfig({
                          ...timelineConfig,
                          sla: {
                            ...timelineConfig.sla,
                            warnings: {
                              ...timelineConfig.sla.warnings,
                              breachAlert: parseInt(e.target.value) || 0
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    ) : (
                      <div className="font-medium">{timelineConfig.sla.warnings.breachAlert} hour(s)</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Configuration & Preview */}
          <div className="space-y-6">
            {/* Job Configuration */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Job Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Job Type</label>
                  {isEditing ? (
                    <select
                      value={timelineConfig.jobType}
                      onChange={(e) => setTimelineConfig({...timelineConfig, jobType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="PLANNED">Planned</option>
                      <option value="EMERGENCY">Emergency</option>
                      <option value="PREVENTIVE">Preventive</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                  ) : (
                    <div className="p-2 bg-gray-100 rounded-lg">{timelineConfig.jobType}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Criticality Level</label>
                  {isEditing ? (
                    <select
                      value={timelineConfig.criticality}
                      onChange={(e) => setTimelineConfig({...timelineConfig, criticality: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="BUSINESS_CRITICAL">Business Critical</option>
                      <option value="SAFETY_CRITICAL">Safety Critical</option>
                    </select>
                  ) : (
                    <div className="p-2 bg-gray-100 rounded-lg">{timelineConfig.criticality}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={timelineConfig.company.name}
                      onChange={(e) => setTimelineConfig({
                        ...timelineConfig,
                        company: { ...timelineConfig.company, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter company name"
                    />
                  ) : (
                    <div className="p-2 bg-gray-100 rounded-lg">{timelineConfig.company.name}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Contractor</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={timelineConfig.contractor.name}
                      onChange={(e) => setTimelineConfig({
                        ...timelineConfig,
                        contractor: { ...timelineConfig.contractor, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Select contractor"
                    />
                  ) : (
                    <div className="p-2 bg-gray-100 rounded-lg">{timelineConfig.contractor.name}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Review Settings */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Review Settings</h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timelineConfig.reviewSettings.autoApproval}
                    onChange={(e) => setTimelineConfig({
                      ...timelineConfig,
                      reviewSettings: {
                        ...timelineConfig.reviewSettings,
                        autoApproval: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Enable Auto-Approval</div>
                    <div className="text-sm text-gray-600">Automatically approve after deadline</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timelineConfig.reviewSettings.requireAgentApproval}
                    onChange={(e) => setTimelineConfig({
                      ...timelineConfig,
                      reviewSettings: {
                        ...timelineConfig.reviewSettings,
                        requireAgentApproval: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Require Agent Approval</div>
                    <div className="text-sm text-gray-600">Agent must approve each stage</div>
                  </div>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Max Review Time (hours)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={timelineConfig.reviewSettings.maxReviewTime}
                      onChange={(e) => setTimelineConfig({
                        ...timelineConfig,
                        reviewSettings: {
                          ...timelineConfig.reviewSettings,
                          maxReviewTime: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <div className="p-2 bg-gray-100 rounded-lg">{timelineConfig.reviewSettings.maxReviewTime} hours</div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Settings */}
            <div className="bg-white border border-gray-300 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">AI Settings</h3>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timelineConfig.aiSettings.enableImageAnalysis}
                    onChange={(e) => setTimelineConfig({
                      ...timelineConfig,
                      aiSettings: {
                        ...timelineConfig.aiSettings,
                        enableImageAnalysis: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Image Quality Analysis</div>
                    <div className="text-sm text-gray-600">Check photo clarity and completeness</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timelineConfig.aiSettings.enableSimilarityCheck}
                    onChange={(e) => setTimelineConfig({
                      ...timelineConfig,
                      aiSettings: {
                        ...timelineConfig.aiSettings,
                        enableSimilarityCheck: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Similarity Check</div>
                    <div className="text-sm text-gray-600">Detect duplicate or fake images</div>
                  </div>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Quality Threshold (%)</label>
                  {isEditing ? (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={timelineConfig.aiSettings.qualityThreshold}
                      onChange={(e) => setTimelineConfig({
                        ...timelineConfig,
                        aiSettings: {
                          ...timelineConfig.aiSettings,
                          qualityThreshold: parseInt(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  ) : null}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Threshold</span>
                    <span className="font-medium">{timelineConfig.aiSettings.qualityThreshold}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Timeline Preview</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stages</span>
                  <span className="font-medium">{stages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-bold text-blue-600">{totalSla} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Penalty Rate</span>
                  <span className="font-medium">₹{timelineConfig.sla.penalties.perHourDelay}/hour</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Max Penalty</span>
                  <span className="font-medium">₹{timelineConfig.sla.penalties.maxPenalty}</span>
                </div>
                
                <div className="pt-4 border-t border-blue-200">
                  <div className="text-sm text-gray-600 mb-2">Stage Sequence</div>
                  <div className="space-y-2">
                    {stages.slice(0, 3).map(stage => (
                      <div key={stage.id} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                          {stage.order}
                        </div>
                        <span className="text-sm truncate">{stage.name}</span>
                      </div>
                    ))}
                    {stages.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{stages.length - 3} more stages
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateTimeline;