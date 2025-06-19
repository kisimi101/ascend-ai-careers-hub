
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, User, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

interface SummaryData {
  jobTitle: string;
  experience: string;
  skills: string;
  achievements: string;
}

const ResumeSummaryGenerator = () => {
  const [formData, setFormData] = useState<SummaryData>({
    jobTitle: "",
    experience: "",
    skills: "",
    achievements: ""
  });

  const [generatedSummary, setGeneratedSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

  const generateSummary = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const summary = `${formData.experience} ${formData.jobTitle} with expertise in ${formData.skills}. Proven track record in ${formData.achievements}. Seeking to leverage strong analytical and problem-solving skills to drive business growth and deliver exceptional results in a dynamic work environment.`;
      
      setGeneratedSummary(summary);
      setIsGenerating(false);
    }, 2000);
  };

  const downloadSummary = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedSummary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "resume-summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
                CareerHub
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Summary Generator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create compelling professional summaries that grab recruiters' attention
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Professional Details
              </CardTitle>
              <CardDescription>Tell us about your professional background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Job Title
                </label>
                <Input
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input
                  placeholder="e.g., 5+ years experienced, Entry-level"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Key Skills</label>
                <Textarea
                  placeholder="List your main skills and expertise areas..."
                  className="min-h-[80px]"
                  value={formData.skills}
                  onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Key Achievements</label>
                <Textarea
                  placeholder="Mention your major accomplishments and results..."
                  className="min-h-[80px]"
                  value={formData.achievements}
                  onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                />
              </div>

              <Button
                onClick={generateSummary}
                disabled={!formData.jobTitle || !formData.experience || isGenerating}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isGenerating ? "Generating..." : "Generate Summary"}
              </Button>
            </CardContent>
          </Card>

          <Card className="sticky top-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Summary</CardTitle>
              {generatedSummary && (
                <Button onClick={downloadSummary} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="bg-white p-6 border rounded-lg min-h-[400px]">
                {generatedSummary ? (
                  <p className="text-sm leading-relaxed">{generatedSummary}</p>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4" />
                      <p>Your generated summary will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResumeSummaryGenerator;
