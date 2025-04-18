"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorController = void 0;
const donor_service_1 = require("../services/donor-service");
const error_handler_1 = require("../utils/error-handler");
class DonorController {
    static async getProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const profile = await donor_service_1.DonorService.getDonorProfile(userId);
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
            const updatedProfile = await donor_service_1.DonorService.updateDonorProfile(userId, updateData);
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
    static async createDonation(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const donationData = req.body;
            const donation = await donor_service_1.DonorService.createDonation(userId, donationData);
            res.status(201).json(donation);
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
    static async getDonations(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const donations = await donor_service_1.DonorService.getDonations(userId);
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
    static async getDonationDetails(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const { id } = req.params;
            const donation = await donor_service_1.DonorService.getDonationDetails(userId, id);
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
    static async cancelDonation(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const { id } = req.params;
            const result = await donor_service_1.DonorService.cancelDonation(userId, id);
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
exports.DonorController = DonorController;
