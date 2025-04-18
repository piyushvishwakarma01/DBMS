import type { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/error-handler"

type Role = "admin" | "donor" | "ngo" | "volunteer"

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError("Unauthorized - Authentication required", 401)
      }

      if (!allowedRoles.includes(req.user.role as Role)) {
        throw new AppError("Forbidden - Insufficient permissions", 403)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
