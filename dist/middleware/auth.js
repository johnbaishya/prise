"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config = process.env;
const verifyToken = (req, res, next) => {
    let token;
    const authHeader = req.headers["authorization"];
    // if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // Extract the token part
    // } else {
    // Fallback to token in body or query for backward compatibility
    // token = req.body.token || req.query.token || req.headers["x-access-token"];
    // }
    if (!token) {
        res.status(403).send("A token is required for authentication");
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    }
    catch (err) {
        res.status(401).send("Invalid Token");
        return;
    }
    return next();
};
exports.default = verifyToken;
