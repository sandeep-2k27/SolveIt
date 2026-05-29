const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// ===============================
// 1. GET ALL USERS (Leaderboard)
// ===============================
router.get("/", async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ karma: -1 });

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ===============================
// 2. GET CURRENT USER
// ===============================
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// =====================================
// 3. GIVE KARMA TO USER (ADMIN ONLY)
// =====================================
router.put("/:id/karma", auth, async (req, res) => {
    try {

        const admin = await User.findById(req.user.id);

        // ❌ FIX: if isAdmin not in schema, this will always fail
        // So temporarily treat first user or manual admin flag
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can update karma"
            });
        }

        const { points } = req.body;

        const karmaPoints = Number(points);

        if (!karmaPoints || isNaN(karmaPoints)) {
            return res.status(400).json({
                message: "Valid points required"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.karma += karmaPoints;

        await user.save();

        res.json({
            message: "Karma updated successfully",
            user
        });

    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});

module.exports = router;