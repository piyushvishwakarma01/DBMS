import Api from "./api"

interface VolunteerProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  phone: string
  address: string
  availability: string[]
  isVerified: boolean
  verificationDocumentUrl?: string
}

interface Assignment {
  id: string
  donationId: string
  donationTitle: string
  pickupAddress: string
  deliveryAddress: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
  scheduledTime: Date
  createdAt: Date
  updatedAt: Date
}

class VolunteerService extends Api {
  async getProfile(): Promise<VolunteerProfile> {
    const response = await this.get<VolunteerProfile>("/volunteer/profile")
    if (response.error) throw response.error
    if (!response.data) throw new Error("Profile not found")
    return response.data
  }

  async updateProfile(data: Partial<VolunteerProfile>) {
    const response = await this.put<VolunteerProfile>("/volunteer/profile", data)
    if (response.error) throw response.error
    return response.data
  }

  async getAvailableAssignments(): Promise<Assignment[]> {
    const response = await this.get<Assignment[]>("/volunteer/available-assignments")
    if (response.error) throw response.error
    return response.data || []
  }

  async getMyAssignments(): Promise<Assignment[]> {
    const response = await this.get<Assignment[]>("/volunteer/my-assignments")
    if (response.error) throw response.error
    return response.data || []
  }

  async acceptAssignment(assignmentId: string) {
    const response = await this.post<Assignment>(`/volunteer/assignments/${assignmentId}/accept`, {})
    if (response.error) throw response.error
    return response.data
  }

  async updateAssignmentStatus(assignmentId: string, status: Assignment["status"]) {
    const response = await this.put<Assignment>(`/volunteer/assignments/${assignmentId}/status`, { status })
    if (response.error) throw response.error
    return response.data
  }

  async getAssignmentHistory(params: { page: number; limit: number }) {
    const response = await this.get<Assignment[]>(`/volunteer/assignment-history?page=${params.page}&limit=${params.limit}`)
    if (response.error) throw response.error
    return response.data || []
  }
}

export const volunteerService = new VolunteerService()