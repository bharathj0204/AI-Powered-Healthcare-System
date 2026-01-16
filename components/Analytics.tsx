import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Heart, 
  Activity, 
  Brain,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Stethoscope
} from "lucide-react";

const patientGrowthData = [
  { month: "Jul", patients: 890, newPatients: 45, aiDiagnoses: 234 },
  { month: "Aug", patients: 920, newPatients: 52, aiDiagnoses: 267 },
  { month: "Sep", patients: 965, newPatients: 48, aiDiagnoses: 289 },
  { month: "Oct", patients: 1020, newPatients: 61, aiDiagnoses: 312 },
  { month: "Nov", patients: 1089, newPatients: 58, aiDiagnoses: 345 },
  { month: "Dec", patients: 1156, newPatients: 67, aiDiagnoses: 378 },
  { month: "Jan", patients: 1234, newPatients: 78, aiDiagnoses: 412 },
];

const conditionDistribution = [
  { condition: "Hypertension", count: 245, percentage: 32, color: "#3b82f6" },
  { condition: "Diabetes", count: 189, percentage: 25, color: "#8b5cf6" },
  { condition: "Heart Disease", count: 134, percentage: 18, color: "#ef4444" },
  { condition: "Asthma", count: 98, percentage: 13, color: "#10b981" },
  { condition: "Other", count: 89, percentage: 12, color: "#f59e0b" },
];

const aiPerformanceData = [
  { week: "Week 1", accuracy: 87, diagnoses: 45, confirmed: 39 },
  { week: "Week 2", accuracy: 89, diagnoses: 52, confirmed: 46 },
  { week: "Week 3", accuracy: 91, diagnoses: 48, confirmed: 44 },
  { week: "Week 4", accuracy: 94, diagnoses: 61, confirmed: 57 },
];

const appointmentTrends = [
  { day: "Mon", scheduled: 24, completed: 22, cancelled: 2 },
  { day: "Tue", scheduled: 28, completed: 26, cancelled: 2 },
  { day: "Wed", scheduled: 32, completed: 30, cancelled: 2 },
  { day: "Thu", scheduled: 26, completed: 24, cancelled: 2 },
  { day: "Fri", scheduled: 30, completed: 28, cancelled: 2 },
];

const treatmentOutcomes = [
  { month: "Aug", improved: 78, stable: 15, declined: 7 },
  { month: "Sep", improved: 82, stable: 12, declined: 6 },
  { month: "Oct", improved: 85, stable: 10, declined: 5 },
  { month: "Nov", improved: 88, stable: 8, declined: 4 },
  { month: "Dec", improved: 91, stable: 6, declined: 3 },
  { month: "Jan", improved: 94, stable: 4, declined: 2 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Healthcare Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive insights into your healthcare practice and AI performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy Rate</CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.6%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last month
            </p>
            <Progress value={91.6} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +1.8% from last month
            </p>
            <Progress value={94.2} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment Success</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88.7%</div>
            <p className="text-xs text-muted-foreground">
              +3.1% from last month
            </p>
            <Progress value={88.7} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Early Detection</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76.3%</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
            <Progress value={76.3} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-performance">AI Performance</TabsTrigger>
          <TabsTrigger value="patient-trends">Patient Trends</TabsTrigger>
          <TabsTrigger value="outcomes">Treatment Outcomes</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Growth & AI Usage</CardTitle>
                <CardDescription>Monthly trends over the last 7 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={patientGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="aiDiagnoses" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Condition Distribution</CardTitle>
                <CardDescription>Most common conditions in your practice</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conditionDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ condition, percentage }) => `${condition}: ${percentage}%`}
                    >
                      {conditionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Indicators</CardTitle>
              <CardDescription>Important metrics for your healthcare practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Wait Time</span>
                    <Badge variant="outline">12 min</Badge>
                  </div>
                  <Progress value={75} />
                  <p className="text-xs text-muted-foreground">Target: 15 min</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Appointment Completion Rate</span>
                    <Badge variant="outline">92%</Badge>
                  </div>
                  <Progress value={92} />
                  <p className="text-xs text-muted-foreground">Target: 90%</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Follow-up Compliance</span>
                    <Badge variant="outline">87%</Badge>
                  </div>
                  <Progress value={87} />
                  <p className="text-xs text-muted-foreground">Target: 85%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Diagnostic Accuracy</CardTitle>
                <CardDescription>Weekly accuracy trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={aiPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="accuracy" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Diagnoses vs Confirmations</CardTitle>
                <CardDescription>AI suggestions confirmed by doctors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aiPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="diagnoses" fill="#3b82f6" />
                    <Bar dataKey="confirmed" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Performance by Condition</CardTitle>
              <CardDescription>Accuracy rates for different medical conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conditionDistribution.map((condition) => (
                  <div key={condition.condition} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{condition.condition}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {Math.floor(Math.random() * 10) + 85}% accuracy
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {condition.count} cases
                        </span>
                      </div>
                    </div>
                    <Progress value={Math.floor(Math.random() * 15) + 80} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patient-trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>New Patient Acquisition</CardTitle>
                <CardDescription>Monthly new patient registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={patientGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="newPatients" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Patient age groups in your practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">0-18 years</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={15} className="w-24" />
                      <span className="text-sm">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">19-35 years</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={28} className="w-24" />
                      <span className="text-sm">28%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">36-50 years</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={32} className="w-24" />
                      <span className="text-sm">32%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">51-65 years</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={18} className="w-24" />
                      <span className="text-sm">18%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">65+ years</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={7} className="w-24" />
                      <span className="text-sm">7%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Outcomes Over Time</CardTitle>
              <CardDescription>Patient improvement rates by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={treatmentOutcomes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="improved" stackId="1" stroke="#10b981" fill="#10b981" />
                  <Area type="monotone" dataKey="stable" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                  <Area type="monotone" dataKey="declined" stackId="1" stroke="#ef4444" fill="#ef4444" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patients Improved</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">94%</div>
                <p className="text-xs text-muted-foreground">
                  +6% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stable Condition</CardTitle>
                <Activity className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">4%</div>
                <p className="text-xs text-muted-foreground">
                  -2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Declined</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">2%</div>
                <p className="text-xs text-muted-foreground">
                  -4% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Appointment Trends</CardTitle>
              <CardDescription>Scheduled vs completed appointments by day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scheduled" fill="#3b82f6" />
                  <Bar dataKey="completed" fill="#10b981" />
                  <Bar dataKey="cancelled" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Current usage of medical resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Examination Rooms</span>
                    <span className="text-sm">8/10</span>
                  </div>
                  <Progress value={80} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medical Equipment</span>
                    <span className="text-sm">12/15</span>
                  </div>
                  <Progress value={80} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Staff Availability</span>
                    <span className="text-sm">18/20</span>
                  </div>
                  <Progress value={90} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>AI system and infrastructure metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Response Time</span>
                    <Badge variant="outline">1.2s avg</Badge>
                  </div>
                  <Progress value={92} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Uptime</span>
                    <Badge variant="outline">99.8%</Badge>
                  </div>
                  <Progress value={99.8} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Processing</span>
                    <Badge variant="outline">1.5TB/day</Badge>
                  </div>
                  <Progress value={75} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}