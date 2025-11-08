import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Image, File } from "lucide-react";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { TechTemplate } from "./templates/TechTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ResumeData } from "./types";

interface EnhancedResumePreviewProps {
  resumeData: ResumeData;
  selectedTemplate: string;
  onDownloadPDF: () => void;
  onDownloadDOCX: () => void;
  onDownloadPNG: () => void;
}

export const EnhancedResumePreview = ({ 
  resumeData, 
  selectedTemplate, 
  onDownloadPDF,
  onDownloadDOCX,
  onDownloadPNG
}: EnhancedResumePreviewProps) => {
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "classic-minimal":
        return <ClassicTemplate resumeData={resumeData} />;
      case "tech-specialist":
        return <TechTemplate resumeData={resumeData} />;
      case "creative-designer":
        return <CreativeTemplate resumeData={resumeData} />;
      default:
        return <ModernTemplate resumeData={resumeData} />;
    }
  };

  return (
    <Card className="sticky top-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Resume Preview</CardTitle>
          <div className="flex gap-2">
            <Button onClick={onDownloadPDF} size="sm" variant="default">
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button onClick={onDownloadDOCX} size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-1" />
              DOCX
            </Button>
            <Button onClick={onDownloadPNG} size="sm" variant="outline">
              <Image className="h-4 w-4 mr-1" />
              PNG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          id="resume-preview" 
          className="border rounded-lg min-h-[700px] max-h-[800px] shadow-sm overflow-y-auto"
          style={{ aspectRatio: '8.5/11' }}
        >
          {renderTemplate()}
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground text-center">
          Template: {selectedTemplate.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </div>
      </CardContent>
    </Card>
  );
};