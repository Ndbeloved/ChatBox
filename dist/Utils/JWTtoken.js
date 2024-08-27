"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JwtSecret = process.env.JWT_SECRET || "papaya_papaya";
//signs jwt tokens
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JwtSecret, { expiresIn: '24hr' });
}
//verifies JWT tokens
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JwtSecret);
    }
    catch (error) {
        console.error("Token verification failed: ", error);
        return null;
    }
}
