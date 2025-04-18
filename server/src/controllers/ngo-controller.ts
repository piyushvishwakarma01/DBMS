import { Request, Response } from "express"
import { NgoService } from "../services/ngo-service"
import { AppError } from "../utils/error-handler"

export class NgoController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const profile = await NgoService.getNgoProfile(userId)
      res.status(200).json(profile)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const updateData = req.body
      const updatedProfile = await NgoService.updateNgoProfile(userId, updateData)
      res.status(200).json(updatedProfile)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async getAvailableDonations(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const donations = await NgoService.getAvailableDonations(userId)
      res.status(200).json(donations)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async acceptDonation(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const { id } = req.params
      const donation = await NgoService.acceptDonation(userId, id)
      res.status(200).json(donation)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async getAcceptedDonations(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const donations = await NgoService.getAcceptedDonations(userId)
      res.status(200).json(donations)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async submitFeedback(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const { id } = req.params
      const feedbackData = req.body
      const feedback = await NgoService.submitFeedback(userId, id, feedbackData)
      res.status(201).json(feedback)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const notifications = await NgoService.getNotifications(userId)
      res.status(200).json(notifications)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async markNotificationAsSeen(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const { id } = req.params
      const result = await NgoService.markNotificationAsSeen(userId, id)
      res.status(200).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }
} 