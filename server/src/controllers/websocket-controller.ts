import { Request, Response } from "express"
import { RealtimeService } from "../services/realtime-service"
import { AppError } from "../utils/error-handler"

export class WebSocketController {
  static async subscribeToDonationUpdates(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const { callback } = req.body
      if (!callback) {
        throw new AppError("Callback function is required", 400)
      }

      RealtimeService.subscribeToDonationUpdates(userId, callback)
      res.status(200).json({ message: "Subscribed to donation updates" })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async subscribeToNgoDonationUpdates(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const { callback } = req.body
      if (!callback) {
        throw new AppError("Callback function is required", 400)
      }

      RealtimeService.subscribeToNgoDonationUpdates(userId, callback)
      res.status(200).json({ message: "Subscribed to NGO donation updates" })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async subscribeToNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const { callback } = req.body
      if (!callback) {
        throw new AppError("Callback function is required", 400)
      }

      RealtimeService.subscribeToNotifications(userId, callback)
      res.status(200).json({ message: "Subscribed to notifications" })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async subscribeToMessages(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const { callback } = req.body
      if (!callback) {
        throw new AppError("Callback function is required", 400)
      }

      RealtimeService.subscribeToMessages(userId, callback)
      res.status(200).json({ message: "Subscribed to messages" })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async unsubscribe(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const { channelType } = req.body
      if (!channelType) {
        throw new AppError("Channel type is required", 400)
      }

      RealtimeService.unsubscribe(userId, channelType)
      res.status(200).json({ message: "Unsubscribed successfully" })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async unsubscribeAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      RealtimeService.unsubscribeAll(userId)
      res.status(200).json({ message: "Unsubscribed from all channels" })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }
} 