import { apiClient } from "./api-client"

export const donationApi = {
  getDonations: async (params?: any) => {
    return apiClient.get("/donations", { params })
  },

  getDonationById: async (id: string) => {
    return apiClient.get(`/donations/${id}`)
  },

  createDonation: async (donationData: any) => {
    return apiClient.post("/donations", donationData)
  },

  updateDonation: async (id: string, donationData: any) => {
    return apiClient.put(`/donations/${id}`, donationData)
  },

  deleteDonation: async (id: string) => {
    return apiClient.delete(`/donations/${id}`)
  },

  // Food items
  addFoodItem: async (donationId: string, itemData: any) => {
    return apiClient.post(`/donations/${donationId}/items`, itemData)
  },

  updateFoodItem: async (donationId: string, itemId: string, itemData: any) => {
    return apiClient.put(`/donations/${donationId}/items/${itemId}`, itemData)
  },

  deleteFoodItem: async (donationId: string, itemId: string) => {
    return apiClient.delete(`/donations/${donationId}/items/${itemId}`)
  },

  // Pickup schedules
  createPickupSchedule: async (donationId: string, scheduleData: any) => {
    return apiClient.post(`/donations/${donationId}/schedule`, scheduleData)
  },

  updatePickupSchedule: async (donationId: string, scheduleData: any) => {
    return apiClient.put(`/donations/${donationId}/schedule`, scheduleData)
  },

  // Feedback
  addFeedback: async (donationId: string, feedbackData: any) => {
    return apiClient.post(`/donations/${donationId}/feedback`, feedbackData)
  },

  // Images
  uploadImage: async (donationId: string, imageFile: File) => {
    const formData = new FormData()
    formData.append("image", imageFile)

    return apiClient.post(`/donations/${donationId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  deleteImage: async (donationId: string, imageId: string) => {
    return apiClient.delete(`/donations/${donationId}/images/${imageId}`)
  },
}
