import { supabase } from "@/config/supabase"
import Api from "./api"

export interface Notification {
  id: string
  userId: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  createdAt: Date
  metadata?: Record<string, any>
}

class NotificationService extends Api {
  private subscription: any = null

  async getNotifications(): Promise<Notification[]> {
    const response = await this.get<Notification[]>("/notifications")
    if (response.error) throw response.error
    return response.data || []
  }

  async markAsRead(notificationId: string) {
    const response = await this.put<Notification>(`/notifications/${notificationId}/read`, {})
    if (response.error) throw response.error
    return response.data
  }

  async markAllAsRead() {
    const response = await this.put<void>("/notifications/read-all", {})
    if (response.error) throw response.error
    return response.data
  }

  subscribeToNotifications(userId: string, onNotification: (notification: Notification) => void) {
    this.subscription = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const notification = payload.new as Notification
          onNotification(notification)
        }
      )
      .subscribe()
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
  }
}

export const notificationService = new NotificationService()