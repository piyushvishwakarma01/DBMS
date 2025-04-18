import { Request, Response } from "express";
export declare class WebSocketController {
    static subscribeToDonationUpdates(req: Request, res: Response): Promise<void>;
    static subscribeToNgoDonationUpdates(req: Request, res: Response): Promise<void>;
    static subscribeToNotifications(req: Request, res: Response): Promise<void>;
    static subscribeToMessages(req: Request, res: Response): Promise<void>;
    static unsubscribe(req: Request, res: Response): Promise<void>;
    static unsubscribeAll(req: Request, res: Response): Promise<void>;
}
