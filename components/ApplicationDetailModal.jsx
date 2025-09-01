'use client';
import { useState, useEffect } from 'react';
import {
    X,
    User,
    Mail,
    MapPin,
    GraduationCap,
    Award,
    Briefcase,
    Download,
    FileText,
    Star,
    Heart,
    BookOpen,
    Target,
    Compass
} from 'lucide-react';

const ApplicationDetailModal = ({ application, isOpen, onClose, onStatusUpdate }) => {
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !application) return null;

    const { talent } = application;

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatArray = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return 'Not specified';
        return arr.join(', ');
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'skills', label: 'Skills & Education', icon: GraduationCap },
        { id: 'documents', label: 'Documents', icon: FileText }
    ];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div 
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                {talent?.avatar ? (
                                    <img 
                                        src={talent.avatar} 
                                        alt={talent.fullname}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-blue-600" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {talent?.fullname || 'Unknown Applicant'}
                                </h2>
                                <p className="text-gray-600">{talent?.careerStage || 'Career stage not specified'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-96 overflow-y-auto">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Email</p>
                                                <p className="text-sm text-gray-600">{talent?.email || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Briefcase className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Career Stage</p>
                                                <p className="text-sm text-gray-600">{talent?.careerStage || 'Not specified'}</p>
                                            </div>
                                        </div>
                                        {talent?.selectedPathTitle && (
                                            <div className="flex items-center space-x-3">
                                                <Compass className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Selected Career Path</p>
                                                    <p className="text-sm text-gray-600">{talent.selectedPathTitle}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Application Details */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Applied Date</p>
                                                <p className="text-sm text-gray-600">{formatDate(application.applicationDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Status</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Current Path & Interests */}
                                {(talent?.currentPath || talent?.interests) && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Interests</h3>
                                        <div className="space-y-3">
                                            {talent?.currentPath && (
                                                <div className="flex items-start space-x-3">
                                                    <Target className="w-5 h-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Current Path</p>
                                                        <p className="text-sm text-gray-600">{talent.currentPath}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {talent?.interests && (
                                                <div className="flex items-start space-x-3">
                                                    <Heart className="w-5 h-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Interests</p>
                                                        <p className="text-sm text-gray-600">{formatArray(talent.interests)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'skills' && (
                            <div className="space-y-6">
                                {/* Skills */}
                                {talent?.skills && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {talent.skills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {talent?.degrees && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-start space-x-3">
                                                <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Degrees</p>
                                                    <p className="text-sm text-gray-600">{formatArray(talent.degrees)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Certifications */}
                                {talent?.certifications && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-start space-x-3">
                                                <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Certifications</p>
                                                    <p className="text-sm text-gray-600">{formatArray(talent.certifications)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Documents</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* CV */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                                <span className="font-medium text-gray-900">Curriculum Vitae</span>
                                            </div>
                                        </div>
                                        {application.cvUrl ? (
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">CV document available for download</p>
                                                <a
                                                    href={application.cvUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download CV
                                                </a>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No CV uploaded</p>
                                        )}
                                    </div>

                                    {/* Cover Letter */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-5 h-5 text-green-600" />
                                                <span className="font-medium text-gray-900">Cover Letter</span>
                                            </div>
                                        </div>
                                        {application.coverLetterUrl ? (
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">Cover letter available for download</p>
                                                <a
                                                    href={application.coverLetterUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download Cover Letter
                                                </a>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No cover letter uploaded</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer with actions */}
                    {application.status === 'pending' && (
                        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    onStatusUpdate(application.$id, 'rejected');
                                    onClose();
                                }}
                                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                            >
                                Reject Application
                            </button>
                            <button
                                onClick={() => {
                                    onStatusUpdate(application.$id, 'shortlisted');
                                    onClose();
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Shortlist Candidate
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailModal;
