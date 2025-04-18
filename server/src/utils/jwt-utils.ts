import jwt from "jsonwebtoken"
import type { TokenData } from "../types"

export const generateAccessToken = (payload: TokenData): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "1h" })
}

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" })
}

export const verifyAccessToken = (token: string): TokenData => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as TokenData
}

export const verifyRefreshToken = (token: string): { id: string } => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string }
}
