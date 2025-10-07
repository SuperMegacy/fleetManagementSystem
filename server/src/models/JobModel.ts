import { create } from 'domain';
import { ScheduledJob, CreateJobRequest } from '../types/fleets';
import { clear } from 'console';

// in-memo storage - we'll repalce with a database later
let jobs: ScheduledJob[] = [];
let nextId = 1;

export const JobModel = {
    // Create a new job
    async create(jobData: CreateJobRequest): Promise<ScheduledJob> {
        const newJob: ScheduledJob = {
            id: (nextId++).toString(),
            ...jobData,
            status: 'scheduled',
            assignedDriver: 'Not Assigned', // Dafault value
            assignedVehicle: 'Not Assigned',
            pickedDate: '',
            dropOffLocations: ''
        };

        jobs.push(newJob);
        return newJob;
    },

    // Find jobs by date
    async findByDate(date: string): Promise<ScheduledJob[]> {
        return jobs.filter(job => job.pickedDate === date);
    },

    // Get all jobs (for debugging)
    async findAll(): Promise<ScheduledJob[]> {
        return jobs;
    },

    // Clear all jobs (for testing)
    async clear(): Promise<void> {
        jobs = [];
        nextId = 1;
    }
};