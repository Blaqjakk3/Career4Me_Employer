'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from "./_layout";
import getMyJobs from '../actions/getmyjobs';
import getTalents from '../actions/getTalents';
import { 
  Eye, 
  MousePointer, 
  BarChart3, 
  Calendar,
  Briefcase,
  Target,
  Activity,
  PieChart,
  Users
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from 'recharts';

const Analytics = () => {
  const [jobs, setJobs] = useState([]);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, talentsData] = await Promise.all([
          getMyJobs(),
          getTalents()
        ]);
        
        console.log('Jobs data:', jobsData); // Debug log
        console.log('Talents data:', talentsData); // Debug log
        
        setJobs(jobsData);
        setTalents(talentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate KPIs
  const totalJobs = jobs.length;
  const totalViews = jobs.reduce((sum, job) => sum + (job.numViews || 0), 0);
  const totalClicks = jobs.reduce((sum, job) => sum + (job.numClicks || 0), 0);
  const averageClickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;
  
  const currentDate = new Date();
  const averageDaysOld = jobs.length > 0 
    ? Math.round(jobs.reduce((sum, job) => {
        const uploadDate = new Date(job.dateofUpload);
        const daysDiff = (currentDate - uploadDate) / (1000 * 60 * 60 * 24);
        return sum + daysDiff;
      }, 0) / jobs.length)
    : 0;

  // Get career stage data using Appwrite Document ID
  const getCareerStageData = () => {
    const careerStageMap = {};
    
    jobs.forEach(job => {
      // Check if job has viewers and it's an array
      if (job.viewers && Array.isArray(job.viewers) && job.viewers.length > 0) {
        job.viewers.forEach(viewerId => {
          // Use Appwrite's Document ID ($id) to find the talent
          const talent = talents.find(t => t.$id === viewerId);
          
          if (talent && talent.careerStage) {
            const stage = talent.careerStage;
            const stageLabel = stage === 'entry' ? 'Pathfinder' :
                             stage === 'mid' ? 'Trailblazer' :
                             stage === 'senior' ? 'Horizon Changer' : 
                             stage; // Handle any other career stages
            
            if (!careerStageMap[stageLabel]) {
              careerStageMap[stageLabel] = 0;
            }
            careerStageMap[stageLabel]++;
          }
        });
      }
    });

    const total = Object.values(careerStageMap).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(careerStageMap).map(([stage, count]) => ({
      name: stage,
      value: count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0
    }));
  };

  // Alternative approach if viewers is not structured as expected
  const getAlternativeCareerStageData = () => {
    // If you have career stage info directly on jobs or need to derive it differently
    const careerStageMap = {};
    
    // Example: If career stage is associated with job type or derived from other fields
    jobs.forEach(job => {
      // You might need to adjust this based on your actual data structure
      const stage = job.targetCareerStage || job.level || 'entry'; // Adjust field name as needed
      const stageLabel = stage === 'entry' ? 'Pathfinder Jobs' :
                        stage === 'mid' ? 'Trailblazer Jobs' :
                        stage === 'senior' ? 'Horizon Changer Jobs' : 
                        `${stage} Jobs`;
      
      if (!careerStageMap[stageLabel]) {
        careerStageMap[stageLabel] = 0;
      }
      careerStageMap[stageLabel]++;
    });

    const total = Object.values(careerStageMap).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(careerStageMap).map(([stage, count]) => ({
      name: stage,
      value: count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0
    }));
  };

  // Prepare data for View-to-Click Ratio by Job Type
  const getJobTypeRatioData = () => {
    const jobTypeStats = {};
    
    jobs.forEach(job => {
      const type = job.jobtype || 'Unknown';
      if (!jobTypeStats[type]) {
        jobTypeStats[type] = { views: 0, clicks: 0, count: 0 };
      }
      
      jobTypeStats[type].views += job.numViews || 0;
      jobTypeStats[type].clicks += job.numClicks || 0;
      jobTypeStats[type].count += 1;
    });

    return Object.entries(jobTypeStats).map(([type, stats]) => ({
      jobType: type.charAt(0).toUpperCase() + type.slice(1),
      ratio: stats.views > 0 ? (stats.clicks / stats.views).toFixed(2) : 0,
      views: stats.views,
      clicks: stats.clicks,
      count: stats.count
    }));
  };

  const careerStageData = getCareerStageData();
  const jobTypeRatioData = getJobTypeRatioData();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-12">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Analytics Dashboard</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Job Performance
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Analytics
                  </span>
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                  Track your job posting performance with detailed insights and visual metrics
                </p>
              </div>
            </div>
          </div>

          {/* Remove debug section and go directly to KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{totalJobs}</div>
                  <div className="text-sm text-gray-500">Total Jobs</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">Posted Jobs</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Views</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">All Jobs Combined</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MousePointer className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Clicks</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">Application Clicks</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{averageClickRate}%</div>
                  <div className="text-sm text-gray-500">Click Rate</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">Views to Clicks</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{averageDaysOld}</div>
                  <div className="text-sm text-gray-500">Avg Days</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">Since Upload</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Jobs by Career Stage - Pie Chart */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center mb-6">
                <PieChart className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Jobs by Career Stage</h3>
              </div>
              
              {careerStageData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={careerStageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {careerStageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center text-gray-500">
                  <Users className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-center">
                    No career stage data available
                    <br />
                    <span className="text-sm">Check if jobs have viewers and talents have career stages</span>
                  </p>
                </div>
              )}
            </div>

            {/* View-to-Click Ratio by Job Type */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Target className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">View-to-Click Ratio by Job Type</h3>
              </div>
              
              {jobTypeRatioData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobTypeRatioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="jobType" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'ratio' ? `${value}` : value,
                          name === 'ratio' ? 'Click Ratio' : name
                        ]}
                      />
                      <Bar dataKey="ratio" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No job type data available
                </div>
              )}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
            <div className="flex items-center mb-6">
              <Activity className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Performance Summary</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {totalJobs > 0 ? Math.round(totalViews / totalJobs) : 0}
                </div>
                <div className="text-sm text-gray-600">Average Views per Job</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {totalJobs > 0 ? Math.round(totalClicks / totalJobs) : 0}
                </div>
                <div className="text-sm text-gray-600">Average Clicks per Job</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {totalViews > totalClicks ? `${((totalViews - totalClicks) / totalViews * 100).toFixed(1)}%` : '0%'}
                </div>
                <div className="text-sm text-gray-600">View-Only Rate</div>
              </div>
            </div>
          </div>

          {/* Job Performance Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Individual Job Performance</h2>
              <p className="text-gray-600 mt-2">Detailed metrics for each job posting</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.length > 0 ? (
                    jobs.map((job) => {
                      const views = job.numViews || 0;
                      const clicks = job.numClicks || 0;
                      const clickRate = views > 0 ? ((clicks / views) * 100).toFixed(1) : 0;
                      const daysActive = Math.floor((currentDate - new Date(job.dateofUpload)) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <tr key={job.$id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{job.name}</div>
                            <div className="text-sm text-gray-500">{job.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{views}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{clicks}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              clickRate >= 5 ? 'bg-green-100 text-green-800' :
                              clickRate >= 2 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {clickRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{daysActive}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {job.jobtype}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No job postings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;