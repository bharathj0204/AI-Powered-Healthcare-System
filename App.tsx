import { useState } from "react";
import { AuthWrapper, User } from "./components/auth/AuthWrapper";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { PatientManagement } from "./components/PatientManagement";
import { PatientRecords } from "./components/PatientRecords";
import { PatientMonitoring } from "./components/PatientMonitoring";
import { FamilyDashboard } from "./components/FamilyDashboard";
import { AIDiagnosis } from "./components/AIDiagnosis";
import { SymptomChecker } from "./components/SymptomChecker";
import { HealthChatbot } from "./components/HealthChatbot";
import { Analytics } from "./components/Analytics";
import { Billing } from "./components/Billing";
import { Appointments } from "./components/Appointments";
import { UserManagement } from "./components/UserManagement";
import { Settings } from "./components/Settings";
import { Help } from "./components/Help";
import { Profile } from "./components/Profile";
import { LabResults } from "./components/LabResults";
import { Toaster } from "./components/ui/sonner";

function MainApp({ user }: { user: User & { signOut: () => void } }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard user={user} />;
      case "patients":
        return <PatientManagement user={user} />;
      case "appointments":
        return <Appointments user={user} />;
      case "records":
        return <PatientRecords user={user} />;
      case "billing":
        return <Billing user={user} />;
      case "patient-monitoring":
        return <PatientMonitoring user={user} />;
      case "family-dashboard":
        return <FamilyDashboard user={user} />;
      case "ai-diagnosis":
        return <AIDiagnosis user={user} />;
      case "symptom-checker":
        return <SymptomChecker user={user} />;
      case "health-chatbot":
        return <HealthChatbot user={user} />;
      case "lab-results":
        return <LabResults user={user} />;
      case "analytics":
        return <Analytics user={user} />;
      case "user-management":
        return user.role === 'admin' ? <UserManagement user={user} /> : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">
                You don't have permission to access this feature.
              </p>
            </div>
          </div>
        );
      case "settings":
        return <Settings user={user} />;
      case "help":
        return <Help user={user} />;
      case "profile":
        return <Profile user={user} />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Feature Coming Soon</h3>
              <p className="text-muted-foreground">
                This feature is currently under development and will be available soon.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header user={user} onNavigate={setActiveTab} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AuthWrapper>
        {(user) => <MainApp user={user} />}
      </AuthWrapper>
      <Toaster />
    </>
  );
}