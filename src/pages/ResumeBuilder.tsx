import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Navigation } from "@/components/Navigation";
import { useForm } from "react-hook-form";
import { Download, FileText, User, Briefcase, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";

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

  const form = useForm();

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

  const generateResume = async () => {
    // This would integrate with AI API to enhance content
    console.log("Generating enhanced resume with AI...", resumeData);
    // For now, just show the preview
  };

  const downloadPDF = () => {
    // This would generate and download PDF
    console.log("Downloading PDF...");
  };

  const navigate = useNavigate();

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
            {/* Progress Steps */}
            <div className="flex justify-between mb-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`flex items-center space-x-2 ${
                    index <= currentStep ? "text-orange-600" : "text-gray-400"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                  <span className="hidden sm:block text-sm font-medium">{step.title}</span>
                </div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>Fill in your {steps[currentStep].title.toLowerCase()} details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStep === 0 && (
                  <>
                    <Input
                      placeholder="Full Name"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value }
                      }))}
                    />
                    <Textarea
                      placeholder="Professional Summary"
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, summary: e.target.value }
                      }))}
                    />
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="border p-4 rounded-lg space-y-2">
                        <Input
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].company = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: newExp }));
                          }}
                        />
                        <Input
                          placeholder="Position"
                          value={exp.position}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].position = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: newExp }));
                          }}
                        />
                        <Input
                          placeholder="Duration (e.g., 2020-2023)"
                          value={exp.duration}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].duration = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: newExp }));
                          }}
                        />
                        <Textarea
                          placeholder="Job Description"
                          value={exp.description}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].description = e.target.value;
                            setResumeData(prev => ({ ...prev, experience: newExp }));
                          }}
                        />
                      </div>
                    ))}
                    <Button onClick={addExperience} variant="outline" className="w-full">
                      Add Another Experience
                    </Button>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="border p-4 rounded-lg space-y-2">
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].institution = e.target.value;
                            setResumeData(prev => ({ ...prev, education: newEdu }));
                          }}
                        />
                        <Input
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].degree = e.target.value;
                            setResumeData(prev => ({ ...prev, education: newEdu }));
                          }}
                        />
                        <Input
                          placeholder="Year"
                          value={edu.year}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education];
                            newEdu[index].year = e.target.value;
                            setResumeData(prev => ({ ...prev, education: newEdu }));
                          }}
                        />
                      </div>
                    ))}
                    <Button onClick={addEducation} variant="outline" className="w-full">
                      Add Another Education
                    </Button>
                  </>
                )}

                {currentStep === 3 && (
                  <div>
                    <Textarea
                      placeholder="Enter your skills separated by commas (e.g., JavaScript, React, Node.js)"
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        skills: e.target.value.split(',').map(skill => skill.trim())
                      }))}
                    />
                  </div>
                )}

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
            <Card className="sticky top-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Live Preview</CardTitle>
                <Button onClick={downloadPDF} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-6 border rounded-lg min-h-[600px] text-sm">
                  <div className="text-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-bold">{resumeData.personalInfo.fullName || "Your Name"}</h2>
                    <p className="text-gray-600">{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>
                    <p className="text-gray-600">{resumeData.personalInfo.location}</p>
                  </div>

                  {resumeData.personalInfo.summary && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-orange-600 border-b mb-2">PROFESSIONAL SUMMARY</h3>
                      <p>{resumeData.personalInfo.summary}</p>
                    </div>
                  )}

                  {resumeData.experience.some(exp => exp.company) && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-orange-600 border-b mb-2">EXPERIENCE</h3>
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{exp.position}</h4>
                            <span className="text-gray-600">{exp.duration}</span>
                          </div>
                          <p className="text-gray-700">{exp.company}</p>
                          <p className="text-sm mt-1">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.education.some(edu => edu.institution) && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-orange-600 border-b mb-2">EDUCATION</h3>
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="mb-2">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{edu.degree}</h4>
                            <span className="text-gray-600">{edu.year}</span>
                          </div>
                          <p className="text-gray-700">{edu.institution}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.skills.length > 0 && resumeData.skills[0] && (
                    <div>
                      <h3 className="font-semibold text-orange-600 border-b mb-2">SKILLS</h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
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

export default ResumeBuilder;
