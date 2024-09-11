// models/Feedback.js
import { Schema, model } from 'mongoose';

const feedbackSchema = new Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Adding a pre-save hook to update the `updatedAt` timestamp
feedbackSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Feedback = model('Feedback', feedbackSchema);

export default Feedback;
