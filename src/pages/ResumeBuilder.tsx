
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase, GraduationCap, FileText, Settings, Sparkles } from "lucide-react";
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
import { ResumeData } from "@/components/resume-builder/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";


const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("modern-professional");
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
    skills: []
  });

  const navigate = useNavigate();

  const steps = [
    { title: "Template", icon: Settings },
    { title: "Personal Info", icon: User },
    { title: "Experience", icon: Briefcase },
    { title: "Education", icon: GraduationCap },
    { title: "Skills", icon: FileText },
    { title: "Optimize", icon: Sparkles }
  ];

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

  const { toast } = useToast();

  const generateResume = async () => {
    try {
      toast({
        title: "Enhancing Resume with AI...",
        description: "Optimizing your resume content for ATS compatibility.",
      });

      // Simulate AI enhancement - you can integrate with actual AI service later
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Auto-advance to the last step to show the enhanced preview
      setCurrentStep(steps.length - 1);

      toast({
        title: "Resume Enhanced!",
        description: "Your resume has been optimized with AI suggestions.",
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Error",
        description: "Failed to enhance resume. Please try again.",
        variant: "destructive",
      });
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
        description: "Your resume has been downloaded successfully.",
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
                    <Button onClick={generateResume} className="bg-orange-600 hover:bg-orange-700">
                      Generate Resume
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div>
            <EnhancedResumePreview
              resumeData={resumeData}
              selectedTemplate={selectedTemplate}
              onDownloadPDF={downloadPDF}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResumeBuilder;
