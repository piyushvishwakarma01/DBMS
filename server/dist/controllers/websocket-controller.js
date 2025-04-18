"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketController = void 0;
const realtime_service_1 = require("../services/realtime-service");
const error_handler_1 = require("../utils/error-handler");
class WebSocketController {
    static async subscribeToDonationUpdates(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const { callback } = req.body;
            if (!callback) {
                throw new error_handler_1.AppError("Callback function is required", 400);
            }
            realtime_service_1.RealtimeService.subscribeToDonationUpdates(userId, callback);
            res.status(200).json({ message: "Subscribed to donation updates" });
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
    static async subscribeToNgoDonationUpdates(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const { callback } = req.body;
            if (!callback) {
                throw new error_handler_1.AppError("Callback function is required", 400);
            }
            realtime_service_1.RealtimeService.subscribeToNgoDonationUpdates(userId, callback);
            res.status(200).json({ message: "Subscribed to NGO donation updates" });
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
    static async subscribeToNotifications(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const { callback } = req.body;
            if (!callback) {
                throw new error_handler_1.AppError("Callback function is required", 400);
            }
            realtime_service_1.RealtimeService.subscribeToNotifications(userId, callback);
            res.status(200).json({ message: "Subscribed to notifications" });
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
    static async subscribeToMessages(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const { callback } = req.body;
            if (!callback) {
                throw new error_handler_1.AppError("Callback function is required", 400);
            }
            realtime_service_1.RealtimeService.subscribeToMessages(userId, callback);
            res.status(200).json({ message: "Subscribed to messages" });
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
    static async unsubscribe(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            const { channelType } = req.body;
            if (!channelType) {
                throw new error_handler_1.AppError("Channel type is required", 400);
            }
            realtime_service_1.RealtimeService.unsubscribe(userId, channelType);
            res.status(200).json({ message: "Unsubscribed successfully" });
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
    static async unsubscribeAll(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_handler_1.AppError("Unauthorized", 401);
            }
            realtime_service_1.RealtimeService.unsubscribeAll(userId);
            res.status(200).json({ message: "Unsubscribed from all channels" });
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
exports.WebSocketController = WebSocketController;
