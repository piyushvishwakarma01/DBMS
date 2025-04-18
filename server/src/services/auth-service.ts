import bcrypt from "bcryptjs"
import { supabase } from "../config/database"
import { AppError } from "../utils/error-handler"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt-utils"
import type { User, RegisterData, AuthResponse, RefreshTokenResponse } from "../types"
import jwt from "jsonwebtoken"

interface LoginData {
  email: string
  password: string
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { email, password, name, role, additionalData } = data

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", email).single()

    if (existingUser) {
      throw new AppError("User with this email already exists", 409)
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Start a transaction
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: passwordHash,
        name,
        role,
      })
      .select()
      .single()

    if (userError || !user) {
      throw new AppError("Failed to create user", 500)
    }

    // Create role-specific data
    let roleDataError
    switch (role) {
      case "donor":
        const { error: donorError } = await supabase.from("donors").insert({
          user_id: user.id,
          ...additionalData
        })
        roleDataError = donorError
        break
      case "ngo":
        const { error: ngoError } = await supabase.from("ngos").insert({
          user_id: user.id,
          ...additionalData
        })
        roleDataError = ngoError
        break
      case "volunteer":
        const { error: volunteerError } = await supabase.from("volunteers").insert({
          user_id: user.id,
          ...additionalData
        })
        roleDataError = volunteerError
        break
    }

    if (roleDataError) {
      // Rollback by deleting the user
      await supabase.from("users").delete().eq("id", user.id)
      throw new AppError("Failed to create user profile", 500)
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    const refreshToken = generateRefreshToken(user.id)

    // Create user session
    await supabase.from("user_sessions").insert({
      user_id: user.id,
      ip_address: "127.0.0.1", // This would be dynamic in a real app
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      accessToken,
      refreshToken,
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const { email, password } = data

    // Find user by email
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      throw new AppError("Invalid credentials", 401)
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401)
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    const refreshToken = generateRefreshToken(user.id)

    // Create user session
    await supabase.from("user_sessions").insert({
      user_id: user.id,
      ip_address: "127.0.0.1", // This would be dynamic in a real app
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      accessToken,
      refreshToken,
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const decoded = verifyRefreshToken(refreshToken)

      // Find user
      const { data: user, error } = await supabase.from("users").select("*").eq("id", decoded.id).single()

      if (error || !user) {
        throw new AppError("Invalid refresh token", 401)
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      })

      return {
        accessToken,
      }
    } catch (error) {
      throw new AppError("Invalid refresh token", 401)
    }
  },

  logout: async (userId: string): Promise<boolean> => {
    // Update user session
    const { error } = await supabase
      .from("user_sessions")
      .update({ logout_time: new Date() })
      .eq("user_id", userId)
      .is("logout_time", null)

    if (error) {
      throw new AppError("Failed to logout", 500)
    }

    return true
  },

  getCurrentUser: async (userId: string): Promise<User & { profile?: any }> => {
    // Find user
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, role, created_at, updated_at")
      .eq("id", userId)
      .single()

    if (error || !user) {
      throw new AppError("User not found", 404)
    }

    // Get profile data based on role
    let profileData = null

    if (user.role === "donor") {
      const { data } = await supabase.from("donors").select("*").eq("user_id", userId).single()
      profileData = data
    } else if (user.role === "ngo") {
      const { data } = await supabase.from("ngos").select("*").eq("user_id", userId).single()
      profileData = data
    } else if (user.role === "volunteer") {
      const { data } = await supabase.from("volunteers").select("*").eq("user_id", userId).single()
      profileData = data
    }

    return {
      ...user,
      profile: profileData,
    }
  },

  private static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  },

  private static async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  },

  private static generateToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    )
  },
}
