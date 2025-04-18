import type { Request, Response, NextFunction } from "express";
type Role = "admin" | "donor" | "ngo" | "volunteer";
export declare const roleMiddleware: (allowedRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => void;
export {};
