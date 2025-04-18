import { useState, useCallback } from "react"
import { useToast } from "./use-toast"

interface ApiOptions {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
}

export function useApi<T>(defaultValue?: T) {
  const [data, setData] = useState<T | undefined>(defaultValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const toast = useToast()

  const execute = useCallback(async <R>(
    promise: Promise<R>,
    options: ApiOptions = {}
  ): Promise<R | undefined> => {
    const {
      showSuccessToast = false,
      showErrorToast = true,
      successMessage = "Operation successful"
    } = options

    try {
      setLoading(true)
      setError(null)
      const result = await promise
      setData(result as T)

      if (showSuccessToast) {
        toast.success(successMessage)
      }

      return result
    } catch (e) {
      const error = e as Error
      setError(error)
      
      if (showErrorToast) {
        toast.error(error.message || "An error occurred")
      }
      
      return undefined
    } finally {
      setLoading(false)
    }
  }, [toast])

  return {
    data,
    loading,
    error,
    execute,
    setData,
  }
}