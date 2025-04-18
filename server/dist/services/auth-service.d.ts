import type { User, RegisterData, AuthResponse, RefreshTokenResponse } from "../types";
interface LoginData {
    email: string;
    password: string;
}
export declare const authService: {
    register: (data: RegisterData) => Promise<AuthResponse>;
    login: (data: LoginData) => Promise<AuthResponse>;
    refreshToken: (refreshToken: string) => Promise<RefreshTokenResponse>;
    logout: (userId: string) => Promise<boolean>;
    getCurrentUser: (userId: string) => Promise<User & {
        profile?: any;
    }>;
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
    generateToken(userId: string, role: string): string;
};
export {};
