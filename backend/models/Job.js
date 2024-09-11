import { Schema, model } from 'mongoose';

const questionSchema = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true }, // Array of strings for options
  correctOption: { type: String, required: true } // Correct option string
});

const jobSchema = new Schema({
  tokenId : {type : String, required :true},
  recruiterEmail: { type: String, required: true },
  subRecruiterEmail: { type: String, required: true },
  jobName: { type: String, required: true },
  jobQualification: { type: String, required: true },
  jobSalary: { type: String, required: true },
  jobDescription: { type: String, required: true },
  role: { type: String, required: true },
  timePeriod: { type: String, required: true },
  location: { type: String, required: true },
  skills: { type: [String], required: true },
  experience: { type: String, required: true }, // New field for experience
  benefits: { type: String, required: true }, // New field for benefits
  questions: { type: [questionSchema], required: true }, // New array of questions
  applicable: { type: Number, required: true }, // New int field for applicable value
  referral: { type: Number, required: true }, // New int field for referral value
  applyLink: { type: String, required: true }, // New field for apply link
  takenTests: { type: [String], default: [] }, // Array to store tokenIDs of users who took the test
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
});

// Adding a pre-save hook to update the `updatedAt` timestamp
jobSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Soft delete function
jobSchema.methods.softDelete = function () {
  this.deletedAt = Date.now();
  return this.save();
};

const Job = model('Job', jobSchema);

export default Job;
