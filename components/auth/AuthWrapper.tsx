import { useState, useEffect, ReactNode } from "react";
import { LoginSelection } from "./LoginSelection";
import { PatientAuth } from "./PatientAuth";
import { DoctorAuth } from "./DoctorAuth";
import { AdminAuth } from "./AdminAuth";
import { supabase } from "../../utils/supabase/client";
import { logAuthEvent } from "../../utils/auth/logger";

export interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
  metadata?: any;
  familyAccess?: boolean;
  linkedPatientId?: string;
}

interface AuthWrapperProps {
  children: (user: User & { signOut: () => void }) => ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'select' | 'patient' | 'doctor' | 'admin'>('select');
  const [loading, setLoading] = useState(true);

  // Using singleton Supabase client

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get user role from metadata or database
        const userMetadata = session.user.user_metadata;
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: userMetadata.role || 'patient',
          name: userMetadata.name || session.user.email?.split('@')[0] || 'User',
          metadata: userMetadata
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (userData: User) => {
    setUser(userData);
    setAuthMode('select');
  };

  const handleSignOut = async () => {
    try {
      // Try to log the logout event (non-blocking)
      if (user?.id) {
        try {
          logAuthEvent({
            user_id: user.id,
            action: 'logout',
            success: true
          }).catch(e => console.debug('Could not log logout', e));
        } catch (e) {
          // Ignore logging errors
        }
      }
      
      await supabase.auth.signOut();
      setUser(null);
      setAuthMode('select');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderAuthComponent = () => {
    switch (authMode) {
      case 'patient':
        return (
          <PatientAuth 
            onSignIn={handleSignIn}
            onBack={() => setAuthMode('select')}
          />
        );
      case 'doctor':
        return (
          <DoctorAuth 
            onSignIn={handleSignIn}
            onBack={() => setAuthMode('select')}
          />
        );
      case 'admin':
        return (
          <AdminAuth 
            onSignIn={handleSignIn}
            onBack={() => setAuthMode('select')}
          />
        );
      default:
        return (
          <LoginSelection onSelectUserType={setAuthMode} />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return renderAuthComponent();
  }

  return children({ ...user, signOut: handleSignOut });
}