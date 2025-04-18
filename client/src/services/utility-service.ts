import { supabase } from "@/config/supabase"
import Api from "./api"

interface GeoLocation {
  latitude: number
  longitude: number
  address: string
}

interface UploadResponse {
  url: string
  path: string
}

class UtilityService extends Api {
  async uploadFile(file: File, bucket: string): Promise<UploadResponse> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${bucket}/${fileName}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      url: publicUrl,
      path: filePath
    }
  }

  async deleteFile(path: string, bucket: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }

  async geocodeAddress(address: string): Promise<GeoLocation> {
    const response = await this.get<GeoLocation>(`/utility/geocode?address=${encodeURIComponent(address)}`)
    if (response.error) throw response.error
    if (!response.data) throw new Error("Failed to geocode address")
    return response.data
  }

  async calculateDistance(origin: GeoLocation, destination: GeoLocation): Promise<number> {
    const response = await this.post<{ distance: number }>("/utility/calculate-distance", {
      origin,
      destination
    })
    if (response.error) throw response.error
    if (!response.data) throw new Error("Failed to calculate distance")
    return response.data.distance
  }

  async validateDocument(file: File): Promise<boolean> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/utility/validate-document", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to validate document")
    }

    const data = await response.json()
    return data.isValid
  }
}

export const utilityService = new UtilityService()