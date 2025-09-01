'use client';
import { useState, useEffect, useTransition } from 'react';
import { useActionState } from 'react';
import { 
    User, 
    Download, 
    Eye, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Mail,
    GraduationCap,
    Award,
    MapPin,
    Calendar,
    FileText,
    Users
} from 'lucide-react';
import { toast } from 'react-toastify';
import updateApplicationStatus from '../app/actions/updateApplicationStatus';

const ApplicationsList = ({ applications, jobTitle, onStatusUpdate, onViewDetails }) => {
    const [state, formAction] = useActionState(updateApplicationStatus, {});
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        }
        if (state.success) {
            toast.success(state.message);
            if (onStatusUpdate) {
                onStatusUpdate();
            }
        }
    }, [state, onStatusUpdate]);

    const handleStatusUpdate = (applicationId, status) => {
        const formData = new FormData();
        formData.append('applicationId', applicationId);
        formData.append('status', status);
        startTransition(() => {
            formAction(formData);
        });
    };

    const handleBulkStatusUpdate = async (status) => {
        if (selectedApplications.length === 0) {
            toast.error('Please select applications first');
            return;
        }

        try {
            // Update each selected application
            for (const applicationId of selectedApplications) {
                const formData = new FormData();
                formData.append('applicationId', applicationId);
                formData.append('status', status);
                startTransition(() => {
                    formAction(formData);
                });
                await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between requests
            }

            setSelectedApplications([]);
            setShowBulkActions(false);
            toast.success(`${selectedApplications.length} applications ${status} successfully`);
        } catch (error) {
            toast.error('Failed to update applications');
        }
    };

    const handleSelectAll = () => {
        const pendingApplications = filteredApplications
            .filter(app => app.status === 'pending')
            .map(app => app.$id);

        if (selectedApplications.length === pendingApplications.length) {
            setSelectedApplications([]);
        } else {
            setSelectedApplications(pendingApplications);
        }
    };

    const handleSelectApplication = (applicationId) => {
        setSelectedApplications(prev => {
            if (prev.includes(applicationId)) {
                return prev.filter(id => id !== applicationId);
            } else {
                return [...prev, applicationId];
            }
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
            shortlisted: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Shortlisted' },
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' },
            withdrawn: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Withdrawn' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {config.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredApplications = applications.filter(app => {
        if (filterStatus === 'all') return true;
        return app.status === filterStatus;
    });

    const getStatusCounts = () => {
        return {
            all: applications.length,
            pending: applications.filter(app => app.status === 'pending').length,
            shortlisted: applications.filter(app => app.status === 'shortlisted').length,
            rejected: applications.filter(app => app.status === 'rejected').length
        };
    };

    const statusCounts = getStatusCounts();

    if (applications.length === 0) {
        return (
            <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-500">
                    Applications for "{jobTitle}" will appear here once talents start applying.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with filters */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Applications for "{jobTitle}"
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {applications.length} total application{applications.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Status Filter */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                    {[
                        { key: 'all', label: 'All', count: statusCounts.all },
                        { key: 'pending', label: 'Pending', count: statusCounts.pending },
                        { key: 'shortlisted', label: 'Shortlisted', count: statusCounts.shortlisted },
                        { key: 'rejected', label: 'Rejected', count: statusCounts.rejected }
                    ].map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => setFilterStatus(filter.key)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                filterStatus === filter.key
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {filter.label} ({filter.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Bulk Actions */}
            {filteredApplications.some(app => app.status === 'pending') && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedApplications.length === filteredApplications.filter(app => app.status === 'pending').length && selectedApplications.length > 0}
                                    onChange={handleSelectAll}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700">
                                    Select all pending ({filteredApplications.filter(app => app.status === 'pending').length})
                                </span>
                            </label>
                            {selectedApplications.length > 0 && (
                                <span className="text-sm text-gray-600">
                                    {selectedApplications.length} selected
                                </span>
                            )}
                        </div>

                        {selectedApplications.length > 0 && (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleBulkStatusUpdate('shortlisted')}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Shortlist Selected
                                </button>
                                <button
                                    onClick={() => handleBulkStatusUpdate('rejected')}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject Selected
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Applications List */}
            <div className="space-y-4">
                {filteredApplications.map((application) => (
                    <div key={application.$id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            {/* Selection Checkbox */}
                            {application.status === 'pending' && (
                                <div className="flex items-center mr-4 mt-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedApplications.includes(application.$id)}
                                        onChange={() => handleSelectApplication(application.$id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </div>
                            )}

                            {/* Applicant Info */}
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    {application.talent?.avatar ? (
                                        <img 
                                            src={application.talent.avatar} 
                                            alt={application.talent.fullname}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-blue-600" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {application.talent?.fullname || 'Unknown Applicant'}
                                        </h4>
                                        {getStatusBadge(application.status)}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="w-4 h-4" />
                                            <span>{application.talent?.email || 'No email'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Applied {formatDate(application.applicationDate)}</span>
                                        </div>
                                        {application.talent?.careerStage && (
                                            <div className="flex items-center space-x-2">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>{application.talent.careerStage}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Skills Preview */}
                                    {application.talent?.skills && (
                                        <div className="mt-3">
                                            <div className="flex flex-wrap gap-1">
                                                {application.talent.skills.slice(0, 5).map((skill, index) => (
                                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {application.talent.skills.length > 5 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                                                        +{application.talent.skills.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col space-y-2 ml-4">
                                {/* Document Downloads */}
                                <div className="flex space-x-2">
                                    {application.cvUrl && (
                                        <a
                                            href={application.cvUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                        >
                                            <Download className="w-4 h-4 mr-1" />
                                            CV
                                        </a>
                                    )}
                                    {application.coverLetterUrl && (
                                        <a
                                            href={application.coverLetterUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                        >
                                            <FileText className="w-4 h-4 mr-1" />
                                            Cover Letter
                                        </a>
                                    )}
                                </div>

                                {/* View Details Button */}
                                <div className="mb-2">
                                    <button
                                        onClick={() => onViewDetails && onViewDetails(application)}
                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View Details
                                    </button>
                                </div>

                                {/* Status Actions */}
                                {application.status === 'pending' && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleStatusUpdate(application.$id, 'shortlisted')}
                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Shortlist
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(application.$id, 'rejected')}
                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApplicationsList;
