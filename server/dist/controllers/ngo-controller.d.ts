import { Request, Response } from "express";
export declare class NgoController {
    static getProfile(req: Request, res: Response): Promise<void>;
    static updateProfile(req: Request, res: Response): Promise<void>;
    static getAvailableDonations(req: Request, res: Response): Promise<void>;
    static acceptDonation(req: Request, res: Response): Promise<void>;
    static getAcceptedDonations(req: Request, res: Response): Promise<void>;
    static submitFeedback(req: Request, res: Response): Promise<void>;
    static getNotifications(req: Request, res: Response): Promise<void>;
    static markNotificationAsSeen(req: Request, res: Response): Promise<void>;
}
