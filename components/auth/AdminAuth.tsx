import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ArrowLeft, Shield, Eye, EyeOff, Key, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../utils/supabase/client";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { User as UserType } from "./AuthWrapper";
import { logAuthEvent, createUserProfile } from "../../utils/auth/logger";
import { shouldUseMockAuth, mockSignIn, mockSignUp, enableMockAuth } from "../../utils/auth/mock-auth";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface AdminAuthProps {
  onSignIn: (user: UserType) => void;
  onBack: () => void;
}

export function AdminAuth({ onSignIn, onBack }: AdminAuthProps) {
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
    adminKey: "",
    department: "",
    employeeId: ""
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      if (useMockAuth) {
        const { user } = await mockSignIn(loginData.email, loginData.password);
        if (!user) {
          throw new Error("Invalid email or password");
        }
        toast.success("Welcome back, Administrator!");
        onSignIn({
          id: user.id,
          email: user.email || '',
          name: user.name || 'Admin',
          role: 'admin'
        });
      } else {
        // Sign in with Supabase client directly - wrap to catch fetch errors
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password
        }).catch((fetchError) => {
          // Catch fetch errors at the lowest level
          console.debug('Fetch error caught in admin auth:', fetchError);
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

        // Check if user has admin role
        const userRole = data.user.user_metadata?.role || 'patient';
        if (userRole !== 'admin') {
          // Try to log wrong role attempt (non-blocking) - silently fail
          logAuthEvent({
            user_id: data.user.id,
            action: 'login',
            success: false,
            error_message: 'Wrong user role - not an admin'
          }).catch(() => {});
          
          await supabase.auth.signOut().catch(() => {});
          throw new Error('This account does not have administrator privileges. Please use the correct login portal.');
        }

        // Log successful login (non-blocking) - silently fail
        logAuthEvent({
          user_id: data.user.id,
          action: 'login',
          success: true
        }).catch(() => {});

        toast.success("Welcome back, Administrator!");
        onSignIn({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Admin',
          role: 'admin'
        });
      }
    } catch (error: any) {
      // Don't show fetch errors to user - just log them
      if (error.message === 'FETCH_ERROR') {
        console.debug('Supabase not available for admin auth');
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

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.adminKey) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Verify admin key (in production, this should be validated on the server)
    const ADMIN_KEY = "GOHEALTH_ADMIN_2024";
    if (signupData.adminKey !== ADMIN_KEY) {
      toast.error("Invalid administrator key. Contact system administrator for access.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      if (useMockAuth) {
        const user = await mockSignUp(signupData.email, signupData.password, {
          name: signupData.name,
          role: 'admin',
          department: signupData.department,
          employeeId: signupData.employeeId
        });
        if (!user) {
          throw new Error("Failed to create account");
        }
        toast.success("Administrator account created successfully! Please sign in.");
        const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
        signInTab?.click();
        
        // Clear the form
        setSignupData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          adminKey: "",
          department: "",
          employeeId: ""
        });
      } else {
        // Sign up with Supabase client directly - wrap to catch fetch errors
        const { data, error: authError } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              name: signupData.name,
              role: 'admin',
              department: signupData.department,
              employeeId: signupData.employeeId
            }
          }
        }).catch((fetchError) => {
          // Catch fetch errors at the lowest level
          console.debug('Fetch error caught in admin signup:', fetchError);
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
          role: 'admin'
        }).catch(() => {});

        // Try to log successful registration (non-blocking) - silently fail
        logAuthEvent({
          user_id: data.user.id,
          action: 'register',
          success: true,
          metadata: {
            role: 'admin',
            name: signupData.name,
            department: signupData.department
          }
        }).catch(() => {});

        toast.success("Administrator account created successfully! Please sign in.");
        const signInTab = document.querySelector('[value="signin"]') as HTMLElement;
        signInTab?.click();
        
        // Clear the form
        setSignupData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          adminKey: "",
          department: "",
          employeeId: ""
        });
      }
    } catch (error: any) {
      // Don't show fetch errors to user - just log them
      if (error.message === 'FETCH_ERROR') {
        console.debug('Supabase not available for admin signup');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Admin Portal</h1>
              <p className="text-sm text-gray-600">System administration</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Administrator Access</CardTitle>
            <CardDescription>
              Sign in to your admin account or register with admin privileges
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Show demo mode indicator */}
            {useMockAuth && (
              <Alert className="mb-4 border-purple-200 bg-purple-50">
                <AlertCircle className="h-4 w-4 text-purple-600" />
                <AlertTitle className="text-purple-900">Demo Mode Active</AlertTitle>
                <AlertDescription className="text-purple-800">
                  <p className="text-sm mb-2">Using local storage for authentication. Data is not synced to cloud.</p>
                  <div className="bg-white/50 rounded p-2 mt-2">
                    <p className="text-xs font-semibold mb-1">Demo Login Credentials:</p>
                    <p className="text-xs font-mono">Email: admin@demo.com</p>
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
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@gohealth.com"
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
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Admin"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Admin Name"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="admin@gohealth.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminKey">Admin Access Key *</Label>
                    <div className="relative">
                      <Input
                        id="adminKey"
                        type="password"
                        placeholder="Enter admin access key"
                        value={signupData.adminKey}
                        onChange={(e) => setSignupData({...signupData, adminKey: e.target.value})}
                      />
                      <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Contact system administrator for access key
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="IT, Administration, etc."
                      value={signupData.department}
                      onChange={(e) => setSignupData({...signupData, department: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      placeholder="Employee identification number"
                      value={signupData.employeeId}
                      onChange={(e) => setSignupData({...signupData, employeeId: e.target.value})}
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
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Register as Admin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>⚠️ Admin accounts require verification</p>
          <p className="mt-1">Default admin key: <code className="bg-gray-100 px-1 rounded">admin123</code></p>
        </div>
      </div>
    </div>
  );
}