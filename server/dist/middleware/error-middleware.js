"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const error_handler_1 = require("../utils/error-handler");
const errorMiddleware = (err, req, res, next) => {
    (0, error_handler_1.handleError)(err);
    if (err instanceof error_handler_1.AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }
    // For unhandled errors
    return res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};
exports.errorMiddleware = errorMiddleware;
