import { supabase } from "../supabase/client";

interface AuthLogData {
  user_id: string;
  action: 'login' | 'register' | 'logout' | 'password_reset';
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
  metadata?: any;
}

/**
 * Log authentication events to the database
 */
export async function logAuthEvent(data: AuthLogData) {
  try {
    // Get user agent from browser
    const userAgent = navigator.userAgent;
    
    // Default IP address
    let ipAddress = data.ip_address || 'unavailable';
    
    // Try to get IP from a service (with timeout and error handling)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
      
      const ipResponse = await fetch('https://api.ipify.org?format=json', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip || ipAddress;
      }
    } catch (ipError) {
      // Silently fail - IP fetch is not critical
      console.debug('Could not fetch IP address:', ipError);
    }

    const logEntry = {
      user_id: data.user_id,
      action: data.action,
      ip_address: ipAddress,
      user_agent: data.user_agent || userAgent,
      success: data.success,
      error_message: data.error_message,
      metadata: data.metadata,
      created_at: new Date().toISOString()
    };

    // Insert log into Supabase - wrap in additional try-catch for fetch errors
    try {
      const { error } = await supabase
        .from('auth_logs')
        .insert(logEntry)
        .catch((fetchError) => {
          // Silently catch fetch errors
          console.debug('Supabase fetch error in logging (ignored):', fetchError);
          return { error: null };
        });

      if (error) {
        console.debug('Failed to log auth event (non-critical):', error);
        // Don't throw - just log the error
      }
    } catch (fetchError) {
      // Completely silent - logging is non-critical
      console.debug('Auth logging failed (ignored)');
    }
  } catch (error) {
    // Completely silent - logging shouldn't break the auth flow
    console.debug('Error in logAuthEvent (ignored)');
  }
}

/**
 * Create or update user profile in the database
 */
export async function createUserProfile(userId: string, data: {
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  address?: string;
  specialization?: string;
  licenseNumber?: string;
  emergencyContact?: string;
  bloodGroup?: string;
}) {
  try {
    const profile = {
      user_id: userId,
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      address: data.address,
      specialization: data.specialization,
      license_number: data.licenseNumber,
      emergency_contact: data.emergencyContact,
      blood_group: data.bloodGroup,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Use upsert to handle both create and update - wrap in try-catch for fetch errors
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert(profile, { onConflict: 'user_id' })
        .catch((fetchError) => {
          // Silently catch fetch errors
          console.debug('Supabase fetch error in profile creation (ignored):', fetchError);
          return { error: null };
        });

      if (error) {
        console.debug('Failed to create/update user profile (non-critical):', error);
        // Don't throw unless it's critical
        // Profile creation failure shouldn't block auth
      }
    } catch (fetchError) {
      // Completely silent - profile creation is non-critical
      console.debug('Profile creation failed (ignored)');
    }
  } catch (error) {
    // Completely silent - profile creation is supplementary
    console.debug('Error in createUserProfile (ignored)');
  }
}