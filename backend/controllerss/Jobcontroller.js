import Job from '../models/Job.js';

const JobController = {
  // Create a new job
  async createJob(req, res) {
    try {
      const newJob = new Job(req.body);
      const savedJob = await newJob.save();
      res.status(201).json(savedJob);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update an existing job
  // Update an existing job
async  updateJob(req, res) {
  const { id } = req.params; // Get the job ID from the route parameters

  try {
    // Find the job by ID and update it with the request body
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    // If the job is not found, send a 404 response
    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Send the updated job data in the response
    res.status(200).json(updatedJob);
  } catch (error) {
    // Handle errors and send a 400 response
    res.status(400).json({ message: error.message });
  }
}
,

  // Soft delete a job
  async softDeleteJob(req, res) {
    const { id } = req.params; // Get the job ID from the route parameters
  
    try {
      // Find the job by ID
      const job = await Job.findById(id);
  
      // If the job is not found, send a 404 response
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      // Set the `deletedAt` field to the current date and time
      job.deletedAt = new Date();
      await job.save();
  
      // Send a success response
      res.status(200).json({ message: 'Job soft deleted successfully' });
    } catch (error) {
      // Handle errors and send a 400 response
      res.status(400).json({ message: error.message });
    }
  },
  // Get all jobs (excluding soft-deleted ones by default)
  async getJobs(req, res) {
    try {
      const jobs = await Job.find({ deletedAt: null });
      res.status(200).json(jobs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get jobs by tokenId
  async getJobsByTokenId(req, res) {
    try {
      const { tokenId } = req.query;
      const jobs = await Job.find({ tokenId, deletedAt: null });
      if (jobs.length === 0) {
        return res.status(404).json({ message: 'No jobs found for this tokenId' });
      }
      res.status(200).json(jobs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getJobById(req, res) {
    try {
      const jobId = req.params.id;
      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.status(200).json(job);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async searchJobs(req, res) {
    try {
      const { query, jobLevel, datePosted, location, remoteStatus } = req.body;
  
      // If no filters are selected, return all jobs.
      if (!query) {
        const allJobs = await Job.find({ deletedAt: null });
        return res.status(200).json(allJobs);
      }
  
      // Normalize query to handle case and dash variations.
      const normalizeQuery = (query) => {
        return query.toLowerCase().replace(/-/g, ' ').trim();
      };
  
      const normalizedQuery = normalizeQuery(query);
  
      // Split the query into words and filter out common terms
      const words = normalizedQuery.split(' ').filter(word =>
        !['developer', 'engineer', 'manager'].includes(word)
      );
  
      if (words.length === 0) {
        return res.status(404).json({ message: 'No relevant search terms provided' });
      }
  
      // Prepare search conditions
      const searchConditions = words.map(word => ({
        $or: [
          { jobName: { $regex: word, $options: 'i' } },
          { jobDescription: { $regex: word, $options: 'i' } },
        ]
      }));
  
      // Build filter for query
      let filter = {
        $and: [
          { deletedAt: null },
          { $or: searchConditions }
        ]
      };
  
      // Apply job level filter if selected
      if (jobLevel && jobLevel.length > 0) {
        filter.$and.push({ role: { $in: jobLevel } });
      }
  
      // Apply date filter if selected
      if (datePosted) {
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - parseInt(datePosted));
        filter.$and.push({ createdAt: { $gte: dateThreshold } });
      }
  
      // Apply location filter if selected
      if (location) {
        filter.$and.push({ location: { $regex: location, $options: 'i' } });
      }
  
      // Apply remote status filter if selected
      if (remoteStatus) {
        filter.$and.push({ location: { $regex: "remote", $options: 'i' } });
      }
  
      // Fetch filtered jobs
      const jobs = await Job.find(filter);
  
      if (jobs.length === 0) {
        return res.status(404).json({ message: 'No jobs found matching the search criteria' });
      }
  
      res.status(200).json(jobs);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  

};

export default JobController;
