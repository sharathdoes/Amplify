import Seeker from "../models/Seeker.js";
import Job from "../models/Job.js";

const SeekerController = {
    // Function to handle user sign-in or registration
    signIn: async (req, res) => {
        try {
            const { tokenID, name } = req.body;

            if (!tokenID || !name) {
                return res
                    .status(400)
                    .json({ message: "Token ID and name are required" });
            }

            let user = await Seeker.findOne({ tokenID });

            if (user) {
                // User exists
                return res.status(201).json({ message: "User already exists", user });
            }

            // Create a new seeker
            user = new Seeker({ tokenID, name });
            await user.save();

            res.status(201).json({
                user
            });
        } catch (error) {
            console.error("Error during sign-in:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Function to handle the test status update
    tookTest: async (req, res) => {
        try {
            const { jobId, tokenID } = req.body;

            // Find the job by its ID
            const job = await Job.findById(jobId);
            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }

            // Check if the user has already taken the test
            if (job.takenTests.includes(tokenID)) {
                return res.status(400).json({ message: "User has already taken the test" });
            }

            // Add the tokenID to the takenTests array
            job.takenTests.push(tokenID);
            await job.save();

            res.status(200).json({ message: "Test status updated successfully" });
        } catch (error) {
            console.error("Error during updating test status:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    // Function to check if a user has taken the test
    checkTestStatus: async (req, res) => {
        try {
            const { jobId, tokenID } = req.body;

            // Find the job by its ID
            const job = await Job.findById(jobId);
            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }

            // Check if the user has already taken the test
            const hasTakenTest = job.takenTests.includes(tokenID);
            res.status(200).json({ hasTakenTest });
        } catch (error) {
            console.error("Error during checking test status:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

export default SeekerController;
