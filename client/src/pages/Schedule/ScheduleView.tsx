import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { DailySchedule } from '../../types/fleet';
import { fleetService } from '../../services/fleetService';

const ScheduleView: React.FC = () => {
  const [schedule, setSchedule] = useState<DailySchedule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

 const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dailySchedule = await fleetService.getDailySchedule(selectedDate);
      setSchedule(dailySchedule);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const getStatusColor = (status: string = 'SCHEDULED') => {
    const colors = {
      SCHEDULED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading && !schedule) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Schedule</h1>
          <p className="text-lg text-gray-600 mt-1">View and manage scheduled jobs</p>
        </div>
        <Link to="/jobs" className="btn-primary whitespace-nowrap">
          + Add New Job
        </Link>
      </div>

      {/* Date Selector */}
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <label htmlFor="schedule-date" className="form-label whitespace-nowrap">
            View schedule for:
          </label>
          <input
            type="date"
            id="schedule-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input max-w-[200px]"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card border-l-4 border-red-500 bg-red-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-800 font-medium">Error loading schedule</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchSchedule}
              className="btn-secondary text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Schedule Content */}
      {schedule && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Jobs for {new Date(schedule.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h2>

          {schedule.jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs scheduled
              </h3>
              <p className="text-gray-600 mb-6">
                There are no jobs scheduled for this date.
              </p>
              <Link to="/jobs" className="btn-primary">
                Schedule Your First Job
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {schedule.jobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                      <span className="text-gray-600 font-medium">Pickup:</span>
                      <span className="text-gray-900 text-right">{job.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Drop-off:</span>
                      <span className="text-gray-900 text-right">{job.dropOffLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Driver:</span>
                      <span className="text-gray-900">{job.driver?.name || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Vehicle:</span>
                      <span className="text-gray-900">
                        {job.vehicle ? `${job.vehicle.make} ${job.vehicle.model} (${job.vehicle.plate})` : 'Not assigned'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleView;