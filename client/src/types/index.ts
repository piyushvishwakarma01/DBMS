export interface Donation {
  id: string
  donor_id: string
  ngo_id: string | null
  food_type: string
  quantity: number
  unit: string
  expiry_date: string
  status: "pending" | "accepted" | "rejected" | "completed"
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  read: boolean
  created_at: string
} 