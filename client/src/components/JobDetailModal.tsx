import React, { useState } from 'react';
import type { Job } from '../types/fleet';
import { useDashboard } from '../contexts/useDashboard';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onUpdate: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { triggerRefresh } = useDashboard();

  const updateJobStatus = async (newStatus: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') => {
    setLoading(true);
    setError(null);
    
    try {
      await fetch(`http://localhost:5000/api/jobs/${job.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      triggerRefresh();
      onUpdate();
    } catch (err) {
        console.error(err);
      setError('Failed to update job status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      SCHEDULED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
            <p className="text-gray-600 mt-1">Complete job information and management</p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Job Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Client</label>
                  <p className="text-gray-900 font-medium">{job.client.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date & Time</label>
                  <p className="text-gray-900">
                    {formatDate(job.pickupDate)} at {job.pickupTime}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
                    {job.status.replace('_', ' ').toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Locations</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Pickup Location</label>
                  <p className="text-gray-900">{job.pickupLocation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Drop-off Location</label>
                  <p className="text-gray-900">{job.dropOffLocation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Driver</label>
                  <p className="text-gray-900">
                    {job.driver ? (
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{job.driver.name}</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">Not assigned</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vehicle</label>
                  <p className="text-gray-900">
                    {job.vehicle ? (
                      `${job.vehicle.make} ${job.vehicle.model} (${job.vehicle.plate})`
                    ) : (
                      <span className="text-gray-500">Not assigned</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{formatDate(job.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">{formatDate(job.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => updateJobStatus(status)}
                  disabled={loading || job.status === status}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    job.status === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {status.replace('_', ' ').toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Navigate to full schedule view
                window.location.href = `/schedule?date=${job.pickupDate}`;
              }}
              className="btn-primary"
            >
              View in Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;