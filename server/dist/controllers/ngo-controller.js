"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgoController = void 0;
const ngo_service_1 = require("../services/ngo-service");
const error_handler_1 = require("../utils/error-handler");
class NgoController {
    static async getProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const profile = await ngo_service_1.NgoService.getNgoProfile(userId);
            res.status(200).json(profile);
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
    static async updateProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const updateData = req.body;
            const updatedProfile = await ngo_service_1.NgoService.updateNgoProfile(userId, updateData);
            res.status(200).json(updatedProfile);
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
    static async getAvailableDonations(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const donations = await ngo_service_1.NgoService.getAvailableDonations(userId);
            res.status(200).json(donations);
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
    static async acceptDonation(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const { id } = req.params;
            const donation = await ngo_service_1.NgoService.acceptDonation(userId, id);
            res.status(200).json(donation);
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
    static async getAcceptedDonations(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const donations = await ngo_service_1.NgoService.getAcceptedDonations(userId);
            res.status(200).json(donations);
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
    static async submitFeedback(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const { id } = req.params;
            const feedbackData = req.body;
            const feedback = await ngo_service_1.NgoService.submitFeedback(userId, id, feedbackData);
            res.status(201).json(feedback);
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
    static async getNotifications(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const notifications = await ngo_service_1.NgoService.getNotifications(userId);
            res.status(200).json(notifications);
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
    static async markNotificationAsSeen(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const { id } = req.params;
            const result = await ngo_service_1.NgoService.markNotificationAsSeen(userId, id);
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
}
exports.NgoController = NgoController;
