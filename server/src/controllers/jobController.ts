import { Request, Response } from "express";
import { JobModel } from "../models/JobModel";
import { CreateJobRequest } from "../types/fleets";
import { error } from "console";


export const jobController = {
    //Create a new scheduled job
    async createJob(req: Request, res: Response) {
        try {
            const jobData: CreateJobRequest = req.body;

            // Basic validation
            if (!jobData.clientName || !jobData.pickupDate) {
                return res.status(400).json({
                    error: 'Missing required fields: clientName and pickupDate are required'
                });
            }

            const newJob = await JobModel.create(jobData);
            res.status(201).json(newJob);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },



    // Get job by date
    async getJobsByDate(req: Request, res: Response) {
        try { 
            const { date } = req.query;

            if (!date || typeof date !== 'string') {
                return res.status(400).json({
                    error: 'Date parameter is required'
                });
            }

            const jobs = await JobModel.findByDate(date);
            res.json(jobs);
        } catch (error) {
            res.status(500).json({ error: 'Internal serve error'});
        }
    },

    // Get all jobs for debugging 
    async getAllJobs(req: Request, res: Response) {
        try {
            const jobs = await JobModel.findAll();
            res.json(jobs);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error'})
        }
    },

    async getJobById(req: Request, res: Response) {
        try {
            const { jobId } = req.params;
            const job = await JobModel.findById(jobId);
            if (!job) return res.status(404).json({ error: "Job not found" });
            res.json(job);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    },

        async assignDriver(req: Request, res: Response) {
            res.json({ message: "Driver assigned (mock)" });
        },

        async assignVehicle(req: Request, res: Response) {
            res.json({ message: "Vehicle assigned (mock)" });
        },

        async getDrivers(req: Request, res: Response) {
            res.json([{ id: 1, name: "John Doe" }]);
        },

        async getVehicles(req: Request, res: Response) {
            res.json([{ id: 1, type: "Truck" }]);
        },

        async getClients(req: Request, res: Response) {
            res.json([{ id: 1, name: "Acme Corp" }]);
        },


        // Add to jobController object
    async updateJobStatus(req: Request, res: Response): Promise<void | Response<any, Record<string, any>> | undefined> {
        try {
            const { jobId } = req.params;
            const { status } = req.body;

            if (!status || !['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ 
                error: 'Valid status is required: SCHEDULED, IN_PROGRESS, COMPLETED, or CANCELLED' 
            });
            }

            const job = await JobModel.findById(jobId);
            if (!job) {
            return res.status(404).json({ 
                error: 'Job not found' 
            });
            }

            const updatedJob = await JobModel.updateStatus(jobId, status);
            res.json(updatedJob);
        } catch (error) {

            console.error('Error updating job status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
}