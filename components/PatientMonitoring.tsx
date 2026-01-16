import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets, 
  Wind, 
  Battery, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Video,
  Bell,
  Users,
  Monitor,
  Wifi,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PatientVitals {
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  timestamp: Date;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  room: string;
  condition: string;
  admissionDate: string;
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    notificationEnabled: boolean;
  }>;
  vitals: PatientVitals;
  alerts: Array<{
    type: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;
  isMonitored: boolean;
  deviceStatus: 'connected' | 'disconnected' | 'low_battery';
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    age: 45,
    room: 'ICU-101',
    condition: 'Post-operative monitoring',
    admissionDate: '2024-01-18',
    emergencyContacts: [
      { name: 'Mary Smith', relationship: 'Spouse', phone: '+1-555-0123', notificationEnabled: true },
      { name: 'David Smith', relationship: 'Son', phone: '+1-555-0124', notificationEnabled: true }
    ],
    vitals: {
      heartRate: 78,
      bloodPressure: { systolic: 128, diastolic: 82 },
      temperature: 98.6,
      oxygenSaturation: 97,
      respiratoryRate: 16,
      timestamp: new Date()
    },
    alerts: [
      { type: 'warning', message: 'Heart rate slightly elevated', timestamp: new Date(Date.now() - 30000) }
    ],
    isMonitored: true,
    deviceStatus: 'connected'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    age: 32,
    room: 'Room-205',
    condition: 'Diabetes management',
    admissionDate: '2024-01-19',
    emergencyContacts: [
      { name: 'Mike Johnson', relationship: 'Husband', phone: '+1-555-0125', notificationEnabled: true },
      { name: 'Linda Johnson', relationship: 'Mother', phone: '+1-555-0126', notificationEnabled: false }
    ],
    vitals: {
      heartRate: 72,
      bloodPressure: { systolic: 118, diastolic: 76 },
      temperature: 98.2,
      oxygenSaturation: 99,
      respiratoryRate: 14,
      timestamp: new Date()
    },
    alerts: [],
    isMonitored: true,
    deviceStatus: 'connected'
  },
  {
    id: '3',
    name: 'Robert Wilson',
    age: 67,
    room: 'CCU-302',
    condition: 'Cardiac monitoring',
    admissionDate: '2024-01-17',
    emergencyContacts: [
      { name: 'Helen Wilson', relationship: 'Wife', phone: '+1-555-0127', notificationEnabled: true },
      { name: 'Jennifer Wilson', relationship: 'Daughter', phone: '+1-555-0128', notificationEnabled: true }
    ],
    vitals: {
      heartRate: 68,
      bloodPressure: { systolic: 145, diastolic: 92 },
      temperature: 99.1,
      oxygenSaturation: 95,
      respiratoryRate: 18,
      timestamp: new Date()
    },
    alerts: [
      { type: 'critical', message: 'Blood pressure elevated', timestamp: new Date(Date.now() - 60000) },
      { type: 'warning', message: 'O2 saturation below normal', timestamp: new Date(Date.now() - 120000) }
    ],
    isMonitored: true,
    deviceStatus: 'low_battery'
  }
];

const vitalsHistory = [
  { time: '00:00', heartRate: 75, bp: 120, temp: 98.6, o2: 98 },
  { time: '04:00', heartRate: 72, bp: 118, temp: 98.4, o2: 97 },
  { time: '08:00', heartRate: 78, bp: 125, temp: 98.7, o2: 96 },
  { time: '12:00', heartRate: 82, bp: 130, temp: 99.1, o2: 95 },
  { time: '16:00', heartRate: 79, bp: 128, temp: 98.9, o2: 97 },
  { time: '20:00', heartRate: 76, bp: 122, temp: 98.5, o2: 98 },
];

export function PatientMonitoring() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(mockPatients[0]);
  const [realTimeUpdate, setRealTimeUpdate] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdate) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate vital signs changes
      const updatedPatients = mockPatients.map(patient => ({
        ...patient,
        vitals: {
          ...patient.vitals,
          heartRate: patient.vitals.heartRate + (Math.random() - 0.5) * 6,
          bloodPressure: {
            systolic: patient.vitals.bloodPressure.systolic + (Math.random() - 0.5) * 8,
            diastolic: patient.vitals.bloodPressure.diastolic + (Math.random() - 0.5) * 5
          },
          temperature: patient.vitals.temperature + (Math.random() - 0.5) * 0.4,
          oxygenSaturation: Math.max(90, Math.min(100, patient.vitals.oxygenSaturation + (Math.random() - 0.5) * 2)),
          timestamp: new Date()
        }
      }));
      
      const currentPatient = updatedPatients.find(p => p.id === selectedPatient.id);
      if (currentPatient) {
        setSelectedPatient(currentPatient);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeUpdate, selectedPatient.id]);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'normal':
        return <Badge className="bg-green-500">Normal</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDeviceStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <Wifi className="h-4 w-4 text-red-500" />;
      case 'low_battery':
        return <Battery className="h-4 w-4 text-yellow-500" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-3 w-3 text-red-500" />;
    if (current < previous) return <TrendingDown className="h-3 w-3 text-green-500" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Patient Monitoring System</h2>
          <p className="text-muted-foreground">Real-time health monitoring for hospitalized patients</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="real-time-toggle">Real-time Updates</Label>
            <Switch
              id="real-time-toggle"
              checked={realTimeUpdate}
              onCheckedChange={setRealTimeUpdate}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Last update: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Select Patient</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockPatients.map((patient) => (
              <div
                key={patient.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPatient.id === patient.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{patient.name}</h4>
                  <div className="flex items-center space-x-1">
                    {getDeviceStatusIcon(patient.deviceStatus)}
                    {patient.alerts.length > 0 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Room: {patient.room}</p>
                  <p>Condition: {patient.condition}</p>
                  <p>Heart Rate: {Math.round(patient.vitals.heartRate)} bpm</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vitals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
          <TabsTrigger value="family">Family Dashboard</TabsTrigger>
          <TabsTrigger value="history">Historical Data</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-6">
          {/* Patient Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedPatient.name}</CardTitle>
                    <CardDescription>
                      Age: {selectedPatient.age} • Room: {selectedPatient.room} • Admitted: {selectedPatient.admissionDate}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getDeviceStatusIcon(selectedPatient.deviceStatus)}
                  <Badge variant={selectedPatient.isMonitored ? "default" : "secondary"}>
                    {selectedPatient.isMonitored ? "Monitoring Active" : "Monitoring Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Vital Signs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center space-x-2">
                  <span>{Math.round(selectedPatient.vitals.heartRate)}</span>
                  <span className="text-sm text-muted-foreground">bpm</span>
                  {getTrendIcon(selectedPatient.vitals.heartRate, 75)}
                </div>
                <div className="mt-2">
                  {getStatusBadge(getVitalStatus('heartRate', selectedPatient.vitals.heartRate))}
                </div>
                <Progress 
                  value={(selectedPatient.vitals.heartRate / 120) * 100} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(selectedPatient.vitals.bloodPressure.systolic)}/
                  {Math.round(selectedPatient.vitals.bloodPressure.diastolic)}
                </div>
                <p className="text-xs text-muted-foreground">mmHg</p>
                <div className="mt-2">
                  {getStatusBadge('normal')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center space-x-2">
                  <span>{selectedPatient.vitals.temperature.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">°F</span>
                  {getTrendIcon(selectedPatient.vitals.temperature, 98.6)}
                </div>
                <div className="mt-2">
                  {getStatusBadge(getVitalStatus('temperature', selectedPatient.vitals.temperature))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Oxygen Saturation</CardTitle>
                <Droplets className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center space-x-2">
                  <span>{Math.round(selectedPatient.vitals.oxygenSaturation)}</span>
                  <span className="text-sm text-muted-foreground">%</span>
                  {getTrendIcon(selectedPatient.vitals.oxygenSaturation, 98)}
                </div>
                <div className="mt-2">
                  {getStatusBadge(getVitalStatus('oxygenSaturation', selectedPatient.vitals.oxygenSaturation))}
                </div>
                <Progress 
                  value={selectedPatient.vitals.oxygenSaturation} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>
          </div>

          {/* Live Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Vital Signs Chart</CardTitle>
              <CardDescription>Last 24 hours monitoring data</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="o2" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Active Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPatient.alerts.length > 0 ? (
                  selectedPatient.alerts.map((alert, index) => (
                    <Alert key={index} className={alert.type === 'critical' ? 'border-red-500' : alert.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        <span>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert</span>
                        <span className="text-sm text-muted-foreground">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </AlertTitle>
                      <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p>No active alerts for this patient</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when and how alerts are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Alert Thresholds</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Heart Rate (bpm)</span>
                      <span className="text-sm text-muted-foreground">50-120</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Oxygen Saturation (%)</span>
                      <span className="text-sm text-muted-foreground">&gt;95</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Temperature (°F)</span>
                      <span className="text-sm text-muted-foreground">96-100.4</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Notification Methods</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS Alerts</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Notifications</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push Notifications</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="space-y-6">
          {/* Family Access Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Family Access Dashboard</span>
              </CardTitle>
              <CardDescription>
                Real-time health updates for family members and emergency contacts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Status for Family */}
                <div className="space-y-4">
                  <h4 className="font-medium">Current Health Status</h4>
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Stable Condition</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.name} is currently stable with all vital signs within normal ranges.
                      Last update: {selectedPatient.vitals.timestamp.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Key Vitals</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 border rounded text-center">
                        <p className="text-sm text-muted-foreground">Heart Rate</p>
                        <p className="font-medium">{Math.round(selectedPatient.vitals.heartRate)} bpm</p>
                      </div>
                      <div className="p-2 border rounded text-center">
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="font-medium">{selectedPatient.vitals.temperature.toFixed(1)}°F</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div className="space-y-4">
                  <h4 className="font-medium">Emergency Contacts</h4>
                  <div className="space-y-3">
                    {selectedPatient.emergencyContacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Bell className={`h-4 w-4 ${contact.notificationEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                            <span className="text-xs">
                              {contact.notificationEnabled ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Communication */}
          <Card>
            <CardHeader>
              <CardTitle>Communication Center</CardTitle>
              <CardDescription>Stay connected with the medical team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="flex items-center space-x-2 h-auto py-4">
                  <Video className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Video Call</p>
                    <p className="text-xs opacity-80">Talk to medical team</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center space-x-2 h-auto py-4">
                  <Phone className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Call Nurse</p>
                    <p className="text-xs text-muted-foreground">Direct line to nursing station</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center space-x-2 h-auto py-4">
                  <Calendar className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Schedule Visit</p>
                    <p className="text-xs text-muted-foreground">Book visiting hours</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Visiting Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Visiting Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Hospital Location</h4>
                  <div className="space-y-1 text-sm">
                    <p>General Hospital</p>
                    <p>123 Medical Center Drive</p>
                    <p>Healthcare City, HC 12345</p>
                    <p className="font-medium mt-2">Room: {selectedPatient.room}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Visiting Hours</h4>
                  <div className="space-y-1 text-sm">
                    <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                    <p>Saturday - Sunday: 10:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground mt-2">
                      Maximum 2 visitors at a time. Please check in at the front desk.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Vital Signs</CardTitle>
              <CardDescription>Track patient's recovery progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={vitalsHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
                  <Line type="monotone" dataKey="bp" stroke="#3b82f6" strokeWidth={2} name="Blood Pressure (Systolic)" />
                  <Line type="monotone" dataKey="o2" stroke="#06b6d4" strokeWidth={2} name="Oxygen Saturation" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recovery Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Vital signs stabilized</p>
                      <p className="text-xs text-muted-foreground">Day 1 - Post-operation</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Pain levels decreased</p>
                      <p className="text-xs text-muted-foreground">Day 2 - Recovery progress</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Physical therapy started</p>
                      <p className="text-xs text-muted-foreground">Day 3 - In progress</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Treatment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Admission Date:</strong> {selectedPatient.admissionDate}</p>
                  <p><strong>Primary Condition:</strong> {selectedPatient.condition}</p>
                  <p><strong>Attending Physician:</strong> Dr. Emily Carter</p>
                  <p><strong>Expected Discharge:</strong> January 25, 2024</p>
                  <p><strong>Current Status:</strong> Stable, recovering well</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}