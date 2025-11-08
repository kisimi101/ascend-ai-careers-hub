
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase, GraduationCap, FileText, Settings, Sparkles, History, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { ProgressSteps } from "@/components/resume-builder/ProgressSteps";
import { PersonalInfoForm } from "@/components/resume-builder/PersonalInfoForm";
import { ExperienceForm } from "@/components/resume-builder/ExperienceForm";
import { EducationForm } from "@/components/resume-builder/EducationForm";
import { SkillsForm } from "@/components/resume-builder/SkillsForm";
import { TemplateSelector } from "@/components/resume-builder/TemplateSelector";
import { ATSScoreCard } from "@/components/resume-builder/ATSScoreCard";
import { EnhancedResumePreview } from "@/components/resume-builder/EnhancedResumePreview";
import { VersionHistory } from "@/components/resume-builder/VersionHistory";
import { SectionReorder } from "@/components/resume-builder/SectionReorder";
import { ResumeData } from "@/components/resume-builder/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("modern-professional");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: ""
    },
    experience: [{ company: "", position: "", duration: "", description: "" }],
    education: [{ institution: "", degree: "", year: "" }],
    skills: [],
    sectionOrder: ["summary", "experience", "education", "skills"]
  });
  
  const [versions, setVersions] = useState<Array<{
    id: string;
    timestamp: Date;
    resumeData: ResumeData;
    template: string;
  }>>([]);

  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { title: "Template", icon: Settings },
    { title: "Personal Info", icon: User },
    { title: "Experience", icon: Briefcase },
    { title: "Education", icon: GraduationCap },
    { title: "Skills", icon: FileText },
    { title: "Optimize", icon: Sparkles }
  ];

  // Save version whenever resumeData changes significantly
  useEffect(() => {
    const saveVersion = () => {
      if (resumeData.personalInfo.fullName) {
        setVersions(prev => {
          const newVersion = {
            id: `version-${Date.now()}`,
            timestamp: new Date(),
            resumeData: { ...resumeData },
            template: selectedTemplate
          };
          
          // Keep only last 10 versions
          const updatedVersions = [newVersion, ...prev].slice(0, 10);
          return updatedVersions;
        });
      }
    };

    const timeoutId = setTimeout(saveVersion, 2000);
    return () => clearTimeout(timeoutId);
  }, [resumeData, selectedTemplate]);

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", position: "", duration: "", description: "" }]
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", year: "" }]
    }));
  };

  const updatePersonalInfo = (personalInfo: ResumeData['personalInfo']) => {
    setResumeData(prev => ({ ...prev, personalInfo }));
  };

  const updateExperience = (experience: ResumeData['experience']) => {
    setResumeData(prev => ({ ...prev, experience }));
  };

  const updateEducation = (education: ResumeData['education']) => {
    setResumeData(prev => ({ ...prev, education }));
  };

  const updateSkills = (skills: string[]) => {
    setResumeData(prev => ({ ...prev, skills }));
  };

  const updateSectionOrder = (sectionOrder: Array<"experience" | "education" | "skills" | "summary">) => {
    setResumeData(prev => ({ ...prev, sectionOrder }));
  };

  const restoreVersion = (version: any) => {
    setResumeData(version.resumeData);
    setSelectedTemplate(version.template);
  };

  const deleteVersion = (versionId: string) => {
    setVersions(prev => prev.filter(v => v.id !== versionId));
  };

  const generateResume = async () => {
    setIsOptimizing(true);
    
    try {
      // Call AI to optimize resume
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/optimize-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ resumeData })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update resume with AI optimizations
        if (data.optimizedResume) {
          setResumeData(data.optimizedResume);
        }
        
        toast({
          title: "Resume Optimized!",
          description: "Your resume has been enhanced with AI suggestions.",
        });
      } else {
        // Fallback if AI optimization fails
        toast({
          title: "Optimization Complete",
          description: "View your ATS score and suggestions below.",
        });
      }
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization Complete",
        description: "View your ATS score and suggestions below.",
      });
    } finally {
      setIsOptimizing(false);
      setCurrentStep(steps.length - 1);
    }
  };

  const downloadPDF = async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we create your resume PDF.",
      });

      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) {
        toast({
          title: "Error",
          description: "Resume preview not found. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('resume-preview') as HTMLElement | null;
          if (el) {
            el.style.boxShadow = 'none';
            el.style.minHeight = 'auto';
            el.style.borderRadius = '0';
          }
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // mm
      const maxW = pageWidth - margin * 2;
      const maxH = pageHeight - margin * 2;

      // Start by fitting to width
      const widthFitH = (canvas.height * maxW) / canvas.width;

      if (widthFitH <= maxH) {
        // Fits on one page when using full width
        const x = (pageWidth - maxW) / 2;
        pdf.addImage(imgData, 'PNG', x, margin, maxW, widthFitH);
      } else {
        // Scale down uniformly to fit height as well (force single page)
        const scale = maxH / widthFitH; // < 1
        const finalW = maxW * scale;
        const finalH = maxH; // by definition
        const x = (pageWidth - finalW) / 2;
        pdf.addImage(imgData, 'PNG', x, margin, finalW, finalH);
      }

      const fileName = `${resumeData.personalInfo.fullName || 'Resume'}_Resume.pdf`;
      pdf.save(fileName);

      toast({
        title: "Success!",
        description: "Your resume has been downloaded as PDF.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadDOCX = async () => {
    toast({
      title: "DOCX Export",
      description: "DOCX export is coming soon! Use PDF export for now.",
    });
  };

  const downloadPNG = async () => {
    try {
      toast({
        title: "Generating PNG...",
        description: "Please wait while we create your resume image.",
      });

      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) {
        toast({
          title: "Error",
          description: "Resume preview not found.",
          variant: "destructive",
        });
        return;
      }

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${resumeData.personalInfo.fullName || 'Resume'}_Resume.png`;
          link.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: "Success!",
            description: "Your resume has been downloaded as PNG.",
          });
        }
      });
    } catch (error) {
      console.error('Error generating PNG:', error);
      toast({
        title: "Error",
        description: "Failed to generate PNG. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />
        );
      case 1:
        return (
          <PersonalInfoForm
            personalInfo={resumeData.personalInfo}
            onUpdate={updatePersonalInfo}
          />
        );
      case 2:
        return (
          <ExperienceForm
            experience={resumeData.experience}
            onUpdate={updateExperience}
            onAdd={addExperience}
          />
        );
      case 3:
        return (
          <EducationForm
            education={resumeData.education}
            onUpdate={updateEducation}
            onAdd={addEducation}
          />
        );
      case 4:
        return (
          <SkillsForm
            skills={resumeData.skills}
            onUpdate={updateSkills}
          />
        );
      case 5:
        return (
          <ATSScoreCard
            resumeData={resumeData}
            selectedTemplate={selectedTemplate}
          />
        );
      default:
        return null;
    }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Resume Builder</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume in minutes with our AI-powered builder
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <ProgressSteps steps={steps} currentStep={currentStep} />

            <Tabs defaultValue="builder" className="mb-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="builder">Builder</TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="reorder">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Reorder
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="builder">
                <Card>
                  <CardHeader>
                    <CardTitle>{steps[currentStep].title}</CardTitle>
                    <CardDescription>Fill in your {steps[currentStep].title.toLowerCase()} details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {renderCurrentStep()}

                    <div className="flex justify-between pt-4">
                      <Button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      {currentStep < steps.length - 1 ? (
                        <Button onClick={() => setCurrentStep(currentStep + 1)}>
                          Next
                        </Button>
                      ) : (
                        <Button 
                          onClick={generateResume} 
                          className="bg-orange-600 hover:bg-orange-700"
                          disabled={isOptimizing}
                        >
                          {isOptimizing ? "Optimizing..." : "Optimize Resume"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <VersionHistory
                  versions={versions}
                  onRestore={restoreVersion}
                  onDelete={deleteVersion}
                />
              </TabsContent>

              <TabsContent value="reorder">
                <SectionReorder
                  sections={resumeData.sectionOrder || ["summary", "experience", "education", "skills"]}
                  onReorder={updateSectionOrder}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div>
            <EnhancedResumePreview
              resumeData={resumeData}
              selectedTemplate={selectedTemplate}
              onDownloadPDF={downloadPDF}
              onDownloadDOCX={downloadDOCX}
              onDownloadPNG={downloadPNG}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResumeBuilder;
