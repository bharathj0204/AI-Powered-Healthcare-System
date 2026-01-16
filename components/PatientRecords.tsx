import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Download, 
  Upload,
  Calendar,
  User,
  Heart,
  Pill,
  TestTube,
  Image,
  FileImage,
  Eye,
  Shield,
  Clock,
  AlertCircle,
  Printer,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { User as UserType } from "./auth/AuthWrapper";

interface PatientRecordsProps {
  user: UserType;
}
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: 'consultation' | 'lab_result' | 'imaging' | 'prescription' | 'procedure' | 'emergency';
  title: string;
  description: string;
  doctor: string;
  department: string;
  attachments?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'completed' | 'reviewed' | 'archived';
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
  };
  lastVisit: string;
  phone: string;
  email: string;
  address: string;
}

// Enhanced Indian patient data
const mockPatients: Patient[] = [
  {
    id: 'PAT-001',
    name: 'Rajesh Kumar Sharma',
    age: 45,
    gender: 'Male',
    bloodType: 'B+',
    allergies: ['Penicillin', 'Dust'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    emergencyContact: {
      name: 'Sunita Sharma',
      phone: '+91 87654 32109',
      relationship: 'Spouse'
    },
    insurance: {
      provider: 'LIC Health Insurance',
      policyNumber: 'LIC-12345678'
    },
    lastVisit: '2024-01-18',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@email.com',
    address: '123 MG Road, Delhi, 110001'
  },
  {
    id: 'PAT-002',
    name: 'Priya Devi Gupta',
    age: 32,
    gender: 'Female',
    bloodType: 'O+',
    allergies: ['Sulfa drugs'],
    chronicConditions: ['Asthma', 'Migraine'],
    emergencyContact: {
      name: 'Amit Gupta',
      phone: '+91 76543 21098',
      relationship: 'Husband'
    },
    insurance: {
      provider: 'Star Health Insurance',
      policyNumber: 'STAR-87654321'
    },
    lastVisit: '2024-01-20',
    phone: '+91 87654 32109',
    email: 'priya.gupta@email.com',
    address: '456 Park Street, Mumbai, 400001'
  },
  {
    id: 'PAT-003',
    name: 'Mohammed Ali Khan',
    age: 28,
    gender: 'Male',
    bloodType: 'A+',
    allergies: ['Aspirin'],
    chronicConditions: ['None'],
    emergencyContact: {
      name: 'Fatima Khan',
      phone: '+91 65432 10987',
      relationship: 'Mother'
    },
    insurance: {
      provider: 'HDFC ERGO Health',
      policyNumber: 'HDFC-56789012'
    },
    lastVisit: '2024-01-22',
    phone: '+91 76543 21098',
    email: 'mohammed.khan@email.com',
    address: '789 Brigade Road, Bangalore, 560001'
  }
];

// Enhanced medical records with Indian context and medications
const mockRecords: MedicalRecord[] = [
  {
    id: 'REC-001',
    patientId: 'PAT-001',
    patientName: 'Rajesh Kumar Sharma',
    date: '2024-01-18',
    type: 'consultation',
    title: 'Diabetes Management Consultation',
    description: 'Patient reports good glucose control with current medication regimen. HbA1c levels improved from 8.2% to 7.1%. Blood pressure slightly elevated at 140/90. Recommended dietary modifications and increased physical activity. Continue current diabetes medications with minor dosage adjustments.',
    doctor: 'Dr. Priya Sharma',
    department: 'Endocrinology',
    priority: 'medium',
    status: 'completed',
    attachments: ['glucose_chart_jan2024.pdf', 'hba1c_report.pdf'],
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '3 months' },
      { name: 'Glimepiride', dosage: '2mg', frequency: 'Once daily (morning)', duration: '3 months' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '3 months' }
    ]
  },
  {
    id: 'REC-002',
    patientId: 'PAT-001',
    patientName: 'Rajesh Kumar Sharma',
    date: '2024-01-15',
    type: 'lab_result',
    title: 'Comprehensive Metabolic Panel & Lipid Profile',
    description: 'Fasting blood glucose: 145 mg/dL (target <130). HbA1c: 7.1% (improved). Total cholesterol: 220 mg/dL (borderline high). LDL: 140 mg/dL (target <100). HDL: 45 mg/dL (low). Triglycerides: 180 mg/dL (elevated). Kidney function normal. Liver enzymes within normal limits.',
    doctor: 'Dr. Sanjay Mehta',
    department: 'Laboratory Medicine',
    priority: 'high',
    status: 'reviewed',
    attachments: ['blood_work_detailed.pdf']
  },
  {
    id: 'REC-003',
    patientId: 'PAT-001',
    patientName: 'Rajesh Kumar Sharma',
    date: '2024-01-10',
    type: 'prescription',
    title: 'Updated Medication Prescription',
    description: 'Based on recent lab results and consultation, updating medication regimen. Added Atorvastatin for cholesterol management. Increased Metformin dose. Continue blood pressure medication. Patient counseled on medication timing and potential side effects.',
    doctor: 'Dr. Priya Sharma',
    department: 'Endocrinology',
    priority: 'medium',
    status: 'completed',
    medications: [
      { name: 'Metformin Extended Release', dosage: '1000mg', frequency: 'Twice daily', duration: '3 months' },
      { name: 'Glimepiride', dosage: '2mg', frequency: 'Before breakfast', duration: '3 months' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'At bedtime', duration: '3 months' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '3 months' }
    ]
  },
  {
    id: 'REC-004',
    patientId: 'PAT-002',
    patientName: 'Priya Devi Gupta',
    date: '2024-01-20',
    type: 'consultation',
    title: 'Asthma Control Assessment',
    description: 'Patient reports improved asthma control with current treatment. Peak flow readings stable at 85% of personal best. No recent exacerbations or emergency visits. Seasonal allergies under control with antihistamines. Continue current inhaler regimen. Scheduled for allergy testing next month.',
    doctor: 'Dr. Vikram Singh',
    department: 'Pulmonology',
    priority: 'low',
    status: 'completed',
    medications: [
      { name: 'Salbutamol (Ventolin) Inhaler', dosage: '100mcg', frequency: 'As needed', duration: '1 month' },
      { name: 'Budesonide/Formoterol Inhaler', dosage: '160/4.5mcg', frequency: 'Twice daily', duration: '3 months' },
      { name: 'Montelukast', dosage: '10mg', frequency: 'At bedtime', duration: '3 months' },
      { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '1 month' }
    ]
  },
  {
    id: 'REC-005',
    patientId: 'PAT-002',
    patientName: 'Priya Devi Gupta',
    date: '2024-01-18',
    type: 'imaging',
    title: 'Chest X-Ray and Spirometry',
    description: 'Chest X-ray shows clear lung fields with no signs of acute pathology. No consolidation or pleural effusion. Heart size normal. Spirometry results show mild reversible airway obstruction consistent with well-controlled asthma. FEV1 improved from baseline.',
    doctor: 'Dr. Kavita Reddy',
    department: 'Radiology',
    priority: 'low',
    status: 'completed',
    attachments: ['chest_xray_jan2024.jpg', 'spirometry_report.pdf']
  },
  {
    id: 'REC-006',
    patientId: 'PAT-003',
    patientName: 'Mohammed Ali Khan',
    date: '2024-01-22',
    type: 'consultation',
    title: 'Sports Injury Follow-up',
    description: 'Follow-up for right knee injury sustained during cricket match. Patient reports significant improvement in pain and mobility. Physiotherapy sessions showing good progress. Range of motion restored to 90%. No signs of infection or complications. Cleared for gradual return to sports activities.',
    doctor: 'Dr. Arjun Patel',
    department: 'Orthopedics',
    priority: 'low',
    status: 'completed',
    medications: [
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'Twice daily with food', duration: '1 week' },
      { name: 'Glucosamine Sulfate', dosage: '1500mg', frequency: 'Once daily', duration: '2 months' }
    ]
  }
];

export function PatientRecords() {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(mockPatients[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const filteredRecords = mockRecords.filter(record => {
    const matchesPatient = record.patientId === selectedPatient.id;
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || record.type === filterType;
    
    return matchesPatient && matchesSearch && matchesType;
  });

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'lab_result':
        return <TestTube className="h-4 w-4 text-green-500" />;
      case 'imaging':
        return <FileImage className="h-4 w-4 text-purple-500" />;
      case 'prescription':
        return <Pill className="h-4 w-4 text-orange-500" />;
      case 'procedure':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'emergency':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRecordTypeBadge = (type: string) => {
    const typeLabels = {
      consultation: 'Consultation',
      lab_result: 'Lab Result',
      imaging: 'Imaging',
      prescription: 'Prescription',
      procedure: 'Procedure',
      emergency: 'Emergency'
    };
    return typeLabels[type as keyof typeof typeLabels] || 'Unknown';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-500">Reviewed</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const downloadMedicalSummary = (patient: Patient) => {
    const patientRecords = mockRecords.filter(record => record.patientId === patient.id);
    const summary = `
MEDICAL SUMMARY
================

Patient Information:
- Name: ${patient.name}
- ID: ${patient.id}
- Age: ${patient.age} years
- Gender: ${patient.gender}
- Blood Type: ${patient.bloodType}
- Phone: ${patient.phone}
- Email: ${patient.email}
- Address: ${patient.address}

Medical History:
- Allergies: ${patient.allergies.join(', ')}
- Chronic Conditions: ${patient.chronicConditions.join(', ')}

Emergency Contact:
- Name: ${patient.emergencyContact.name}
- Relationship: ${patient.emergencyContact.relationship}
- Phone: ${patient.emergencyContact.phone}

Insurance Information:
- Provider: ${patient.insurance.provider}
- Policy Number: ${patient.insurance.policyNumber}

Recent Medical Records:
${patientRecords.map(record => `
Date: ${record.date}
Type: ${getRecordTypeBadge(record.type)}
Title: ${record.title}
Doctor: ${record.doctor}
Department: ${record.department}
Description: ${record.description}
${record.medications ? '\nPrescribed Medications:\n' + record.medications.map(med => 
  `- ${med.name} ${med.dosage} - ${med.frequency} for ${med.duration}`
).join('\n') : ''}
---
`).join('\n')}

Generated on: ${new Date().toLocaleDateString('en-IN')}
    `;

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-summary-${patient.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPrescription = (record: MedicalRecord) => {
    if (!record.medications) return;

    const prescription = `
PRESCRIPTION
============

Hospital: ${record.department}
Doctor: ${record.doctor}
Date: ${record.date}

Patient Information:
- Name: ${record.patientName}
- Patient ID: ${record.patientId}

Prescribed Medications:
${record.medications.map(med => `
Medicine: ${med.name}
Dosage: ${med.dosage}
Frequency: ${med.frequency}
Duration: ${med.duration}
---`).join('\n')}

Instructions: ${record.description}

Doctor's Signature: ${record.doctor}
Date: ${record.date}

Note: This is a computer-generated prescription.
    `;

    const blob = new Blob([prescription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${record.id}-${record.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Medical Records</h2>
          <p className="text-muted-foreground">Comprehensive patient medical history and documentation</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => downloadMedicalSummary(selectedPatient)}>
            <Download className="mr-2 h-4 w-4" />
            Download Summary
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Medical Record</DialogTitle>
                <DialogDescription>
                  Add a new medical record for {selectedPatient.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="record-type">Record Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="lab_result">Lab Result</SelectItem>
                        <SelectItem value="imaging">Imaging</SelectItem>
                        <SelectItem value="prescription">Prescription</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Record title" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Detailed description..." className="min-h-[100px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctor">Doctor</Label>
                    <Input id="doctor" placeholder="Dr. Smith" />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" placeholder="Internal Medicine" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Create Record</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Patient Selection</span>
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
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4>{patient.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{patient.age} years, {patient.gender}</span>
                      <span>Blood: {patient.bloodType}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {patient.allergies.slice(0, 2).map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="records" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="profile">Patient Profile</TabsTrigger>
          <TabsTrigger value="timeline">Medical Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search records by title, doctor, or description..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="consultation">Consultations</SelectItem>
                <SelectItem value="lab_result">Lab Results</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="procedure">Procedures</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Records for {selectedPatient.name}</CardTitle>
              <CardDescription>
                Comprehensive medical history and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{record.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRecordTypeIcon(record.type)}
                          <span>{getRecordTypeBadge(record.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{record.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {record.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{record.doctor}</p>
                          <p className="text-sm text-muted-foreground">{record.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(record.priority)}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedRecord(record)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-2">
                                  {getRecordTypeIcon(record.type)}
                                  <span>{record.title}</span>
                                </DialogTitle>
                                <DialogDescription>
                                  {record.doctor} • {record.department} • {record.date}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                  {getPriorityBadge(record.priority)}
                                  {getStatusBadge(record.status)}
                                </div>
                                <Separator />
                                <div>
                                  <h4>Description</h4>
                                  <p className="text-sm leading-relaxed">{record.description}</p>
                                </div>
                                
                                {record.medications && record.medications.length > 0 && (
                                  <div>
                                    <h4>Prescribed Medications</h4>
                                    <div className="space-y-3">
                                      {record.medications.map((med, index) => (
                                        <div key={index} className="p-3 border rounded-lg">
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            <div>
                                              <Label className="text-xs">Medicine</Label>
                                              <p className="text-sm">{med.name}</p>
                                            </div>
                                            <div>
                                              <Label className="text-xs">Dosage</Label>
                                              <p className="text-sm">{med.dosage}</p>
                                            </div>
                                            <div>
                                              <Label className="text-xs">Frequency</Label>
                                              <p className="text-sm">{med.frequency}</p>
                                            </div>
                                            <div>
                                              <Label className="text-xs">Duration</Label>
                                              <p className="text-sm">{med.duration}</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {record.attachments && record.attachments.length > 0 && (
                                  <div>
                                    <h4>Attachments</h4>
                                    <div className="space-y-2">
                                      {record.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                                          <div className="flex items-center space-x-2">
                                            <FileText className="h-4 w-4" />
                                            <span className="text-sm">{attachment}</span>
                                          </div>
                                          <Button variant="outline" size="sm">
                                            <Download className="h-3 w-3 mr-1" />
                                            Download
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-end space-x-2">
                                  {record.medications && (
                                    <Button variant="outline" onClick={() => downloadPrescription(record)}>
                                      <Download className="h-3 w-3 mr-1" />
                                      Download Prescription
                                    </Button>
                                  )}
                                  <Button variant="outline">
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button variant="outline">
                                    <Printer className="h-3 w-3 mr-1" />
                                    Print
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5" />
                <span>Current Medications for {selectedPatient.name}</span>
              </CardTitle>
              <CardDescription>
                Active prescriptions and medication history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords
                  .filter(record => record.medications && record.medications.length > 0)
                  .map(record => (
                    <div key={record.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4>{record.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Prescribed by {record.doctor} on {record.date}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadPrescription(record)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {record.medications?.map((med, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded">
                            <h5>{med.name} - {med.dosage}</h5>
                            <p className="text-sm text-muted-foreground">
                              {med.frequency} for {med.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg">{selectedPatient.name}</h3>
                    <p className="text-muted-foreground">Patient ID: {selectedPatient.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Age</Label>
                    <p>{selectedPatient.age} years</p>
                  </div>
                  <div>
                    <Label className="text-sm">Gender</Label>
                    <p>{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Blood Type</Label>
                    <p>{selectedPatient.bloodType}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Last Visit</Label>
                    <p>{selectedPatient.lastVisit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{selectedPatient.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedPatient.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Medical Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Allergies</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedPatient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm">Chronic Conditions</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedPatient.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="secondary">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Emergency Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedPatient.emergencyContact.name}</p>
                  <p><strong>Relationship:</strong> {selectedPatient.emergencyContact.relationship}</p>
                  <p><strong>Phone:</strong> {selectedPatient.emergencyContact.phone}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Medical Timeline</span>
              </CardTitle>
              <CardDescription>Chronological view of {selectedPatient.name}'s medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record, index) => (
                    <div key={record.id} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                          {getRecordTypeIcon(record.type)}
                        </div>
                        {index < filteredRecords.length - 1 && (
                          <div className="w-px h-12 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-8">
                        <div className="flex items-center justify-between">
                          <p className="text-sm">{record.date}</p>
                          {getPriorityBadge(record.priority)}
                        </div>
                        <h4 className="text-sm">{record.title}</h4>
                        <p className="text-sm text-muted-foreground">{record.doctor} • {record.department}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {record.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}