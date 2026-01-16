import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "./ui/progress";
import { 
  Heart, 
  Thermometer, 
  Droplets, 
  Activity, 
  Phone, 
  Video, 
  MessageCircle,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Hospital,
  User,
  Calendar,
  Bell,
  Shield,
  Wifi,
  WifiOff
} from "lucide-react";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PatientVitals {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  timestamp: string;
}

interface PatientInfo {
  id: string;
  name: string;
  age: number;
  room: string;
  condition: string;
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    notificationEnabled: boolean;
  }>;
}

interface Alert {
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

interface FamilyDashboardData {
  patient: PatientInfo;
  currentVitals: PatientVitals;
  activeAlerts: Alert[];
  lastUpdate: string;
}

export function FamilyDashboard() {
  const [patientId, setPatientId] = useState("1");
  const [dashboardData, setDashboardData] = useState<FamilyDashboardData | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate family member authentication
  const handleAuthentication = () => {
    if (accessCode === "FAMILY123") { // In real app, this would be secure
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      alert("Invalid access code");
    }
  };

  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-65f9e3ac/family/${patientId}/dashboard`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setIsConnected(true);
        setLastRefresh(new Date());
      } else {
        console.error('Failed to fetch dashboard data');
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [patientId, isAuthenticated]);

  const getVitalStatus = (vital: string, value: number) => {
    switch (vital) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'warning';
        if (value < 50 || value > 120) return 'critical';
        return 'normal';
      case 'oxygenSaturation':
        if (value < 95) return 'critical';
        if (value < 97) return 'warning';
        return 'normal';
      case 'temperature':
        if (value > 100.4 || value < 96) return 'warning';
        if (value > 103 || value < 95) return 'critical';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'normal':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Family Access Portal</CardTitle>
            <CardDescription>
              Enter your access code to view your loved one's health information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                type="password"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuthentication()}
              />
            </div>
            <Button onClick={handleAuthentication} className="w-full">
              Access Dashboard
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <p>For demo purposes, use code: <strong>FAMILY123</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p>Loading patient information...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <h3 className="font-semibold mb-2">Unable to Load Information</h3>
            <p className="text-muted-foreground mb-4">
              We're having trouble connecting to the hospital system.
            </p>
            <Button onClick={fetchDashboardData}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Hospital className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Family Portal</h1>
                <p className="text-sm text-muted-foreground">Real-time health monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                Updated: {lastRefresh.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {dashboardData.patient?.name?.split(' ').map(n => n[0]).join('') || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{dashboardData.patient?.name}</CardTitle>
                  <CardDescription>
                    Room {dashboardData.patient?.room} • {dashboardData.patient?.condition}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">General Hospital</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Last update: {dashboardData.lastUpdate ? new Date(dashboardData.lastUpdate).toLocaleTimeString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {dashboardData.activeAlerts?.length > 0 ? (
                  <Badge variant="destructive" className="mb-2">
                    {dashboardData.activeAlerts.length} Alert(s)
                  </Badge>
                ) : (
                  <Badge className="bg-green-500 mb-2">Stable</Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Active Alerts */}
        {dashboardData.activeAlerts && dashboardData.activeAlerts.length > 0 && (
          <div className="space-y-3">
            {dashboardData.activeAlerts.map((alert, index) => (
              <Alert key={index} className={`border-l-4 ${
                alert.type === 'critical' ? 'border-l-red-500 bg-red-50' : 
                alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' : 
                'border-l-blue-500 bg-blue-50'
              }`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Current Vital Signs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.currentVitals?.heartRate ? Math.round(dashboardData.currentVitals.heartRate) : '--'}
                <span className="text-sm text-muted-foreground ml-1">bpm</span>
              </div>
              {dashboardData.currentVitals?.heartRate && (
                <div className={`text-xs px-2 py-1 rounded-full mt-2 ${
                  getStatusColor(getVitalStatus('heartRate', dashboardData.currentVitals.heartRate))
                }`}>
                  {getVitalStatus('heartRate', dashboardData.currentVitals.heartRate) === 'normal' ? 'Normal' : 
                   getVitalStatus('heartRate', dashboardData.currentVitals.heartRate) === 'warning' ? 'Attention Needed' : 'Critical'}
                </div>
              )}
              {dashboardData.currentVitals?.heartRate && (
                <Progress 
                  value={(dashboardData.currentVitals.heartRate / 120) * 100} 
                  className="mt-2" 
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.currentVitals?.bloodPressure ? 
                  `${Math.round(dashboardData.currentVitals.bloodPressure.systolic)}/${Math.round(dashboardData.currentVitals.bloodPressure.diastolic)}` 
                  : '--/--'}
              </div>
              <p className="text-xs text-muted-foreground">mmHg</p>
              <div className="text-xs px-2 py-1 rounded-full mt-2 bg-green-50 text-green-600">
                Normal Range
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.currentVitals?.temperature ? dashboardData.currentVitals.temperature.toFixed(1) : '--'}
                <span className="text-sm text-muted-foreground ml-1">°F</span>
              </div>
              {dashboardData.currentVitals?.temperature && (
                <div className={`text-xs px-2 py-1 rounded-full mt-2 ${
                  getStatusColor(getVitalStatus('temperature', dashboardData.currentVitals.temperature))
                }`}>
                  {getVitalStatus('temperature', dashboardData.currentVitals.temperature) === 'normal' ? 'Normal' : 
                   getVitalStatus('temperature', dashboardData.currentVitals.temperature) === 'warning' ? 'Elevated' : 'Critical'}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Oxygen Level</CardTitle>
              <Droplets className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.currentVitals?.oxygenSaturation ? Math.round(dashboardData.currentVitals.oxygenSaturation) : '--'}
                <span className="text-sm text-muted-foreground ml-1">%</span>
              </div>
              {dashboardData.currentVitals?.oxygenSaturation && (
                <div className={`text-xs px-2 py-1 rounded-full mt-2 ${
                  getStatusColor(getVitalStatus('oxygenSaturation', dashboardData.currentVitals.oxygenSaturation))
                }`}>
                  {getVitalStatus('oxygenSaturation', dashboardData.currentVitals.oxygenSaturation) === 'normal' ? 'Good' : 
                   getVitalStatus('oxygenSaturation', dashboardData.currentVitals.oxygenSaturation) === 'warning' ? 'Low' : 'Critical'}
                </div>
              )}
              {dashboardData.currentVitals?.oxygenSaturation && (
                <Progress 
                  value={dashboardData.currentVitals.oxygenSaturation} 
                  className="mt-2" 
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Communication and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contact Medical Team</span>
              </CardTitle>
              <CardDescription>Connect with the healthcare team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Video Call Nurse</span>
              </Button>
              <Button variant="outline" className="w-full flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Call Nursing Station</span>
              </Button>
              <Button variant="outline" className="w-full flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Send Message</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Visiting Information</span>
              </CardTitle>
              <CardDescription>Plan your visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p><strong>Visiting Hours:</strong></p>
                <p>Daily: 8:00 AM - 8:00 PM</p>
                <p><strong>Room:</strong> {dashboardData.patient?.room}</p>
                <p><strong>Floor:</strong> 3rd Floor, West Wing</p>
              </div>
              <Button variant="outline" className="w-full">
                Schedule Visit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Health Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Current Health Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-800">
                  {dashboardData.activeAlerts?.length > 0 ? 'Stable with Monitoring' : 'Stable Condition'}
                </span>
              </div>
              <p className="text-sm text-green-700">
                {dashboardData.patient?.name} is currently stable and receiving excellent care. 
                All vital signs are being monitored continuously, and the medical team is providing 
                appropriate treatment for {dashboardData.patient?.condition?.toLowerCase()}.
              </p>
              {dashboardData.lastUpdate && (
                <p className="text-xs text-green-600 mt-2">
                  Last medical update: {new Date(dashboardData.lastUpdate).toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Auto-refresh notification */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>This dashboard updates automatically every 30 seconds</span>
          </p>
        </div>
      </div>
    </div>
  );
}