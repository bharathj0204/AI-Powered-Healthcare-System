import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Users, Calendar, AlertTriangle, TrendingUp, Heart, Brain } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { User as UserType } from "./auth/AuthWrapper";

interface DashboardProps {
  user: UserType;
}

const patientData = [
  { month: "Jan", patients: 120, diagnoses: 85 },
  { month: "Feb", patients: 135, diagnoses: 92 },
  { month: "Mar", patients: 148, diagnoses: 103 },
  { month: "Apr", patients: 162, diagnoses: 115 },
  { month: "May", patients: 178, diagnoses: 128 },
  { month: "Jun", patients: 195, diagnoses: 142 },
];

const aiAccuracyData = [
  { condition: "Diabetes", accuracy: 94 },
  { condition: "Hypertension", accuracy: 89 },
  { condition: "Heart Disease", accuracy: 92 },
  { condition: "Pneumonia", accuracy: 87 },
  { condition: "Fractures", accuracy: 96 },
];

export function Dashboard({ user }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl mb-2">Welcome back, {user.name}</h2>
        <p className="opacity-90">Here's what's happening in your healthcare practice today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              3 urgent, 21 routine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.6%</div>
            <p className="text-xs text-muted-foreground">
              Average diagnostic accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Growth & AI Diagnoses</CardTitle>
            <CardDescription>Monthly trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="diagnoses" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Diagnostic Accuracy</CardTitle>
            <CardDescription>Accuracy rates by condition type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aiAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="condition" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Insights</CardTitle>
            <CardDescription>Latest AI-powered diagnostic suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">High-risk cardiac pattern detected</p>
                  <p className="text-xs text-muted-foreground">Patient: John Doe - Confidence: 94%</p>
                  <Badge variant="destructive" className="mt-1">Urgent</Badge>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Potential diabetes indicators</p>
                  <p className="text-xs text-muted-foreground">Patient: Jane Smith - Confidence: 87%</p>
                  <Badge variant="secondary" className="mt-1">Follow-up</Badge>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Treatment response positive</p>
                  <p className="text-xs text-muted-foreground">Patient: Mike Johnson - Confidence: 92%</p>
                  <Badge variant="default" className="mt-1">Good Progress</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Trends</CardTitle>
            <CardDescription>Population health insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Vaccination Rate</span>
                  <span className="text-sm text-muted-foreground">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Chronic Disease Management</span>
                  <span className="text-sm text-muted-foreground">73%</span>
                </div>
                <Progress value={73} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Preventive Care Compliance</span>
                  <span className="text-sm text-muted-foreground">91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Weekly Goals</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI diagnoses reviewed</span>
                    <Badge variant="outline">48/50</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Patient follow-ups</span>
                    <Badge variant="outline">23/25</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}