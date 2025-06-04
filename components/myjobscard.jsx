import React from "react";
import { Pencil, MapPin, Eye, Calendar, Users, Star, Zap, Target, TrendingUp } from "lucide-react";
import DeleteJobButton from "../components/DeleteJobButton";

const MyJobsCard = ({ job }) => {
  // Handle case where job is undefined or null
  if (!job) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="text-center text-gray-500">
          <p>No job data available</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return dateString.split("T")[0].split("-").reverse().join("/");
  };

  const getSeniorityColor = (level) => {
    // Use opacity variations of the main color for hierarchy
    switch(level) {
      case 'Junior': return 'bg-[#5badec]/20 text-[#5badec] border-[#5badec]/30';
      case 'Mid-Level': return 'bg-[#5badec]/30 text-[#5badec] border-[#5badec]/40';
      case 'Senior': return 'bg-[#5badec]/40 text-[#5badec] border-[#5badec]/50';
      case 'Lead': return 'bg-[#5badec]/50 text-white border-[#5badec]/60';
      case 'Manager': return 'bg-[#5badec]/60 text-white border-[#5badec]/70';
      case 'Director': return 'bg-[#5badec]/70 text-white border-[#5badec]/80';
      case 'Executive': return 'bg-[#5badec] text-white border-[#5badec]';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md overflow-hidden w-full max-w-6xl transition-all duration-200 hover:-translate-y-1">
      
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-[#5badec] rounded-lg flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {job.name || 'Untitled Job'}
                </h2>
                <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location || 'Location not specified'}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Posted {formatDate(job.dateofUpload)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeniorityColor(job.seniorityLevel)}`}>
                {job.seniorityLevel || 'Not specified'}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                {job.workenvironment || 'Not specified'}
              </span>
            </div>
          </div>
          
          {/* Views counter */}
          <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <Eye className="w-4 h-4 text-gray-600 mr-2" />
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">{job.numViews || 0}</div>
              <div className="text-xs text-gray-500">views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Skills Section */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900 flex items-center">
              <div className="w-6 h-6 bg-[#5badec] rounded flex items-center justify-center mr-2">
                <Zap className="w-3 h-3 text-white" />
              </div>
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(job.skills || []).map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#5badec]/10 text-[#5badec] px-2.5 py-1 rounded text-sm font-medium border border-[#5badec]/20"
                >
                  {skill}
                </span>
              ))}
              {(!job.skills || job.skills.length === 0) && (
                <span className="text-gray-500 text-sm">No skills specified</span>
              )}
            </div>
          </div>

          {/* Degrees Section */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900 flex items-center">
              <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center mr-2">
                <Target className="w-3 h-3 text-white" />
              </div>
              Required Degrees
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(job.requiredDegrees || []).map((degree, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-sm font-medium border border-gray-200"
                >
                  {degree}
                </span>
              ))}
              {(!job.requiredDegrees || job.requiredDegrees.length === 0) && (
                <span className="text-gray-500 text-sm">No degrees specified</span>
              )}
            </div>
          </div>

          {/* Career Paths Section */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900 flex items-center">
              <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center mr-2">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              Career Paths
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(job.relatedpaths || []).map((path, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-sm font-medium border border-gray-200"
                >
                  {path}
                </span>
              ))}
              {(!job.relatedpaths || job.relatedpaths.length === 0) && (
                <span className="text-gray-500 text-sm">No career paths specified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-end items-center">
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#5badec] rounded-lg hover:bg-[#4a9ad4] transition-colors duration-200">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Job
            </button>
            <DeleteJobButton jobId={job.$id || job.id} />
          </div>
        </div>
      </div>
    </div>
  ); 
};

export default MyJobsCard;