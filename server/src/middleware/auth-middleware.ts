import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { supabase } from "../index"

interface JwtPayload {
  userId: string
  role: string
  iat: number
  exp: number
}

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: string
      }
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

    // Verify user exists in database
    const { data: user, error } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", decoded.userId)
      .single()

    if (error || !user) {
      return res.status(401).json({ message: "Invalid token" })
    }

    req.user = {
      id: user.id,
      role: user.role
    }

    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" })
    }

    next()
  }
}
