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
    }
}