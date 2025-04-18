import Api from "./api"

interface NGOProfile {
  id: string
  userId: string
  organizationName: string
  registrationNumber: string
  address: string
  phone: string
  isVerified: boolean
  verificationDocumentUrl?: string
  description?: string
}

interface AvailableDonation {
  id: string
  title: string
  description: string
  quantity: number
  expiry: Date
  donorName: string
  donorAddress: string
  status: "pending"
  distance?: number
  createdAt: Date
}

interface CollectedDonation {
  id: string
  title: string
  donorName: string
  quantity: number
  collectedAt: Date
  status: "completed"
}

class NGOService extends Api {
  async getProfile(): Promise<NGOProfile> {
    const response = await this.get<NGOProfile>("/ngo/profile")
    if (response.error) throw response.error
    if (!response.data) throw new Error("Profile not found")
    return response.data
  }

  async updateProfile(data: Partial<NGOProfile>) {
    const response = await this.put<NGOProfile>("/ngo/profile", data)
    if (response.error) throw response.error
    return response.data
  }

  async getAvailableDonations(): Promise<AvailableDonation[]> {
    const response = await this.get<AvailableDonation[]>("/ngo/available-donations")
    if (response.error) throw response.error
    return response.data || []
  }

  async acceptDonation(donationId: string) {
    const response = await this.post<void>(`/ngo/donations/${donationId}/accept`, {})
    if (response.error) throw response.error
    return response.data
  }

  async getCollectedDonations(): Promise<CollectedDonation[]> {
    const response = await this.get<CollectedDonation[]>("/ngo/collected-donations")
    if (response.error) throw response.error
    return response.data || []
  }

  async getDonationHistory(params: { page: number; limit: number }) {
    const response = await this.get<CollectedDonation[]>(`/ngo/donation-history?page=${params.page}&limit=${params.limit}`)
    if (response.error) throw response.error
    return response.data || []
  }
}

export const ngoService = new NGOService()