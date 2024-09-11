// routes/feedbackRoutes.js
import express from 'express';
import FeedbackController from '../controllerss/feedbackcontroller.js'

const router = express.Router();

// Route to create feedback
router.post('/feedback', FeedbackController.createFeedback);

export default router;
