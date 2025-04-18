"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth-controller");
const auth_middleware_1 = require("../middleware/auth-middleware");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", auth_controller_1.AuthController.register);
router.post("/login", auth_controller_1.AuthController.login);
// Protected routes
router.get("/me", auth_middleware_1.authenticate, auth_controller_1.AuthController.getCurrentUser);
router.post("/logout", auth_middleware_1.authenticate, auth_controller_1.AuthController.logout);
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
exports.default = router;
