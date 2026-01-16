import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Brain, 
  FileText, 
  Upload, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  Stethoscope,
  Activity,
  Heart,
  Zap
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const mockDiagnoses = [
  {
    id: 1,
    patient: "John Doe",
    condition: "Hypertension",
    confidence: 94,
    symptoms: ["Headache", "Dizziness", "Fatigue"],
    recommendations: ["Blood pressure medication", "Lifestyle changes", "Regular monitoring"],
    riskFactors: ["Age", "Family history", "Sedentary lifestyle"],
    timestamp: "2024-01-20 14:30"
  },
  {
    id: 2,
    patient: "Jane Smith",
    condition: "Type 2 Diabetes",
    confidence: 87,
    symptoms: ["Excessive thirst", "Frequent urination", "Blurred vision"],
    recommendations: ["Glucose monitoring", "Dietary counseling", "Medication review"],
    riskFactors: ["BMI", "Family history", "Age"],
    timestamp: "2024-01-20 11:15"
  },
  {
    id: 3,
    patient: "Mike Johnson",
    condition: "Asthma Exacerbation",
    confidence: 91,
    symptoms: ["Shortness of breath", "Wheezing", "Chest tightness"],
    recommendations: ["Inhaler adjustment", "Avoid triggers", "Follow-up in 1 week"],
    riskFactors: ["Environmental allergens", "Weather changes"],
    timestamp: "2024-01-19 16:45"
  }
];

export function AIDiagnosis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [symptoms, setSymptoms] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const analyzeSymptoms = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        primaryDiagnosis: "Viral Upper Respiratory Infection",
        confidence: 85,
        alternativeDiagnoses: [
          { condition: "Common Cold", confidence: 78 },
          { condition: "Allergic Rhinitis", confidence: 65 },
          { condition: "Bacterial Sinusitis", confidence: 42 }
        ],
        recommendations: [
          "Rest and hydration",
          "Over-the-counter pain relievers",
          "Monitor symptoms for 7-10 days",
          "Return if symptoms worsen"
        ],
        urgency: "Low",
        followUp: "1-2 weeks if symptoms persist"
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge className="bg-green-500">High Confidence</Badge>;
    if (confidence >= 70) return <Badge className="bg-yellow-500">Medium Confidence</Badge>;
    return <Badge variant="destructive">Low Confidence</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">AI Diagnosis Assistant</h2>
        <p className="text-muted-foreground">Advanced AI-powered diagnostic support system</p>
      </div>

      <Tabs defaultValue="symptom-analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="symptom-analysis">Symptom Analysis</TabsTrigger>
          <TabsTrigger value="image-analysis">Medical Imaging</TabsTrigger>
          <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          <TabsTrigger value="recent-diagnoses">Recent Diagnoses</TabsTrigger>
        </TabsList>

        <TabsContent value="symptom-analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5" />
                  <span>Symptom Input</span>
                </CardTitle>
                <CardDescription>
                  Enter patient symptoms for AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Patient Age</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="35"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={patientGender} onValueChange={setPatientGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="symptoms">Symptoms Description</Label>
                  <Textarea 
                    id="symptoms"
                    placeholder="Patient presents with headache, fever, and fatigue for 3 days..."
                    className="min-h-[120px]"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={analyzeSymptoms} 
                  disabled={isAnalyzing || !symptoms.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Symptoms
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Analysis Results</span>
                </CardTitle>
                <CardDescription>
                  AI-generated diagnostic suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAnalyzing && (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                    <p>AI is analyzing symptoms...</p>
                    <div className="mt-4">
                      <Progress value={33} className="w-full" />
                    </div>
                  </div>
                )}
                
                {analysisResult && (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{analysisResult.primaryDiagnosis}</h4>
                        {getConfidenceBadge(analysisResult.confidence)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Confidence:</span>
                        <Progress value={analysisResult.confidence} className="flex-1" />
                        <span className="text-sm font-medium">{analysisResult.confidence}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Alternative Diagnoses</h5>
                      <div className="space-y-2">
                        {analysisResult.alternativeDiagnoses.map((alt: any, index: number) => (
                          <div key={index} className="flex items-center justify-between border rounded p-2">
                            <span className="text-sm">{alt.condition}</span>
                            <span className="text-sm text-muted-foreground">{alt.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Recommendations</h5>
                      <ul className="space-y-1">
                        {analysisResult.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {!isAnalyzing && !analysisResult && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-8 w-8 mx-auto mb-2" />
                    <p>Enter symptoms to get AI analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="image-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Medical Image Analysis</span>
              </CardTitle>
              <CardDescription>
                Upload medical images for AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-2">Upload X-rays, CT scans, MRIs, or other medical images</p>
                <p className="text-sm text-muted-foreground mb-4">Supports DICOM, JPEG, PNG formats</p>
                <input
                  type="file"
                  accept="image/*,.dcm"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Choose File
                  </Button>
                </label>
                {selectedFile && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab-results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Lab Results Analysis</span>
              </CardTitle>
              <CardDescription>
                AI interpretation of laboratory test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Feature Coming Soon</AlertTitle>
                <AlertDescription>
                  Lab results analysis with AI interpretation will be available in the next update.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent-diagnoses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Recent AI Diagnoses</span>
              </CardTitle>
              <CardDescription>
                Review recent AI-powered diagnostic suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDiagnoses.map((diagnosis) => (
                  <div key={diagnosis.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{diagnosis.patient}</h4>
                        <p className="text-sm text-muted-foreground">{diagnosis.timestamp}</p>
                      </div>
                      {getConfidenceBadge(diagnosis.confidence)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-1">Diagnosis</h5>
                        <p className="text-sm">{diagnosis.condition}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-1">Key Symptoms</h5>
                        <div className="flex flex-wrap gap-1">
                          {diagnosis.symptoms.slice(0, 2).map((symptom, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                          {diagnosis.symptoms.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{diagnosis.symptoms.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-1">Confidence</h5>
                        <div className="flex items-center space-x-2">
                          <Progress value={diagnosis.confidence} className="flex-1" />
                          <span className="text-sm">{diagnosis.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}