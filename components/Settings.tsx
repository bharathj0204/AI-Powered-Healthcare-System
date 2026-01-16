import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Lock, 
  Globe, 
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
}

interface SettingsProps {
  user: User;
}

export function Settings({ user }: SettingsProps) {
  const [settings, setSettings] = useState({
    // Personal Settings
    displayName: user.name,
    email: user.email,
    phone: "+91 9876543210",
    language: "en",
    timezone: "Asia/Kolkata",
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    medicationReminders: true,
    emergencyAlerts: true,
    systemUpdates: false,
    
    // Privacy Settings
    shareDataForResearch: false,
    allowAnalytics: true,
    profileVisibility: "private",
    
    // Medical Settings (role-specific)
    defaultAppointmentDuration: "30",
    autoSaveRecords: true,
    requireSignature: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "60",
    loginAlerts: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully!`);
  };

  const handleExportData = () => {
    toast.success("Data export initiated. You'll receive an email with download link.");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires admin approval. Contact support for assistance.");
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="medical" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Medical
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => updateSetting('displayName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => updateSetting('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                      <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                      <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                      <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSave('Personal')}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive text messages for urgent updates</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Appointment Reminders</h4>
                    <p className="text-sm text-muted-foreground">Get reminded about upcoming appointments</p>
                  </div>
                  <Switch
                    checked={settings.appointmentReminders}
                    onCheckedChange={(checked) => updateSetting('appointmentReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Medication Reminders</h4>
                    <p className="text-sm text-muted-foreground">Never miss your medication schedule</p>
                  </div>
                  <Switch
                    checked={settings.medicationReminders}
                    onCheckedChange={(checked) => updateSetting('medicationReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Emergency Alerts</h4>
                    <p className="text-sm text-muted-foreground">Critical health notifications</p>
                  </div>
                  <Switch
                    checked={settings.emergencyAlerts}
                    onCheckedChange={(checked) => updateSetting('emergencyAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">System Updates</h4>
                    <p className="text-sm text-muted-foreground">App updates and maintenance notifications</p>
                  </div>
                  <Switch
                    checked={settings.systemUpdates}
                    onCheckedChange={(checked) => updateSetting('systemUpdates', checked)}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave('Notification')}>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control how your data is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Share Data for Research</h4>
                    <p className="text-sm text-muted-foreground">
                      Help improve healthcare by sharing anonymized data
                    </p>
                  </div>
                  <Switch
                    checked={settings.shareDataForResearch}
                    onCheckedChange={(checked) => updateSetting('shareDataForResearch', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Usage Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Allow collection of usage data to improve the platform
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowAnalytics}
                    onCheckedChange={(checked) => updateSetting('allowAnalytics', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={settings.profileVisibility} onValueChange={(value) => updateSetting('profileVisibility', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private - Only visible to healthcare providers</SelectItem>
                      <SelectItem value="limited">Limited - Visible to connected family members</SelectItem>
                      <SelectItem value="public">Public - Visible to other patients (anonymized)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSave('Privacy')}>
                <Save className="mr-2 h-4 w-4" />
                Update Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button onClick={() => handleSave('Password')}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select value={settings.sessionTimeout} onValueChange={(value) => updateSetting('sessionTimeout', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="0">Never timeout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Login Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.loginAlerts}
                    onCheckedChange={(checked) => updateSetting('loginAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical Settings</CardTitle>
              <CardDescription>
                Configure medical-specific preferences and defaults
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user.role === 'doctor' || user.role === 'admin' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Appointment Duration</Label>
                    <Select value={settings.defaultAppointmentDuration} onValueChange={(value) => updateSetting('defaultAppointmentDuration', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-save Records</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically save patient records while typing
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoSaveRecords}
                      onCheckedChange={(checked) => updateSetting('autoSaveRecords', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Digital Signature</h4>
                      <p className="text-sm text-muted-foreground">
                        Require digital signature for prescriptions
                      </p>
                    </div>
                    <Switch
                      checked={settings.requireSignature}
                      onCheckedChange={(checked) => updateSetting('requireSignature', checked)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Patient Medical Preferences</h4>
                    <p className="text-sm text-blue-700">
                      Your medical preferences are managed by your healthcare provider. 
                      Contact your doctor to update specific medical settings.
                    </p>
                  </div>
                </div>
              )}
              <Button onClick={() => handleSave('Medical')}>
                <Save className="mr-2 h-4 w-4" />
                Save Medical Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export, backup, or delete your account data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Export Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Download all your data in a portable format
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Import Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Import medical records from other systems
                    </p>
                  </div>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                  <div>
                    <h4 className="font-medium text-red-700">Delete Account</h4>
                    <p className="text-sm text-red-600">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>
                Application information and version details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Version</p>
                  <p className="text-muted-foreground">GoHealth v2.1.0</p>
                </div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">October 7, 2025</p>
                </div>
                <div>
                  <p className="font-medium">Build</p>
                  <p className="text-muted-foreground">Production</p>
                </div>
                <div>
                  <p className="font-medium">Support</p>
                  <p className="text-muted-foreground">support@gohealth.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}