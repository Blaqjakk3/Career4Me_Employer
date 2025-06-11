import React from 'react';
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
  MousePointer
} from "lucide-react";
import Link from "next/link";
import getJobById from "../../actions/getJobById";
import deleteJobs from "../../actions/deleteJob";
import { notFound } from "next/navigation";
import DeleteJobButton from '../../../components/DeleteJobButton';

export default async function JobDetails({ searchParams }) {
  const jobId = searchParams.job ? atob(searchParams.job) : null;
  
  if (!jobId) {
    notFound();
  }

  let job;
  try {
    job = await getJobById(jobId);
  } catch (error) {
    console.error('Error fetching job:', error);
    notFound();
  }

  if (!job) {
    notFound();
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

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
    </div>
  );
}