import { useState } from "react";
import {
  Upload,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Scan,
  Brain,
  Heart,
  Microscope,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Filter,
  Calendar,
  Eye,
  FileImage,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { toast } from "sonner@2.0.3";

interface User {
  id: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  name: string;
}

interface LabResultsProps {
  user: User;
}

interface MedicalImage {
  id: string;
  type: "xray" | "mri" | "ct";
  bodyPart: string;
  date: string;
  imageUrl: string;
  patientName: string;
  patientId: string;
  findings: string;
  aiAnalysis: {
    confidence: number;
    detectedAbnormalities: string[];
    severity: "normal" | "mild" | "moderate" | "severe";
    recommendations: string[];
    measurements: { label: string; value: string }[];
  };
}

interface LabTest {
  id: string;
  testName: string;
  category: string;
  date: string;
  value: number;
  unit: string;
  normalRange: { min: number; max: number };
  status: "normal" | "low" | "high" | "critical";
  patientName: string;
  patientId: string;
}

// Sample medical imaging data
const sampleMedicalImages: MedicalImage[] = [
  {
    id: "img-1",
    type: "xray",
    bodyPart: "Chest",
    date: "2026-01-05",
    imageUrl: "https://images.unsplash.com/photo-1631651363531-fd29aec4cb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdCUyMHhyYXl8ZW58MXx8fHwxNzY3Nzc2MzQwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    patientName: "Rajesh Kumar",
    patientId: "P001",
    findings: "Chest X-ray PA view shows clear lung fields with no evidence of consolidation or pleural effusion.",
    aiAnalysis: {
      confidence: 94.5,
      detectedAbnormalities: ["Minor calcification in left lower lobe", "Slightly enlarged cardiac silhouette"],
      severity: "mild",
      recommendations: [
        "Follow-up X-ray in 3 months to monitor calcification",
        "ECG recommended to assess cardiac status",
        "Maintain regular cardiovascular exercise",
      ],
      measurements: [
        { label: "Cardiothoracic Ratio", value: "0.52 (Normal: <0.5)" },
        { label: "Lung Volume", value: "Normal expansion" },
        { label: "Diaphragm Position", value: "Normal" },
      ],
    },
  },
  {
    id: "img-2",
    type: "mri",
    bodyPart: "Brain",
    date: "2026-01-03",
    imageUrl: "https://images.unsplash.com/photo-1581595220057-eefa8c4add1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNUkklMjBicmFpbiUyMHNjYW58ZW58MXx8fHwxNzY3NzUyNjc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    patientName: "Priya Sharma",
    patientId: "P002",
    findings: "T2-weighted MRI of the brain demonstrates normal brain parenchyma with appropriate gray-white matter differentiation.",
    aiAnalysis: {
      confidence: 97.8,
      detectedAbnormalities: ["Small white matter hyperintensity in frontal lobe"],
      severity: "normal",
      recommendations: [
        "No immediate intervention required",
        "Routine follow-up in 12 months",
        "Maintain healthy lifestyle and blood pressure control",
      ],
      measurements: [
        { label: "Ventricular Size", value: "Normal for age" },
        { label: "Hippocampal Volume", value: "Within normal limits" },
        { label: "Cortical Thickness", value: "Normal" },
      ],
    },
  },
  {
    id: "img-3",
    type: "ct",
    bodyPart: "Abdomen",
    date: "2025-12-28",
    imageUrl: "https://images.unsplash.com/photo-1706065638524-eb52e7165abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDVCUyMHNjYW4lMjBtZWRpY2FsfGVufDF8fHx8MTc2NzY3OTQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    patientName: "Amit Patel",
    patientId: "P003",
    findings: "Non-contrast CT of the abdomen shows normal liver, spleen, and kidney morphology.",
    aiAnalysis: {
      confidence: 92.3,
      detectedAbnormalities: ["Small renal cyst in right kidney (5mm)", "Mild fatty infiltration of liver"],
      severity: "mild",
      recommendations: [
        "Renal cyst is benign and requires no treatment",
        "Dietary modifications to reduce hepatic steatosis",
        "Follow-up ultrasound in 6 months",
        "Regular exercise and weight management",
      ],
      measurements: [
        { label: "Liver Size", value: "15.2 cm (Normal: 12-16 cm)" },
        { label: "Spleen Size", value: "10.5 cm (Normal)" },
        { label: "Kidney Size (Right)", value: "11.3 cm (Normal)" },
        { label: "Kidney Size (Left)", value: "11.1 cm (Normal)" },
      ],
    },
  },
  {
    id: "img-4",
    type: "xray",
    bodyPart: "Spine",
    date: "2025-12-20",
    imageUrl: "https://images.unsplash.com/photo-1587010580103-fd86b8ea14ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx4cmF5JTIwbWVkaWNhbCUyMHNjYW58ZW58MXx8fHwxNzY3Nzc2MzM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    patientName: "Sunita Reddy",
    patientId: "P004",
    findings: "Lateral lumbar spine X-ray shows mild degenerative changes at L4-L5 level.",
    aiAnalysis: {
      confidence: 89.7,
      detectedAbnormalities: [
        "Mild disc space narrowing at L4-L5",
        "Small anterior osteophytes at L3-L4",
        "Reduced lumbar lordosis",
      ],
      severity: "moderate",
      recommendations: [
        "Physical therapy for core strengthening",
        "Pain management with NSAIDs as needed",
        "Avoid heavy lifting and prolonged sitting",
        "Consider MRI if symptoms worsen",
      ],
      measurements: [
        { label: "Disc Height L4-L5", value: "7mm (Reduced)" },
        { label: "Vertebral Alignment", value: "Maintained" },
        { label: "Lordotic Curve", value: "Reduced" },
      ],
    },
  },
];

// Sample lab test data with historical trends
const generateLabHistory = (
  baseValue: number,
  variation: number,
  count: number = 6
): number[] => {
  const history: number[] = [];
  for (let i = 0; i < count; i++) {
    const variance = (Math.random() - 0.5) * variation;
    history.push(parseFloat((baseValue + variance).toFixed(2)));
  }
  return history;
};

const sampleLabTests: LabTest[] = [
  {
    id: "lab-1",
    testName: "Hemoglobin",
    category: "Hematology",
    date: "2026-01-05",
    value: 14.2,
    unit: "g/dL",
    normalRange: { min: 13.5, max: 17.5 },
    status: "normal",
    patientName: "Rajesh Kumar",
    patientId: "P001",
  },
  {
    id: "lab-2",
    testName: "White Blood Cell Count",
    category: "Hematology",
    date: "2026-01-05",
    value: 8500,
    unit: "cells/μL",
    normalRange: { min: 4000, max: 11000 },
    status: "normal",
    patientName: "Rajesh Kumar",
    patientId: "P001",
  },
  {
    id: "lab-3",
    testName: "Platelet Count",
    category: "Hematology",
    date: "2026-01-05",
    value: 245000,
    unit: "cells/μL",
    normalRange: { min: 150000, max: 400000 },
    status: "normal",
    patientName: "Rajesh Kumar",
    patientId: "P001",
  },
  {
    id: "lab-4",
    testName: "Fasting Blood Sugar",
    category: "Chemistry",
    date: "2026-01-04",
    value: 108,
    unit: "mg/dL",
    normalRange: { min: 70, max: 100 },
    status: "high",
    patientName: "Priya Sharma",
    patientId: "P002",
  },
  {
    id: "lab-5",
    testName: "HbA1c",
    category: "Chemistry",
    date: "2026-01-04",
    value: 6.2,
    unit: "%",
    normalRange: { min: 4, max: 5.6 },
    status: "high",
    patientName: "Priya Sharma",
    patientId: "P002",
  },
  {
    id: "lab-6",
    testName: "Total Cholesterol",
    category: "Lipid Panel",
    date: "2026-01-03",
    value: 215,
    unit: "mg/dL",
    normalRange: { min: 0, max: 200 },
    status: "high",
    patientName: "Amit Patel",
    patientId: "P003",
  },
  {
    id: "lab-7",
    testName: "LDL Cholesterol",
    category: "Lipid Panel",
    date: "2026-01-03",
    value: 135,
    unit: "mg/dL",
    normalRange: { min: 0, max: 100 },
    status: "high",
    patientName: "Amit Patel",
    patientId: "P003",
  },
  {
    id: "lab-8",
    testName: "HDL Cholesterol",
    category: "Lipid Panel",
    date: "2026-01-03",
    value: 48,
    unit: "mg/dL",
    normalRange: { min: 40, max: 200 },
    status: "normal",
    patientName: "Amit Patel",
    patientId: "P003",
  },
  {
    id: "lab-9",
    testName: "Triglycerides",
    category: "Lipid Panel",
    date: "2026-01-03",
    value: 165,
    unit: "mg/dL",
    normalRange: { min: 0, max: 150 },
    status: "high",
    patientName: "Amit Patel",
    patientId: "P003",
  },
  {
    id: "lab-10",
    testName: "Creatinine",
    category: "Kidney Function",
    date: "2026-01-02",
    value: 1.1,
    unit: "mg/dL",
    normalRange: { min: 0.7, max: 1.3 },
    status: "normal",
    patientName: "Sunita Reddy",
    patientId: "P004",
  },
  {
    id: "lab-11",
    testName: "Blood Urea Nitrogen",
    category: "Kidney Function",
    date: "2026-01-02",
    value: 18,
    unit: "mg/dL",
    normalRange: { min: 7, max: 20 },
    status: "normal",
    patientName: "Sunita Reddy",
    patientId: "P004",
  },
  {
    id: "lab-12",
    testName: "ALT (SGPT)",
    category: "Liver Function",
    date: "2025-12-30",
    value: 52,
    unit: "U/L",
    normalRange: { min: 7, max: 56 },
    status: "normal",
    patientName: "Amit Patel",
    patientId: "P003",
  },
  {
    id: "lab-13",
    testName: "AST (SGOT)",
    category: "Liver Function",
    date: "2025-12-30",
    value: 38,
    unit: "U/L",
    normalRange: { min: 10, max: 40 },
    status: "normal",
    patientName: "Amit Patel",
    patientId: "P003",
  },
  {
    id: "lab-14",
    testName: "Thyroid Stimulating Hormone",
    category: "Thyroid Function",
    date: "2025-12-28",
    value: 2.8,
    unit: "mIU/L",
    normalRange: { min: 0.4, max: 4.0 },
    status: "normal",
    patientName: "Priya Sharma",
    patientId: "P002",
  },
  {
    id: "lab-15",
    testName: "Vitamin D",
    category: "Vitamins",
    date: "2025-12-25",
    value: 22,
    unit: "ng/mL",
    normalRange: { min: 30, max: 100 },
    status: "low",
    patientName: "Rajesh Kumar",
    patientId: "P001",
  },
];

// Generate historical data for trending
const getHistoricalData = (testName: string) => {
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  
  const dataMap: Record<string, number[]> = {
    "Hemoglobin": generateLabHistory(14.2, 1.0),
    "Fasting Blood Sugar": generateLabHistory(108, 15),
    "Total Cholesterol": generateLabHistory(215, 20),
    "LDL Cholesterol": generateLabHistory(135, 15),
    "HbA1c": generateLabHistory(6.2, 0.3),
    "Vitamin D": generateLabHistory(22, 5),
  };

  const values = dataMap[testName] || generateLabHistory(100, 10);
  
  return months.map((month, index) => ({
    month,
    value: values[index],
  }));
};

export function LabResults({ user }: LabResultsProps) {
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(null);
  const [imageZoom, setImageZoom] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  // Filter functions
  const filteredImages = sampleMedicalImages.filter((img) => {
    const matchesSearch =
      img.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || img.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredTests = sampleLabTests.filter((test) => {
    const matchesSearch =
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || test.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageUpload = (type: "image" | "report") => {
    toast.success(`${type === "image" ? "Medical image" : "Lab report"} uploaded successfully!`);
  };

  const handleDownloadReport = (id: string, type: "image" | "lab") => {
    toast.success(`${type === "image" ? "Imaging" : "Lab"} report downloaded successfully!`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "normal":
        return "text-green-600 bg-green-50";
      case "mild":
        return "text-yellow-600 bg-yellow-50";
      case "moderate":
        return "text-orange-600 bg-orange-50";
      case "severe":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "low":
      case "high":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "critical":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-50 text-green-700";
      case "low":
      case "high":
        return "bg-yellow-50 text-yellow-700";
      case "critical":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Calculate category statistics
  const categoryStats = sampleLabTests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = { total: 0, abnormal: 0 };
    }
    acc[test.category].total++;
    if (test.status !== "normal") {
      acc[test.category].abnormal++;
    }
    return acc;
  }, {} as Record<string, { total: number; abnormal: number }>);

  const radarData = Object.keys(categoryStats).map((category) => ({
    category: category.replace(" Function", "").replace(" Panel", ""),
    score: ((categoryStats[category].total - categoryStats[category].abnormal) / 
            categoryStats[category].total) * 100,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Lab Results & Medical Imaging</h2>
        <p className="text-muted-foreground mt-1">
          View lab results, medical images with AI-powered analysis and insights
        </p>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by test name, patient name, or body part..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="imaging" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="imaging" className="gap-2">
            <Scan className="h-4 w-4" />
            Medical Imaging
          </TabsTrigger>
          <TabsTrigger value="lab-results" className="gap-2">
            <Microscope className="h-4 w-4" />
            Lab Results
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Medical Imaging Tab */}
        <TabsContent value="imaging" className="space-y-6">
          {/* Filter by imaging type */}
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              All Images
            </Button>
            <Button
              variant={filterType === "xray" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("xray")}
            >
              X-Ray
            </Button>
            <Button
              variant={filterType === "mri" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("mri")}
            >
              MRI
            </Button>
            <Button
              variant={filterType === "ct" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("ct")}
            >
              CT Scan
            </Button>
          </div>

          {/* Medical Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-black">
                  <img
                    src={image.imageUrl}
                    alt={`${image.type} - ${image.bodyPart}`}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <Badge className="absolute top-2 right-2 uppercase">
                    {image.type}
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold">{image.bodyPart} {image.type.toUpperCase()}</h3>
                    <p className="text-sm text-muted-foreground">{image.patientName}</p>
                    <p className="text-xs text-muted-foreground">{image.date}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">AI Confidence: {image.aiAnalysis.confidence}%</span>
                  </div>

                  <Badge className={getSeverityColor(image.aiAnalysis.severity)} variant="outline">
                    {image.aiAnalysis.severity.toUpperCase()}
                  </Badge>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedImage(image);
                            setImageZoom(100);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {image.bodyPart} {image.type.toUpperCase()} Analysis
                          </DialogTitle>
                          <DialogDescription>
                            AI-powered medical image analysis and findings
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Image Viewer */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Medical Image</Label>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setImageZoom(Math.max(50, imageZoom - 10))}
                                >
                                  <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded">
                                  {imageZoom}%
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setImageZoom(Math.min(200, imageZoom + 10))}
                                >
                                  <ZoomIn className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <RotateCw className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: "400px" }}>
                              <img
                                src={image.imageUrl}
                                alt={`${image.type} - ${image.bodyPart}`}
                                className="w-full h-full object-contain"
                                style={{ transform: `scale(${imageZoom / 100})` }}
                              />
                            </div>
                          </div>

                          {/* Patient Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground">Patient</Label>
                              <p className="font-medium">{image.patientName}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Date</Label>
                              <p className="font-medium">{image.date}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Study Type</Label>
                              <p className="font-medium uppercase">{image.type}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Body Part</Label>
                              <p className="font-medium">{image.bodyPart}</p>
                            </div>
                          </div>

                          {/* AI Analysis */}
                          <Card className="bg-blue-50 border-blue-200">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-blue-900">
                                <Brain className="h-5 w-5" />
                                AI-Powered Analysis
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-blue-900">Confidence Score</span>
                                <Badge className="bg-blue-600 text-white">
                                  {image.aiAnalysis.confidence}%
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-blue-900">Severity Assessment</span>
                                <Badge className={getSeverityColor(image.aiAnalysis.severity)}>
                                  {image.aiAnalysis.severity.toUpperCase()}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Findings */}
                          <div>
                            <Label className="text-lg font-semibold mb-2 block">Clinical Findings</Label>
                            <Card>
                              <CardContent className="pt-4">
                                <p className="text-sm leading-relaxed">{image.findings}</p>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Detected Abnormalities */}
                          <div>
                            <Label className="text-lg font-semibold mb-2 block">Detected Abnormalities</Label>
                            <div className="space-y-2">
                              {image.aiAnalysis.detectedAbnormalities.map((abnormality, index) => (
                                <Card key={index}>
                                  <CardContent className="flex items-start gap-3 p-3">
                                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                                    <p className="text-sm flex-1">{abnormality}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* Measurements */}
                          <div>
                            <Label className="text-lg font-semibold mb-2 block">Measurements & Observations</Label>
                            <Card>
                              <CardContent className="pt-4">
                                <div className="space-y-3">
                                  {image.aiAnalysis.measurements.map((measurement, index) => (
                                    <div key={index} className="flex justify-between items-center pb-2 border-b last:border-0">
                                      <span className="text-sm font-medium">{measurement.label}</span>
                                      <span className="text-sm text-muted-foreground">{measurement.value}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Recommendations */}
                          <div>
                            <Label className="text-lg font-semibold mb-2 block">AI Recommendations</Label>
                            <div className="space-y-2">
                              {image.aiAnalysis.recommendations.map((recommendation, index) => (
                                <Card key={index} className="bg-green-50 border-green-200">
                                  <CardContent className="flex items-start gap-3 p-3">
                                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                    <p className="text-sm flex-1 text-green-900">{recommendation}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Button className="flex-1" onClick={() => handleDownloadReport(image.id, "image")}>
                              <Download className="h-4 w-4 mr-2" />
                              Download Report
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <FileText className="h-4 w-4 mr-2" />
                              Print Report
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadReport(image.id, "image")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileImage className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No medical images found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload medical images to get started with AI analysis
                </p>
                <Button onClick={() => handleImageUpload("image")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Medical Image
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Lab Results Tab */}
        <TabsContent value="lab-results" className="space-y-6">
          {/* Filter by category */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory("all")}
            >
              All Tests
            </Button>
            {Object.keys(categoryStats).map((category) => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory(category)}
              >
                {category}
                {categoryStats[category].abnormal > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {categoryStats[category].abnormal}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Lab Results Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Test Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Result
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Normal Range
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTests.map((test) => (
                      <tr key={test.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Microscope className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {test.testName}
                              </div>
                              <div className="text-xs text-gray-500">{test.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {test.value.toLocaleString()} {test.unit}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {test.normalRange.min} - {test.normalRange.max} {test.unit}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(test.status)} variant="outline">
                            <span className="flex items-center gap-1">
                              {getStatusIcon(test.status)}
                              {test.status.toUpperCase()}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {test.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedTest(test)}
                                >
                                  <TrendingUp className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>{test.testName} - Trend Analysis</DialogTitle>
                                  <DialogDescription>
                                    Historical trends and analysis for {test.patientName}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-6">
                                  {/* Current Status */}
                                  <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="text-center">
                                          <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                                          <p className="text-2xl font-bold">
                                            {test.value} <span className="text-sm font-normal">{test.unit}</span>
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="text-center">
                                          <p className="text-sm text-muted-foreground mb-1">Normal Range</p>
                                          <p className="text-lg font-semibold">
                                            {test.normalRange.min} - {test.normalRange.max}
                                          </p>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="text-center">
                                          <p className="text-sm text-muted-foreground mb-1">Status</p>
                                          <Badge className={getStatusColor(test.status)}>
                                            {test.status.toUpperCase()}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Trend Chart */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-lg">6-Month Trend</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <ResponsiveContainer width="100%" height={250}>
                                        <AreaChart data={getHistoricalData(test.testName)}>
                                          <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                          </defs>
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis dataKey="month" />
                                          <YAxis />
                                          <Tooltip />
                                          <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#3b82f6"
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                          />
                                        </AreaChart>
                                      </ResponsiveContainer>
                                    </CardContent>
                                  </Card>

                                  {/* Insights */}
                                  <Card className="bg-blue-50 border-blue-200">
                                    <CardHeader>
                                      <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                                        <Brain className="h-5 w-5" />
                                        AI Insights
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm text-blue-900">
                                      {test.status !== "normal" && (
                                        <>
                                          <p>
                                            • Your {test.testName} is currently{" "}
                                            <strong>{test.status}</strong> at {test.value} {test.unit}.
                                          </p>
                                          <p>
                                            • The normal range is {test.normalRange.min} - {test.normalRange.max} {test.unit}.
                                          </p>
                                          <p>
                                            • Consider consulting with your healthcare provider for personalized recommendations.
                                          </p>
                                        </>
                                      )}
                                      {test.status === "normal" && (
                                        <p>
                                          • Your {test.testName} is within the normal range. Continue maintaining a healthy lifestyle!
                                        </p>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReport(test.id, "lab")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {filteredTests.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Microscope className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No lab results found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload lab reports to track your health metrics
                </p>
                <Button onClick={() => handleImageUpload("report")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Lab Report
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Health Score Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Health Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Health Score"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Test Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Test Results Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      {
                        status: "Normal",
                        count: sampleLabTests.filter((t) => t.status === "normal").length,
                      },
                      {
                        status: "Low",
                        count: sampleLabTests.filter((t) => t.status === "low").length,
                      },
                      {
                        status: "High",
                        count: sampleLabTests.filter((t) => t.status === "high").length,
                      },
                      {
                        status: "Critical",
                        count: sampleLabTests.filter((t) => t.status === "critical").length,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Imaging Studies by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Medical Imaging Studies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["xray", "mri", "ct"].map((type) => {
                    const count = sampleMedicalImages.filter((img) => img.type === type).length;
                    const abnormalCount = sampleMedicalImages.filter(
                      (img) => img.type === type && img.aiAnalysis.severity !== "normal"
                    ).length;
                    
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium uppercase">{type}</span>
                          <Badge variant="outline">
                            {count} studies ({abnormalCount} abnormal)
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(count / sampleMedicalImages.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Scan className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Medical Imaging</p>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                      </div>
                    </div>
                    <Badge>{sampleMedicalImages.length} studies</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Microscope className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Lab Tests</p>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                      </div>
                    </div>
                    <Badge>{sampleLabTests.length} tests</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Abnormal Results</p>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                      </div>
                    </div>
                    <Badge variant="destructive">
                      {sampleLabTests.filter((t) => t.status !== "normal").length} items
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Health Metrics Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Key Health Metrics - 6 Month Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={getHistoricalData("Hemoglobin").map((item, index) => ({
                    month: item.month,
                    hemoglobin: item.value,
                    cholesterol: getHistoricalData("Total Cholesterol")[index].value,
                    glucose: getHistoricalData("Fasting Blood Sugar")[index].value,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="hemoglobin"
                    stroke="#ef4444"
                    name="Hemoglobin (g/dL)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cholesterol"
                    stroke="#3b82f6"
                    name="Cholesterol (mg/dL)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="glucose"
                    stroke="#10b981"
                    name="Blood Glucose (mg/dL)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
