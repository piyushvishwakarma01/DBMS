import { supabase } from "../config/database"
import { AppError } from "../utils/error-handler"
import type { DonorProfile, FoodDonation, FoodItem } from "../types"

export const donorService = {
  getDonorProfile: async (userId: string): Promise<DonorProfile> => {
    const { data: donor, error } = await supabase
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
      .single()

    if (error) {
      throw new AppError("Failed to fetch donor profile", 500)
    }

    if (!donor) {
      throw new AppError("Donor profile not found", 404)
    }

    return donor
  },

  updateDonorProfile: async (userId: string, updateData: any): Promise<DonorProfile> => {
    const { data: donor, error } = await supabase
      .from("donors")
      .update(updateData)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      throw new AppError("Failed to update donor profile", 500)
    }

    return donor
  },

  getDonorDonations: async (donorId: string): Promise<FoodDonation[]> => {
    const { data, error } = await supabase
      .from("food_donations")
      .select("*")
      .eq("donor_id", donorId)
      .order("created_at", { ascending: false })

    if (error) {
      throw new AppError("Failed to fetch donations", 500)
    }

    return data || []
  },

  createDonation: async (
    donorId: string,
    donationData: Partial<FoodDonation>,
    foodItems: Partial<FoodItem>[],
  ): Promise<FoodDonation> => {
    // Create the donation
    const { data: donation, error: donationError } = await supabase
      .from("food_donations")
      .insert({
        donor_id: donorId,
        status: "pending",
        ...donationData,
      })
      .select()
      .single()

    if (donationError || !donation) {
      throw new AppError("Failed to create donation", 500)
    }

    // Add food items
    if (foodItems.length > 0) {
      const itemsWithDonationId = foodItems.map((item) => ({
        ...item,
        donation_id: donation.id,
      }))

      const { error: itemsError } = await supabase.from("food_items").insert(itemsWithDonationId)

      if (itemsError) {
        // Rollback by deleting the donation
        await supabase.from("food_donations").delete().eq("id", donation.id)
        throw new AppError("Failed to add food items", 500)
      }
    }

    return donation
  },

  updateDonation: async (
    donorId: string,
    donationId: string,
    donationData: Partial<FoodDonation>,
  ): Promise<FoodDonation> => {
    // Check if donation exists and belongs to the donor
    const { data: existingDonation, error: checkError } = await supabase
      .from("food_donations")
      .select("*")
      .eq("id", donationId)
      .eq("donor_id", donorId)
      .single()

    if (checkError || !existingDonation) {
      throw new AppError("Donation not found or access denied", 404)
    }

    // Only allow updates if the donation is in pending status
    if (existingDonation.status !== "pending") {
      throw new AppError("Cannot update donation that is not in pending status", 400)
    }

    // Update the donation
    const { data, error } = await supabase
      .from("food_donations")
      .update(donationData)
      .eq("id", donationId)
      .select()
      .single()

    if (error) {
      throw new AppError("Failed to update donation", 500)
    }

    return data
  },

  cancelDonation: async (donorId: string, donationId: string): Promise<FoodDonation> => {
    // Check if donation exists and belongs to the donor
    const { data: existingDonation, error: checkError } = await supabase
      .from("food_donations")
      .select("*")
      .eq("id", donationId)
      .eq("donor_id", donorId)
      .single()

    if (checkError || !existingDonation) {
      throw new AppError("Donation not found or access denied", 404)
    }

    // Only allow cancellation if the donation is not already delivered or cancelled
    if (["delivered", "cancelled"].includes(existingDonation.status)) {
      throw new AppError("Cannot cancel donation that is already delivered or cancelled", 400)
    }

    // Update the donation status to cancelled
    const { data, error } = await supabase
      .from("food_donations")
      .update({ status: "cancelled" })
      .eq("id", donationId)
      .select()
      .single()

    if (error) {
      throw new AppError("Failed to cancel donation", 500)
    }

    return data
  },

  getDonationDetails: async (
    donorId: string,
    donationId: string,
  ): Promise<{ donation: FoodDonation; items: FoodItem[] }> => {
    // Get the donation
    const { data: donation, error: donationError } = await supabase
      .from("food_donations")
      .select("*")
      .eq("id", donationId)
      .eq("donor_id", donorId)
      .single()

    if (donationError || !donation) {
      throw new AppError("Donation not found or access denied", 404)
    }

    // Get the food items
    const { data: items, error: itemsError } = await supabase
      .from("food_items")
      .select("*")
      .eq("donation_id", donationId)

    if (itemsError) {
      throw new AppError("Failed to fetch food items", 500)
    }

    return {
      donation,
      items: items || [],
    }
  },

  addFoodItem: async (donorId: string, donationId: string, itemData: Partial<FoodItem>): Promise<FoodItem> => {
    // Check if donation exists and belongs to the donor
    const { data: existingDonation, error: checkError } = await supabase
      .from("food_donations")
      .select("*")
      .eq("id", donationId)
      .eq("donor_id", donorId)
      .single()

    if (checkError || !existingDonation) {
      throw new AppError("Donation not found or access denied", 404)
    }

    // Only allow updates if the donation is in pending status
    if (existingDonation.status !== "pending") {
      throw new AppError("Cannot add items to donation that is not in pending status", 400)
    }

    // Add the food item
    const { data, error } = await supabase
      .from("food_items")
      .insert({
        donation_id: donationId,
        ...itemData,
      })
      .select()
      .single()

    if (error) {
      throw new AppError("Failed to add food item", 500)
    }

    return data
  },

  updateFoodItem: async (
    donorId: string,
    donationId: string,
    itemId: string,
    itemData: Partial<FoodItem>,
  ): Promise<FoodItem> => {
    // Check if donation exists and belongs to the donor
    const { data: existingDonation, error: checkError } = await supabase
      .from("food_donations")
      .select("*")
      .eq("id", donationId)
      .eq("donor_id", donorId)
      .single()

    if (checkError || !existingDonation) {
      throw new AppError("Donation not found or access denied", 404)
    }

    // Only allow updates if the donation is in pending status
    if (existingDonation.status !== "pending") {
      throw new AppError("Cannot update items in donation that is not in pending status", 400)
    }

    // Update the food item
    const { data, error } = await supabase
      .from("food_items")
      .update(itemData)
      .eq("id", itemId)
      .eq("donation_id", donationId)
      .select()
      .single()

    if (error) {
      throw new AppError("Failed to update food item", 500)
    }

    return data
  },

  deleteFoodItem: async (donorId: string, donationId: string, itemId: string): Promise<void> => {
    // Check if donation exists and belongs to the donor
    const { data: existingDonation, error: checkError } = await supabase
      .from("food_donations")
      .select("*")
      .eq("id", donationId)
      .eq("donor_id", donorId)
      .single()

    if (checkError || !existingDonation) {
      throw new AppError("Donation not found or access denied", 404)
    }

    // Only allow updates if the donation is in pending status
    if (existingDonation.status !== "pending") {
      throw new AppError("Cannot delete items from donation that is not in pending status", 400)
    }

    // Delete the food item
    const { error } = await supabase.from("food_items").delete().eq("id", itemId).eq("donation_id", donationId)

    if (error) {
      throw new AppError("Failed to delete food item", 500)
    }
  },
}
