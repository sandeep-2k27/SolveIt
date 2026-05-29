const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const commentRoutes = require("./routes/commentRoutes");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)

.then(() => {
    console.log("MongoDB Connected");
})

.catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("API Running");
});

app.use("/api/auth", authRoutes);

app.use("/api/problems", problemRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running On ${PORT}`);
});