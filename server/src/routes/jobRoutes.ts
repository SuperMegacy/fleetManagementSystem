import { Router  } from "express";
import { jobController } from "../controllers/jobController";

const router = Router();

// Get /api/jobs?date=2023-10-15
router.get('/', jobController.getJobsByDate);

// POST /api/jobs
router.post('/', jobController.createJob);

// GET /api/jobs/all (for debugging)
router.get('/all', jobController.getAllJobs);

export default router;