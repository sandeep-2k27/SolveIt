const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header missing"
            });
        }

        // Expect: "Bearer token"
        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }

        const token = parts[1];

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (!verified) {
            return res.status(401).json({
                message: "Token verification failed"
            });
        }

        // important: keep user structure consistent
        req.user = {
            id: verified.id
        };

        next();

    } catch (err) {
        console.log("Auth error:", err.message);

        return res.status(401).json({
            message: "Unauthorized - Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;