import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Klien Supabase. null bila variabel lingkungan belum diisi (mode lokal dengan data JSON dummy). */
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

export const USER_DOMAIN = "qrion.local";
export const emailOf = (username: string) => `${username}@${USER_DOMAIN}`;
export const usernameOf = (email?: string | null) => String(email || "").split("@")[0];
