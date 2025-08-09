import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, Copy, RefreshCw, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResumeBulletGenerator = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [level, setLevel] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobTitle || !workDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in job title and work description",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI bullet generation
    setTimeout(() => {
      const generatedBullets = [
        `Led ${industry || 'cross-functional'} team of 5+ members to achieve ${Math.floor(Math.random() * 50) + 20}% improvement in project delivery`,
        `Implemented strategic initiatives that resulted in $${(Math.random() * 500 + 100).toFixed(0)}K cost savings annually`,
        `Collaborated with stakeholders to streamline processes, reducing turnaround time by ${Math.floor(Math.random() * 40) + 15}%`,
        `Developed and executed ${workDescription.includes('manage') ? 'management' : 'technical'} solutions improving operational efficiency by ${Math.floor(Math.random() * 30) + 25}%`,
        `Mentored junior team members while maintaining ${Math.floor(Math.random() * 20) + 95}% client satisfaction rate`
      ];
      
      setBullets(generatedBullets);
      setIsGenerating(false);
      
      toast({
        title: "Bullets Generated!",
        description: "AI has created optimized bullet points for your resume",
      });
    }, 2000);
  };

  const copyToClipboard = (bullet: string) => {
    navigator.clipboard.writeText(bullet);
    toast({
      title: "Copied!",
      description: "Bullet point copied to clipboard",
    });
  };

  const copyAllBullets = () => {
    const allBullets = bullets.join('\n• ');
    navigator.clipboard.writeText('• ' + allBullets);
    toast({
      title: "All Bullets Copied!",
      description: "All bullet points copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-800 text-sm font-medium mb-6">
              <Target className="w-4 h-4 mr-2" />
              AI Bullet Generator
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Generate Powerful
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Resume Bullets</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your work experience into impactful, ATS-friendly bullet points that get you noticed by recruiters.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-orange-500" />
                  Your Experience Details
                </CardTitle>
                <CardDescription>
                  Provide details about your role and we'll generate optimized bullet points
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level">Experience Level</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="director">Director+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="workDescription">Work Description *</Label>
                  <Textarea
                    id="workDescription"
                    placeholder="Describe your key responsibilities, projects, and achievements in this role..."
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating Bullets...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Generate Bullet Points
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Bullets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated Bullet Points</CardTitle>
                  {bullets.length > 0 && (
                    <Button variant="outline" size="sm" onClick={copyAllBullets}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </Button>
                  )}
                </div>
                <CardDescription>
                  AI-optimized bullet points ready for your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bullets.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Generated bullet points will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bullets.map((bullet, index) => (
                      <div 
                        key={index}
                        className="group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge variant="secondary" className="mb-2">
                              Bullet {index + 1}
                            </Badge>
                            <p className="text-gray-700">• {bullet}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(bullet)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResumeBulletGenerator;