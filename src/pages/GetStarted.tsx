import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  Linkedin,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const GetStarted = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [activeMethod, setActiveMethod] = useState<string | null>(null);

  const handleStartFromScratch = () => {
    // Clear any existing resume data so builder starts fresh
    localStorage.removeItem("resume-data");
    navigate("/resume-builder");
  };

  const handleUploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported File",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("parse-resume", {
        body: {
          fileContent: base64,
          fileName: file.name,
          fileType: file.type,
        },
      });

      if (error) throw error;

      if (data?.resumeData) {
        // Store parsed data for resume builder
        const resumeData = {
          personalInfo: {
            fullName: data.resumeData.fullName || "",
            email: data.resumeData.email || "",
            phone: data.resumeData.phone || "",
            location: data.resumeData.location || "",
            summary: data.resumeData.summary || "",
          },
          experience: (data.resumeData.experience || []).map(
            (exp: any) => ({
              company: exp.company || "",
              position: exp.position || exp.title || "",
              duration: exp.duration || "",
              description: exp.description || "",
            })
          ),
          education: (data.resumeData.education || []).map(
            (edu: any) => ({
              institution: edu.institution || edu.school || "",
              degree: edu.degree || "",
              year: edu.year || edu.years || "",
            })
          ),
          skills: data.resumeData.skills || [],
          sectionOrder: ["summary", "experience", "education", "skills"],
        };

        localStorage.setItem("resume-data", JSON.stringify(resumeData));
        toast({
          title: "Resume Parsed!",
          description: "Your resume data has been extracted. Redirecting to builder...",
        });
        navigate("/resume-builder");
      } else {
        throw new Error("Could not extract data from resume");
      }
    } catch (err) {
      console.error("Resume parse error:", err);
      toast({
        title: "Parse Failed",
        description:
          "Could not extract resume data. Try a different format or start from scratch.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkedInImport = async () => {
    if (!linkedinUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter your LinkedIn profile URL.",
        variant: "destructive",
      });
      return;
    }

    const linkedinPattern =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[\w-]+\/?$/i;
    if (!linkedinPattern.test(linkedinUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid LinkedIn profile URL.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "scrape-linkedin",
        { body: { url: linkedinUrl } }
      );

      if (error) throw error;

      if (data?.success && data?.profile) {
        const profile = data.profile;
        const resumeData = {
          personalInfo: {
            fullName: profile.name || "",
            email: "",
            phone: "",
            location: "",
            summary: profile.summary || "",
          },
          experience: (profile.experience || []).map((exp: any) => ({
            company: exp.company || "",
            position: exp.title || "",
            duration: exp.duration || "",
            description: exp.description || "",
          })),
          education: (profile.education || []).map((edu: any) => ({
            institution: edu.school || "",
            degree: `${edu.degree || ""} ${edu.field || ""}`.trim(),
            year: edu.years || "",
          })),
          skills: profile.skills || [],
          sectionOrder: ["summary", "experience", "education", "skills"],
        };

        localStorage.setItem("resume-data", JSON.stringify(resumeData));
        toast({
          title: "Profile Imported!",
          description: "Your LinkedIn data has been loaded. Redirecting to builder...",
        });
        navigate("/resume-builder");
      } else {
        throw new Error(data?.error || "Failed to import profile");
      }
    } catch (err) {
      console.error("LinkedIn import error:", err);
      toast({
        title: "Import Failed",
        description:
          "Could not import LinkedIn profile. Ensure it's public and try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const methods = [
    {
      id: "smart",
      icon: Sparkles,
      title: "Smart Apply (Recommended)",
      description:
        "Upload your resume → AI optimizes it → finds matching jobs → generates cover letters → one-click batch apply.",
      badge: "New ✨",
      badgeVariant: "default" as const,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "scratch",
      icon: FileText,
      title: "Start from Scratch",
      description:
        "Build your resume step-by-step with our guided builder and AI suggestions.",
      badge: "Most Popular",
      badgeVariant: "secondary" as const,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "upload",
      icon: Upload,
      title: "Upload Your Resume",
      description:
        "Upload an existing resume (PDF, DOCX, or TXT) and we'll extract your information automatically.",
      badge: "Quick Start",
      badgeVariant: "secondary" as const,
      color: "text-accent-foreground",
      bgColor: "bg-accent/50",
    },
    {
      id: "linkedin",
      icon: Linkedin,
      title: "Import from LinkedIn",
      description:
        "Pull your experience, education, and skills directly from your LinkedIn profile.",
      badge: "One-Click",
      badgeVariant: "outline" as const,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-28 sm:pt-32 pb-20 container-padding">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              How would you like to
              <span className="text-gradient-primary block sm:inline">
                {" "}get started?
              </span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Choose the method that works best for you. You can always edit everything later.
            </p>
          </motion.div>

          {/* Method Cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {methods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  className={`card-enhanced cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    activeMethod === method.id
                      ? "ring-2 ring-primary shadow-lg"
                      : ""
                  }`}
                  onClick={() => {
                    if (method.id === "scratch") {
                      handleStartFromScratch();
                    } else {
                      setActiveMethod(
                        activeMethod === method.id ? null : method.id
                      );
                    }
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${method.bgColor}`}>
                        <method.icon className={`h-6 w-6 ${method.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {method.title}
                          </h3>
                          <Badge variant={method.badgeVariant} className="text-xs">
                            {method.badge}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    </div>

                    {/* Expanded sections */}
                    {activeMethod === "upload" && method.id === "upload" && (
                      <div
                        className="mt-5 pt-5 border-t border-border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx,.txt"
                          className="hidden"
                          onChange={handleUploadResume}
                        />
                        <Button
                          className="w-full btn-gradient"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Parsing resume...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Choose file (PDF, DOCX, TXT)
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Max 5MB • We extract your info using AI
                        </p>
                      </div>
                    )}

                    {activeMethod === "linkedin" &&
                      method.id === "linkedin" && (
                        <div
                          className="mt-5 pt-5 border-t border-border"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex gap-2">
                            <Input
                              placeholder="linkedin.com/in/yourprofile"
                              value={linkedinUrl}
                              onChange={(e) => setLinkedinUrl(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              className="btn-gradient shrink-0"
                              onClick={handleLinkedInImport}
                              disabled={isImporting}
                            >
                              {isImporting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Import"
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Your profile must be set to public
                          </p>
                        </div>
                      )}

                    {activeMethod === "ai" && method.id === "ai" && (
                      <div
                        className="mt-5 pt-5 border-t border-border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          className="w-full btn-gradient"
                          onClick={() => {
                            localStorage.removeItem("resume-data");
                            navigate("/resume-builder?ai=true");
                          }}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Launch AI Resume Assistant
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Tell us your target role and we'll generate a draft
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              ATS-optimized templates
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              AI-powered suggestions
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Export as PDF
            </span>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GetStarted;
