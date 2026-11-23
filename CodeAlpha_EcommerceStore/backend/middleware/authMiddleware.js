const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Please log in first." });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_only_change_me");
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) return res.status(401).json({ message: "User not found." });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired login. Please log in again." });
  }
};
