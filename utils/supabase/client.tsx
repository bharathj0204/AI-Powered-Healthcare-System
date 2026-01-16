import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

// Singleton Supabase client to avoid multiple instances
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
          }
        }
      );
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }
  return supabaseClient;
}

export const supabase = getSupabaseClient();

// Helper to check if Supabase is accessible
export async function checkSupabaseConnection() {
  try {
    const { error } = await supabase.auth.getSession();
    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
}