"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const error_handler_1 = require("../utils/error-handler");
const jwt_utils_1 = require("../utils/jwt-utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authService = {
    register: async (data) => {
        const { email, password, name, role, additionalData } = data;
        // Check if user already exists
        const { data: existingUser } = await database_1.supabase.from("users").select("*").eq("email", email).single();
        if (existingUser) {
            throw new error_handler_1.AppError("User with this email already exists", 409);
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Start a transaction
        const { data: user, error: userError } = await database_1.supabase
            .from("users")
            .insert({
            email,
            password_hash: passwordHash,
            name,
            role,
        })
            .select()
            .single();
        if (userError || !user) {
            throw new error_handler_1.AppError("Failed to create user", 500);
        }
        // Create role-specific data
        let roleDataError;
        switch (role) {
            case "donor":
                const { error: donorError } = await database_1.supabase.from("donors").insert(Object.assign({ user_id: user.id }, additionalData));
                roleDataError = donorError;
                break;
            case "ngo":
                const { error: ngoError } = await database_1.supabase.from("ngos").insert(Object.assign({ user_id: user.id }, additionalData));
                roleDataError = ngoError;
                break;
            case "volunteer":
                const { error: volunteerError } = await database_1.supabase.from("volunteers").insert(Object.assign({ user_id: user.id }, additionalData));
                roleDataError = volunteerError;
                break;
        }
        if (roleDataError) {
            // Rollback by deleting the user
            await database_1.supabase.from("users").delete().eq("id", user.id);
            throw new error_handler_1.AppError("Failed to create user profile", 500);
        }
        // Generate tokens
        const accessToken = (0, jwt_utils_1.generateAccessToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, jwt_utils_1.generateRefreshToken)(user.id);
        // Create user session
        await database_1.supabase.from("user_sessions").insert({
            user_id: user.id,
            ip_address: "127.0.0.1", // This would be dynamic in a real app
        });
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
        };
    },
    login: async (data) => {
        const { email, password } = data;
        // Find user by email
        const { data: user, error } = await database_1.supabase.from("users").select("*").eq("email", email).single();
        if (error || !user) {
            throw new error_handler_1.AppError("Invalid credentials", 401);
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new error_handler_1.AppError("Invalid credentials", 401);
        }
        // Generate tokens
        const accessToken = (0, jwt_utils_1.generateAccessToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, jwt_utils_1.generateRefreshToken)(user.id);
        // Create user session
        await database_1.supabase.from("user_sessions").insert({
            user_id: user.id,
            ip_address: "127.0.0.1", // This would be dynamic in a real app
        });
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
        };
    },
    refreshToken: async (refreshToken) => {
        try {
            const decoded = (0, jwt_utils_1.verifyRefreshToken)(refreshToken);
            // Find user
            const { data: user, error } = await database_1.supabase.from("users").select("*").eq("id", decoded.id).single();
            if (error || !user) {
                throw new error_handler_1.AppError("Invalid refresh token", 401);
            }
            // Generate new access token
            const accessToken = (0, jwt_utils_1.generateAccessToken)({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            return {
                accessToken,
            };
        }
        catch (error) {
            throw new error_handler_1.AppError("Invalid refresh token", 401);
        }
    },
    logout: async (userId) => {
        // Update user session
        const { error } = await database_1.supabase
            .from("user_sessions")
            .update({ logout_time: new Date() })
            .eq("user_id", userId)
            .is("logout_time", null);
        if (error) {
            throw new error_handler_1.AppError("Failed to logout", 500);
        }
        return true;
    },
    getCurrentUser: async (userId) => {
        // Find user
        const { data: user, error } = await database_1.supabase
            .from("users")
            .select("id, email, name, role, created_at, updated_at")
            .eq("id", userId)
            .single();
        if (error || !user) {
            throw new error_handler_1.AppError("User not found", 404);
        }
        // Get profile data based on role
        let profileData = null;
        if (user.role === "donor") {
            const { data } = await database_1.supabase.from("donors").select("*").eq("user_id", userId).single();
            profileData = data;
        }
        else if (user.role === "ngo") {
            const { data } = await database_1.supabase.from("ngos").select("*").eq("user_id", userId).single();
            profileData = data;
        }
        else if (user.role === "volunteer") {
            const { data } = await database_1.supabase.from("volunteers").select("*").eq("user_id", userId).single();
            profileData = data;
        }
        return Object.assign(Object.assign({}, user), { profile: profileData });
    },
    static async hashPassword(password) {
        return bcryptjs_1.default.hash(password, 10);
    },
    static async comparePasswords(plainPassword, hashedPassword) {
        return bcryptjs_1.default.compare(plainPassword, hashedPassword);
    },
    static generateToken(userId, role) {
        return jsonwebtoken_1.default.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    },
};
