import express from 'express';
import JobController from '../controllerss/Jobcontroller.js';

const router = express.Router();

// Create a new job
router.post('/jobs', JobController.createJob);

// Update an existing job
router.post('/jobs/:id/up', JobController.updateJob);
router.get('/jobs/:id', JobController.getJobById);

// Soft delete a job
router.post('/jobs/:id/soft-delete', JobController.softDeleteJob);

// Fetch all jobs (optional: excluding soft-deleted ones)
router.get('/jobs', JobController.getJobs);
router.get('/jobsbytokenid', JobController.getJobsByTokenId);
router.post('/jobsbykeyword', JobController.searchJobs);


export default router;
