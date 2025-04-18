import type { Feedback } from "../types";
export declare class NgoService {
    static getNgoProfile(userId: string): Promise<any>;
    static updateNgoProfile(userId: string, updateData: any): Promise<any>;
    static getAvailableDonations(userId: string): Promise<any[]>;
    static acceptDonation(userId: string, donationId: string): Promise<any>;
    static getAcceptedDonations(userId: string): Promise<any[]>;
    static submitFeedback(userId: string, donationId: string, feedbackData: Partial<Feedback>): Promise<any>;
    static getNotifications(userId: string): Promise<any[]>;
    static markNotificationAsSeen(userId: string, notificationId: string): Promise<{
        message: string;
    }>;
}
