import { useQuery as useReactQuery, useMutation as useReactMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { useToast } from './use-toast'

interface QueryConfig<T> extends Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'> {
  showErrorToast?: boolean
}

interface MutationConfig<T, V> extends Omit<UseMutationOptions<T, Error, V>, 'mutationFn'> {
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
}

export function useQuery<T>(
  key: string | string[],
  queryFn: () => Promise<T>,
  config: QueryConfig<T> = {}
) {
  const toast = useToast()
  const { showErrorToast = true, ...queryConfig } = config

  return useReactQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn,
    ...queryConfig,
    onError: (error) => {
      if (showErrorToast) {
        toast.error(error.message)
      }
      config.onError?.(error)
    },
  })
}

export function useMutation<T, V = void>(
  mutationFn: (variables: V) => Promise<T>,
  config: MutationConfig<T, V> = {}
) {
  const toast = useToast()
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation successful',
    ...mutationConfig
  } = config

  return useReactMutation({
    mutationFn,
    ...mutationConfig,
    onSuccess: (data, variables, context) => {
      if (showSuccessToast) {
        toast.success(successMessage)
      }
      config.onSuccess?.(data, variables, context)
    },
    onError: (error, variables, context) => {
      if (showErrorToast) {
        toast.error(error.message)
      }
      config.onError?.(error, variables, context)
    },
  })
}