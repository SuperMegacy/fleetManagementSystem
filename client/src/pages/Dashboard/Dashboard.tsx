import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Jobs Today', value: 5, icon: '📅', color: 'blue' },
    { label: 'Active Drivers', value: 3, icon: '👨‍💼', color: 'green' },
    { label: 'Available Vehicles', value: 8, icon: '🚚', color: 'purple' },
    { label: 'Completed This Week', value: 23, icon: '✅', color: 'orange' },
  ];

  const recentJobs = [
    { id: '1', clientName: 'ABC Corp', time: '09:00', status: 'in-progress' },
    { id: '2', clientName: 'XYZ Ltd', time: '10:30', status: 'scheduled' },
    { id: '3', clientName: 'Global Inc', time: '14:15', status: 'scheduled' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Fleet Management Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Overview of your fleet operations and scheduled jobs
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
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
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Today's Upcoming Jobs</h2>
          <Link to="/schedule" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        <div className="space-y-4">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-900 min-w-[60px]">
                  {job.time}
                </span>
                <span className="text-gray-700">{job.clientName}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {job.status.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;