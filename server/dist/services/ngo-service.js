"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgoService = void 0;
const database_1 = require("../config/database");
const error_handler_1 = require("../utils/error-handler");
class NgoService {
    static async getNgoProfile(userId) {
        const { data: ngo, error } = await database_1.supabase
            .from("ngos")
            .select(`
        *,
        user:users (
          id,
          email,
          name,
          role
        )
      `)
            .eq("user_id", userId)
            .single();
        if (error) {
            throw new error_handler_1.AppError("Failed to fetch NGO profile", 500);
        }
        if (!ngo) {
            throw new error_handler_1.AppError("NGO profile not found", 404);
        }
        return ngo;
    }
    static async updateNgoProfile(userId, updateData) {
        const { data: ngo, error } = await database_1.supabase
            .from("ngos")
            .update(updateData)
            .eq("user_id", userId)
            .select()
            .single();
        if (error) {
            throw new error_handler_1.AppError("Failed to update NGO profile", 500);
        }
        return ngo;
    }
    static async getAvailableDonations(userId) {
        // Get NGO ID
        const { data: ngo } = await database_1.supabase
            .from("ngos")
            .select("id")
            .eq("user_id", userId)
            .single();
        if (!ngo) {
            throw new error_handler_1.AppError("NGO profile not found", 404);
        }
        // Get available donations
        const { data: donations, error } = await database_1.supabase
            .from("food_donations")
            .select(`
        *,
        donor:donors (
          id,
          business_name,
          address,
          phone
        ),
        food_items (
          id,
          name,
          quantity,
          unit,
          category,
          allergens
        )
      `)
            .eq("status", "pending")
            .order("created_at", { ascending: false });
        if (error) {
            throw new error_handler_1.AppError("Failed to fetch available donations", 500);
        }
        return donations || [];
    }
    static async acceptDonation(userId, donationId) {
        // Get NGO ID
        const { data: ngo } = await database_1.supabase
            .from("ngos")
            .select("id")
            .eq("user_id", userId)
            .single();
        if (!ngo) {
            throw new error_handler_1.AppError("NGO profile not found", 404);
        }
        // Check if donation exists and is available
        const { data: donation, error: checkError } = await database_1.supabase
            .from("food_donations")
            .select("*")
            .eq("id", donationId)
            .eq("status", "pending")
            .single();
        if (checkError || !donation) {
            throw new error_handler_1.AppError("Donation not found or not available", 404);
        }
        // Update donation status
        const { data: updatedDonation, error } = await database_1.supabase
            .from("food_donations")
            .update({
            ngo_id: ngo.id,
            status: "accepted"
        })
            .eq("id", donationId)
            .select()
            .single();
        if (error) {
            throw new error_handler_1.AppError("Failed to accept donation", 500);
        }
        // Create notification for donor
        await database_1.supabase.from("notifications").insert({
            user_id: donation.donor_id,
            message: `Your donation has been accepted by ${ngo.name}`,
            link: `/donor/donations/${donationId}`
        });
        return updatedDonation;
    }
    static async getAcceptedDonations(userId) {
        // Get NGO ID
        const { data: ngo } = await database_1.supabase
            .from("ngos")
            .select("id")
            .eq("user_id", userId)
            .single();
        if (!ngo) {
            throw new error_handler_1.AppError("NGO profile not found", 404);
        }
        // Get accepted donations
        const { data: donations, error } = await database_1.supabase
            .from("food_donations")
            .select(`
        *,
        donor:donors (
          id,
          business_name,
          address,
          phone
        ),
        food_items (
          id,
          name,
          quantity,
          unit,
          category,
          allergens
        ),
        pickup_schedule (
          id,
          scheduled_time,
          actual_time,
          status,
          notes
        )
      `)
            .eq("ngo_id", ngo.id)
            .in("status", ["accepted", "in_transit", "delivered"])
            .order("created_at", { ascending: false });
        if (error) {
            throw new error_handler_1.AppError("Failed to fetch accepted donations", 500);
        }
        return donations || [];
    }
    static async submitFeedback(userId, donationId, feedbackData) {
        // Get NGO ID
        const { data: ngo } = await database_1.supabase
            .from("ngos")
            .select("id")
            .eq("user_id", userId)
            .single();
        if (!ngo) {
            throw new error_handler_1.AppError("NGO profile not found", 404);
        }
        // Check if donation exists and belongs to NGO
        const { data: donation, error: checkError } = await database_1.supabase
            .from("food_donations")
            .select("*")
            .eq("id", donationId)
            .eq("ngo_id", ngo.id)
            .eq("status", "delivered")
            .single();
        if (checkError || !donation) {
            throw new error_handler_1.AppError("Donation not found or not delivered", 404);
        }
        // Submit feedback
        const { data, error } = await database_1.supabase
            .from("feedback")
            .insert(Object.assign({ donation_id: donationId, ngo_id: ngo.id }, feedbackData))
            .select()
            .single();
        if (error) {
            throw new error_handler_1.AppError("Failed to submit feedback", 500);
        }
        return data;
    }
    static async getNotifications(userId) {
        const { data: notifications, error } = await database_1.supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });
        if (error) {
            throw new error_handler_1.AppError("Failed to fetch notifications", 500);
        }
        return notifications || [];
    }
    static async markNotificationAsSeen(userId, notificationId) {
        const { error } = await database_1.supabase
            .from("notifications")
            .update({ seen: true })
            .eq("id", notificationId)
            .eq("user_id", userId);
        if (error) {
            throw new error_handler_1.AppError("Failed to mark notification as seen", 500);
        }
        return { message: "Notification marked as seen" };
    }
}
exports.NgoService = NgoService;
