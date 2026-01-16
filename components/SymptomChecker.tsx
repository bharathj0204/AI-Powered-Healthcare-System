import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Stethoscope, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ThermometerSun,
  Heart,
  Brain,
  Zap,
  Activity
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const commonSymptoms = [
  { id: 1, name: "Headache", category: "Neurological", severity: 0 },
  { id: 2, name: "Fever", category: "Constitutional", severity: 0 },
  { id: 3, name: "Cough", category: "Respiratory", severity: 0 },
  { id: 4, name: "Fatigue", category: "Constitutional", severity: 0 },
  { id: 5, name: "Nausea", category: "Gastrointestinal", severity: 0 },
  { id: 6, name: "Dizziness", category: "Neurological", severity: 0 },
  { id: 7, name: "Shortness of breath", category: "Respiratory", severity: 0 },
  { id: 8, name: "Chest pain", category: "Cardiovascular", severity: 0 },
  { id: 9, name: "Abdominal pain", category: "Gastrointestinal", severity: 0 },
  { id: 10, name: "Joint pain", category: "Musculoskeletal", severity: 0 },
];

const mockResults = {
  conditions: [
    {
      name: "Viral Upper Respiratory Infection",
      probability: 85,
      urgency: "Low",
      description: "Common viral infection affecting the upper respiratory tract",
      symptoms: ["Cough", "Fever", "Fatigue"],
      recommendations: [
        "Rest and hydration",
        "Over-the-counter medications for symptom relief",
        "Monitor symptoms for 7-10 days"
      ]
    },
    {
      name: "Tension Headache",
      probability: 72,
      urgency: "Low",
      description: "Most common type of headache, often stress-related",
      symptoms: ["Headache", "Fatigue"],
      recommendations: [
        "Pain relievers as needed",
        "Stress management techniques",
        "Regular sleep schedule"
      ]
    },
    {
      name: "Gastroenteritis",
      probability: 68,
      urgency: "Medium",
      description: "Inflammation of the stomach and intestines",
      symptoms: ["Nausea", "Abdominal pain", "Fatigue"],
      recommendations: [
        "Stay hydrated",
        "BRAT diet (Bananas, Rice, Applesauce, Toast)",
        "Seek medical attention if symptoms worsen"
      ]
    }
  ],
  redFlags: [
    "Severe chest pain",
    "Difficulty breathing",
    "High fever (>103°F)"
  ],
  nextSteps: "Consider consulting with a healthcare provider if symptoms persist or worsen."
};

export function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [symptomSeverities, setSymptomSeverities] = useState<{[key: number]: number}>({});
  const [duration, setDuration] = useState("");
  const [age, setAge] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSymptomToggle = (symptomId: number) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSeverityChange = (symptomId: number, severity: number[]) => {
    setSymptomSeverities(prev => ({
      ...prev,
      [symptomId]: severity[0]
    }));
  };

  const analyzeSymptoms = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 2500);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "High":
        return <Badge variant="destructive">High Urgency</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500">Medium Urgency</Badge>;
      case "Low":
        return <Badge variant="outline">Low Urgency</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Neurological":
        return <Brain className="h-4 w-4" />;
      case "Cardiovascular":
        return <Heart className="h-4 w-4" />;
      case "Respiratory":
        return <Activity className="h-4 w-4" />;
      case "Constitutional":
        return <ThermometerSun className="h-4 w-4" />;
      default:
        return <Stethoscope className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">AI Symptom Checker</h2>
        <p className="text-muted-foreground">
          Describe your symptoms and get AI-powered health insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Input */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5" />
                <span>Select Your Symptoms</span>
              </CardTitle>
              <CardDescription>
                Choose the symptoms you're experiencing and their severity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="How long?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Few hours</SelectItem>
                      <SelectItem value="1day">1 day</SelectItem>
                      <SelectItem value="2-3days">2-3 days</SelectItem>
                      <SelectItem value="week">About a week</SelectItem>
                      <SelectItem value="weeks">Several weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Symptom Search */}
              <div>
                <Label htmlFor="symptom-search">Search Symptoms</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    id="symptom-search"
                    placeholder="Type to search symptoms..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Symptom List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredSymptoms.map((symptom) => (
                  <div key={symptom.id} className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`symptom-${symptom.id}`}
                        checked={selectedSymptoms.includes(symptom.id)}
                        onCheckedChange={() => handleSymptomToggle(symptom.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(symptom.category)}
                          <Label htmlFor={`symptom-${symptom.id}`} className="cursor-pointer">
                            {symptom.name}
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">{symptom.category}</p>
                      </div>
                    </div>
                    
                    {selectedSymptoms.includes(symptom.id) && (
                      <div className="ml-6 space-y-2">
                        <Label className="text-xs">Severity (1-10)</Label>
                        <Slider
                          value={[symptomSeverities[symptom.id] || 5]}
                          onValueChange={(value) => handleSeverityChange(symptom.id, value)}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Mild</span>
                          <span>{symptomSeverities[symptom.id] || 5}</span>
                          <span>Severe</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button 
                onClick={analyzeSymptoms}
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>
                AI-powered health insights based on your symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing && (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                  <p>AI is analyzing your symptoms...</p>
                  <div className="mt-4">
                    <Progress value={60} className="w-full" />
                  </div>
                </div>
              )}

              {results && (
                <div className="space-y-6">
                  {/* Possible Conditions */}
                  <div>
                    <h4 className="font-semibold mb-3">Possible Conditions</h4>
                    <div className="space-y-3">
                      {results.conditions.map((condition: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{condition.name}</h5>
                            {getUrgencyBadge(condition.urgency)}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {condition.description}
                          </p>
                          
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-sm">Probability:</span>
                            <Progress value={condition.probability} className="flex-1" />
                            <span className="text-sm font-medium">{condition.probability}%</span>
                          </div>
                          
                          <div className="space-y-2">
                            <h6 className="text-sm font-medium">Recommendations:</h6>
                            <ul className="space-y-1">
                              {condition.recommendations.map((rec: string, recIndex: number) => (
                                <li key={recIndex} className="text-sm flex items-start space-x-2">
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Red Flags */}
                  {results.redFlags && results.redFlags.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Important Warning Signs</AlertTitle>
                      <AlertDescription>
                        Seek immediate medical attention if you experience:
                        <ul className="mt-2 space-y-1">
                          {results.redFlags.map((flag: string, index: number) => (
                            <li key={index} className="flex items-center space-x-2">
                              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Next Steps */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Next Steps</span>
                    </h4>
                    <p className="text-sm">{results.nextSteps}</p>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground">
                      <strong>Disclaimer:</strong> This AI symptom checker is for informational purposes only 
                      and should not replace professional medical advice. Always consult with a healthcare 
                      provider for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              )}

              {!isAnalyzing && !results && (
                <div className="text-center py-8 text-muted-foreground">
                  <Stethoscope className="h-8 w-8 mx-auto mb-2" />
                  <p>Select symptoms to get AI-powered insights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}