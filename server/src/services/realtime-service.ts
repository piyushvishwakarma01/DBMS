import { supabase } from "../config/database"
import { RealtimeChannel } from "@supabase/supabase-js"

export class RealtimeService {
  private static channels: Map<string, RealtimeChannel> = new Map()

  static subscribeToDonationUpdates(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`donation_updates:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "food_donations",
          filter: `donor_id=eq.${userId}`
        },
        callback
      )
      .subscribe()

    this.channels.set(`donation_updates:${userId}`, channel)
  }

  static subscribeToNgoDonationUpdates(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`ngo_donation_updates:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "food_donations",
          filter: `ngo_id=eq.${userId}`
        },
        callback
      )
      .subscribe()

    this.channels.set(`ngo_donation_updates:${userId}`, channel)
  }

  static subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()

    this.channels.set(`notifications:${userId}`, channel)
  }

  static subscribeToMessages(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`messages:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`
        },
        callback
      )
      .subscribe()

    this.channels.set(`messages:${userId}`, channel)
  }

  static unsubscribe(userId: string, channelType: string) {
    const channelKey = `${channelType}:${userId}`
    const channel = this.channels.get(channelKey)
    if (channel) {
      channel.unsubscribe()
      this.channels.delete(channelKey)
    }
  }

  static unsubscribeAll(userId: string) {
    const channelTypes = [
      "donation_updates",
      "ngo_donation_updates",
      "notifications",
      "messages"
    ]

    channelTypes.forEach(type => this.unsubscribe(userId, type))
  }
} 