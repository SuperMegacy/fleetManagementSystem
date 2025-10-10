import type { ScheduledJob, CreateJobRequest, DailySchedule } from "../types/fleet"

// this is for api base, will set ip the backenf later
const API_BASE ='http://localhost:5000/api';

export const fleetService = {
    // creat a new scheduled job
    async createJob (jobData: CreateJobRequest): Promise<ScheduledJob> {
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

        return await response.json() as ScheduledJob;
    },

    // Get all jobs for a specific date
    async getJobsByDate(date: string): Promise<ScheduledJob[]> {
        const response = await fetch(`${API_BASE}/jobs?date=${date}`);

        if (!response.ok) {
            throw new Error('Failed to fetch jobs');
        }

        return await response.json();
    },

    // Get the full daily schedule (date + jobs)
    async getDailySchedule(date: string): Promise<DailySchedule> {
        const jobs = await this.getJobsByDate(date);
        return {
            date, 
            jobs
        };
    }
};