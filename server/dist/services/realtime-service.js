"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeService = void 0;
const database_1 = require("../config/database");
class RealtimeService {
    static subscribeToDonationUpdates(userId, callback) {
        const channel = database_1.supabase
            .channel(`donation_updates:${userId}`)
            .on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "food_donations",
            filter: `donor_id=eq.${userId}`
        }, callback)
            .subscribe();
        this.channels.set(`donation_updates:${userId}`, channel);
    }
    static subscribeToNgoDonationUpdates(userId, callback) {
        const channel = database_1.supabase
            .channel(`ngo_donation_updates:${userId}`)
            .on("postgres_changes", {
            event: "*",
            schema: "public",
            table: "food_donations",
            filter: `ngo_id=eq.${userId}`
        }, callback)
            .subscribe();
        this.channels.set(`ngo_donation_updates:${userId}`, channel);
    }
    static subscribeToNotifications(userId, callback) {
        const channel = database_1.supabase
            .channel(`notifications:${userId}`)
            .on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`
        }, callback)
            .subscribe();
        this.channels.set(`notifications:${userId}`, channel);
    }
    static subscribeToMessages(userId, callback) {
        const channel = database_1.supabase
            .channel(`messages:${userId}`)
            .on("postgres_changes", {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${userId}`
        }, callback)
            .subscribe();
        this.channels.set(`messages:${userId}`, channel);
    }
    static unsubscribe(userId, channelType) {
        const channelKey = `${channelType}:${userId}`;
        const channel = this.channels.get(channelKey);
        if (channel) {
            channel.unsubscribe();
            this.channels.delete(channelKey);
        }
    }
    static unsubscribeAll(userId) {
        const channelTypes = [
            "donation_updates",
            "ngo_donation_updates",
            "notifications",
            "messages"
        ];
        channelTypes.forEach(type => this.unsubscribe(userId, type));
    }
}
exports.RealtimeService = RealtimeService;
RealtimeService.channels = new Map();
