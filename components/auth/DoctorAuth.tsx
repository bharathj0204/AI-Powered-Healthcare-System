import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ArrowLeft, Stethoscope, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { supabase } from "../../utils/supabase/client";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { User as UserType } from "./AuthWrapper";
import { logAuthEvent, createUserProfile } from "../../utils/auth/logger";
import { shouldUseMockAuth, mockSignIn, mockSignUp, enableMockAuth } from "../../utils/auth/mock-auth";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface DoctorAuthProps {
  onSignIn: (user: UserType) => void;
  onBack: () => void;
}

export function DoctorAuth({ onSignIn, onBack }: DoctorAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [useMockAuth, setUseMockAuth] = useState(shouldUseMockAuth());
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    specialization: "",
    hospital: "",
    experience: "",
    qualification: ""
  });

  const specializations = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Neurology",
    "Oncology", "Orthopedics", "Pediatrics", "Psychiatry", "Pulmonology",
    "Radiology", "Surgery", "Urology", "General Medicine", "Emergency Medicine"
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Use mock auth if enabled
      if (useMockAuth) {
        const { user } = await mockSignIn(loginData.email, loginData.password);
        
        // Check if user has doctor role
        if (user.role !== 'doctor') {
          throw new Error('This account is not registered as a doctor. Please use the correct login portal.');
        }

        toast.success("Welcome back, Doctor!");
        onSignIn({
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'doctor'
        });
        setIsLoading(false);
        return;
      }
      
      // Sign in with Supabase client directly - wrap to catch fetch errors
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      }).catch((fetchError) => {
        // Catch fetch errors at the lowest level
        console.debug('Fetch error caught in doctor auth:', fetchError);
        throw new Error('FETCH_ERROR');
      });

      if (authError) {
        // Check for fetch errors
        if (authError.message.includes('Failed to fetch') || 
            authError.message.includes('fetch') || 
            authError.name === 'AuthRetryableFetchError' ||
            authError.name === 'FetchError') {
          throw new Error('FETCH_ERROR');
        }
        
        // Try to log failed login attempt (non-blocking) - silently fail
        if (data?.user?.id) {
          logAuthEvent({
            user_id: data.user.id,
            action: 'login',
            success: false,
            error_message: authError.message
          }).catch(() => {});
        }
        
        throw new Error(authError.message);
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Check if user has doctor role
      const userRole = data.user.user_metadata?.role || 'patient';
      if (userRole !== 'doctor') {
        // Try to log wrong role attempt (non-blocking) - silently fail
        logAuthEvent({
          user_id: data.user.id,
          action: 'login',
          success: false,
          error_message: 'Wrong user role - not a doctor'
        }).catch(() => {});
        
        await supabase.auth.signOut().catch(() => {});
        throw new Error('This account is not registered as a doctor. Please use the correct login portal.');
      }

      // Log successful login (non-blocking) - silently fail
      logAuthEvent({
        user_id: data.user.id,
        action: 'login',
        success: true
      }).catch(() => {});

      toast.success("Welcome back, Doctor!");
      onSignIn({
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Doctor',
        role: 'doctor'
      });
    } catch (error: any) {
      // Don't show fetch errors to user - just log them
      if (error.message === 'FETCH_ERROR') {
        console.debug('Supabase not available for doctor auth');
        toast.error("Authentication service is currently unavailable. Please try again later or contact support.");
      } else {
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

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.licenseNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      if (useMockAuth) {
        const user = mockSignUp(signupData.email, signupData.password, signupData.name, signupData.licenseNumber, signupData.specialization, signupData.hospital, signupData.experience, signupData.qualification);
        if (!user) {
          throw new Error("Failed to create account");
        }
        toast.success("Doctor account created successfully! Please sign in.");
        const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
        signInTab?.click();
        
        // Clear the form
        setSignupData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          licenseNumber: "",
          specialization: "",
          hospital: "",
          experience: "",
          qualification: ""
        });
      } else {
        // Sign up with Supabase client directly - wrap to catch fetch errors
        const { data, error: authError } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              name: signupData.name,
              role: 'doctor',
              licenseNumber: signupData.licenseNumber,
              specialization: signupData.specialization,
              hospital: signupData.hospital,
              experience: signupData.experience,
              qualification: signupData.qualification
            }
          }
        }).catch((fetchError) => {
          // Catch fetch errors at the lowest level
          console.debug('Fetch error caught in doctor signup:', fetchError);
          throw new Error('FETCH_ERROR');
        });

        if (authError) {
          // Check for fetch errors
          if (authError.message.includes('Failed to fetch') || 
              authError.message.includes('fetch') || 
              authError.name === 'AuthRetryableFetchError' ||
              authError.name === 'FetchError') {
            throw new Error('FETCH_ERROR');
          }
          
          throw new Error(authError.message);
        }

        if (!data.user) {
          throw new Error('No user data returned');
        }

        // Try to create user profile (non-blocking) - silently fail
        createUserProfile(data.user.id, {
          email: signupData.email,
          name: signupData.name,
          role: 'doctor',
          specialization: signupData.specialization,
          licenseNumber: signupData.licenseNumber
        }).catch(() => {});

        // Try to log successful registration (non-blocking) - silently fail
        logAuthEvent({
          user_id: data.user.id,
          action: 'register',
          success: true,
          metadata: {
            role: 'doctor',
            name: signupData.name,
            specialization: signupData.specialization
          }
        }).catch(() => {});

        toast.success("Doctor account created successfully! Please sign in.");
        const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
        signInTab?.click();
        
        // Clear the form
        setSignupData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          licenseNumber: "",
          specialization: "",
          hospital: "",
          experience: "",
          qualification: ""
        });
      }
    } catch (error: any) {
      // Don't show fetch errors to user - just log them
      if (error.message === 'FETCH_ERROR') {
        console.debug('Supabase not available for doctor signup');
        toast.error("Authentication service is currently unavailable. Please try again later or contact support.");
      } else {
        console.error('Sign up error:', error);
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Stethoscope className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Doctor Portal</h1>
              <p className="text-sm text-gray-600">Manage your medical practice</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Access</CardTitle>
            <CardDescription>
              Sign in to your doctor account or register as a new medical professional
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Show demo mode indicator */}
            {useMockAuth && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Demo Mode Active</AlertTitle>
                <AlertDescription className="text-green-800">
                  <p className="text-sm mb-2">Using local storage for authentication. Data is not synced to cloud.</p>
                  <div className="bg-white/50 rounded p-2 mt-2">
                    <p className="text-xs font-semibold mb-1">Demo Login Credentials:</p>
                    <p className="text-xs font-mono">Email: doctor@demo.com</p>
                    <p className="text-xs font-mono">Password: demo123</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@hospital.com"
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
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
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
                      placeholder="Dr. John Smith"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">Medical License Number *</Label>
                    <Input
                      id="license"
                      placeholder="Medical license number"
                      value={signupData.licenseNumber}
                      onChange={(e) => setSignupData({...signupData, licenseNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Select value={signupData.specialization} onValueChange={(value) => setSignupData({...signupData, specialization: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital/Clinic</Label>
                    <Input
                      id="hospital"
                      placeholder="Hospital or clinic name"
                      value={signupData.hospital}
                      onChange={(e) => setSignupData({...signupData, hospital: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      placeholder="MBBS, MD, etc."
                      value={signupData.qualification}
                      onChange={(e) => setSignupData({...signupData, qualification: e.target.value})}
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
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Register as Doctor"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Medical professional verification required</p>
        </div>
      </div>
    </div>
  );
}