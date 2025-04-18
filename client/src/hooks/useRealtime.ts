import { useEffect, useRef } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "./useAuth"

type ChannelType = "donation_updates" | "ngo_donation_updates" | "notifications" | "messages"

export const useRealtime = (channelType: ChannelType, callback: (payload: any) => void) => {
  const { user } = useAuth()
  const channelRef = useRef<ReturnType<typeof supabase.channel>>()

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`${channelType}:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: getTableName(channelType),
          filter: getFilter(channelType, user.id)
        },
        callback
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [user, channelType, callback])

  const getTableName = (type: ChannelType): string => {
    switch (type) {
      case "donation_updates":
      case "ngo_donation_updates":
        return "food_donations"
      case "notifications":
        return "notifications"
      case "messages":
        return "messages"
      default:
        return ""
    }
  }

  const getFilter = (type: ChannelType, userId: string): string => {
    switch (type) {
      case "donation_updates":
        return `donor_id=eq.${userId}`
      case "ngo_donation_updates":
        return `ngo_id=eq.${userId}`
      case "notifications":
        return `user_id=eq.${userId}`
      case "messages":
        return `receiver_id=eq.${userId}`
      default:
        return ""
    }
  }
} 