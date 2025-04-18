"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const donor_controller_1 = require("../controllers/donor-controller");
const auth_middleware_1 = require("../middleware/auth-middleware");
const router = (0, express_1.Router)();
// Apply authentication and authorization middleware to all routes
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)(["donor"]));
// Profile routes
router.get("/profile", donor_controller_1.DonorController.getProfile);
router.put("/profile", donor_controller_1.DonorController.updateProfile);
// Donation routes
router.post("/donations", donor_controller_1.DonorController.createDonation);
router.get("/donations", donor_controller_1.DonorController.getDonations);
router.get("/donations/:id", donor_controller_1.DonorController.getDonationDetails);
router.post("/donations/:id/cancel", donor_controller_1.DonorController.cancelDonation);
exports.default = router;
