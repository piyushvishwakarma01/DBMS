"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.donorService = void 0;
const database_1 = require("../config/database");
const error_handler_1 = require("../utils/error-handler");
exports.donorService = {
    getDonorProfile: async (userId) => {
        const { data: donor, error } = await database_1.supabase
            .from("donors")
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
            throw new error_handler_1.AppError("Failed to fetch donor profile", 500);
        }
        if (!donor) {
            throw new error_handler_1.AppError("Donor profile not found", 404);
        }
        return donor;
    },
    updateDonorProfile: async (userId, updateData) => {
        const { data: donor, error } = await database_1.supabase
            .from("donors")
            .update(updateData)
            .eq("user_id", userId)
            .select()
            .single();
        if (error) {
            throw new error_handler_1.AppError("Failed to update donor profile", 500);
        }
        return donor;
    },
    getDonorDonations: async (donorId) => {
        const { data, error } = await database_1.supabase
            .from("food_donations")
            .select("*")
            .eq("donor_id", donorId)
            .order("created_at", { ascending: false });
        if (error) {
            throw new error_handler_1.AppError("Failed to fetch donations", 500);
        }
        return data || [];
    },
    createDonation: async (donorId, donationData, foodItems) => {
        // Create the donation
        const { data: donation, error: donationError } = await database_1.supabase
            .from("food_donations")
            .insert(Object.assign({ donor_id: donorId, status: "pending" }, donationData))
            .select()
            .single();
        if (donationError || !donation) {
            throw new error_handler_1.AppError("Failed to create donation", 500);
        }
        // Add food items
        if (foodItems.length > 0) {
            const itemsWithDonationId = foodItems.map((item) => (Object.assign(Object.assign({}, item), { donation_id: donation.id })));
            const { error: itemsError } = await database_1.supabase.from("food_items").insert(itemsWithDonationId);
            if (itemsError) {
                // Rollback by deleting the donation
                await database_1.supabase.from("food_donations").delete().eq("id", donation.id);
                throw new error_handler_1.AppError("Failed to add food items", 500);
            }
        }
        return donation;
    },
    updateDonation: async (donorId, donationId, donationData) => {
        // Check if donation exists and belongs to the donor
        const { data: existingDonation, error: checkError } = await database_1.supabase
            .from("food_donations")
            .select("*")
            .eq("id", donationId)
            .eq("donor_id", donorId)
            .single();
        if (checkError || !existingDonation) {
            throw new error_handler_1.AppError("Donation not found or access denied", 404);
        }
        // Only allow updates if the donation is in pending status
        if (existingDonation.status !== "pending") {
            throw new error_handler_1.AppError("Cannot update donation that is not in pending status", 400);
        }
        // Update the donation
        const { data, error } = await database_1.supabase
            .from("food_donations")
            .update(donationData)
            .eq("id", donationId)
            .select()
            .single();
        if (error) {
            throw new error_handler_1.AppError("Failed to update donation", 500);
        }
        return data;
    },
    cancelDonation: async (donorId, donationId) => {
        // Check if donation exists and belongs to the donor
        const { data: existingDonation, error: checkError } = await database_1.supabase
            .from("food_donations")
            .select("*")
            .eq("id", donationId)
            .eq("donor_id", donorId)
            .single();
        if (checkError || !existingDonation) {
            throw new error_handler_1.AppError("Donation not found or access denied", 404);
        }
        // Only allow cancellation if the donation is not already delivered or cancelled
        if (["delivered", "cancelled"].includes(existingDonation.status)) {
            throw new error_handler_1.AppError("Cannot cancel donation that is already delivered or cancelled", 400);
        }
        // Update the donation status to cancelled
        const { data, error } = await database_1.supabase
            .from("food_donations")
            .update({ status: "cancelled" })
            .eq("id", donationId)
            .select()
            .single();
        if (error) {
            throw new error_handler_1.AppError("Failed to cancel donation", 500);
        }
        return data;
    },
    getDonationDetails: async (donorId, donationId) => {
        // Get the donation
        const { data: donation, error: donationError } = await database_1.supabase
            .from("food_donations")
            .select("*")
            .eq("id", donationId)
            .eq("donor_id", donorId)
            .single();
        if (donationError || !donation) {
            throw new error_handler_1.AppError("Donation not found or access denied", 404);
        }
        // Get the food items
        const { data: items, error: itemsError } = await database_1.supabase
            .from("food_items")
            .select("*")
            .eq("donation_id", donationId);
        if (itemsError) {
            throw new error_handler_1.AppError("Failed to fetch food items", 500);
        }
        return {
            donation,
            items: items || [],
        };
    },
    addFoodItem: async (donorId, donationId, itemData) => {
        // Check if donation exists and belongs to the donor
        const { data: existingDonation, error: checkError } = await database_1.supabase
            .from("food_donations")
            .select("*")
            .eq("id", donationId)
            .eq("donor_id", donorId)
            .single();
        if (checkError || !existingDonation) {
            throw new error_handler_1.AppError("Donation not found or access denied", 404);
        }
        // Only allow updates if the donation is in pending status
        if (existingDonation.status !== "pending") {
            throw new error_handler_1.AppError("Cannot add items to donation that is not in pending status", 400);
        }
        // Add the food item
        const { data, error } = await database_1.supabase
            .from("food_items")
            .insert(Object.assign({ donation_id: donationId }, itemData))
            .select()
            .single();
        if (error) {
            throw new error_handler_1.AppError("Failed to add food item", 500);
        }
        return data;
    },
    updateFoodItem: async (donorId, donationId, itemId, itemData) => {
        // Check if donation exists and belongs to the donor
        const { data: existingDonation, error: checkError } = await database_1.supabase
            .from("food_donations")
            .select("*")
            .eq("id", donationId)
            .eq("donor_id", donorId)
            .single();
        if (checkError || !existingDonation) {
            throw new error_handler_1.AppError("Donation not found or access denied", 404);
        }
        // Only allow updates if the donation is in pending status
        if (existingDonation.status !== "pending") {
            throw new error_handler_1.AppError("Cannot update items in donation that is not in pending status", 400);
        }
        // Update the food item
        const { data, error } = await database_1.supabase
            .from("food_items")
            .update(itemData)
            .eq("id", itemId)
            .eq("donation_id", donationId)
            .select()
            .single();
        if (error) {
            throw new error_handler_1.AppError("Failed to update food item", 500);
        }
        return data;
    },
    deleteFoodItem: async (donorId, donationId, itemId) => {
        // Check if donation exists and belongs to the donor
        const { data: existingDonation, error: checkError } = await database_1.supabase
            .from("food_donations")
            .select("*")
            .eq("id", donationId)
            .eq("donor_id", donorId)
            .single();
        if (checkError || !existingDonation) {
            throw new error_handler_1.AppError("Donation not found or access denied", 404);
        }
        // Only allow updates if the donation is in pending status
        if (existingDonation.status !== "pending") {
            throw new error_handler_1.AppError("Cannot delete items from donation that is not in pending status", 400);
        }
        // Delete the food item
        const { error } = await database_1.supabase.from("food_items").delete().eq("id", itemId).eq("donation_id", donationId);
        if (error) {
            throw new error_handler_1.AppError("Failed to delete food item", 500);
        }
    },
};
