export declare class RealtimeService {
    private static channels;
    static subscribeToDonationUpdates(userId: string, callback: (payload: any) => void): void;
    static subscribeToNgoDonationUpdates(userId: string, callback: (payload: any) => void): void;
    static subscribeToNotifications(userId: string, callback: (payload: any) => void): void;
    static subscribeToMessages(userId: string, callback: (payload: any) => void): void;
    static unsubscribe(userId: string, channelType: string): void;
    static unsubscribeAll(userId: string): void;
}
