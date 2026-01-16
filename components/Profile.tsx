import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { 
  User, 
  Stethoscope, 
  Shield, 
  Camera, 
  Edit, 
  Save, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase,
  GraduationCap,
  Award,
  Heart,
  Activity,
  Clock,
  Star,
  FileText,
  Download,
  Upload,
  Users,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
}

interface ProfileProps {
  user: User;
}

export function Profile({ user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  const [profileData, setProfileData] = useState({
    // Personal Information
    fullName: user.name,
    email: user.email,
    phone: "+91 9876543210",
    dateOfBirth: "1985-06-15",
    gender: "male",
    address: "123 Health Street, Medical District, Mumbai, Maharashtra 400001",
    emergencyContact: {
      name: "Priya Sharma",
      relationship: "Spouse",
      phone: "+91 9876543211"
    },
    
    // Professional Information (for doctors/admins)
    specialization: user.role === 'doctor' ? "Cardiology" : "",
    licenseNumber: user.role === 'doctor' ? "MH12345678" : "",
    experience: user.role === 'doctor' ? "12" : "",
    education: user.role === 'doctor' ? "MBBS, MD - Cardiology" : "",
    hospital: user.role === 'doctor' ? "Apollo Hospital Mumbai" : "",
    consultationFee: user.role === 'doctor' ? "1500" : "",
    
    // Medical Information (for patients)
    bloodGroup: user.role === 'patient' ? "O+" : "",
    height: user.role === 'patient' ? "175" : "",
    weight: user.role === 'patient' ? "70" : "",
    allergies: user.role === 'patient' ? ["Penicillin", "Peanuts"] : [],
    medications: user.role === 'patient' ? ["Metformin 500mg"] : [],
    conditions: user.role === 'patient' ? ["Type 2 Diabetes", "Hypertension"] : [],
    
    // Bio and preferences
    bio: user.role === 'doctor' ? "Experienced cardiologist with 12+ years of practice. Specializing in interventional cardiology and heart disease prevention." : 
         user.role === 'patient' ? "Health-conscious individual managing diabetes through diet and exercise." : 
         "System administrator ensuring platform security and compliance.",
    languages: ["English", "Hindi", "Marathi"],
    timezone: "Asia/Kolkata",
    profilePicture: null
  });

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success("Profile picture uploaded successfully!");
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'doctor': return <Stethoscope className="h-5 w-5" />;
      case 'admin': return <Shield className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case 'patient': return 'bg-blue-100 text-blue-800';
      case 'doctor': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock statistics based on role
  const getStatistics = () => {
    if (user.role === 'patient') {
      return [
        { label: "Appointments", value: "24", change: "+3 this month", icon: Calendar },
        { label: "Health Score", value: "85%", change: "+5% improved", icon: Heart },
        { label: "Medications", value: "3", change: "Active prescriptions", icon: FileText },
        { label: "Last Checkup", value: "15 days", change: "ago", icon: Clock }
      ];
    } else if (user.role === 'doctor') {
      return [
        { label: "Patients", value: "247", change: "+12 this month", icon: Users },
        { label: "Appointments", value: "156", change: "this month", icon: Calendar },
        { label: "Rating", value: "4.8", change: "⭐ (127 reviews)", icon: Star },
        { label: "Experience", value: "12 years", change: "practicing", icon: Award }
      ];
    } else {
      return [
        { label: "Total Users", value: "1,247", change: "+23 this week", icon: Users },
        { label: "System Uptime", value: "99.9%", change: "this month", icon: TrendingUp },
        { label: "Active Sessions", value: "156", change: "currently online", icon: Activity },
        { label: "Support Tickets", value: "8", change: "pending", icon: FileText }
      ];
    }
  };

  const recentActivity = [
    { action: "Updated medical records", time: "2 hours ago", icon: FileText },
    { action: "Completed appointment with Dr. Kumar", time: "1 day ago", icon: Calendar },
    { action: "Uploaded lab results", time: "3 days ago", icon: Upload },
    { action: "Changed password", time: "1 week ago", icon: Shield }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.profilePicture || undefined} />
                  <AvatarFallback className="text-xl">
                    {getInitials(profileData.fullName)}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
                  <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                    <Camera className="h-4 w-4" />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                  <Badge className={getRoleBadgeColor()}>
                    <span className="flex items-center space-x-1">
                      {getRoleIcon()}
                      <span>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                    </span>
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Mumbai, India</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground max-w-2xl">
                  {profileData.bio}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        {getStatistics().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {user.role === 'patient' ? 'Medical' : 'Professional'}
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={profileData.gender} onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => setProfileData(prev => ({ ...prev, timezone: value }))} disabled={!isEditing}>
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
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Name</Label>
                    <Input
                      id="emergencyName"
                      value={profileData.emergencyContact.name}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={profileData.emergencyContact.relationship}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={profileData.emergencyContact.phone}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          {user.role === 'doctor' || user.role === 'admin' ? (
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Your professional credentials and experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={profileData.specialization}
                      onChange={(e) => setProfileData(prev => ({ ...prev, specialization: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={profileData.licenseNumber}
                      onChange={(e) => setProfileData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      value={profileData.experience}
                      onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                    <Input
                      id="consultationFee"
                      value={profileData.consultationFee}
                      onChange={(e) => setProfileData(prev => ({ ...prev, consultationFee: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    value={profileData.education}
                    onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hospital">Current Hospital/Clinic</Label>
                  <Input
                    id="hospital"
                    value={profileData.hospital}
                    onChange={(e) => setProfileData(prev => ({ ...prev, hospital: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>
                  Your health profile and medical history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={profileData.bloodGroup} onValueChange={(value) => setProfileData(prev => ({ ...prev, bloodGroup: value }))} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      value={profileData.height}
                      onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      value={profileData.weight}
                      onChange={(e) => setProfileData(prev => ({ ...prev, weight: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Known Allergies</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Current Medications</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.medications.map((medication, index) => (
                        <Badge key={index} variant="outline">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Medical Conditions</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.conditions.map((condition, index) => (
                        <Badge key={index} variant="outline">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>
                  Complete your profile for better experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Basic Information</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Contact Details</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Professional Info</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Picture</span>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall Completion</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Files</CardTitle>
              <CardDescription>
                Manage your uploaded documents and certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Upload Documents</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload medical certificates, licenses, or other important documents
                  </p>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Files
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Uploaded Documents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Medical License</p>
                          <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Degree Certificate</p>
                          <p className="text-xs text-muted-foreground">PDF • 2.1 MB</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium">Blood Test Report</p>
                          <p className="text-xs text-muted-foreground">PDF • 0.8 MB</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}