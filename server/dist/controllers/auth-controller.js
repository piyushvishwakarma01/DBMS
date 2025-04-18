"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth-service");
const error_handler_1 = require("../utils/error-handler");
class AuthController {
    static async register(req, res) {
        try {
            const { email, password, name, role, additionalData } = req.body;
            if (!email || !password || !name || !role || !additionalData) {
                throw new error_handler_1.AppError("Missing required fields", 400);
            }
            const result = await auth_service_1.AuthService.register({
                email,
                password,
                name,
                role,
                additionalData
            });
            res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof error_handler_1.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new error_handler_1.AppError("Missing required fields", 400);
            }
            const result = await auth_service_1.AuthService.login({
                email,
                password
            });
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof error_handler_1.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new error_handler_1.AppError("Refresh token is required", 400);
            }
            const result = await auth_service_1.AuthService.refreshToken(refreshToken);
            res.status(200).json({
                status: "success",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof error_handler_1.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    static async logout(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("User ID not found", 400);
            }
            await auth_service_1.AuthService.logout(userId);
            res.status(200).json({
                status: "success",
                message: "Logged out successfully",
            });
        }
        catch (error) {
            if (error instanceof error_handler_1.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
    static async getCurrentUser(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("User ID not found", 400);
            }
            const user = await auth_service_1.AuthService.getCurrentUser(userId);
            res.status(200).json({
                status: "success",
                data: user,
            });
        }
        catch (error) {
            if (error instanceof error_handler_1.AppError) {
                res.status(error.statusCode).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: "Internal server error" });
            }
        }
    }
}
exports.AuthController = AuthController;
