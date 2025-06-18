
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase, GraduationCap, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { ProgressSteps } from "@/components/resume-builder/ProgressSteps";
import { PersonalInfoForm } from "@/components/resume-builder/PersonalInfoForm";
import { ExperienceForm } from "@/components/resume-builder/ExperienceForm";
import { EducationForm } from "@/components/resume-builder/EducationForm";
import { SkillsForm } from "@/components/resume-builder/SkillsForm";
import { ResumePreview } from "@/components/resume-builder/ResumePreview";

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  skills: string[];
}

const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
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
    { title: "Personal Info", icon: User },
    { title: "Experience", icon: Briefcase },
    { title: "Education", icon: GraduationCap },
    { title: "Skills", icon: FileText }
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

  const generateResume = async () => {
    console.log("Generating enhanced resume with AI...", resumeData);
  };

  const downloadPDF = () => {
    console.log("Downloading PDF...");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoForm
            personalInfo={resumeData.personalInfo}
            onUpdate={updatePersonalInfo}
          />
        );
      case 1:
        return (
          <ExperienceForm
            experience={resumeData.experience}
            onUpdate={updateExperience}
            onAdd={addExperience}
          />
        );
      case 2:
        return (
          <EducationForm
            education={resumeData.education}
            onUpdate={updateEducation}
            onAdd={addEducation}
          />
        );
      case 3:
        return (
          <SkillsForm
            skills={resumeData.skills}
            onUpdate={updateSkills}
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
            <ResumePreview
              resumeData={resumeData}
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
