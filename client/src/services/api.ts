import { supabase } from "@/config/supabase"

// Types for our API responses
interface ApiResponse<T> {
  data: T | null
  error: Error | null
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Base API class with common functionality
class Api {
  protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  protected async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`/api${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify(body),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  protected async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`/api${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify(body),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`/api${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }
}

export default Api