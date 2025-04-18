import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not set in environment variables");
}

if (!supabaseKey) {
  throw new Error("SUPABASE_SERVICE_KEY is not set in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
