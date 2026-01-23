import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Trash2, Edit2, Save, CheckCircle,
  Upload, Image, Camera, Eye
} from 'lucide-react';
import { createTimeline } from '../../services/api';

const CreateTimeline = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [isEditing, setIsEditing] = useState(true);
  const [activeStageId, setActiveStageId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [timeline, setTimeline] = useState({
    jobId: jobId || '', // Expecting valid ObjectId from params
    title: '',
    category: 'Electrical',
    priority: 'MEDIUM',
    totalSla: 0,
    stages: [],
    evidenceSettings: {
      requirePhotos: true,
      minPhotosPerStage: 2,
      allowedTypes: ['image/jpeg', 'image/png', 'video/mp4'],
      maxSizeMB: 10
    }
  });

  const stageTemplates = [
    {
      id: 'survey',
      name: 'Site Survey',
      defaultSla: 4,
      evidence: ['before', 'after'],
      checklist: ['Site photos', 'Measurements']
    },
    {
      id: 'installation',
      name: 'Installation',
      defaultSla: 12,
      evidence: ['before', 'during', 'after'],
      checklist: ['Progress photos', 'Safety check']
    },
    {
      id: 'testing',
      name: 'Testing',
      defaultSla: 8,
      evidence: ['during', 'after'],
      checklist: ['Test results', 'Certificate']
    }
  ];

  const addStage = (template = null) => {
    const newStage = {
      id: `stage-${Date.now()}`,
      order: timeline.stages.length + 1,
      name: template ? template.name : `Stage ${timeline.stages.length + 1}`,
      slaDuration: template ? template.defaultSla : 8,
      evidence: template ? [...template.evidence] : ['before', 'after'],
      checklist: template ? [...template.checklist] : ['Completion proof'],
      status: 'draft'
    };

    const newStages = [...timeline.stages, newStage];
    const totalSla = newStages.reduce((sum, stage) => sum + stage.slaDuration, 0);

    setTimeline({ ...timeline, stages: newStages, totalSla });
    setActiveStageId(newStage.id);
  };

  const updateStage = (stageId, updates) => {
    const updatedStages = timeline.stages.map(stage =>
      stage.id === stageId ? { ...stage, ...updates } : stage
    );

    const totalSla = updatedStages.reduce((sum, stage) => sum + stage.slaDuration, 0);
    setTimeline({ ...timeline, stages: updatedStages, totalSla });
  };

  const removeStage = (stageId) => {
    if (timeline.stages.length <= 1) {
      alert('Timeline must have at least one stage');
      return;
    }

    const filteredStages = timeline.stages.filter(stage => stage.id !== stageId);
    const reordered = filteredStages.map((stage, index) => ({ ...stage, order: index + 1 }));
    const totalSla = reordered.reduce((sum, stage) => sum + stage.slaDuration, 0);

    setTimeline({ ...timeline, stages: reordered, totalSla });
    setActiveStageId(reordered[0]?.id || null);
  };

  const validateTimeline = () => {
    const errors = {};

    if (!timeline.title.trim()) {
      errors.title = 'Job title is required';
    }

    if (timeline.stages.length === 0) {
      errors.stages = 'At least one stage is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateTimeline()) {
      alert('Please fix validation errors');
      return;
    }

    try {
      setIsSaving(true);
      if (!timeline.jobId) {
        alert("Error: Missing Job ID");
        return;
      }

      const payload = {
        ...timeline,
        status: 'draft',
        stages: timeline.stages.map(s => ({
          ...s,
          status: 'pending' // ensure backend enum compatibility
        }))
      };

      await createTimeline(payload);
      setIsEditing(false);
      alert('Timeline saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save timeline: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validateTimeline()) {
      alert('Please fix validation errors');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...timeline,
        status: 'published',
        stages: timeline.stages.map(s => ({
          ...s,
          status: 'pending'
        }))
      };

      await createTimeline(payload);
      alert('Timeline published successfully!');
      navigate(`/execution/${timeline.jobId}`);
    } catch (error) {
      console.error('Publish failed:', error);
      alert('Failed to publish timeline: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const activeStage = timeline.stages.find(stage => stage.id === activeStageId);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-xl font-bold text-gray-900">
                  {isEditing ? 'Create Timeline' : 'Timeline Preview'}
                </h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {timeline.jobId}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={timeline.title}
                    onChange={(e) => setTimeline({ ...timeline, title: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.title ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-100' : ''}`}
                    placeholder="Enter job title"
                  />
                  {validationErrors.title && (
                    <div className="text-red-600 text-sm mt-1">{validationErrors.title}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg flex items-center gap-2"
              >
                {isEditing ? <Eye size={16} /> : <Edit2 size={16} />}
                {isEditing ? 'Preview' : 'Edit'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className={`px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <CheckCircle size={16} />
                {isSaving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Timeline Structure */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Timeline Structure</h2>
                <div className="flex gap-2">
                  {isEditing && (
                    <button
                      onClick={() => addStage()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Add Stage
                    </button>
                  )}
                  <div className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                    {timeline.stages.length} Stages
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
                        className="px-3 py-2 border border-gray-300 hover:border-blue-300 rounded-lg flex items-center gap-2"
                      >
                        <span className="text-sm">{template.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stages List */}
              <div className="space-y-4">
                {timeline.stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={`border rounded-lg p-4 ${activeStageId === stage.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                      }`}
                    onClick={() => setActiveStageId(stage.id)}
                  >
                    {/* Stage Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {stage.order}
                          </div>
                          {index < timeline.stages.length - 1 && (
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
                                className="font-bold text-gray-900 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none"
                                placeholder="Stage name"
                              />
                            ) : (
                              <h3 className="font-bold text-gray-900">{stage.name}</h3>
                            )}

                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {stage.slaDuration}h
                            </span>
                          </div>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex gap-1">
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
                    <div className="grid grid-cols-2 gap-4 ml-11">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">SLA (hours)</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={stage.slaDuration}
                            onChange={(e) => updateStage(stage.id, { slaDuration: parseInt(e.target.value) || 0 })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          <div className="text-sm font-medium">{stage.slaDuration} hours</div>
                        )}
                      </div>
                    </div>

                    {/* Evidence Requirements */}
                    <div className="mt-4 ml-11">
                      <div className="flex items-center gap-2 mb-2">
                        <Camera size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Evidence Required</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {stage.evidence.map((type, idx) => (
                          <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs flex items-center gap-1">
                            <Image size={10} />
                            {type} Photos
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="mt-4 ml-11">
                      <div className="text-sm font-medium text-gray-700 mb-2">Checklist</div>
                      <div className="flex flex-wrap gap-2">
                        {stage.checklist.map((item, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Evidence Settings</h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timeline.evidenceSettings.requirePhotos}
                    onChange={(e) => setTimeline({
                      ...timeline,
                      evidenceSettings: {
                        ...timeline.evidenceSettings,
                        requirePhotos: e.target.checked
                      }
                    })}
                    disabled={!isEditing}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Require Photo Evidence</div>
                    <div className="text-sm text-gray-600">Contractor must upload photos for each stage</div>
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Min Photos per Stage
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={timeline.evidenceSettings.minPhotosPerStage}
                        onChange={(e) => setTimeline({
                          ...timeline,
                          evidenceSettings: {
                            ...timeline.evidenceSettings,
                            minPhotosPerStage: parseInt(e.target.value) || 1
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        min="1"
                      />
                    ) : (
                      <div className="font-medium">{timeline.evidenceSettings.minPhotosPerStage} photos</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Max File Size (MB)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={timeline.evidenceSettings.maxSizeMB}
                        onChange={(e) => setTimeline({
                          ...timeline,
                          evidenceSettings: {
                            ...timeline.evidenceSettings,
                            maxSizeMB: parseInt(e.target.value) || 10
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        min="1"
                      />
                    ) : (
                      <div className="font-medium">{timeline.evidenceSettings.maxSizeMB} MB</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Allowed File Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {timeline.evidenceSettings.allowedTypes.map((type, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {type.split('/')[1]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            {/* Timeline Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Timeline Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Stages</span>
                  <span className="font-medium">{timeline.stages.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-bold text-blue-600">{timeline.totalSla} hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Evidence Required</span>
                  <span className="font-medium">
                    {timeline.evidenceSettings.requirePhotos ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Stage Details */}
            {activeStage && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">Stage Details</h3>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="font-medium">{activeStage.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">SLA Duration</div>
                    <div className="font-medium">{activeStage.slaDuration} hours</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Evidence Types</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeStage.evidence.map((type, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white text-blue-700 rounded text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Preview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Upload Preview</h3>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Drop photos or videos here</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Max {timeline.evidenceSettings.maxSizeMB}MB per file
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera size={14} />
                    <span>Required for each stage:</span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-500">
                    <li>• Before work photos</li>
                    <li>• During work photos</li>
                    <li>• After completion photos</li>
                    <li>• Supporting documents</li>
                  </ul>
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