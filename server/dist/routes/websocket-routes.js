"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const websocket_controller_1 = require("../controllers/websocket-controller");
const auth_middleware_1 = require("../middleware/auth-middleware");
const router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_middleware_1.authenticate);
// Subscription routes
router.post("/subscribe/donations", websocket_controller_1.WebSocketController.subscribeToDonationUpdates);
router.post("/subscribe/ngo-donations", websocket_controller_1.WebSocketController.subscribeToNgoDonationUpdates);
router.post("/subscribe/notifications", websocket_controller_1.WebSocketController.subscribeToNotifications);
router.post("/subscribe/messages", websocket_controller_1.WebSocketController.subscribeToMessages);
// Unsubscription routes
router.post("/unsubscribe", websocket_controller_1.WebSocketController.unsubscribe);
router.post("/unsubscribe-all", websocket_controller_1.WebSocketController.unsubscribeAll);
exports.default = router;
