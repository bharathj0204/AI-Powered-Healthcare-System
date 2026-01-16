import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { User, Stethoscope, Shield } from "lucide-react";

interface LoginSelectionProps {
  onSelectUserType: (type: 'patient' | 'doctor' | 'admin') => void;
}

export function LoginSelection({ onSelectUserType }: LoginSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Aarogya</h1>
          <p className="text-xl text-gray-600">AI-Powered Healthcare Management System</p>
          <p className="text-lg text-gray-500 mt-2">Choose your login type to continue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Login */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Patient Portal</CardTitle>
              <CardDescription>
                Access your medical records, appointments, and health insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => onSelectUserType('patient')}
              >
                Sign In as Patient
              </Button>
              <div className="mt-4 text-sm text-gray-600">
                <p>• View medical records</p>
                <p>• Book appointments</p>
                <p>• Access health chatbot</p>
                <p>• Monitor vital signs</p>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Login */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Doctor Portal</CardTitle>
              <CardDescription>
                Manage patients, diagnoses, and medical practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={() => onSelectUserType('doctor')}
              >
                Sign In as Doctor
              </Button>
              <div className="mt-4 text-sm text-gray-600">
                <p>• Patient management</p>
                <p>• AI-powered diagnosis</p>
                <p>• Medical records</p>
                <p>• Appointment scheduling</p>
              </div>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Admin Portal</CardTitle>
              <CardDescription>
                System administration and user management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={() => onSelectUserType('admin')}
              >
                Sign In as Admin
              </Button>
              <div className="mt-4 text-sm text-gray-600">
                <p>• User management</p>
                <p>• System analytics</p>
                <p>• Security settings</p>
                <p>• Data management</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Secure healthcare data management</p>
          <p className="mt-1"> 24/7 Support</p>
        </div>
      </div>
    </div>
  );
}