// controllers/feedbackController.js
import Feedback from '../models/Feedback.js';

const FeedbackController = {
  // Create a new feedback
  async createFeedback(req, res) {
    try {
      const { rating, feedback } = req.body;
      if (!rating || !feedback) {
        return res.status(400).json({ message: 'Rating and feedback are required.' });
      }

      const newFeedback = new Feedback({ rating, feedback });
      const savedFeedback = await newFeedback.save();
      res.status(201).json(savedFeedback);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update an existing feedback
  async updateFeedback(req, res) {
    try {
      const { rating, feedback } = req.body;
      const updatedFeedback = await Feedback.findByIdAndUpdate(
        req.params.id,
        { rating, feedback, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );

      if (!updatedFeedback) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
      res.status(200).json(updatedFeedback);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get all feedback
  async getFeedback(req, res) {
    try {
      const feedbacks = await Feedback.find();
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get feedback by ID
  async getFeedbackById(req, res) {
    try {
      const feedback = await Feedback.findById(req.params.id);
      if (!feedback) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
      res.status(200).json(feedback);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default FeedbackController;
