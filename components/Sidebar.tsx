import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Brain, 
  Stethoscope,
  TrendingUp,
  Settings,
  HelpCircle,
  MessageCircle,
  Monitor,
  Activity,
  CreditCard,
  Shield,
  UserCheck,
  FlaskConical
} from "lucide-react";
import { Button } from "./ui/button";

interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
}

export function Sidebar({ activeTab, onTabChange, user }: SidebarProps) {
  // Base menu items available to all users
  const baseMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ['patient', 'doctor', 'admin'] },
    { id: "health-chatbot", label: "Health Assistant", icon: MessageCircle, roles: ['patient', 'doctor', 'admin'] },
  ];

  // Role-specific menu items
  const roleSpecificItems = [
    // Patient-specific items
    { id: "appointments", label: "My Appointments", icon: Calendar, roles: ['patient'] },
    { id: "records", label: "My Records", icon: FileText, roles: ['patient'] },
    { id: "lab-results", label: "Lab & Imaging", icon: FlaskConical, roles: ['patient'] },
    { id: "symptom-checker", label: "Symptom Checker", icon: Stethoscope, roles: ['patient'] },
    { id: "family-dashboard", label: "Family Portal", icon: Activity, roles: ['patient'] },
    
    // Doctor-specific items
    { id: "patients", label: "Patient Management", icon: Users, roles: ['doctor', 'admin'] },
    { id: "appointments", label: "Appointments", icon: Calendar, roles: ['doctor', 'admin'] },
    { id: "records", label: "Medical Records", icon: FileText, roles: ['doctor', 'admin'] },
    { id: "lab-results", label: "Lab & Imaging", icon: FlaskConical, roles: ['doctor', 'admin'] },
    { id: "ai-diagnosis", label: "AI Diagnosis", icon: Brain, roles: ['doctor', 'admin'] },
    { id: "patient-monitoring", label: "Patient Monitoring", icon: Monitor, roles: ['doctor', 'admin'] },
    { id: "analytics", label: "Analytics", icon: TrendingUp, roles: ['doctor', 'admin'] },
    
    // Admin-specific items
    { id: "billing", label: "Billing & Payments", icon: CreditCard, roles: ['admin'] },
    { id: "user-management", label: "User Management", icon: UserCheck, roles: ['admin'] },
  ];

  // Filter menu items based on user role
  const menuItems = [...baseMenuItems, ...roleSpecificItems].filter(item => 
    item.roles.includes(user.role)
  );

  const bottomItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t px-4 py-4">
        <nav className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}