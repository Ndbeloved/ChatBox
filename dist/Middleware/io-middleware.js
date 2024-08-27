"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.sameOrigin = void 0;
const JWTtoken_1 = require("../Utils/JWTtoken");
const cookie_1 = __importDefault(require("cookie"));
const sameOrigin = (socket, next) => {
    const origin = socket.handshake.headers.origin;
    const domain = process.env.SITE_URL;
    //check if connection url is same with site
    if (origin !== domain)
        return next(new Error('Forbidden'));
    return next();
};
exports.sameOrigin = sameOrigin;
const authenticate = (socket, next) => {
    const cookies = socket.request.headers.cookie;
    if (cookies) {
        const parsedCookie = cookie_1.default.parse(cookies);
        const authToken = parsedCookie['authToken'];
        if (authToken && (0, JWTtoken_1.verifyToken)(authToken)) {
            const payload = (0, JWTtoken_1.verifyToken)(authToken);
            socket.data.user = payload;
            return next();
        }
    }
    return next(new Error("Authentication Error"));
};
exports.authenticate = authenticate;
