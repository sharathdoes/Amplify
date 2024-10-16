import User from "../models/User.js";
import Seeker from "../models/Seeker.js";

const signIn = async (req, res) => {
    try {
        const { tokenId, companyName } = req.body;

        if (!tokenId || !companyName) {
            return res
                .status(400)
                .json({ message: "Token ID and company name are required" });
        }

        let user = await User.findOne({ tokenId });

        if (user) {
            // User exists
            return res.status(201).json({ message: "User already exists", user });
        }

        // Create a new user
        user = new User({ tokenId, companyName });
        await user.save();

        res.status(201).json({
            user
        });
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default signIn ;
