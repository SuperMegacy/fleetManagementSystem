import React, { useState } from 'react';
import type { CreateJobRequest } from '../../types/fleet';
import { fleetService } from '../../services/fleetService';

interface JobFormProps {
  onJobCreated: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ onJobCreated }) => {
  const [formData, setFormData] = useState<CreateJobRequest>({
    clientName: '',
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    dropOffLocation: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleInputChange = (field: keyof CreateJobRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fleetService.createJob(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        clientName: '',
        pickupDate: '',
        pickupTime: '',
        pickupLocation: '',
        dropOffLocation: ''
      });

      onJobCreated();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.clientName && 
                     formData.pickupDate && 
                     formData.pickupTime && 
                     formData.pickupLocation && 
                     formData.dropOffLocation;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule New Job</h2>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-500">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-green-500">✅</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <p className="text-sm text-green-700 mt-1">Job scheduled successfully!</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Name */}
        <div className="form-group">
          <label htmlFor="clientName" className="form-label">
            Client Name *
          </label>
          <input
            type="text"
            id="clientName"
            value={formData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            placeholder="Enter client name"
            className="input"
            required
          />
        </div>

        {/* Date and Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="pickupDate" className="form-label">
              Pickup Date *
            </label>
            <input
              type="date"
              id="pickupDate"
              value={formData.pickupDate}
              onChange={(e) => handleInputChange('pickupDate', e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pickupTime" className="form-label">
              Pickup Time *
            </label>
            <input
              type="time"
              id="pickupTime"
              value={formData.pickupTime}
              onChange={(e) => handleInputChange('pickupTime', e.target.value)}
              className="input"
              required
            />
          </div>
        </div>

        {/* Pickup Location */}
        <div className="form-group">
          <label htmlFor="pickupLocation" className="form-label">
            Pickup Location *
          </label>
          <input
            type="text"
            id="pickupLocation"
            value={formData.pickupLocation}
            onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
            placeholder="Enter pickup address"
            className="input"
            required
          />
        </div>

        {/* Drop-off Location */}
        <div className="form-group">
          <label htmlFor="dropOffLocation" className="form-label">
            Drop-off Location *
          </label>
          <input
            type="text"
            id="dropOffLocation"
            value={formData.dropOffLocation}
            onChange={(e) => handleInputChange('dropOffLocation', e.target.value)}
            placeholder="Enter drop-off address"
            className="input"
            required
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={!isFormValid || loading}
          className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Scheduling...</span>
            </div>
          ) : (
            'Schedule Job'
          )}
        </button>
      </form>
    </div>
  );
};

export default JobForm;