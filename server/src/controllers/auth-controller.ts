import { Request, Response } from "express"
import { AuthService } from "../services/auth-service"
import { AppError } from "../utils/error-handler"

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, role, additionalData } = req.body

      if (!email || !password || !name || !role || !additionalData) {
        throw new AppError("Missing required fields", 400)
      }

      const result = await AuthService.register({
        email,
        password,
        name,
        role,
        additionalData
      })

      res.status(201).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        throw new AppError("Missing required fields", 400)
      }

      const result = await AuthService.login({
        email,
        password
      })

      res.status(200).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        throw new AppError("Refresh token is required", 400)
      }

      const result = await AuthService.refreshToken(refreshToken)

      res.status(200).json({
        status: "success",
        data: result,
      })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      if (!userId) {
        throw new AppError("User ID not found", 400)
      }

      await AuthService.logout(userId)

      res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }

  static async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      if (!userId) {
        throw new AppError("User ID not found", 400)
      }

      const user = await AuthService.getCurrentUser(userId)

      res.status(200).json({
        status: "success",
        data: user,
      })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Internal server error" })
      }
    }
  }
}
