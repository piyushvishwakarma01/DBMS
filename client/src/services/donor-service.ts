import Api from "./api"

interface Donation {
  id: string
  title: string
  description: string
  quantity: number
  expiry: Date
  status: "pending" | "accepted" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

interface DonorProfile {
  id: string
  userId: string
  businessName: string
  businessLicense?: string
  address: string
  phone: string
  isVerified: boolean
  verificationDocumentUrl?: string
}

class DonorService extends Api {
  async getDonations(): Promise<Donation[]> {
    const response = await this.get<Donation[]>("/donations")
    if (response.error) throw response.error
    return response.data || []
  }

  async createDonation(data: Omit<Donation, "id" | "status" | "createdAt" | "updatedAt">) {
    const response = await this.post<Donation>("/donations", data)
    if (response.error) throw response.error
    return response.data
  }

  async updateDonation(id: string, data: Partial<Donation>) {
    const response = await this.put<Donation>(`/donations/${id}`, data)
    if (response.error) throw response.error
    return response.data
  }

  async cancelDonation(id: string) {
    const response = await this.put<Donation>(`/donations/${id}/cancel`, {})
    if (response.error) throw response.error
    return response.data
  }

  async getProfile(): Promise<DonorProfile> {
    const response = await this.get<DonorProfile>("/donor/profile")
    if (response.error) throw response.error
    if (!response.data) throw new Error("Profile not found")
    return response.data
  }

  async updateProfile(data: Partial<DonorProfile>) {
    const response = await this.put<DonorProfile>("/donor/profile", data)
    if (response.error) throw response.error
    return response.data
  }
}

export const donorService = new DonorService()