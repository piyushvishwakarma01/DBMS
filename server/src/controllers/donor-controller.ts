import { Request, Response } from "express"
import { DonorService } from "../services/donor-service"
import { AppError } from "../utils/error-handler"

export class DonorController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const profile = await DonorService.getDonorProfile(userId)
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
      const updatedProfile = await DonorService.updateDonorProfile(userId, updateData)
      res.status(200).json(updatedProfile)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async createDonation(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const donationData = req.body
      const donation = await DonorService.createDonation(userId, donationData)
      res.status(201).json(donation)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async getDonations(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const donations = await DonorService.getDonations(userId)
      res.status(200).json(donations)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async getDonationDetails(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const { id } = req.params
      const donation = await DonorService.getDonationDetails(userId, id)
      res.status(200).json(donation)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async cancelDonation(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const { id } = req.params
      const result = await DonorService.cancelDonation(userId, id)
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