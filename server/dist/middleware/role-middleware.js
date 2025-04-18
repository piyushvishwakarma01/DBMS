"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const error_handler_1 = require("../utils/error-handler");
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new error_handler_1.AppError("Unauthorized - Authentication required", 401);
            }
            if (!allowedRoles.includes(req.user.role)) {
                throw new error_handler_1.AppError("Forbidden - Insufficient permissions", 403);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.roleMiddleware = roleMiddleware;
