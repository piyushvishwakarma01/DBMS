import { createContext, useContext, useEffect } from "react"
import { useQuery } from "@/hooks/use-query"
import { notificationService, Notification } from "@/services/notification-service"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: Error | null
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const toast = useToast()

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["notifications"],
    () => notificationService.getNotifications(),
    { enabled: !!user }
  )

  useEffect(() => {
    if (!user) return

    // Subscribe to real-time notifications
    notificationService.subscribeToNotifications(user.id, (notification) => {
      // Show toast for new notification
      toast.info(notification.message, {
        duration: 5000,
      })
      // Refetch notifications
      refetch()
    })

    return () => {
      notificationService.unsubscribe()
    }
  }, [user, toast, refetch])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const value = {
    notifications,
    unreadCount,
    loading: isLoading,
    error,
    markAsRead: async (id: string) => {
      await notificationService.markAsRead(id)
      refetch()
    },
    markAllAsRead: async () => {
      await notificationService.markAllAsRead()
      refetch()
    },
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}