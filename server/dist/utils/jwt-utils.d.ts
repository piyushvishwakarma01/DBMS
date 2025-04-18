import type { TokenData } from "../types";
export declare const generateAccessToken: (payload: TokenData) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyAccessToken: (token: string) => TokenData;
export declare const verifyRefreshToken: (token: string) => {
    id: string;
};
