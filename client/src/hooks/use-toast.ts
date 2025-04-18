import { toast } from "sonner"

interface ToastOptions {
  duration?: number
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left"
}

export function useToast() {
  const showToast = {
    success: (message: string, options?: ToastOptions) => {
      toast.success(message, options)
    },
    error: (message: string, options?: ToastOptions) => {
      toast.error(message, options)
    },
    info: (message: string, options?: ToastOptions) => {
      toast.info(message, options)
    },
    warning: (message: string, options?: ToastOptions) => {
      toast.warning(message, options)
    },
  }

  return showToast
}