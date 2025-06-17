
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Upload, FileText, CheckCircle, AlertTriangle, X, Target, Zap, Eye } from "lucide-react";

interface AnalysisResult {
  overallScore: number;
  atsCompatibility: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
    suggestions: string[];
  }[];
  keywords: {
    found: string[];
    missing: string[];
  };
  formatting: {
    score: number;
    issues: string[];
  };
}

const ResumeChecker = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setUploadedFile(file);
      setAnalysisResult(null);
    }
  };

  const analyzeResume = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis (in real implementation, this would process the file and use AI)
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        overallScore: 78,
        atsCompatibility: 85,
        sections: [
          {
            name: "Contact Information",
            score: 95,
            feedback: "Complete and well-formatted contact details",
            suggestions: ["Consider adding LinkedIn profile"]
          },
          {
            name: "Professional Summary",
            score: 72,
            feedback: "Good summary but could be more impactful",
            suggestions: ["Add quantifiable achievements", "Use stronger action verbs"]
          },
          {
            name: "Work Experience",
            score: 80,
            feedback: "Relevant experience clearly presented",
            suggestions: ["Add more metrics and numbers", "Include specific technologies used"]
          },
          {
            name: "Skills Section",
            score: 65,
            feedback: "Skills are listed but need better organization",
            suggestions: ["Categorize technical and soft skills", "Match more keywords from job description"]
          }
        ],
        keywords: {
          found: ["JavaScript", "React", "Node.js", "Python", "SQL"],
          missing: ["AWS", "Docker", "Kubernetes", "TypeScript", "GraphQL"]
        },
        formatting: {
          score: 88,
          issues: ["Consider using consistent bullet points", "Ensure proper margins"]
        }
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Resume Checker</h1>
            <p className="text-xl text-gray-600">Get instant feedback and ATS compatibility score</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Resume
                  </CardTitle>
                  <CardDescription>Upload your resume for analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Description (Optional)</label>
                    <textarea
                      className="w-full p-3 border rounded-md min-h-[100px] text-sm"
                      placeholder="Paste the job description to get targeted feedback..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={analyzeResume}
                    disabled={!uploadedFile || isAnalyzing}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              {analysisResult ? (
                <div className="space-y-6">
                  {/* Overall Scores */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Overall Score</h3>
                            <p className="text-sm text-gray-600">Resume quality rating</p>
                          </div>
                          <div className={`text-3xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                            {analysisResult.overallScore}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">ATS Compatibility</h3>
                            <p className="text-sm text-gray-600">Applicant Tracking System</p>
                          </div>
                          <div className={`text-3xl font-bold ${getScoreColor(analysisResult.atsCompatibility)}`}>
                            {analysisResult.atsCompatibility}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Section Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysisResult.sections.map((section, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{section.name}</h4>
                              <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreBgColor(section.score)} ${getScoreColor(section.score)}`}>
                                {section.score}%
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{section.feedback}</p>
                            <div className="space-y-1">
                              {section.suggestions.map((suggestion, idx) => (
                                <div key={idx} className="flex items-start space-x-2 text-sm">
                                  <Zap className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                                  <span>{suggestion}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Keywords Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Eye className="h-5 w-5 mr-2" />
                        Keywords Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-green-700 mb-3 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Found Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.keywords.found.map((keyword, index) => (
                              <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-red-700 mb-3 flex items-center">
                            <X className="h-4 w-4 mr-1" />
                            Missing Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.keywords.missing.map((keyword, index) => (
                              <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Formatting Issues */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Formatting & Structure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">Formatting Score</span>
                        <span className={`text-xl font-bold ${getScoreColor(analysisResult.formatting.score)}`}>
                          {analysisResult.formatting.score}%
                        </span>
                      </div>
                      {analysisResult.formatting.issues.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900">Improvement Suggestions:</h5>
                          {analysisResult.formatting.issues.map((issue, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{issue}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your resume to get started</h3>
                    <p className="text-gray-600">Get instant feedback on your resume's ATS compatibility and overall quality</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeChecker;
