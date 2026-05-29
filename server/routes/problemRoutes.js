const router = require("express").Router();

const Problem = require("../models/Problem");
const User = require("../models/User");

const auth = require("../middleware/authMiddleware");


// =========================
// CREATE PROBLEM
// =========================
router.post("/create", auth, async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const problem = await Problem.create({
            title,
            description,
            category,
            createdBy: req.user.id
        });

        const populatedProblem = await Problem.findById(problem._id)
            .populate("createdBy", "name email karma");

        res.status(201).json(populatedProblem);

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// =========================
// GET ALL PROBLEMS
// =========================
router.get("/", async (req, res) => {
    try {
        const problems = await Problem.find()
            .populate("createdBy", "name email karma")
            .sort({ createdAt: -1 });

        res.json(problems);

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// =========================
// GET SINGLE PROBLEM
// =========================
router.get("/:id", async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id)
            .populate("createdBy", "name email karma")
            .populate("solver", "name email karma");

        if (!problem) {
            return res.status(404).json({ message: "Problem Not Found" });
        }

        res.json(problem);

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// =========================
// UPDATE PROBLEM (ONLY OWNER)
// =========================
router.put("/:id", auth, async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: "Problem Not Found" });
        }

        if (problem.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        problem.title = title;
        problem.description = description;
        problem.category = category;

        await problem.save();

        res.json(problem);

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// =========================
// DELETE PROBLEM (ONLY OWNER)
// =========================
router.delete("/:id", auth, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: "Problem Not Found" });
        }

        if (problem.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await problem.deleteOne();

        res.json({ message: "Problem Deleted" });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// =========================
// SOLVE PROBLEM (SECURE FIX)
// ONLY OWNER CAN MARK SOLVED
// =========================
router.put("/solve/:id", auth, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: "Problem Not Found" });
        }

        // 🔐 SECURITY CHECK (MOST IMPORTANT)
        if (problem.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to mark this problem solved"
            });
        }

        if (problem.solved) {
            return res.status(400).json({
                message: "Already Solved"
            });
        }

        problem.solved = true;
        problem.solver = req.user.id;

        await problem.save();

        const solver = await User.findById(req.user.id);

        if (solver) {
            solver.karma += 10;
            await solver.save();
        }

        res.json({ message: "Problem Solved" });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;