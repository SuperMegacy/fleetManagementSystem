import React, { useState, useEffect } from "react";
import type { DailySchedule } from "../../types/fleet";
import { fleetService } from "../../services/fleetService";

const ScheduleView: React.FC = () => {
  // State to store daily schedule data
  const [schedule, setSchedule] = useState<DailySchedule | null>(null);

  // State for loading and error handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for the selected date
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0] // get YYYY-MM-DD format
  );

  // Fetch schedule when component mounts or date changes
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError(null);
        const dailySchedule = await fleetService.getDailySchedule(selectedDate);
        setSchedule(dailySchedule);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDate]);

  // Handle date change
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  // Display loading state
  if (loading) {
    return (
      <div className="schedule-container">
        <p>Loading schedule...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="schedule-container">
        <div className="error-message">Error: {error}</div>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

  // Display schedule
  return (
    <div className="schedule-container">
      <h1>Fleet Schedule</h1>

      {/* Date Selector */}
      <div className="date-selector">
        <label htmlFor="schedule-date">Select Date: </label>
        <input
          type="date"
          id="schedule-date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
        />
      </div>

      {/* Schedule Display */}
      {schedule && (
        <div className="schedule-content">
          <h2>Schedule for {schedule.date}</h2>

          {schedule.jobs.length === 0 ? (
            <p>No jobs scheduled for this date.</p>
          ) : (
            <div className="jobs-list">
              {schedule.jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <h3>{job.clientName}</h3>
                  <p>
                    <strong>Time:</strong> {job.pickupTime}
                  </p>
                  <p>
                    <strong>Pickup:</strong> {job.pickupLocation}
                  </p>
                  <p>
                    <strong>Drop-off:</strong> {job.dropOffLocation}
                  </p>
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
