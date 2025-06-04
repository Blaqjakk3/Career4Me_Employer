import JobsLayout from './_layout'
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { Plus, Briefcase, TrendingUp, Target } from "lucide-react";
import getMyJobs from '../actions/getmyjobs';
import MyJobsCard from '../../components/myjobscard';


const Jobs = async () => {
  const jobs = await getMyJobs();  
  return (   
          <JobsLayout>
            <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-8">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <Briefcase className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Job Management Dashboard</span>
              </div>
              
              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Job Listings
                  </span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                  Manage and track your job postings with powerful analytics and career stage targeting
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center px-6 py-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
                    <div className="text-sm text-gray-500">Active Jobs</div>
                  </div>
                </div>
                
                <div className="flex items-center px-6 py-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{jobs.reduce((sum, job) => sum + (job.numViews || 0), 0)}</div>
                    <div className="text-sm text-gray-500">Total Views</div>
                  </div>
                </div>
              </div>
        </div>
        <Button asChild className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                <Link href="/jobs/post" className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" /> 
                  Post New Job
                </Link>
              </Button>

              
      </div>

      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Listings</h2>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} posted
                  </div>
                </div>
      
      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => <MyJobsCard key={job.$id} job={job}/>)
        ) : (
          <p className="text-gray-500 text-center py-8">You have no job listings</p>
        )}
      </div>
      </div>
      </div>
         </JobsLayout>

     )
}
 
export default Jobs;