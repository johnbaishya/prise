"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// error handler class to handle errors in the application and return appropriate status codes and messages
class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
exports.default = AppError;
