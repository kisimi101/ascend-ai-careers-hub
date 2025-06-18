import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Download, FileText, Briefcase, User, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

interface CoverLetterData {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  yourName: string;
  yourExperience: string;
  tone: "professional" | "enthusiastic" | "creative";
}

const CoverLetterGenerator = () => {
  const [formData, setFormData] = useState<CoverLetterData>({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    yourName: "",
    yourExperience: "",
    tone: "professional"
  });

  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (in real implementation, this would call an AI API)
    setTimeout(() => {
      const letter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.companyName}. With my background in ${formData.yourExperience}, I am confident that I would be a valuable addition to your team.

Based on the job description you provided, I understand that you are looking for someone who can contribute to ${formData.jobDescription.slice(0, 100)}... My experience aligns well with these requirements, particularly in areas where I have demonstrated success.

Throughout my career, I have developed strong skills that directly relate to this role. ${formData.yourExperience} has prepared me to take on the challenges and responsibilities outlined in your job posting.

I am particularly drawn to ${formData.companyName} because of your company's reputation and values. I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's continued success.

Thank you for considering my application. I look forward to hearing from you soon.

Sincerely,
${formData.yourName}`;

      setGeneratedLetter(letter);
      setIsGenerating(false);
    }, 2000);
  };

  const downloadLetter = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${formData.companyName.replace(/\s+/g, '-').toLowerCase()}.txt`;
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Cover Letter Generator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate personalized, compelling cover letters tailored to any job opportunity
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Job & Personal Details
                </CardTitle>
                <CardDescription>Provide information about the job and yourself</CardDescription>
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
                  <label className="text-sm font-medium flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Company Name
                  </label>
                  <Input
                    placeholder="e.g., Google, Microsoft, Startup Inc."
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Your Full Name
                  </label>
                  <Input
                    placeholder="Your full name"
                    value={formData.yourName}
                    onChange={(e) => setFormData(prev => ({ ...prev, yourName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Description</label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    className="min-h-[100px]"
                    value={formData.jobDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Experience & Background</label>
                  <Textarea
                    placeholder="Briefly describe your relevant experience, skills, and achievements..."
                    className="min-h-[100px]"
                    value={formData.yourExperience}
                    onChange={(e) => setFormData(prev => ({ ...prev, yourExperience: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.tone}
                    onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value as CoverLetterData['tone'] }))}
                  >
                    <option value="professional">Professional</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <Button
                  onClick={generateCoverLetter}
                  disabled={!formData.jobTitle || !formData.companyName || !formData.yourName || isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? "Generating..." : "Generate Cover Letter"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div>
            <Card className="sticky top-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Generated Cover Letter</CardTitle>
                {generatedLetter && (
                  <Button onClick={downloadLetter} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 border rounded-lg min-h-[600px]">
                  {generatedLetter ? (
                    <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                      {generatedLetter}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4" />
                        <p>Your generated cover letter will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoverLetterGenerator;
