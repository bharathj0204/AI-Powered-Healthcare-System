import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { toast } from "sonner@2.0.3";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Video, 
  BookOpen, 
  Search,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  FileText,
  Download,
  ExternalLink,
  User,
  Stethoscope,
  Shield
} from "lucide-react";

interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
}

interface HelpProps {
  user: User;
}

export function Help({ user }: HelpProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [supportForm, setSupportForm] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: "",
    attachments: []
  });

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support ticket submitted successfully! We'll get back to you within 24 hours.");
    setSupportForm({
      subject: "",
      category: "",
      priority: "medium",
      description: "",
      attachments: []
    });
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'doctor': return <Stethoscope className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  // FAQ data based on user role
  const getFAQs = () => {
    const commonFAQs = [
      {
        id: "account",
        question: "How do I update my account information?",
        answer: "Go to Settings > Personal Information to update your name, email, phone number, and other details. Changes are saved automatically."
      },
      {
        id: "password",
        question: "How do I change my password?",
        answer: "Navigate to Settings > Security, enter your current password, then set a new password. We recommend using a strong password with at least 8 characters."
      },
      {
        id: "notifications",
        question: "How can I manage my notifications?",
        answer: "Visit Settings > Notifications to customize email, SMS, and in-app notification preferences. You can enable/disable specific types of alerts."
      },
      {
        id: "support",
        question: "How do I contact technical support?",
        answer: "Use the Contact Support tab on this help page, or email support@gohealth.com. For urgent issues, use the live chat feature available 24/7."
      }
    ];

    const patientFAQs = [
      ...commonFAQs,
      {
        id: "appointments",
        question: "How do I book an appointment?",
        answer: "Go to My Appointments, click 'Book New Appointment', select your preferred doctor, date, and time. You'll receive a confirmation email."
      },
      {
        id: "records",
        question: "How can I access my medical records?",
        answer: "Visit My Records section to view all your medical history, test results, prescriptions, and download reports as PDF files."
      },
      {
        id: "symptoms",
        question: "How does the symptom checker work?",
        answer: "The AI-powered symptom checker asks about your symptoms and provides preliminary insights. It's not a diagnosis - always consult your doctor."
      },
      {
        id: "family",
        question: "How do I share access with family members?",
        answer: "In Family Portal, you can generate access codes for family members to monitor your health status and receive important updates."
      }
    ];

    const doctorFAQs = [
      ...commonFAQs,
      {
        id: "patients",
        question: "How do I manage my patient list?",
        answer: "Use Patient Management to view all your patients, search by name/ID, update medical records, and track treatment history."
      },
      {
        id: "diagnosis",
        question: "How does AI diagnosis assistance work?",
        answer: "The AI analyzes patient symptoms, medical history, and test results to provide diagnostic suggestions with confidence scores. Always verify with your clinical judgment."
      },
      {
        id: "prescriptions",
        question: "How do I create digital prescriptions?",
        answer: "In patient records, click 'New Prescription', select medications, dosage, and duration. Your digital signature is required for validation."
      },
      {
        id: "monitoring",
        question: "How do I set up patient monitoring?",
        answer: "Use Patient Monitoring to configure alerts for vital signs, medication compliance, and scheduled check-ups. Set thresholds for automatic notifications."
      }
    ];

    const adminFAQs = [
      ...commonFAQs,
      {
        id: "users",
        question: "How do I manage user accounts?",
        answer: "Access User Management to create, edit, or deactivate accounts. You can also assign roles and manage permissions for different user types."
      },
      {
        id: "billing",
        question: "How do I process billing and payments?",
        answer: "Use the Billing section to generate invoices, process payments, manage insurance claims, and view financial reports."
      },
      {
        id: "analytics",
        question: "How do I access system analytics?",
        answer: "Visit Analytics dashboard to view usage statistics, performance metrics, user activity, and generate custom reports for insights."
      },
      {
        id: "compliance",
        question: "How do we ensure HIPAA compliance?",
        answer: "The system follows HIPAA standards with encrypted data storage, audit logs, user access controls, and regular security assessments."
      }
    ];

    switch (user.role) {
      case 'patient': return patientFAQs;
      case 'doctor': return doctorFAQs;
      case 'admin': return adminFAQs;
      default: return commonFAQs;
    }
  };

  const filteredFAQs = getFAQs().filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resources = [
    {
      title: "User Guide",
      description: "Complete guide to using GoHealth platform",
      type: "PDF",
      size: "2.5 MB",
      icon: BookOpen
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for common tasks",
      type: "Video",
      duration: "45 min",
      icon: Video
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      type: "Web",
      pages: "120 pages",
      icon: FileText
    },
    {
      title: "Training Webinars",
      description: "Live training sessions and recordings",
      type: "Webinar",
      sessions: "12 sessions",
      icon: Users
    }
  ];

  const systemStatus = [
    { service: "Core Platform", status: "operational", uptime: "99.9%" },
    { service: "Authentication", status: "operational", uptime: "99.8%" },
    { service: "Database", status: "operational", uptime: "99.9%" },
    { service: "AI Services", status: "maintenance", uptime: "98.5%" },
    { service: "Notifications", status: "operational", uptime: "99.7%" },
    { service: "File Storage", status: "operational", uptime: "99.6%" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "maintenance": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "down": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Help & Support</h2>
          <p className="text-muted-foreground">
            Get help with GoHealth platform and contact our support team
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          {getRoleIcon()}
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Contact Support
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            System Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about using GoHealth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="appointments">Appointments</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No FAQs found</h3>
                  <p className="text-muted-foreground">
                    Try a different search term or contact our support team
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Options</CardTitle>
                <CardDescription>
                  Choose the best way to reach our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Live Chat</h4>
                        <p className="text-sm text-muted-foreground">Available 24/7</p>
                      </div>
                    </div>
                    <Button size="sm">
                      Start Chat
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Video className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">Video Call</h4>
                        <p className="text-sm text-muted-foreground">Mon-Fri, 9 AM - 6 PM IST</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Schedule Call
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-orange-500" />
                      <div>
                        <h4 className="font-medium">Phone Support</h4>
                        <p className="text-sm text-muted-foreground">+91-1800-XXX-XXXX</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Call Now
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium">Email Support</h4>
                        <p className="text-sm text-muted-foreground">support@gohealth.com</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Send Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submit Support Ticket</CardTitle>
                <CardDescription>
                  Describe your issue and we'll get back to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={supportForm.category} 
                        onValueChange={(value) => setSupportForm(prev => ({ ...prev, category: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="account">Account Problem</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={supportForm.priority} 
                        onValueChange={(value) => setSupportForm(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
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

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={supportForm.description}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Please provide detailed information about your issue..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>
                Documentation, tutorials, and training materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-8 w-8 text-blue-500" />
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground mb-1">{resource.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {resource.size || resource.duration || resource.pages || resource.sessions}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current status of GoHealth platform services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h4 className="font-medium">{service.service}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {service.status === "operational" ? "All systems operational" : 
                           service.status === "maintenance" ? "Scheduled maintenance" : "Service unavailable"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={service.status === "operational" ? "default" : "secondary"}>
                      {service.uptime} uptime
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium text-blue-900">Overall System Health</h4>
                </div>
                <p className="text-sm text-blue-700">
                  All critical systems are operational. We're currently performing scheduled maintenance 
                  on AI services to improve performance. No user impact expected.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}