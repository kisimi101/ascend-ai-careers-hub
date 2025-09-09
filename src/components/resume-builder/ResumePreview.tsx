
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

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

interface ResumePreviewProps {
  resumeData: ResumeData;
  onDownloadPDF: () => void;
}

export const ResumePreview = ({ resumeData, onDownloadPDF }: ResumePreviewProps) => {
  return (
    <Card className="sticky top-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Preview</CardTitle>
        <Button onClick={onDownloadPDF} size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </CardHeader>
      <CardContent>
        <div id="resume-preview" className="bg-white p-6 border rounded-lg min-h-[600px] text-sm">
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
  );
};
