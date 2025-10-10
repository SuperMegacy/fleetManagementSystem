import type { Job, CreateJobRequest, DailySchedule } from '../types/fleet';
import { mockFleetService } from './mockFleetService';

// Use environment variable or fallback to localhost for development
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Function to check if backend is available
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend not available, using mock data:', error);
    return false;
  }
};

const realFleetService = {
  async createJob(jobData: CreateJobRequest): Promise<Job> {
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create job');
    }
    
    return await response.json();
  },

  async getJobsByDate(date: string): Promise<Job[]> {
    const response = await fetch(`${API_BASE}/jobs?date=${date}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    
    return await response.json();
  },

  async getDailySchedule(date: string): Promise<DailySchedule> {
    const jobs = await this.getJobsByDate(date);
    return {
      date,
      jobs
    };
  }
};

// Export a service that falls back to mock data if backend is unavailable
export const fleetService = {
  async createJob(jobData: CreateJobRequest): Promise<Job> {
    if (await isBackendAvailable()) {
      return realFleetService.createJob(jobData);
    } else {
      return mockFleetService.createJob(jobData);
    }
  },

  async getJobsByDate(date: string): Promise<Job[]> {
    if (await isBackendAvailable()) {
      return realFleetService.getJobsByDate(date);
    } else {
      return mockFleetService.getJobsByDate(date);
    }
  },

  async getDailySchedule(date: string): Promise<DailySchedule> {
    if (await isBackendAvailable()) {
      return realFleetService.getDailySchedule(date);
    } else {
      return mockFleetService.getDailySchedule(date);
    }
  }
};