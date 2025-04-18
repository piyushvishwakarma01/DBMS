import { useState } from "react";
import axios from "axios";

// Use environment variables injected by the build tool
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ikolygsxqkloptmzkpjc.supabase.co";
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY || "your-supabase-api-key";

export function useAuth() {
  const [user, setUser] = useState(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        email,
        password,
      }, {
        headers: {
          apiKey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
      });
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${SUPABASE_URL}/auth/v1/signup`, {
        email,
        password,
      }, {
        headers: {
          apiKey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
        },
      });
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  return { user, login, signup };
}