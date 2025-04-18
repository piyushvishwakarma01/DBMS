import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken")

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            // Try to refresh the token
            const refreshToken = localStorage.getItem("refreshToken")

            if (!refreshToken) {
              // No refresh token, redirect to login
              window.location.href = "/auth/login"
              return Promise.reject(error)
            }

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, { refreshToken })

            const { accessToken } = response.data.data

            // Update token
            localStorage.setItem("accessToken", accessToken)

            // Update header and retry
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            window.location.href = "/auth/login"
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      },
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ status: string; data: T }> = await this.client.get(url, config)
    return response.data.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ status: string; data: T }> = await this.client.post(url, data, config)
    return response.data.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ status: string; data: T }> = await this.client.put(url, data, config)
    return response.data.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ status: string; data: T }> = await this.client.delete(url, config)
    return response.data.data
  }
}

export const apiClient = new ApiClient(process.env.REACT_APP_API_URL as string)
