// User types
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "donor" | "ngo" | "volunteer"
  created_at: Date
  updated_at: Date
}

export interface UserWithPassword extends User {
  password_hash: string
}

export interface UserProfile {
  id: string
  user_id: string
  [key: string]: any
}

export interface DonorProfile extends UserProfile {
  business_name: string
  business_license?: string
  address: string
  phone: string
  is_verified: boolean
  verification_document_url?: string
}

export interface NgoProfile extends UserProfile {
  registration_number: string
  service_area: string
  capacity: number
  address: string
  phone: string
}

export interface VolunteerProfile extends UserProfile {
  phone: string
  address: string
  availability?: string
}

// Donation types
export interface FoodDonation {
  id: string
  donor_id: string
  ngo_id?: string
  status: "pending" | "accepted" | "in_transit" | "delivered" | "cancelled"
  pickup_time?: Date
  expiry_date: Date
  pickup_address: string
  description?: string
  created_at: Date
  updated_at: Date
}

export interface FoodItem {
  id: string
  donation_id: string
  name: string
  quantity: number
  unit: string
  category: string
  allergens?: string
  created_at: Date
  updated_at: Date
}

export interface PickupSchedule {
  id: string
  donation_id: string
  scheduled_time: Date
  actual_time?: Date
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface VolunteerAssignment {
  id: string
  volunteer_id: string
  pickup_schedule_id: string
  status: "assigned" | "accepted" | "in_progress" | "completed" | "cancelled"
  created_at: Date
  updated_at: Date
}

export interface Feedback {
  id: string
  donation_id: string
  ngo_id: string
  rating: number
  comment?: string
  created_at: Date
}

export interface DonationImage {
  id: string
  donation_id: string
  image_url: string
  created_at: Date
}

// Other types
export interface Complaint {
  id: string
  user_id: string
  subject: string
  description: string
  status: "open" | "in_progress" | "resolved" | "closed"
  resolved_by?: string
  created_at: Date
  updated_at: Date
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: Date
}

export interface Notification {
  id: string
  user_id: string
  message: string
  seen: boolean
  link?: string
  created_at: Date
}

export interface UserSession {
  id: string
  user_id: string
  login_time: Date
  logout_time?: Date
  ip_address?: string
  user_agent?: string
}

export interface Report {
  id: string
  admin_id: string
  report_type: string
  report_data: any
  created_at: Date
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_table: string
  target_id?: string
  details?: any
  timestamp: Date
}

// Auth types
export interface RegisterData {
  email: string
  password: string
  name: string
  role: "admin" | "donor" | "ngo" | "volunteer"
  profile: any
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface TokenData {
  id: string
  email: string
  role: string
}

export interface RefreshTokenResponse {
  accessToken: string
}
