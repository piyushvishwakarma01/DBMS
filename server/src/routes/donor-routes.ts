import { Router } from "express"
import { DonorController } from "../controllers/donor-controller"
import { authenticate, authorize } from "../middleware/auth-middleware"

const router = Router()

// Apply authentication and authorization middleware to all routes
router.use(authenticate)
router.use(authorize(["donor"]))

// Profile routes
router.get("/profile", DonorController.getProfile)
router.put("/profile", DonorController.updateProfile)

// Donation routes
router.post("/donations", DonorController.createDonation)
router.get("/donations", DonorController.getDonations)
router.get("/donations/:id", DonorController.getDonationDetails)
router.post("/donations/:id/cancel", DonorController.cancelDonation)

export default router 