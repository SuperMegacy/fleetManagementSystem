import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Job, DailySchedule } from '../../types/fleet';
import { fleetService } from '../../services/fleetService';
import { useDashboard } from '../../contexts/useDashboard';
import JobDetailModal from '../../components/JobDetailModal';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    jobsToday: 0,
    activeDrivers: 0,
    availableVehicles: 0,
    completedThisWeek: 0
  });
  const [todayJobs, setTodayJobs] = useState<Job[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedJob, setSelectedJob, refreshTrigger } = useDashboard();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch today's schedule
      const todaySchedule: DailySchedule = await fleetService.getDailySchedule(today);
      setTodayJobs(todaySchedule.jobs);

      // Fetch all jobs for this week to calculate stats
      const allJobs = await fleetService.getJobsByDate(today);
      
      // Calculate stats (in a real app, these would come from the backend)
      const jobsToday = todaySchedule.jobs.length;
      const activeDrivers = new Set(todaySchedule.jobs.map(job => job.driver?.id).filter(Boolean)).size;
      const availableVehicles = 8; // This would come from backend
      const completedThisWeek = todaySchedule.jobs.filter(job => job.status === 'COMPLETED').length;

      setStats({
        jobsToday,
        activeDrivers,
        availableVehicles,
        completedThisWeek
      });

      // Set recent jobs (last 3 jobs)
      setRecentJobs(todaySchedule.jobs.slice(0, 3));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, refreshTrigger]);

  const handleStatCardClick = (type: string) => {
    switch (type) {
      case 'jobsToday':
        navigate('/schedule');
        break;
      case 'activeDrivers':
        // Navigate to drivers page (to be implemented)
        break;
      case 'availableVehicles':
        // Navigate to vehicles page (to be implemented)
        break;
      case 'completedThisWeek':
        // Show completed jobs
        break;
    }
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleJobUpdate = () => {
    fetchDashboardData(); // Refresh data
  };

  const getStatusColor = (status: string) => {
    const colors = {
      SCHEDULED: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Fleet Management Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Real-time overview of your fleet operations
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card border-l-4 border-red-500 bg-red-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-800 font-medium">Error loading dashboard</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="btn-secondary text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Jobs Today', value: stats.jobsToday, icon: '📅', type: 'jobsToday' },
          { label: 'Active Drivers', value: stats.activeDrivers, icon: '👨‍💼', type: 'activeDrivers' },
          { label: 'Available Vehicles', value: stats.availableVehicles, icon: '🚚', type: 'availableVehicles' },
          { label: 'Completed This Week', value: stats.completedThisWeek, icon: '✅', type: 'completedThisWeek' },
        ].map((stat) => (
          <div 
            key={stat.label}
            onClick={() => handleStatCardClick(stat.type)}
            className="card cursor-pointer transform hover:scale-105 transition-transform duration-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/jobs" className="btn-primary">
            📝 Schedule New Job
          </Link>
          <Link to="/schedule" className="btn-secondary">
            📋 View Today's Schedule
          </Link>
          <button className="btn-secondary">
            👨‍💼 Manage Drivers
          </button>
          <button className="btn-secondary">
            🚚 Manage Vehicles
          </button>
        </div>
      </div>

      {/* Today's Jobs Preview */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Today's Jobs</h2>
          <Link to="/schedule" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        {todayJobs.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs scheduled for today</h3>
            <p className="text-gray-600 mb-4">Get started by scheduling your first job</p>
            <Link to="/jobs" className="btn-primary">
              Schedule a Job
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayJobs.slice(0, 6).map((job) => (
              <div 
                key={job.id}
                onClick={() => handleJobClick(job)}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {job.client.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                    {job.status.toLowerCase()}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Time:</span>
                    <span className="text-gray-900">{job.pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Driver:</span>
                    <span className="text-gray-900">{job.driver?.name || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Vehicle:</span>
                    <span className="text-gray-900">
                      {job.vehicle ? `${job.vehicle.make} ${job.vehicle.model}` : 'Not assigned'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdate={handleJobUpdate}
        />
      )}
    </div>
  );
};

export default Dashboard;