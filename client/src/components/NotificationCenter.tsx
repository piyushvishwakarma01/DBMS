import { useState, useEffect } from "react"
import { useRealtime } from "../hooks/useRealtime"
import { supabase } from "../lib/supabase"
import { Bell, X } from "lucide-react"
import { Button } from "./ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { ScrollArea } from "./ui/scroll-area"
import { Badge } from "./ui/badge"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  created_at: string
  seen: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching notifications:", error)
        return
      }

      setNotifications(data || [])
      setUnreadCount(data?.filter((n) => !n.seen).length || 0)
    }

    fetchNotifications()
  }, [])

  // Subscribe to real-time notifications
  useRealtime("notifications", (payload) => {
    if (payload.eventType === "INSERT") {
      setNotifications((prev) => [payload.new, ...prev])
      setUnreadCount((prev) => prev + 1)
    } else if (payload.eventType === "UPDATE") {
      setNotifications((prev) =>
        prev.map((n) => (n.id === payload.new.id ? payload.new : n))
      )
      if (payload.new.seen) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    }
  })

  const markAsSeen = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ seen: true })
      .eq("id", notificationId)

    if (error) {
      console.error("Error marking notification as seen:", error)
      return
    }

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, seen: true } : n
      )
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsSeen = async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ seen: true })
      .in(
        "id",
        notifications.filter((n) => !n.seen).map((n) => n.id)
      )

    if (error) {
      console.error("Error marking all notifications as seen:", error)
      return
    }

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, seen: true }))
    )
    setUnreadCount(0)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsSeen}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4 text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 ${
                    !notification.seen ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!notification.seen && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => markAsSeen(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
} 