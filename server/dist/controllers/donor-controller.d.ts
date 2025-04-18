import { Request, Response } from "express";
export declare class DonorController {
    static getProfile(req: Request, res: Response): Promise<void>;
    static updateProfile(req: Request, res: Response): Promise<void>;
    static createDonation(req: Request, res: Response): Promise<void>;
    static getDonations(req: Request, res: Response): Promise<void>;
    static getDonationDetails(req: Request, res: Response): Promise<void>;
    static cancelDonation(req: Request, res: Response): Promise<void>;
}
