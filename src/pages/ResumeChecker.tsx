
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Upload, FileText, CheckCircle, AlertTriangle, X, Target, Zap, Eye } from "lucide-react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { uploadLarge, MAX_UPLOAD_BYTES } from "@/lib/uploadLarge";

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
  const [showAuth, setShowAuth] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const okType = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/rtf',
      'text/rtf',
    ].includes(file.type) || ['pdf','doc','docx','txt','rtf'].includes(ext);
    if (!okType) {
      toast({ title: "Unsupported file", description: "Please upload PDF, DOC, DOCX, TXT, or RTF.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast({ title: "Too large", description: "Maximum file size is 50MB.", variant: "destructive" });
      return;
    }
    setUploadedFile(file);
    setAnalysisResult(null);
  };

  const analyzeResume = async () => {
    if (!uploadedFile) return;
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    setIsAnalyzing(true);
    try {
      let invokeBody: Record<string, unknown> = {
        action: "check-resume",
        mimeType: uploadedFile.type,
        jobDescription: jobDescription || undefined,
      };
      // Files >4MB go through Storage to bypass the 6MB edge-function payload cap
      if (uploadedFile.size > 4 * 1024 * 1024) {
        const { path } = await uploadLarge(uploadedFile);
        invokeBody.storagePath = path;
      } else {
        const buf = await uploadedFile.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = "";
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
        }
        invokeBody.fileBase64 = btoa(binary);
      }
      const { data, error } = await supabase.functions.invoke("ai-resume-tools", { body: invokeBody });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAnalysisResult(data.result as AnalysisResult);
    } catch (e: any) {
      toast({
        title: "Analysis failed",
        description: e?.message || "Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                CareerNow
              </span>
            </div>
            <Button onClick={() => navigate('/')} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Resume Checker & Grader</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get instant feedback on your resume's ATS compatibility and professional quality
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
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
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX, TXT, RTF up to 50MB</p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf"
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

      <Footer />
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} defaultTab="signin" />
    </div>
  );
};

export default ResumeChecker;
