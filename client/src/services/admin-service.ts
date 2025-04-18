import Api from "./api"

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: Date
  isVerified: boolean
}

interface DonationStats {
  total: number
  pending: number
  completed: number
  cancelled: number
}

interface UserStats {
  totalUsers: number
  activeNGOs: number
  activeDonors: number
  activeVolunteers: number
}

class AdminService extends Api {
  async getUsers(params: { page: number; limit: number; role?: string }): Promise<{ users: User[]; total: number }> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      ...(params.role && { role: params.role })
    })
    
    const response = await this.get<{ users: User[]; total: number }>(`/admin/users?${queryParams}`)
    if (response.error) throw response.error
    return response.data || { users: [], total: 0 }
  }

  async verifyUser(userId: string) {
    const response = await this.put<User>(`/admin/users/${userId}/verify`, {})
    if (response.error) throw response.error
    return response.data
  }

  async suspendUser(userId: string) {
    const response = await this.put<User>(`/admin/users/${userId}/suspend`, {})
    if (response.error) throw response.error
    return response.data
  }

  async getDonationStats(): Promise<DonationStats> {
    const response = await this.get<DonationStats>("/admin/stats/donations")
    if (response.error) throw response.error
    return response.data || { total: 0, pending: 0, completed: 0, cancelled: 0 }
  }

  async getUserStats(): Promise<UserStats> {
    const response = await this.get<UserStats>("/admin/stats/users")
    if (response.error) throw response.error
    return response.data || { totalUsers: 0, activeNGOs: 0, activeDonors: 0, activeVolunteers: 0 }
  }

  async getRecentActivity() {
    const response = await this.get<any[]>("/admin/activity")
    if (response.error) throw response.error
    return response.data || []
  }

  async getDonationReports(params: { startDate: Date; endDate: Date }) {
    const queryParams = new URLSearchParams({
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString()
    })
    
    const response = await this.get<any>(`/admin/reports/donations?${queryParams}`)
    if (response.error) throw response.error
    return response.data
  }
}

export const adminService = new AdminService()