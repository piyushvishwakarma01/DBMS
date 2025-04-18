import type { DonorProfile, FoodDonation, FoodItem } from "../types";
export declare const donorService: {
    getDonorProfile: (userId: string) => Promise<DonorProfile>;
    updateDonorProfile: (userId: string, updateData: any) => Promise<DonorProfile>;
    getDonorDonations: (donorId: string) => Promise<FoodDonation[]>;
    createDonation: (donorId: string, donationData: Partial<FoodDonation>, foodItems: Partial<FoodItem>[]) => Promise<FoodDonation>;
    updateDonation: (donorId: string, donationId: string, donationData: Partial<FoodDonation>) => Promise<FoodDonation>;
    cancelDonation: (donorId: string, donationId: string) => Promise<FoodDonation>;
    getDonationDetails: (donorId: string, donationId: string) => Promise<{
        donation: FoodDonation;
        items: FoodItem[];
    }>;
    addFoodItem: (donorId: string, donationId: string, itemData: Partial<FoodItem>) => Promise<FoodItem>;
    updateFoodItem: (donorId: string, donationId: string, itemId: string, itemData: Partial<FoodItem>) => Promise<FoodItem>;
    deleteFoodItem: (donorId: string, donationId: string, itemId: string) => Promise<void>;
};
