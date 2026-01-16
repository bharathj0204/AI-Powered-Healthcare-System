import { useState } from "react";
import { indianPatients, generateIndianPatientData } from "./data/IndianMedicalData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Search, Plus, Filter, User, Calendar, Heart, AlertCircle, Eye, Phone, Mail, MapPin, Download, QrCode, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { User as UserType } from "./auth/AuthWrapper";

// Enhanced patient data with additional properties
const enhancedPatients = indianPatients.map((patient, index) => ({
  id: `PAT-${String(index + 1).padStart(3, '0')}`,
  name: patient.name,
  age: patient.age,
  gender: patient.gender,
  condition: patient.condition,
  lastVisit: patient.lastVisit,
  nextAppointment: patient.nextAppointment,
  riskLevel: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
  aiAlerts: Math.floor(Math.random() * 4),
  photo: null,
  phone: patient.phone,
  email: patient.email,
  address: patient.address,
  emergencyContact: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  bloodGroup: patient.bloodGroup,
  height: `${Math.floor(Math.random() * 40) + 150} cm`,
  weight: `${Math.floor(Math.random() * 40) + 50} kg`,
  allergies: ["Penicillin", "Dust", "Pollen", "Nuts"].slice(0, Math.floor(Math.random() * 3) + 1),
  medications: ["Paracetamol 500mg", "Vitamin D3", "Multivitamin"].slice(0, Math.floor(Math.random() * 3) + 1),
  doctor: patient.doctor,
  hospital: "Apollo Hospital",
  accessCode: `ACC-${patient.name.split(' ').map(n => n.charAt(0)).join('')}-${String(index + 1).padStart(3, '0')}`,
  admissionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  vitals: {
    bp: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 70} mmHg`,
    pulse: `${Math.floor(Math.random() * 30) + 60} bpm`,
    temp: `${(Math.random() * 2 + 97).toFixed(1)}°F`,
    oxygen: `${Math.floor(Math.random() * 4) + 96}%`
  }
}));

// Generate additional patients to reach 2000+
const additionalPatients = generateIndianPatientData(2000).map((patient, index) => ({
  id: `PAT-${String(index + 26).padStart(3, '0')}`,
  name: patient.name,
  age: patient.age,
  gender: patient.gender,
  condition: patient.condition,
  lastVisit: patient.lastVisit,
  nextAppointment: patient.nextAppointment,
  riskLevel: Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
  aiAlerts: Math.floor(Math.random() * 4),
  photo: null,
  phone: patient.phone,
  email: patient.email,
  address: patient.address,
  emergencyContact: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  bloodGroup: patient.bloodGroup,
  height: `${Math.floor(Math.random() * 40) + 150} cm`,
  weight: `${Math.floor(Math.random() * 40) + 50} kg`,
  allergies: ["Penicillin", "Dust", "Pollen", "Nuts"].slice(0, Math.floor(Math.random() * 3) + 1),
  medications: ["Paracetamol 500mg", "Vitamin D3", "Multivitamin"].slice(0, Math.floor(Math.random() * 3) + 1),
  doctor: patient.doctor,
  hospital: "Apollo Hospital",
  accessCode: `ACC-${patient.name.split(' ').map(n => n.charAt(0)).join('')}-${String(index + 26).padStart(3, '0')}`,
  admissionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  vitals: {
    bp: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 70} mmHg`,
    pulse: `${Math.floor(Math.random() * 30) + 60} bpm`,
    temp: `${(Math.random() * 2 + 97).toFixed(1)}°F`,
    oxygen: `${Math.floor(Math.random() * 4) + 96}%`
  }
}));

const mockPatients = [...enhancedPatients, ...additionalPatients];

interface PatientManagementProps {
  user: UserType;
}

export function PatientManagement({ user }: PatientManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPatientData, setNewPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    bloodGroup: "",
    condition: "",
    allergies: "",
    medications: ""
  });

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === "all" || patient.riskLevel.toLowerCase() === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddPatient = () => {
    // In a real app, this would make an API call
    toast.success("Patient added successfully!");
  };

  const generateAccessCode = (patient: any) => {
    const code = `${patient.accessCode}-${Date.now().toString().slice(-4)}`;
    navigator.clipboard.writeText(code);
    toast.success("Access code copied to clipboard!");
  };

  const downloadPatientData = (patient: any) => {
    const data = JSON.stringify(patient, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-${patient.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Management</h1>
          <p className="text-muted-foreground">
            Manage patient records and monitor health conditions - {mockPatients.length} patients
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Enter patient information to create a new record.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newPatientData.name}
                  onChange={(e) => setNewPatientData({...newPatientData, name: e.target.value})}
                  placeholder="Patient name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={newPatientData.age}
                  onChange={(e) => setNewPatientData({...newPatientData, age: e.target.value})}
                  placeholder="Age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={newPatientData.gender} onValueChange={(value) => setNewPatientData({...newPatientData, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={newPatientData.bloodGroup} onValueChange={(value) => setNewPatientData({...newPatientData, bloodGroup: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Blood group" />
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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newPatientData.phone}
                  onChange={(e) => setNewPatientData({...newPatientData, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPatientData.email}
                  onChange={(e) => setNewPatientData({...newPatientData, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newPatientData.address}
                  onChange={(e) => setNewPatientData({...newPatientData, address: e.target.value})}
                  placeholder="Full address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  id="emergency"
                  value={newPatientData.emergencyContact}
                  onChange={(e) => setNewPatientData({...newPatientData, emergencyContact: e.target.value})}
                  placeholder="+91 87654 32109"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Primary Condition</Label>
                <Input
                  id="condition"
                  value={newPatientData.condition}
                  onChange={(e) => setNewPatientData({...newPatientData, condition: e.target.value})}
                  placeholder="Primary health condition"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleAddPatient}>Add Patient</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, condition, or ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterRisk} onValueChange={setFilterRisk}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPatients.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{additionalPatients.length} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockPatients.filter(p => p.riskLevel === "High").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(mockPatients.length * 0.05)}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Alerts</CardTitle>
            <Heart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockPatients.reduce((sum, p) => sum + p.aiAlerts, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Active AI-generated alerts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle>Patient List ({filteredPatients.length})</CardTitle>
          <CardDescription>
            Comprehensive list of all registered patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Next Appointment</TableHead>
                  <TableHead>AI Alerts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.slice(0, 50).map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={patient.photo} alt={patient.name} />
                          <AvatarFallback>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} years, {patient.gender}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.condition}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskBadgeColor(patient.riskLevel)}>
                        {patient.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>{patient.nextAppointment}</TableCell>
                    <TableCell>
                      {patient.aiAlerts > 0 && (
                        <Badge variant="destructive">{patient.aiAlerts}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Patient Details - {patient.name}</DialogTitle>
                            </DialogHeader>
                            <Tabs defaultValue="overview" className="w-full">
                              <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="medical">Medical Info</TabsTrigger>
                                <TabsTrigger value="vitals">Current Vitals</TabsTrigger>
                                <TabsTrigger value="family">Family Access</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="overview" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>{patient.name}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{patient.phone}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{patient.email}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{patient.address}</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Medical Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div><strong>Condition:</strong> {patient.condition}</div>
                                      <div><strong>Blood Group:</strong> {patient.bloodGroup}</div>
                                      <div><strong>Height:</strong> {patient.height}</div>
                                      <div><strong>Weight:</strong> {patient.weight}</div>
                                      <div><strong>Doctor:</strong> {patient.doctor}</div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="medical" className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Allergies</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex flex-wrap gap-2">
                                        {patient.allergies.map((allergy, index) => (
                                          <Badge key={index} variant="destructive">{allergy}</Badge>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Current Medications</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="space-y-2">
                                        {patient.medications.map((medication, index) => (
                                          <div key={index} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>{medication}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="vitals" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Blood Pressure</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{patient.vitals.bp}</div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Heart Rate</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{patient.vitals.pulse}</div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Temperature</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{patient.vitals.temp}</div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Oxygen Saturation</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="text-2xl font-bold">{patient.vitals.oxygen}</div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="family" className="space-y-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">Family Dashboard Access</CardTitle>
                                    <CardDescription>
                                      Generate secure access codes for family members to monitor patient's health
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                      <div className="flex-1">
                                        <Label>Current Access Code</Label>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                            {patient.accessCode}
                                          </code>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => generateAccessCode(patient)}
                                          >
                                            <Copy className="h-4 w-4 mr-1" />
                                            Copy
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Emergency Contact</Label>
                                      <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{patient.emergencyContact}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                      <Button variant="outline" size="sm">
                                        <QrCode className="h-4 w-4 mr-1" />
                                        Generate QR Code
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => downloadPatientData(patient)}
                                      >
                                        <Download className="h-4 w-4 mr-1" />
                                        Download Data
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredPatients.length > 50 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing first 50 of {filteredPatients.length} patients. Use search to narrow results.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}