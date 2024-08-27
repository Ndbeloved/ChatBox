"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.sameOrigin = void 0;
const JWTtoken_1 = require("../Utils/JWTtoken");
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
    const { tokens } = socket.handshake.auth;
    if (tokens) {
        if (tokens && (0, JWTtoken_1.verifyToken)(tokens)) {
            const payload = (0, JWTtoken_1.verifyToken)(tokens);
            socket.data.user = payload;
            return next();
        }
    }
    return next(new Error("Authentication Error"));
};
exports.authenticate = authenticate;
