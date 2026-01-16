import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Calendar } from "./ui/calendar";
import { Textarea } from "./ui/textarea";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { User as UserType } from "./auth/AuthWrapper";

interface AppointmentsProps {
  user: UserType;
}

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  patientPhone: string;
  patientEmail: string;
  doctor: string;
  specialty: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";
  type: "consultation" | "follow-up" | "emergency" | "routine-checkup";
  notes?: string;
  hospital: string;
  room?: string;
}

export function Appointments({ user }: AppointmentsProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    doctor: "",
    specialty: "",
    date: "",
    time: "",
    type: "consultation",
    notes: ""
  });

  // Sample appointments data with Indian names
  const appointments: Appointment[] = [
    {
      id: "APT-001",
      patientName: "Priya Sharma",
      patientId: "PAT-001",
      patientPhone: "+91 98765 43210",
      patientEmail: "priya.sharma@email.com",
      doctor: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      department: "Cardiac Sciences",
      date: "2024-01-15",
      time: "09:00",
      duration: 30,
      status: "confirmed",
      type: "consultation",
      notes: "Chest pain complaint, ECG required",
      hospital: "Apollo Hospital, Delhi",
      room: "Room 201"
    },
    {
      id: "APT-002",
      patientName: "Arjun Patel",
      patientId: "PAT-002",
      patientPhone: "+91 87654 32109",
      patientEmail: "arjun.patel@email.com",
      doctor: "Dr. Sunita Devi",
      specialty: "Orthopedics",
      department: "Bone & Joint",
      date: "2024-01-15",
      time: "10:30",
      duration: 45,
      status: "scheduled",
      type: "follow-up",
      notes: "Post-surgery follow-up for knee replacement",
      hospital: "Fortis Hospital, Mumbai",
      room: "Room 305"
    },
    {
      id: "APT-003",
      patientName: "Lakshmi Iyer",
      patientId: "PAT-003",
      patientPhone: "+91 76543 21098",
      patientEmail: "lakshmi.iyer@email.com",
      doctor: "Dr. Kavita Reddy",
      specialty: "Gynecology",
      department: "Women's Health",
      date: "2024-01-15",
      time: "14:00",
      duration: 30,
      status: "completed",
      type: "routine-checkup",
      notes: "Regular prenatal checkup",
      hospital: "Manipal Hospital, Bangalore",
      room: "Room 102"
    },
    {
      id: "APT-004",
      patientName: "Mohammed Ali",
      patientId: "PAT-004",
      patientPhone: "+91 65432 10987",
      patientEmail: "mohammed.ali@email.com",
      doctor: "Dr. Vikram Singh",
      specialty: "Neurology",
      department: "Neurosciences",
      date: "2024-01-16",
      time: "11:00",
      duration: 60,
      status: "scheduled",
      type: "consultation",
      notes: "Severe headaches and dizziness",
      hospital: "AIIMS, New Delhi",
      room: "Room 408"
    },
    {
      id: "APT-005",
      patientName: "Deepika Singh",
      patientId: "PAT-005",
      patientPhone: "+91 54321 09876",
      patientEmail: "deepika.singh@email.com",
      doctor: "Dr. Anil Gupta",
      specialty: "Dermatology",
      department: "Skin & Hair",
      date: "2024-01-16",
      time: "15:30",
      duration: 20,
      status: "cancelled",
      type: "consultation",
      notes: "Skin allergy consultation",
      hospital: "Max Hospital, Gurgaon"
    }
  ];

  const doctors = [
    { name: "Dr. Rajesh Kumar", specialty: "Cardiology" },
    { name: "Dr. Sunita Devi", specialty: "Orthopedics" },
    { name: "Dr. Kavita Reddy", specialty: "Gynecology" },
    { name: "Dr. Vikram Singh", specialty: "Neurology" },
    { name: "Dr. Anil Gupta", specialty: "Dermatology" },
    { name: "Dr. Priya Sharma", specialty: "Pediatrics" },
    { name: "Dr. Sanjay Mehta", specialty: "General Medicine" },
    { name: "Dr. Ravi Krishnan", specialty: "Ophthalmology" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no-show":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
      case "no-show":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const updateAppointmentStatus = (appointmentId: string, newStatus: string) => {
    // In a real app, this would update the database
    console.log(`Updating appointment ${appointmentId} to status: ${newStatus}`);
    alert(`Appointment ${appointmentId} status updated to ${newStatus}`);
  };

  const deleteAppointment = (appointmentId: string) => {
    // In a real app, this would delete from the database
    console.log(`Deleting appointment ${appointmentId}`);
    alert(`Appointment ${appointmentId} has been deleted`);
  };

  const createAppointment = () => {
    // In a real app, this would save to the database
    console.log("Creating new appointment:", newAppointment);
    alert("New appointment has been created successfully!");
    setIsAddingAppointment(false);
    setNewAppointment({
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      doctor: "",
      specialty: "",
      date: "",
      time: "",
      type: "consultation",
      notes: ""
    });
  };

  const todayAppointments = appointments.filter(apt => apt.date === "2024-01-15");
  const upcomingAppointments = appointments.filter(apt => apt.date > "2024-01-15");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Appointments Management</h2>
          <p className="text-muted-foreground">
            Schedule, manage, and track all patient appointments
          </p>
        </div>
        <Dialog open={isAddingAppointment} onOpenChange={setIsAddingAppointment}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Fill in the details to schedule a new patient appointment
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input
                  id="patient-name"
                  value={newAppointment.patientName}
                  onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                  placeholder="Enter patient name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-phone">Phone Number</Label>
                <Input
                  id="patient-phone"
                  value={newAppointment.patientPhone}
                  onChange={(e) => setNewAppointment({...newAppointment, patientPhone: e.target.value})}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-email">Email</Label>
                <Input
                  id="patient-email"
                  type="email"
                  value={newAppointment.patientEmail}
                  onChange={(e) => setNewAppointment({...newAppointment, patientEmail: e.target.value})}
                  placeholder="patient@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select value={newAppointment.doctor} onValueChange={(value) => {
                  const doctor = doctors.find(d => d.name === value);
                  setNewAppointment({
                    ...newAppointment, 
                    doctor: value,
                    specialty: doctor?.specialty || ""
                  });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.name} value={doctor.name}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="routine-checkup">Routine Checkup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  placeholder="Additional notes or symptoms"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingAppointment(false)}>
                Cancel
              </Button>
              <Button onClick={createAppointment}>
                Schedule Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Today's Appointments</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointments.filter(apt => apt.status === "confirmed").length} confirmed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {todayAppointments.filter(apt => apt.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Cancellations</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {appointments.filter(apt => apt.status === "cancelled").length}
            </div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today's Appointments</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="all">All Appointments</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule - January 15, 2024</CardTitle>
              <CardDescription>
                Manage today's patient appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.time}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{appointment.patientName}</span>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {appointment.doctor} - {appointment.specialty}
                        </p>
                        {appointment.room && (
                          <p className="text-sm text-muted-foreground">{appointment.room}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Appointment Actions</DialogTitle>
                            <DialogDescription>
                              Update appointment status or details
                            </DialogDescription>
                          </DialogHeader>
                          {selectedAppointment && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4>Patient: {selectedAppointment.patientName}</h4>
                                <p>Doctor: {selectedAppointment.doctor}</p>
                                <p>Time: {selectedAppointment.time}</p>
                                <p>Type: {selectedAppointment.type}</p>
                                {selectedAppointment.notes && (
                                  <p>Notes: {selectedAppointment.notes}</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label>Update Status</Label>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => updateAppointmentStatus(selectedAppointment.id, "confirmed")}
                                  >
                                    Confirm
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    onClick={() => updateAppointmentStatus(selectedAppointment.id, "completed")}
                                  >
                                    Complete
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => updateAppointmentStatus(selectedAppointment.id, "cancelled")}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteAppointment(appointment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                View and manage future appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>
                Complete appointment history and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>
                        <div>
                          <p>{appointment.patientName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{appointment.patientPhone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{appointment.patientEmail}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.specialty}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Selected Date Appointments</CardTitle>
                <CardDescription>
                  Appointments for {selectedDate?.toDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Calendar integration with appointment scheduling coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}