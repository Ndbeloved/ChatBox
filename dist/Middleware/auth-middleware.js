"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
const JWTtoken_1 = require("../Utils/JWTtoken");
function isAuthenticated(req, res, next) {
    const token = req.headers["authorization"] || null;
    if (!token) {
        return res.status(403).json({ success: false, message: "provide auth token" });
    }
    const payload = (0, JWTtoken_1.verifyToken)(token);
    if (!payload)
        return res.status(400).json({ success: false, message: "User authorization failed" });
    req.user = payload.user;
    next();
}
