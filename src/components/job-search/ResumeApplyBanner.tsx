import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ResumeApplyBannerProps {
  resumeData: {
    personalInfo: { fullName: string; email: string; phone: string; location: string; summary: string };
    experience: Array<{ company: string; position: string; duration: string; description: string }>;
    skills: string[];
  } | null;
  searchQuery: string;
  location: string;
}

export const ResumeApplyBanner = ({ resumeData, searchQuery, location }: ResumeApplyBannerProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!resumeData) {
    return (
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardContent className="py-5 text-center">
          <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">No Resume Found</p>
          <p className="text-xs text-muted-foreground mb-3">Build your resume to auto-fill job applications</p>
          <Button size="sm" onClick={() => navigate('/resume-builder')} className="w-full">
            <Sparkles className="w-3 h-3 mr-1" />
            Build Resume
          </Button>
        </CardContent>
      </Card>
    );
  }

  const latestRole = resumeData.experience?.[0]?.position || "Professional";
  const topSkills = resumeData.skills?.slice(0, 4) || [];

  const copyField = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fields = [
    { label: "Name", value: resumeData.personalInfo.fullName },
    { label: "Email", value: resumeData.personalInfo.email },
    { label: "Phone", value: resumeData.personalInfo.phone },
    { label: "Location", value: resumeData.personalInfo.location },
  ].filter(f => f.value);

  const query = encodeURIComponent(latestRole || searchQuery || "developer");
  const loc = encodeURIComponent(location || resumeData.personalInfo.location || "");

  const boards = [
    { name: "Indeed", url: `https://www.indeed.com/jobs?q=${query}&l=${loc}`, color: "bg-[#2164f3]" },
    { name: "LinkedIn", url: `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${loc}`, color: "bg-[#0077b5]" },
    { name: "Glassdoor", url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${query}&locKeyword=${loc}`, color: "bg-[#0caa41]" },
  ];

  return (
    <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Resume Quick Apply
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Resume summary */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground text-sm">{resumeData.personalInfo.fullName}</p>
          <p>{latestRole}</p>
        </div>

        {/* Skills badges */}
        {topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {topSkills.map((skill, i) => (
              <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* Quick copy fields */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Quick Copy</p>
          {fields.map((field) => (
            <button
              key={field.label}
              onClick={() => copyField(field.label, field.value)}
              className="w-full flex items-center justify-between text-xs px-2 py-1.5 rounded-md hover:bg-accent transition-colors text-left"
            >
              <span className="truncate text-foreground">{field.value}</span>
              {copiedField === field.label ? (
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 ml-1" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground flex-shrink-0 ml-1" />
              )}
            </button>
          ))}
        </div>

        {/* Apply on boards using resume role */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Apply as "{latestRole}"</p>
          <div className="grid grid-cols-3 gap-1">
            {boards.map((board) => (
              <Button
                key={board.name}
                onClick={() => window.open(board.url, '_blank')}
                className={`${board.color} text-white text-[10px] h-7 px-2`}
                size="sm"
              >
                {board.name}
                <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
              </Button>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => navigate('/resume-job-search')}
        >
          <FileText className="w-3 h-3 mr-1" />
          Find AI-Matched Jobs
        </Button>
      </CardContent>
    </Card>
  );
};
