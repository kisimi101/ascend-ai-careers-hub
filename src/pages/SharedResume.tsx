import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ModernTemplate } from "@/components/resume-builder/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/resume-builder/templates/ClassicTemplate";
import { TechTemplate } from "@/components/resume-builder/templates/TechTemplate";
import { CreativeTemplate } from "@/components/resume-builder/templates/CreativeTemplate";
import { ResumeData } from "@/components/resume-builder/types";
import { Eye, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SharedResume = () => {
  const { token } = useParams<{ token: string }>();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [template, setTemplate] = useState("modern-professional");
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) loadResume();
  }, [token]);

  const loadResume = async () => {
    try {
      const { data, error: fetchError } = await supabase.functions.invoke('track-resume-view', {
        body: { share_token: token }
      });

      if (fetchError || !data?.success) {
        setError("Resume not found or link has expired.");
        return;
      }

      setResumeData(data.resume.resume_data);
      setTemplate(data.resume.template);
      setViewCount(data.resume.view_count);
    } catch {
      setError("Failed to load resume.");
    } finally {
      setLoading(false);
    }
  };

  const renderTemplate = () => {
    if (!resumeData) return null;
    switch (template) {
      case "classic-minimal": return <ClassicTemplate resumeData={resumeData} />;
      case "tech-specialist": return <TechTemplate resumeData={resumeData} />;
      case "creative-designer": return <CreativeTemplate resumeData={resumeData} />;
      default: return <ModernTemplate resumeData={resumeData} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Resume Not Found</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-[850px] mx-auto">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{viewCount} views</span>
          </div>
          <p className="text-xs text-muted-foreground">Powered by CareerHub AI</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default SharedResume;
