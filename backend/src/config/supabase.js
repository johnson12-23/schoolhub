import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseEnabled = Boolean(supabaseUrl && supabaseKey);
export const supabase = supabaseEnabled ? createClient(supabaseUrl, supabaseKey) : null;
