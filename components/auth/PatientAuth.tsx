import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowLeft, User, Eye, EyeOff, Mail, Phone, MapPin, AlertCircle, Shield } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { supabase } from "../../utils/supabase/client";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { User as UserType } from "./AuthWrapper";
import { logAuthEvent, createUserProfile } from "../../utils/auth/logger";
import { mockSignUp, mockSignIn, shouldUseMockAuth, enableMockAuth } from "../../utils/auth/mock-auth";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface PatientAuthProps {
  onSignIn: (user: UserType) => void;
  onBack: () => void;
}

export function PatientAuth({ onSignIn, onBack }: PatientAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [useMockAuth, setUseMockAuth] = useState(shouldUseMockAuth());
  const [showSupabaseError, setShowSupabaseError] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    emergencyContact: "",
    bloodGroup: ""
  });
  const [familyAccessCode, setFamilyAccessCode] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to sign in with email:', loginData.email);
      
      // Use mock auth if enabled
      if (useMockAuth) {
        const { user } = await mockSignIn(loginData.email, loginData.password);
        
        // Check if user has patient role
        if (user.role !== 'patient') {
          throw new Error('This account is not registered as a patient. Please use the correct login portal.');
        }

        toast.success("Welcome back!");
        onSignIn({
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'patient'
        });
        
        setIsLoading(false);
        return;
      }
      
      // Try Supabase sign in first - wrap in try-catch to handle all errors
      try {
        // Sign in with Supabase client directly
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password
        }).catch((fetchError) => {
          // Catch fetch errors at the lowest level
          console.log('Fetch error caught, enabling Demo Mode');
          throw new Error('FETCH_ERROR');
        });

        if (authError) {
          // If it's a fetch error, automatically switch to demo mode
          if (authError.message.includes('Failed to fetch') || 
              authError.message.includes('fetch') || 
              authError.name === 'AuthRetryableFetchError' ||
              authError.name === 'FetchError') {
            throw new Error('FETCH_ERROR');
          } else if (authError.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please try again.');
          } else if (authError.message.includes('Email not confirmed')) {
            throw new Error('Please verify your email address before signing in. Check your inbox for the confirmation link.');
          } else {
            throw new Error(authError.message);
          }
        }

        if (!data.user) {
          throw new Error('No user data returned');
        }

        // Check if user has patient role
        const userRole = data.user.user_metadata?.role || 'patient';
        if (userRole !== 'patient') {
          // Try to log wrong role attempt (non-blocking) - silently fail
          logAuthEvent({
            user_id: data.user.id,
            action: 'login',
            success: false,
            error_message: 'Wrong user role - not a patient'
          }).catch(() => {});
          
          await supabase.auth.signOut().catch(() => {});
          throw new Error('This account is not registered as a patient. Please use the correct login portal.');
        }

        // Log successful login (non-blocking) - silently fail
        logAuthEvent({
          user_id: data.user.id,
          action: 'login',
          success: true
        }).catch(() => {});

        toast.success("Welcome back!");
        onSignIn({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Patient',
          role: 'patient'
        });
      } catch (supabaseError: any) {
        // If it's a fetch error, switch to demo mode without showing error
        if (supabaseError.message === 'FETCH_ERROR' ||
            supabaseError.message?.includes('fetch') || 
            supabaseError.name?.includes('Fetch') ||
            supabaseError.name === 'AuthRetryableFetchError') {
          console.log('🔧 Supabase not available, automatically using Demo Mode');
          enableMockAuth();
          setUseMockAuth(true);
          setShowSupabaseError(true);
          
          // Retry with mock auth - silently
          try {
            const { user } = await mockSignIn(loginData.email, loginData.password);
            
            // Check if user has patient role
            if (user.role !== 'patient') {
              throw new Error('This account is not registered as a patient. Please use the correct login portal.');
            }

            toast.success("Welcome back! (Demo Mode)");
            onSignIn({
              id: user.id,
              email: user.email,
              name: user.name,
              role: 'patient'
            });
            
            setIsLoading(false);
            return;
          } catch (mockError: any) {
            throw mockError;
          }
        }
        
        throw supabaseError;
      }
    } catch (error: any) {
      // Only show error if it's not a fetch error
      if (error.message !== 'FETCH_ERROR') {
        console.error('Sign in error:', error);
        toast.error(error.message || "Failed to sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!signupData.name || !signupData.email || !signupData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to sign up with email:', signupData.email);
      
      // Use mock auth if enabled
      if (useMockAuth) {
        const { user } = await mockSignUp(signupData.email, signupData.password, {
          name: signupData.name,
          role: 'patient',
          phone: signupData.phone,
          address: signupData.address,
          emergencyContact: signupData.emergencyContact,
          bloodGroup: signupData.bloodGroup
        });

        toast.success("Demo account created successfully! Please sign in.");
        
        // Switch to sign in tab
        const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
        signInTab?.click();
        
        // Clear the form
        setSignupData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
          emergencyContact: "",
          bloodGroup: ""
        });
        
        setIsLoading(false);
        return;
      }
      
      // Try Supabase auth first - wrap in try-catch to handle all errors
      try {
        // Sign up with Supabase client directly
        const { data, error: authError } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              name: signupData.name,
              role: 'patient',
              phone: signupData.phone,
              address: signupData.address,
              emergencyContact: signupData.emergencyContact,
              bloodGroup: signupData.bloodGroup
            },
            emailRedirectTo: window.location.origin
          }
        }).catch((fetchError) => {
          // Catch fetch errors at the lowest level
          console.log('Fetch error caught during signup, enabling Demo Mode');
          throw new Error('FETCH_ERROR');
        });

        if (authError) {
          // If it's a fetch error, automatically switch to demo mode
          if (authError.message.includes('Failed to fetch') || 
              authError.message.includes('fetch') ||
              authError.name === 'AuthRetryableFetchError' ||
              authError.name === 'FetchError') {
            throw new Error('FETCH_ERROR');
          } else if (authError.message.includes('User already registered')) {
            throw new Error('An account with this email already exists. Please sign in instead.');
          } else if (authError.message.includes('Email rate limit exceeded')) {
            throw new Error('Too many signup attempts. Please try again in a few minutes.');
          } else {
            throw new Error(authError.message);
          }
        }

        if (!data.user) {
          throw new Error('Account creation failed. Please try again.');
        }

        // Try to create user profile (non-blocking) - silently fail
        createUserProfile(data.user.id, {
          email: signupData.email,
          name: signupData.name,
          role: 'patient',
          phone: signupData.phone,
          address: signupData.address,
          emergencyContact: signupData.emergencyContact,
          bloodGroup: signupData.bloodGroup
        }).catch(() => {});

        // Try to log successful registration (non-blocking) - silently fail
        logAuthEvent({
          user_id: data.user.id,
          action: 'register',
          success: true,
          metadata: {
            role: 'patient',
            name: signupData.name
          }
        }).catch(() => {});

        // Check if email confirmation is required
        if (data.user && !data.session) {
          toast.success("Account created! Please check your email to verify your account before signing in.");
        } else {
          toast.success("Account created successfully! Please sign in.");
        }
        
        // Switch to sign in tab
        const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
        signInTab?.click();
        
        // Clear the form
        setSignupData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          address: "",
          emergencyContact: "",
          bloodGroup: ""
        });
      } catch (supabaseError: any) {
        // If it's a fetch error, switch to demo mode without showing error
        if (supabaseError.message === 'FETCH_ERROR' ||
            supabaseError.message?.includes('fetch') || 
            supabaseError.name?.includes('Fetch') ||
            supabaseError.name === 'AuthRetryableFetchError') {
          console.log('🔧 Supabase not available, automatically using Demo Mode');
          enableMockAuth();
          setUseMockAuth(true);
          setShowSupabaseError(true);
          
          // Retry with mock auth - silently
          try {
            const { user } = await mockSignUp(signupData.email, signupData.password, {
              name: signupData.name,
              role: 'patient',
              phone: signupData.phone,
              address: signupData.address,
              emergencyContact: signupData.emergencyContact,
              bloodGroup: signupData.bloodGroup
            });

            toast.success("Demo account created successfully! Please sign in.");
            
            // Switch to sign in tab
            const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
            signInTab?.click();
            
            // Clear the form
            setSignupData({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              phone: "",
              address: "",
              emergencyContact: "",
              bloodGroup: ""
            });
            
            setIsLoading(false);
            return;
          } catch (mockError: any) {
            throw mockError;
          }
        }
        
        throw supabaseError;
      }
    } catch (error: any) {
      // Only show error if it's not a fetch error
      if (error.message !== 'FETCH_ERROR') {
        console.error('Sign up error:', error);
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFamilyPortalAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyAccessCode) {
      toast.error("Please enter the access code");
      return;
    }

    setIsLoading(true);
    try {
      // Validate access code format (should be like FAMILY-XXXX-XXXX)
      const accessCodePattern = /^FAMILY-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
      if (!accessCodePattern.test(familyAccessCode)) {
        throw new Error('Invalid access code format. Please check and try again.');
      }

      // For demo mode or mock auth, use predefined access codes
      if (useMockAuth) {
        // Demo access codes for family members
        const demoAccessCodes: Record<string, { patientId: string; patientName: string; relationship: string }> = {
          'FAMILY-DEMO-1234': { patientId: 'demo_patient_001', patientName: 'Demo Patient', relationship: 'Family Member' },
          'FAMILY-TEST-5678': { patientId: '1', patientName: 'Rajesh Kumar Sharma', relationship: 'Family Member' },
          'FAMILY-ABCD-9999': { patientId: '2', patientName: 'Priyanka Singh', relationship: 'Family Member' }
        };

        const accessData = demoAccessCodes[familyAccessCode];
        if (!accessData) {
          throw new Error('Invalid access code. Please check with your family member.');
        }

        toast.success(`Welcome! Accessing ${accessData.patientName}'s health dashboard`);
        
        // Sign in as family member with view-only access
        onSignIn({
          id: `family_${accessData.patientId}`,
          email: `family_${accessData.patientId}@family.portal`,
          name: `Family of ${accessData.patientName}`,
          role: 'patient', // Family members use patient portal but with restricted access
          familyAccess: true,
          linkedPatientId: accessData.patientId
        });
        
        setIsLoading(false);
        return;
      }

      // For Supabase, verify the access code with the server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-65f9e3ac/verify-family-access`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ accessCode: familyAccessCode })
        }
      ).catch((fetchError) => {
        console.log('Fetch error in family portal access');
        throw new Error('FETCH_ERROR');
      });

      if (!response.ok) {
        throw new Error('Invalid or expired access code');
      }

      const accessData = await response.json();

      toast.success(`Welcome! Accessing ${accessData.patientName}'s health dashboard`);
      onSignIn({
        id: `family_${accessData.patientId}`,
        email: `family_${accessData.patientId}@family.portal`,
        name: `Family of ${accessData.patientName}`,
        role: 'patient',
        familyAccess: true,
        linkedPatientId: accessData.patientId
      });

    } catch (error: any) {
      if (error.message === 'FETCH_ERROR') {
        console.debug('Supabase not available for family portal access');
        toast.error("Family Portal service is currently unavailable. Please try again later.");
      } else {
        console.error('Family portal access error:', error);
        toast.error(error.message || "Failed to access family portal");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Patient Portal</h1>
              <p className="text-sm text-gray-600">Access your health records</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient Access</CardTitle>
            <CardDescription>
              Sign in to your patient account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Show Supabase error alert if needed */}
            {showSupabaseError && !useMockAuth && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Supabase Not Configured</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Authentication service is not available. You can:</p>
                  <ul className="list-disc list-inside mb-3 text-sm">
                    <li>Enable Demo Mode to test the application</li>
                    <li>Configure Supabase authentication (see TROUBLESHOOTING.md)</li>
                  </ul>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      enableMockAuth();
                      setUseMockAuth(true);
                      setShowSupabaseError(false);
                      toast.success("Demo Mode enabled! You can now create test accounts.");
                    }}
                  >
                    Enable Demo Mode
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Show demo mode indicator */}
            {useMockAuth && (
              <Alert className="mb-4 border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-900">Demo Mode Active</AlertTitle>
                <AlertDescription className="text-orange-800">
                  <p className="text-sm mb-2">Using local storage for authentication. Data is not synced to cloud.</p>
                  <div className="bg-white/50 rounded p-2 mt-2">
                    <p className="text-xs font-semibold mb-1">Demo Login Credentials:</p>
                    <p className="text-xs font-mono">Email: patient@demo.com</p>
                    <p className="text-xs font-mono">Password: demo123</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="family">Family Portal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="patient@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input
                      id="bloodGroup"
                      placeholder="A+, B+, O+, etc."
                      value={signupData.bloodGroup}
                      onChange={(e) => setSignupData({...signupData, bloodGroup: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password *</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="family">
                <form onSubmit={handleFamilyPortalAccess} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Family Member Access</h4>
                        <p className="text-sm text-blue-700">
                          Access your family member's health dashboard using their unique family access code. 
                          This provides view-only access to health records, appointments, and vital information.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="familyAccessCode">Family Access Code *</Label>
                    <Input
                      id="familyAccessCode"
                      type="text"
                      placeholder="FAMILY-XXXX-XXXX"
                      value={familyAccessCode}
                      onChange={(e) => setFamilyAccessCode(e.target.value.toUpperCase())}
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-500">
                      Enter the access code provided by your family member
                    </p>
                  </div>

                  {useMockAuth && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-900 mb-2">Demo Access Codes:</p>
                      <div className="space-y-1 text-xs font-mono text-green-800">
                        <p>FAMILY-DEMO-1234 (Demo Patient)</p>
                        <p>FAMILY-TEST-5678 (Rajesh Kumar Sharma)</p>
                        <p>FAMILY-ABCD-9999 (Priyanka Singh)</p>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Verifying Access..." : "Access Family Dashboard"}
                  </Button>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-600 text-center">
                      <strong>Need an access code?</strong> Ask your family member to generate one from their 
                      patient dashboard under "Family Access" settings.
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Your health data is secure and encrypted</p>
        </div>
        
        {/* Supabase Connection Indicator */}
        <div className="mt-2 text-center text-xs text-gray-400">
          <p>Connected to: mbmvphjqfvzzxtgwyiaj.supabase.co</p>
        </div>
      </div>
    </div>
  );
}