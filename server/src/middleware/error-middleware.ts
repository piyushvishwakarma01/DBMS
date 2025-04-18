import type { Request, Response, NextFunction } from "express"
import { AppError, handleError } from "../utils/error-handler"

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  handleError(err)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    })
  }

  // For unhandled errors
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  })
}
