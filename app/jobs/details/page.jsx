'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Star,
  Zap,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  ExternalLink,
  Briefcase,
  Building,
  GraduationCap,
  Heart,
  Eye,
  Share2,
  Edit,
  Trash2,
  MousePointer,
  FileText,
  UserCheck,
  Mail
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import getJobById from "../../actions/getJobById";
import getApplicationsByJob from "../../actions/getApplicationsByJob";
import getShortlistedEmails from "../../actions/getShortlistedEmails";
import DeleteJobButton from '../../../components/DeleteJobButton';
import ApplicationsList from '../../../components/ApplicationsList';
import ApplicationDetailModal from '../../../components/ApplicationDetailModal';

export default function JobDetails() {
  const searchParams = useSearchParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const jobId = searchParams.get('job') ? atob(searchParams.get('job')) : null;

  useEffect(() => {
    if (!jobId) {
      toast.error('No job ID provided');
      return;
    }

    const fetchJobData = async () => {
      try {
        const jobData = await getJobById(jobId);
        setJob(jobData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
        setLoading(false);
      }
    };

    fetchJobData();
  }, [jobId]);

  const fetchApplications = async () => {
    if (!jobId) return;

    try {
      const result = await getApplicationsByJob(jobId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setApplications(result.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    }
  };

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab, jobId]);

  const handleStatusUpdate = useCallback(() => {
    fetchApplications(); // Refresh applications after status update
  }, [fetchApplications]);

  const handleExportEmails = async () => {
    try {
      const result = await getShortlistedEmails(jobId);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (!result.shortlistedTalents || result.shortlistedTalents.length === 0) {
        toast.info('No shortlisted candidates to export.');
        return;
      }

      // Create CSV content
      const headers = 'Full Name,Email';
      const csvContent = [
        headers,
        ...result.shortlistedTalents.map(talent => `"${talent.fullname.replace(/"/g, '""')}","${talent.email}"`)
      ].join('\n');

      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create a link element to trigger the download
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const jobTitle = job ? job.name.replace(/\s+/g, '_') : 'job';
      link.setAttribute('download', `shortlisted-talents-${jobTitle}.csv`);
      
      // Append to the document, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${result.shortlistedTalents.length} shortlisted candidates exported successfully!`);

    } catch (error) {
      console.error('Error exporting emails:', error); 
      toast.error('Failed to export emails');
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Link href="/jobs" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSeniorityColor = (level) => {
    switch (level) {
      case 'Entry-Level': return 'bg-green-100 text-green-800 border-green-200';
      case 'Mid-Level': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Senior-Level': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'Full Time': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Part Time': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Contract': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Internship': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Encode job ID for URL
  const encodedJobId = btoa(jobId);

  const formatArray = (arr) => {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return 'Not specified';
    return arr.join(', ');
  };

  const tabs = [
    { id: 'details', label: 'Job Details', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: UserCheck, count: applications.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/jobs"
                className="text-[#5badec] hover:text-[#4a9ad4] font-medium"
              >
                ← Back to Jobs
              </Link>
            </div>
            
            {/* Action Buttons - Edit and Delete */}
            <div className="flex items-center space-x-3">
              <Link
                href={`/jobs/edit?job=${encodedJobId}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Job
              </Link>
              
              <DeleteJobButton jobId={jobId} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#5badec] rounded-lg flex items-center justify-center mr-4">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {job.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {job.industry || 'Technology'}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Posted {formatDate(job.dateofUpload)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Stats Display */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-lg font-semibold text-gray-900">{job.numViews || 0}</span>
                    <span className="text-sm text-gray-500 ml-1">views</span>
                  </div>
                  
                  <div className="flex items-center px-3 py-2 bg-blue-50 rounded-lg">
                    <MousePointer className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-lg font-semibold text-blue-900">{job.numClicks || 0}</span>
                    <span className="text-sm text-blue-600 ml-1">apply clicks</span>
                  </div>
                </div>
              </div>

              {/* Job Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeniorityColor(job.seniorityLevel)}`}>
                  {job.seniorityLevel}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getJobTypeColor(job.jobtype)}`}>
                  {job.jobtype}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                  {job.workenvironment}
                </span>
                {job.expiryDate && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                    Expires {formatDate(job.expiryDate)}
                  </span>
                )}
              </div>

              {/* Apply Link Display (for employer view) */}
              {job.applylink && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Application Link</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 text-sm break-all">{job.applylink}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                        {tab.count !== undefined && (
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Job Description */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <div className="w-6 h-6 bg-[#5badec] rounded flex items-center justify-center mr-3">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        About this Job
                      </h2>
                      <div className="prose max-w-none text-gray-700 leading-relaxed">
                        {job.description ? (
                          <p className="whitespace-pre-wrap">{job.description}</p>
                        ) : (
                          <p className="text-gray-500 italic">No job description provided.</p>
                        )}
                      </div>
                    </div>

                    {/* Responsibilities */}
                    {job.responsibilities && job.responsibilities.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                          <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center mr-3">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          Key Responsibilities
                        </h2>
                        <ul className="space-y-3">
                          {job.responsibilities.map((responsibility, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Desired Qualities */}
                    {job.qualities && job.qualities.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                          <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center mr-3">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          Desired Qualities
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {job.qualities.map((quality, index) => (
                            <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                              <Star className="w-4 h-4 text-purple-600 mr-3" />
                              <span className="text-gray-700">{quality}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'applications' && (
                  <div>
                    {job.allowCareer4MeApplications ? (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">Application Management</h2>
                            <p className="text-gray-600 mt-1">Review and manage applications for this position</p>
                          </div>
                          {applications.some(app => app.status === 'shortlisted') && (
                            <button
                              onClick={handleExportEmails}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Export Shortlisted Emails
                            </button>
                          )}
                        </div>
                        <ApplicationsList
                          applications={applications}
                          jobTitle={job.name}
                          onStatusUpdate={handleStatusUpdate}
                          onViewDetails={(application) => {
                            setSelectedApplication(application);
                            setShowApplicationModal(true);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Apply Not Enabled</h3>
                        <p className="text-gray-500 mb-4">
                          This job doesn't have Quick Apply enabled. Applications are handled through the external link.
                        </p>
                        <Link
                          href={`/jobs/edit?job=${encodedJobId}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Enable Quick Apply
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Required Skills */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-6 h-6 bg-[#5badec] rounded flex items-center justify-center mr-3">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-[#5badec]/10 text-[#5badec] px-3 py-1.5 rounded-lg text-sm font-medium border border-[#5badec]/20"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No specific skills required</span>
                )}
              </div>
            </div>

            {/* Education Requirements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center mr-3">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                Education
              </h3>
              <div className="space-y-3">
                {job.requiredDegrees && job.requiredDegrees.length > 0 ? (
                  job.requiredDegrees.map((degree, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Target className="w-4 h-4 text-gray-600 mr-3" />
                      <span className="text-gray-700 font-medium">{degree}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No specific degree requirements</span>
                )}
              </div>
            </div>

            {/* Suggested Certifications */}
            {job.suggestedCertifications && job.suggestedCertifications.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center mr-3">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  Suggested Certifications
                </h3>
                <div className="space-y-2">
                  {job.suggestedCertifications.map((cert, index) => (
                    <div key={index} className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <Award className="w-4 h-4 text-amber-600 mr-3" />
                      <span className="text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Paths */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center mr-3">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                Career Paths
              </h3>
              <div className="space-y-2">
                {job.relatedpaths && job.relatedpaths.length > 0 ? (
                  job.relatedpaths.map((path, index) => (
                    <div key={index} className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                      <TrendingUp className="w-4 h-4 text-indigo-600 mr-3" />
                      <span className="text-gray-700">{path}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No specific career paths mentioned</span>
                )}
              </div>
            </div>

            {/* Job Analytics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Total Views
                  </span>
                  <span className="font-semibold text-gray-900">{job.numViews || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <MousePointer className="w-4 h-4 mr-2" />
                    Apply Clicks
                  </span>
                  <span className="font-semibold text-blue-600">{job.numClicks || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Click Rate</span>
                  <span className="font-semibold text-gray-900">
                    {job.numViews > 0 ? `${((job.numClicks || 0) / job.numViews * 100).toFixed(1)}%` : '0%'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-semibold text-gray-900">{formatDate(job.dateofUpload)}</span>
                </div>
                {job.expiryDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Expires</span>
                    <span className="font-semibold text-red-600">{formatDate(job.expiryDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={showApplicationModal}
        onClose={() => {
          setShowApplicationModal(false);
          setSelectedApplication(null);
        }}
        onStatusUpdate={(applicationId, status) => {
          // Handle status update from modal
          const formData = new FormData();
          formData.append('applicationId', applicationId);
          formData.append('status', status);
          // You would call the updateApplicationStatus action here
          handleStatusUpdate();
        }}
      />
    </div>
  );
}