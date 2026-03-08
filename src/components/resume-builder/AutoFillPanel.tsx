import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { ResumeData } from "./types";
import { useToast } from "@/hooks/use-toast";

interface AutoFillPanelProps {
  resumeData: ResumeData;
}

export const AutoFillPanel = ({ resumeData }: AutoFillPanelProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (value: string, fieldName: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    toast({ title: "Copied!", description: `${fieldName} copied to clipboard.` });
  };

  const fields = [
    { label: "Full Name", value: resumeData.personalInfo.fullName },
    { label: "Email", value: resumeData.personalInfo.email },
    { label: "Phone", value: resumeData.personalInfo.phone },
    { label: "Location", value: resumeData.personalInfo.location },
    { label: "Summary", value: resumeData.personalInfo.summary },
    { label: "Skills", value: resumeData.skills.join(", ") },
    ...resumeData.experience.filter(e => e.company).map((exp, i) => ({
      label: `Experience ${i + 1}`,
      value: `${exp.position} at ${exp.company} (${exp.duration})\n${exp.description}`
    })),
    ...resumeData.education.filter(e => e.institution).map((edu, i) => ({
      label: `Education ${i + 1}`,
      value: `${edu.degree} - ${edu.institution} (${edu.year})`
    })),
  ].filter(f => f.value?.trim());

  const copyAll = async () => {
    const fullText = fields.map(f => `${f.label}: ${f.value}`).join('\n\n');
    await navigator.clipboard.writeText(fullText);
    toast({ title: "All fields copied!", description: "Paste into any job application form." });
  };

  if (fields.length === 0) return null;

  return (
    <Card className="border-dashed border-primary/30">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            Quick Auto-Fill
          </span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-2">
          <Button onClick={copyAll} size="sm" variant="outline" className="w-full mb-2 text-xs">
            <Copy className="h-3 w-3 mr-1" /> Copy All Fields
          </Button>
          <div className="max-h-60 overflow-y-auto space-y-1.5">
            {fields.map((field) => (
              <div key={field.label} className="flex items-center justify-between gap-2 p-2 rounded bg-muted/50 text-xs">
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-muted-foreground">{field.label}:</span>
                  <span className="ml-1 truncate text-foreground">{field.value?.substring(0, 50)}{(field.value?.length || 0) > 50 ? '...' : ''}</span>
                </div>
                <Button
                  onClick={() => copyToClipboard(field.value, field.label)}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 flex-shrink-0"
                >
                  {copiedField === field.label ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
