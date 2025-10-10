import React from 'react';
import JobForm from '../Schedule/JobForm';

const JobsPage: React.FC = () => {
  const handleJobCreated = () => {
    // We can add additional logic here if needed
    console.log('Job created successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Jobs</h1>
        <p className="text-lg text-gray-600">
          Create and manage scheduled jobs for your fleet
        </p>
      </div>

      {/* Job Form */}
      <div className="max-w-2xl mx-auto">
        <JobForm onJobCreated={handleJobCreated} />
      </div>

      {/* Additional Information */}
      <div className="max-w-2xl mx-auto">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-blue-500 text-lg">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-blue-800 font-medium">Tips for scheduling jobs</h3>
              <ul className="text-blue-700 text-sm mt-2 space-y-1">
                <li>• Double-check pickup and drop-off locations</li>
                <li>• Ensure the date and time are accurate</li>
                <li>• Assign drivers and vehicles after creating the job</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;