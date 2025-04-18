"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = "AppError";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }
    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            message: "Token expired"
        });
    }
    // Handle database errors
    if (err.name === "PostgresError") {
        return res.status(400).json({
            message: "Database error"
        });
    }
    // Default error
    return res.status(500).json({
        message: "Internal server error"
    });
};
exports.errorMiddleware = errorMiddleware;
