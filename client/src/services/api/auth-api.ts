import { apiClient } from "./api-client"

export const authApi = {
  register: async (userData: any) => {
    return apiClient.post("/auth/register", userData)
  },

  login: async (email: string, password: string) => {
    return apiClient.post("/auth/login", { email, password })
  },

  logout: async () => {
    return apiClient.post("/auth/logout")
  },

  refreshToken: async (refreshToken: string) => {
    return apiClient.post("/auth/refresh-token", { refreshToken })
  },

  getCurrentUser: async () => {
    return apiClient.get("/auth/me")
  },
}
