import { Router } from "express"
import { WebSocketController } from "../controllers/websocket-controller"
import { authenticate } from "../middleware/auth-middleware"

const router = Router()

// Apply authentication middleware to all routes
router.use(authenticate)

// Subscription routes
router.post("/subscribe/donations", WebSocketController.subscribeToDonationUpdates)
router.post("/subscribe/ngo-donations", WebSocketController.subscribeToNgoDonationUpdates)
router.post("/subscribe/notifications", WebSocketController.subscribeToNotifications)
router.post("/subscribe/messages", WebSocketController.subscribeToMessages)

// Unsubscription routes
router.post("/unsubscribe", WebSocketController.unsubscribe)
router.post("/unsubscribe-all", WebSocketController.unsubscribeAll)

export default router 