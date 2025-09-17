import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface ATSScoreProps {
  resumeData: any;
  selectedTemplate: string;
}

export const ATSScoreCard = ({ resumeData, selectedTemplate }: ATSScoreProps) => {
  const calculateATSScore = () => {
    let score = 0;
    const checks = [];

    // Contact Information (20 points)
    if (resumeData.personalInfo.fullName && resumeData.personalInfo.email && resumeData.personalInfo.phone) {
      score += 20;
      checks.push({ type: "pass", text: "Complete contact information" });
    } else {
      checks.push({ type: "fail", text: "Missing contact information" });
    }

    // Professional Summary (15 points)
    if (resumeData.personalInfo.summary && resumeData.personalInfo.summary.length > 50) {
      score += 15;
      checks.push({ type: "pass", text: "Professional summary present" });
    } else {
      checks.push({ type: "warning", text: "Add a professional summary (50+ characters)" });
    }

    // Work Experience (25 points)
    const validExperience = resumeData.experience.filter(exp => exp.company && exp.position && exp.description);
    if (validExperience.length >= 2) {
      score += 25;
      checks.push({ type: "pass", text: "Sufficient work experience" });
    } else if (validExperience.length === 1) {
      score += 15;
      checks.push({ type: "warning", text: "Add more work experience entries" });
    } else {
      checks.push({ type: "fail", text: "Missing work experience" });
    }

    // Education (15 points)
    const validEducation = resumeData.education.filter(edu => edu.institution && edu.degree);
    if (validEducation.length >= 1) {
      score += 15;
      checks.push({ type: "pass", text: "Education information complete" });
    } else {
      checks.push({ type: "fail", text: "Missing education information" });
    }

    // Skills (15 points)
    if (resumeData.skills.length >= 5 && resumeData.skills[0]) {
      score += 15;
      checks.push({ type: "pass", text: "Relevant skills listed" });
    } else if (resumeData.skills.length >= 3 && resumeData.skills[0]) {
      score += 10;
      checks.push({ type: "warning", text: "Add more relevant skills (5+ recommended)" });
    } else {
      checks.push({ type: "fail", text: "Missing skills section" });
    }

    // Template ATS Compatibility (10 points)
    const templateBonus = selectedTemplate === "classic-minimal" ? 10 : 
                         selectedTemplate === "tech-specialist" ? 9 :
                         selectedTemplate === "modern-professional" ? 8 : 6;
    score += templateBonus;

    return { score: Math.min(score, 100), checks, templateBonus };
  };

  const { score, checks, templateBonus } = calculateATSScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "pass":
        return <CheckCircle className="text-green-600" size={16} />;
      case "warning":
        return <AlertTriangle className="text-yellow-600" size={16} />;
      case "fail":
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <Info className="text-blue-600" size={16} />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          ATS Compatibility Score
          <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}>
            {getScoreLabel(score)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </div>
          <Progress value={score} className="mt-2" />
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Optimization Checklist:</h4>
          <div className="space-y-1">
            {checks.map((check, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {renderIcon(check.type)}
                <span className={
                  check.type === "pass" ? "text-green-700" :
                  check.type === "warning" ? "text-yellow-700" :
                  "text-red-700"
                }>
                  {check.text}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm">
              <Info className="text-blue-600" size={16} />
              <span className="text-blue-700">
                Template ATS Score: {templateBonus}/10
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p><strong>Tip:</strong> ATS systems scan for keywords, clear formatting, and standard sections. Aim for 80%+ for best results.</p>
        </div>
      </CardContent>
    </Card>
  );
};