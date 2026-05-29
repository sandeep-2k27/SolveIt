import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password")
            .sort({ karma: -1 });

        res.status(200).json(users);

    } catch (error) {

        console.log("Get users error:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};