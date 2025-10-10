import { Router } from 'express';
import { jobController } from '../controllers/jobController';

const router = Router();

// Job routes
router.get('/', jobController.getJobsByDate);
router.post('/', jobController.createJob);
router.get('/all', jobController.getAllJobs);
router.get('/:jobId', jobController.getJobById);
router.patch('/:jobId/status', jobController.updateJobStatus);
router.patch('/:jobId/assign-driver', jobController.assignDriver);
router.patch('/:jobId/assign-vehicle', jobController.assignVehicle);

// Resource routes
router.get('/resource/drivers', jobController.getDrivers);
router.get('/resource/vehicles', jobController.getVehicles);
router.get('/resource/clients', jobController.getClients);

export default router;