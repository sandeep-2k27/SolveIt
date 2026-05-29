const router = require("express").Router();

const Comment = require("../models/Comment");

const auth =
require("../middleware/authMiddleware");


// CREATE COMMENT
router.post(
    "/create",
    auth,
    async (req, res) => {

        try {

            const {
                text,
                problemId
            } = req.body;

            // VALIDATION
            if (
                !text ||
                !problemId
            ) {

                return res.status(400).json({
                    message: "All fields are required"
                });

            }

            // EMPTY COMMENT CHECK
            if (text.trim() === "") {

                return res.status(400).json({
                    message: "Comment cannot be empty"
                });

            }

            // CREATE COMMENT
            const comment =
                await Comment.create({

                    text: text.trim(),

                    user: req.user.id,

                    problem: problemId

                });

            // POPULATE USER
            const populatedComment =
                await Comment.findById(comment._id)
                .populate(
                    "user",
                    "name email karma"
                );

            res.status(201).json(
                populatedComment
            );

        } catch (err) {

            console.log(err);

            res.status(500).json({
                message: "Server Error"
            });

        }

    }
);


// GET COMMENTS BY PROBLEM
router.get("/:problemId", async (req, res) => {

    try {

        const comments =
            await Comment.find({

                problem: req.params.problemId

            })

            .populate(
                "user",
                "name email karma"
            )

            .sort({
                createdAt: -1
            });

        res.json(comments);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

module.exports = router;