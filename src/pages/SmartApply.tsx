import { useState, useRef, useCallback, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Sparkles,
  Search,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ExternalLink,
  Copy,
  Briefcase,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Download,
  Crown,
  Lock,
  History,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import { ModernTemplate } from "@/components/resume-builder/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/resume-builder/templates/ClassicTemplate";
import { TechTemplate } from "@/components/resume-builder/templates/TechTemplate";
import { CreativeTemplate } from "@/components/resume-builder/templates/CreativeTemplate";
import { ExecutiveTemplate } from "@/components/resume-builder/templates/ExecutiveTemplate";
import { MinimalistTemplate } from "@/components/resume-builder/templates/MinimalistTemplate";
import { densityWrapperStyle, densityClassName, type Density } from "@/components/resume-builder/templates/densityStyles";
import {
  saveRun,
  getInstantApplyRemaining,
  incrementInstantApply,
  getInstantApplyLimit,
  type ApplyHistoryJob,
} from "@/lib/applyHistory";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { SearchUsageBadge } from "@/components/job-search/SearchUsageBadge";
import { useTrialLimit } from "@/hooks/useTrialLimit";
import { AuthDialog } from "@/components/auth/AuthDialog";

interface ResumeData {
  personalInfo: { fullName: string; email: string; phone: string; location: string; summary: string };
  experience: Array<{ company: string; position: string; duration: string; description: string }>;
  education: Array<{ institution: string; degree: string; year: string }>;
  skills: string[];
}

interface MatchedJob {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
  coverLetter?: string;
  selected?: boolean;
}

type PipelineStep = "upload" | "optimizing" | "searching" | "matching" | "ready";

const REMOTE_JOB_BOARDS = [
  { name: "We Work Remotely", buildUrl: (q: string) => `https://weworkremotely.com/remote-jobs/search?term=${q}` },
  { name: "Remote.co", buildUrl: (q: string) => `https://remote.co/remote-jobs/search/?search_keywords=${q}` },
  { name: "FlexJobs", buildUrl: (q: string) => `https://www.flexjobs.com/search?search=${q}` },
  { name: "RemoteOK", buildUrl: (q: string) => `https://remoteok.com/remote-${q.replace(/\s+/g, "-").toLowerCase()}-jobs` },
  { name: "AngelList", buildUrl: (q: string) => `https://wellfound.com/jobs?query=${q}` },
  { name: "Hired", buildUrl: (q: string) => `https://hired.com/jobs?q=${q}` },
];

const GENERAL_JOB_BOARDS = [
  { name: "Indeed", buildUrl: (q: string, l: string) => `https://www.indeed.com/jobs?q=${q}&l=${l}` },
  { name: "LinkedIn", buildUrl: (q: string, l: string) => `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${l}` },
  { name: "Glassdoor", buildUrl: (q: string, l: string) => `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${q}&locKeyword=${l}` },
  { name: "ZipRecruiter", buildUrl: (q: string, l: string) => `https://www.ziprecruiter.com/jobs-search?search=${q}&location=${l}` },
  { name: "Monster", buildUrl: (q: string, l: string) => `https://www.monster.com/jobs/search?q=${q}&where=${l}` },
  { name: "SimplyHired", buildUrl: (q: string, l: string) => `https://www.simplyhired.com/search?q=${q}&l=${l}` },
  { name: "CareerBuilder", buildUrl: (q: string, l: string) => `https://www.careerbuilder.com/jobs?keywords=${q}&location=${l}` },
  { name: "Dice", buildUrl: (q: string, l: string) => `https://www.dice.com/jobs?q=${q}&location=${l}` },
];

const SmartApply = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPro, isLoading: subLoading } = useSubscription();
  const { isAuthenticated, user } = useAuth();
  const guestApply = useTrialLimit("smart-apply", 1);
  const [authOpen, setAuthOpen] = useState(false);
  const [serverUsage, setServerUsage] = useState<{ used: number; limit: number; remaining: number; isGuest: boolean } | null>(null);

  // Pull authoritative guest usage from server so cleared localStorage can't reset it.
  useEffect(() => {
    if (isAuthenticated) { setServerUsage(null); return; }
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("smart-match", { body: { checkUsageOnly: true } });
        if (data && typeof data.used === "number") {
          setServerUsage({ used: data.used, limit: data.limit, remaining: data.remaining, isGuest: !!data.isGuest });
        }
      } catch {}
    })();
  }, [isAuthenticated]);

  const ensureCanRunApply = async (): Promise<boolean> => {
    if (isAuthenticated) return true;
    // Authoritative server check — localStorage can be cleared, server can't.
    try {
      const { data } = await supabase.functions.invoke("smart-match", { body: { checkUsageOnly: true } });
      if (data && typeof data.used === "number") {
        setServerUsage({ used: data.used, limit: data.limit, remaining: data.remaining, isGuest: !!data.isGuest });
        if (data.remaining <= 0) {
          toast({
            title: "Free Smart Apply used",
            description: "Sign up free to keep applying.",
            variant: "destructive",
          });
          setAuthOpen(true);
          return false;
        }
        return true;
      }
    } catch {}
    // Fallback to local
    if (guestApply.canUse) return true;
    setAuthOpen(true);
    return false;
  };

  const [step, setStep] = useState<PipelineStep>("upload");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [resumeStyle, setResumeStyle] = useState<{ template?: string; accentColor?: string; density?: string } | null>(null);
  const [usage, setUsage] = useState<{ used: number; limit: number; tier: string; monthlyUsed?: number; monthlyLimit?: number | null } | null>(null);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [instantRemaining, setInstantRemaining] = useState<number>(getInstantApplyRemaining(isPro ? "pro" : "free"));

  const tierKey = isPro ? "pro" : "free";
  const instantLimit = getInstantApplyLimit(tierKey);

  useEffect(() => {
    setInstantRemaining(getInstantApplyRemaining(tierKey));
  }, [tierKey]);

  // Autofill from saved profile (name/email/phone/location)
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .maybeSingle();
        if (!profile) return;
        setResumeData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              fullName: prev.personalInfo.fullName || profile.full_name || "",
              email: prev.personalInfo.email || profile.email || user.email || "",
            },
          };
        });
      } catch {}
    })();
  }, [user?.id]);

  const requirePro = (action: () => void) => {
    if (isPro) {
      action();
    } else {
      setShowUpgradeModal(true);
    }
  };

  // Load synced resume style + saved resume from builder
  useEffect(() => {
    try {
      const styleRaw = localStorage.getItem("resume-style");
      if (styleRaw) setResumeStyle(JSON.parse(styleRaw));
      const savedRaw = localStorage.getItem("resume-data");
      if (savedRaw && !resumeData) {
        const parsed = JSON.parse(savedRaw);
        if (parsed?.personalInfo?.fullName) {
          // Merge profile defaults if available
          if (user?.email && !parsed.personalInfo.email) {
            parsed.personalInfo.email = user.email;
          }
          setResumeData(parsed);
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const stepLabels: Record<PipelineStep, string> = {
    upload: "Upload Resume",
    optimizing: "AI Optimizing...",
    searching: "Finding Jobs...",
    matching: "Generating Cover Letters...",
    ready: "Ready to Apply!",
  };

  const stepIndex: Record<PipelineStep, number> = {
    upload: 0, optimizing: 1, searching: 2, matching: 3, ready: 4,
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!(await ensureCanRunApply())) {
      // Reset file input so the user can retry after signing up
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Unsupported file", description: "Please upload PDF, DOCX, or TXT.", variant: "destructive" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 50MB.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setStep("optimizing");
    setProgressPercent(10);

    try {
      // Parse resume
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setProgressPercent(20);
      const { data: parseData, error: parseError } = await supabase.functions.invoke("parse-resume", {
        body: { fileContent: base64, fileName: file.name, fileType: file.type },
      });
      if (parseError) throw parseError;

      const parsed: ResumeData = {
        personalInfo: {
          fullName: parseData.resumeData?.fullName || "",
          email: parseData.resumeData?.email || "",
          phone: parseData.resumeData?.phone || "",
          location: parseData.resumeData?.location || "",
          summary: parseData.resumeData?.summary || "",
        },
        experience: (parseData.resumeData?.experience || []).map((exp: any) => ({
          company: exp.company || "", position: exp.position || exp.title || "",
          duration: exp.duration || "", description: exp.description || "",
        })),
        education: (parseData.resumeData?.education || []).map((edu: any) => ({
          institution: edu.institution || edu.school || "", degree: edu.degree || "", year: edu.year || "",
        })),
        skills: parseData.resumeData?.skills || [],
      };

      setResumeData(parsed);
      localStorage.setItem("resume-data", JSON.stringify(parsed));
      setProgressPercent(35);

      // Optimize resume
      const { data: optimizeData, error: optimizeError } = await supabase.functions.invoke("smart-match", {
        body: { resumeData: parsed, action: "optimize" },
      });
      if (optimizeError) throw optimizeError;

      setOptimizationResult(optimizeData);
      setProgressPercent(50);
      setStep("searching");

      // Search jobs using suggested titles
      const suggestedTitles = optimizeData?.suggestedJobTitles || [parsed.experience?.[0]?.position || ""];
      const searchTitle = suggestedTitles[0] || "Software Engineer";

      const { data: jobData, error: jobError } = await supabase.functions.invoke("search-jobs", {
        body: { jobTitle: searchTitle, location: parsed.personalInfo.location || "", skills: parsed.skills },
      });
      if (jobError) throw jobError;
      if (jobData?.used !== undefined) {
        setUsage({ used: jobData.used, limit: jobData.limit, tier: jobData.tier, monthlyUsed: jobData.monthlyUsed, monthlyLimit: jobData.monthlyLimit });
      }

      const jobs: MatchedJob[] = (jobData?.jobs || []).slice(0, 10).map((j: any) => ({
        title: j.title || j.positionName || "Untitled",
        company: j.company || j.companyName || "Unknown",
        location: j.location || "",
        description: j.description || j.descriptionText || "",
        url: j.url || j.externalApplyLink || "#",
        source: j.source || "Job Board",
        selected: true,
      }));

      setMatchedJobs(jobs);
      setProgressPercent(75);
      setStep("matching");

      // Generate cover letters
      if (jobs.length > 0) {
        const { data: coverData, error: coverError } = await supabase.functions.invoke("smart-match", {
          body: {
            resumeData: { ...parsed, jobs: jobs.slice(0, 5) },
            action: "generate-cover-letters",
          },
        });

        if (!coverError && coverData?.coverLetters) {
          const updated = [...jobs];
          coverData.coverLetters.forEach((cl: any) => {
            if (updated[cl.jobIndex]) {
              updated[cl.jobIndex].coverLetter = cl.letter;
            }
          });
          setMatchedJobs(updated);
        }
      }

      setProgressPercent(100);
      setStep("ready");
      toast({ title: "Pipeline complete!", description: `Found ${jobs.length} matching jobs with tailored cover letters.` });
      recordRun(jobs);
      if (!isAuthenticated) guestApply.recordUse();
    } catch (err: any) {
      console.error("Smart apply error:", err);
      toast({ title: "Error", description: err.message || "Something went wrong.", variant: "destructive" });
      setStep("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseExisting = async () => {
    if (!(await ensureCanRunApply())) return;
    const saved = localStorage.getItem("resume-data");
    if (!saved) {
      toast({ title: "No resume found", description: "Please upload a resume or build one first.", variant: "destructive" });
      return;
    }
    const parsed = JSON.parse(saved);
    if (!parsed.personalInfo?.fullName && !parsed.experience?.length) {
      toast({ title: "Resume incomplete", description: "Your saved resume has no data. Upload or build one first.", variant: "destructive" });
      return;
    }

    setResumeData(parsed);
    setIsProcessing(true);
    setStep("optimizing");
    setProgressPercent(25);

    try {
      const { data: optimizeData, error: optimizeError } = await supabase.functions.invoke("smart-match", {
        body: { resumeData: parsed, action: "optimize" },
      });
      if (optimizeError) throw optimizeError;
      setOptimizationResult(optimizeData);
      setProgressPercent(50);
      setStep("searching");

      const suggestedTitles = optimizeData?.suggestedJobTitles || [parsed.experience?.[0]?.position || ""];
      const { data: jobData, error: jobError } = await supabase.functions.invoke("search-jobs", {
        body: { jobTitle: suggestedTitles[0] || "Software Engineer", location: parsed.personalInfo?.location || "", skills: parsed.skills || [] },
      });
      if (jobError) throw jobError;
      if (jobData?.used !== undefined) {
        setUsage({ used: jobData.used, limit: jobData.limit, tier: jobData.tier, monthlyUsed: jobData.monthlyUsed, monthlyLimit: jobData.monthlyLimit });
      }

      const jobs: MatchedJob[] = (jobData?.jobs || []).slice(0, 10).map((j: any) => ({
        title: j.title || j.positionName || "Untitled",
        company: j.company || j.companyName || "Unknown",
        location: j.location || "",
        description: j.description || j.descriptionText || "",
        url: j.url || j.externalApplyLink || "#",
        source: j.source || "Job Board",
        selected: true,
      }));

      setMatchedJobs(jobs);
      setProgressPercent(75);
      setStep("matching");

      if (jobs.length > 0) {
        const { data: coverData, error: coverError } = await supabase.functions.invoke("smart-match", {
          body: { resumeData: { ...parsed, jobs: jobs.slice(0, 5) }, action: "generate-cover-letters" },
        });
        if (!coverError && coverData?.coverLetters) {
          const updated = [...jobs];
          coverData.coverLetters.forEach((cl: any) => {
            if (updated[cl.jobIndex]) updated[cl.jobIndex].coverLetter = cl.letter;
          });
          setMatchedJobs(updated);
        }
      }

      setProgressPercent(100);
      setStep("ready");
      toast({ title: "Pipeline complete!", description: `Found ${jobs.length} matching jobs.` });
      recordRun(jobs);
      if (!isAuthenticated) guestApply.recordUse();
    } catch (err: any) {
      console.error("Smart apply error:", err);
      toast({ title: "Error", description: err.message || "Something went wrong.", variant: "destructive" });
      setStep("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleJobSelection = (index: number) => {
    setMatchedJobs(prev => prev.map((j, i) => i === index ? { ...j, selected: !j.selected } : j));
  };

  const recordRun = (jobs: MatchedJob[]) => {
    const id = `run-${Date.now()}`;
    setCurrentRunId(id);
    saveRun({
      id,
      timestamp: Date.now(),
      template: resumeStyle?.template,
      jobs: jobs.map<ApplyHistoryJob>((j) => ({
        title: j.title,
        company: j.company,
        location: j.location,
        url: j.url,
        source: j.source,
        status: "queued",
      })),
    });
  };

  const handleBatchApply = () => {
    requirePro(() => {
      const selected = matchedJobs.filter(j => j.selected);
      if (instantLimit !== Infinity && selected.length > instantRemaining) {
        toast({
          title: "Instant Apply cap reached",
          description: `You have ${instantRemaining} instant applies left this month. Deselect jobs or wait until next month.`,
          variant: "destructive",
        });
        return;
      }
      selected.forEach((job, i) => {
        setTimeout(() => {
          window.open(job.url, "_blank");
        }, i * 500);
      });
      const next = incrementInstantApply(selected.length);
      const limit = getInstantApplyLimit(tierKey);
      setInstantRemaining(limit === Infinity ? Infinity : Math.max(0, limit - next.used));
      // Mark jobs as opened in history
      if (currentRunId) {
        try {
          const raw = localStorage.getItem("smart-apply-history");
          if (raw) {
            const all = JSON.parse(raw);
            const run = all.find((r: any) => r.id === currentRunId);
            if (run) {
              const selectedSet = new Set(selected.map((s) => s.url));
              run.jobs.forEach((j: any) => {
                if (selectedSet.has(j.url)) j.status = "opened";
              });
              localStorage.setItem("smart-apply-history", JSON.stringify(all));
            }
          }
        } catch {}
      }
      toast({
        title: `Opening ${selected.length} job${selected.length > 1 ? "s" : ""}`,
        description: "Each job page will open in a new tab. Use your cover letter from below!",
      });
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Cover letter copied to clipboard." });
  };

  const downloadResumePDF = () => {
    requirePro(() => {
    if (!resumeData) return;
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;
    
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(resumeData.personalInfo.fullName || "Resume", margin, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const contactParts = [resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean);
    doc.text(contactParts.join(" • "), margin, y);
    y += 10;

    if (optimizationResult?.atsScore) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`ATS Score: ${optimizationResult.atsScore}%`, margin, y);
      doc.setTextColor(0, 0, 0);
      y += 8;
    }

    if (resumeData.personalInfo.summary) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("SUMMARY", margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const summaryLines = doc.splitTextToSize(resumeData.personalInfo.summary, 170);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 5 + 6;
    }

    if (resumeData.experience?.length) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("EXPERIENCE", margin, y);
      y += 6;
      resumeData.experience.forEach(exp => {
        if (y > 270) { doc.addPage(); y = margin; }
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${exp.position} — ${exp.company}`, margin, y);
        y += 5;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text(exp.duration, margin, y);
        y += 5;
        if (exp.description) {
          doc.setFont("helvetica", "normal");
          const lines = doc.splitTextToSize(exp.description, 170);
          doc.text(lines, margin, y);
          y += lines.length * 4.5 + 4;
        }
      });
      y += 4;
    }

    if (resumeData.education?.length) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("EDUCATION", margin, y);
      y += 6;
      resumeData.education.forEach(edu => {
        if (y > 270) { doc.addPage(); y = margin; }
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`${edu.degree} — ${edu.institution} (${edu.year})`, margin, y);
        y += 6;
      });
      y += 4;
    }

    if (resumeData.skills?.length) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("SKILLS", margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const skillsText = doc.splitTextToSize(resumeData.skills.join(", "), 170);
      doc.text(skillsText, margin, y);
    }

    doc.save(`${resumeData.personalInfo.fullName || "resume"}-optimized.pdf`);
    toast({ title: "Downloaded!", description: "Optimized resume saved as PDF." });
    });
  };

  const downloadStyledResumePDF = () => {
    requirePro(async () => {
      if (!resumeData) return;
      const template = resumeStyle?.template || "modern-professional";
      const accent = resumeStyle?.accentColor || "#2563eb";
      const density = (resumeStyle?.density as Density) || "standard";

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "816px"; // ~ 8.5in @ 96dpi
      container.style.background = "#ffffff";
      document.body.appendChild(container);

      const inner = document.createElement("div");
      inner.id = "styled-resume-export";
      inner.className = densityClassName(density);
      Object.assign(inner.style, densityWrapperStyle(density), { background: "#ffffff" });
      container.appendChild(inner);

      const root = createRoot(inner);
      const props = { resumeData, accentColor: accent };
      const node =
        template === "classic-minimal" ? <ClassicTemplate {...props} /> :
        template === "tech-specialist" ? <TechTemplate {...props} /> :
        template === "creative-designer" ? <CreativeTemplate {...props} /> :
        template === "executive" ? <ExecutiveTemplate {...props} /> :
        template === "minimalist" ? <MinimalistTemplate {...props} /> :
        <ModernTemplate {...props} />;
      root.render(node);

      try {
        // Wait for paint
        await new Promise((r) => setTimeout(r, 300));
        const canvas = await html2canvas(inner, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;
        const widthFitH = (canvas.height * maxW) / canvas.width;
        if (widthFitH <= maxH) {
          pdf.addImage(imgData, "PNG", margin, margin, maxW, widthFitH);
        } else {
          const scale = maxH / widthFitH;
          const finalW = maxW * scale;
          pdf.addImage(imgData, "PNG", (pageW - finalW) / 2, margin, finalW, maxH);
        }
        pdf.save(`${resumeData.personalInfo.fullName || "resume"}-styled.pdf`);
        toast({ title: "Downloaded!", description: `Styled PDF saved using your ${template.replace(/-/g, " ")} template.` });
      } catch (err: any) {
        toast({ title: "Export failed", description: err.message || "Could not generate styled PDF.", variant: "destructive" });
      } finally {
        root.unmount();
        document.body.removeChild(container);
      }
    });
  };

  const downloadCoverLetterPDF = (job: MatchedJob) => {
    requirePro(() => {
      if (!job.coverLetter) return;
      const doc = new jsPDF();
      const margin = 20;
      let y = margin;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), margin, y);
      y += 12;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Application: ${job.title}`, margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${job.company} — ${job.location}`, margin, y);
      y += 12;

      if (resumeData?.personalInfo) {
        doc.text(`From: ${resumeData.personalInfo.fullName}`, margin, y);
        y += 5;
        doc.text(resumeData.personalInfo.email, margin, y);
        y += 10;
      }

      doc.setFontSize(11);
      const bodyLines = doc.splitTextToSize(job.coverLetter, 170);
      doc.text(bodyLines, margin, y);

      doc.save(`cover-letter-${job.company.replace(/\s+/g, "-").toLowerCase()}.pdf`);
      toast({ title: "Downloaded!", description: `Cover letter for ${job.company} saved as PDF.` });
    });
  };

  const downloadAllCoverLetters = () => {
    requirePro(() => {
      const jobsWithLetters = matchedJobs.filter(j => j.coverLetter);
      if (!jobsWithLetters.length) {
        toast({ title: "No cover letters", description: "No cover letters to download.", variant: "destructive" });
        return;
      }
      const doc = new jsPDF();
      jobsWithLetters.forEach((job, idx) => {
        if (idx > 0) doc.addPage();
        const margin = 20;
        let y = margin;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`${job.title} — ${job.company}`, margin, y);
        y += 6;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(job.location, margin, y);
        y += 10;
        const lines = doc.splitTextToSize(job.coverLetter!, 170);
        doc.text(lines, margin, y);
      });
      doc.save("all-cover-letters.pdf");
      toast({ title: "Downloaded!", description: `${jobsWithLetters.length} cover letters saved as PDF.` });
    });
  };

  const steps = ["Upload", "Optimize", "Search", "Match", "Apply"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 sm:pt-28 pb-20 container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            Smart Apply Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-3">
            Upload → Optimize → <span className="text-primary">Apply</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Upload your resume and our AI will optimize it, find matching jobs, generate tailored cover letters, and queue everything for one-click batch apply.
          </p>
        </motion.div>

        {/* Usage indicator */}
        {!isAuthenticated && serverUsage && (
          <div className="max-w-xl mx-auto mb-6">
            <div className={`rounded-lg border px-4 py-3 flex items-center justify-between gap-3 ${
              serverUsage.remaining <= 0 ? "border-destructive/40 bg-destructive/5" : "border-border bg-card/60"
            }`}>
              <div className="flex items-center gap-2 text-sm">
                <Zap className={`h-4 w-4 ${serverUsage.remaining <= 0 ? "text-destructive" : "text-primary"}`} />
                <span className="font-medium text-foreground">
                  {serverUsage.remaining} of {serverUsage.limit} free Smart Apply pipeline left
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">· lifetime free trial</span>
              </div>
              <Button size="sm" variant={serverUsage.remaining <= 0 ? "default" : "outline"} onClick={() => setAuthOpen(true)}>
                {serverUsage.remaining <= 0 ? "Sign up free" : "Sign up"}
              </Button>
            </div>
          </div>
        )}
        {isAuthenticated && (
          <div className="max-w-xl mx-auto mb-6 space-y-2">
            <SearchUsageBadge
              used={usage?.used}
              limit={usage?.limit}
              tier={usage?.tier}
              monthlyUsed={usage?.monthlyUsed}
              monthlyLimit={usage?.monthlyLimit}
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 border border-border/60 rounded-lg px-3 py-2">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" />
                Instant Applies remaining this month
              </span>
              <span className="font-medium text-foreground">
                {instantLimit === Infinity
                  ? "Unlimited"
                  : `${instantRemaining} / ${instantLimit}`}
              </span>
            </div>
            <div className="text-right">
              <Link to="/apply-history" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                <History className="h-3 w-3" /> View apply history
              </Link>
            </div>
            {resumeStyle?.template && (
              <p className="text-xs text-muted-foreground text-center">
                Using your <span className="font-medium text-foreground capitalize">{resumeStyle.template.replace(/-/g, " ")}</span> template
                {resumeStyle.density && <> · <span className="capitalize">{resumeStyle.density}</span> density</>}
              </p>
            )}
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-lg mx-auto mb-2">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i <= stepIndex[step] ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i < stepIndex[step] ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">{s}</span>
              </div>
            ))}
          </div>
          {step !== "upload" && <Progress value={progressPercent} className="max-w-lg mx-auto" />}
        </div>

        {/* Upload Step */}
        {step === "upload" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto space-y-4">
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
                <p className="text-sm text-muted-foreground mb-4">PDF, DOCX, or TXT • Max 50MB</p>
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileUpload} />
                <Button className="btn-gradient" size="lg" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Choose File
                </Button>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">or</div>

            <Button variant="outline" className="w-full h-12" onClick={handleUseExisting}>
              <FileText className="h-4 w-4 mr-2" /> Use My Saved Resume
            </Button>
          </motion.div>
        )}

        {/* Processing Steps */}
        {(step === "optimizing" || step === "searching" || step === "matching") && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{stepLabels[step]}</h3>
            <p className="text-muted-foreground text-sm">
              {step === "optimizing" && "AI is analyzing and enhancing your resume for maximum impact..."}
              {step === "searching" && "Searching across job boards for positions matching your profile..."}
              {step === "matching" && "Creating tailored cover letter intros for each position..."}
            </p>
          </motion.div>
        )}

        {/* Results Step */}
        {step === "ready" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Optimization Summary */}
            {optimizationResult && (
              <Card>
                 <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Resume Optimization Results
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={downloadResumePDF} className="w-fit">
                      <Download className="h-4 w-4 mr-1" /> Download Resume PDF
                    </Button>
                    <Button size="sm" onClick={downloadStyledResumePDF} className="w-fit">
                      <Sparkles className="h-4 w-4 mr-1" /> Styled PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">ATS Score:</span>
                    <Badge variant={optimizationResult.atsScore >= 80 ? "default" : "secondary"}>
                      {optimizationResult.atsScore || 0}%
                    </Badge>
                  </div>
                  {optimizationResult.improvements?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Improvements Made:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {optimizationResult.improvements.slice(0, 4).map((imp: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {optimizationResult.suggestedJobTitles?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-muted-foreground">Suggested searches:</span>
                      {optimizationResult.suggestedJobTitles.map((t: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Matched Jobs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Matched Jobs ({matchedJobs.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={downloadAllCoverLetters} disabled={!matchedJobs.some(j => j.coverLetter)}>
                  <Download className="h-4 w-4 mr-1" /> All Cover Letters
                </Button>
                {(() => {
                  const selectedCount = matchedJobs.filter(j => j.selected).length;
                  const overCap = instantLimit !== Infinity && selectedCount > instantRemaining;
                  return (
                    <Button
                      size="sm"
                      onClick={handleBatchApply}
                      disabled={selectedCount === 0 || overCap || (instantLimit !== Infinity && instantRemaining === 0)}
                      title={overCap ? `Only ${instantRemaining} instant applies left this month` : undefined}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Apply ({selectedCount}){instantLimit !== Infinity && ` · ${instantRemaining} left`}
                    </Button>
                  );
                })()}
              </div>
            </div>

            <div className="space-y-3">
              {matchedJobs.map((job, index) => (
                <Card key={index} className={`transition-all ${job.selected ? "ring-1 ring-primary/30" : "opacity-60"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <input
                        type="checkbox"
                        checked={job.selected}
                        onChange={() => toggleJobSelection(index)}
                        className="mt-1.5 h-4 w-4 rounded border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base">{job.title}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{job.company} • {job.location}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => setExpandedJob(expandedJob === index ? null : index)}>
                              {expandedJob === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => window.open(job.url, "_blank")}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedJob === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3 border-t border-border space-y-3">
                                {job.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                                )}
                                {job.coverLetter && (
                                  <div className="bg-muted/30 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                                      <span className="text-xs font-medium text-primary flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" /> AI Cover Letter
                                      </span>
                                      <div className="flex gap-1">
                                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => copyToClipboard(job.coverLetter!)}>
                                          <Copy className="h-3 w-3 mr-1" /> Copy
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => downloadCoverLetterPDF(job)}>
                                          <Download className="h-3 w-3 mr-1" /> PDF
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-foreground">{job.coverLetter}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {matchedJobs.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No matching jobs found. Try adjusting your resume or searching manually.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Apply on More Job Boards */}
            {matchedJobs.length > 0 && resumeData && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  Apply on More Job Boards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">General Job Boards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {GENERAL_JOB_BOARDS.map((board) => {
                          const query = encodeURIComponent(optimizationResult?.suggestedJobTitles?.[0] || resumeData.experience?.[0]?.position || "");
                          const loc = encodeURIComponent(resumeData.personalInfo?.location || "");
                          return (
                            <Button key={board.name} size="sm" variant="outline" className="text-xs h-8 justify-start"
                              onClick={() => window.open(board.buildUrl(query, loc), "_blank")}>
                              {board.name}
                              <ExternalLink className="h-3 w-3 ml-auto shrink-0" />
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        🌍 Remote Job Sites
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {REMOTE_JOB_BOARDS.map((board) => {
                          const query = encodeURIComponent(optimizationResult?.suggestedJobTitles?.[0] || resumeData.experience?.[0]?.position || "");
                          return (
                            <Button key={board.name} size="sm" variant="outline" className="text-xs h-8 justify-start"
                              onClick={() => window.open(board.buildUrl(query), "_blank")}>
                              {board.name}
                              <ExternalLink className="h-3 w-3 ml-auto shrink-0" />
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Start Over */}
            <div className="text-center pt-4">
              <Button variant="outline" onClick={() => { setStep("upload"); setMatchedJobs([]); setOptimizationResult(null); setProgressPercent(0); }}>
                Start Over
              </Button>
            </div>
          </motion.div>
        )}

        {/* Upgrade Modal */}
        <AnimatePresence>
          {showUpgradeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
              onClick={() => setShowUpgradeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card border border-border rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Crown className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Download optimized resumes, cover letters as PDF, and batch apply to jobs with one click. Unlock all premium features.
                  </p>
                  <div className="space-y-3 text-left mb-6">
                    {[
                      "Download optimized resume as PDF",
                      "Download tailored cover letters",
                      "Batch apply to multiple jobs",
                      "50 daily job searches",
                      "Smart Apply pipeline",
                      "Auto follow-up emails",
                    ].map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button className="btn-gradient w-full" onClick={async () => {
                      try {
                        const { data, error } = await supabase.functions.invoke("polar-checkout", {
                          body: { tier: "pro" },
                        });
                        if (error) throw error;
                        if (data?.url) window.location.href = data.url;
                      } catch {
                        toast({ title: "Error", description: "Could not start checkout. Please try again.", variant: "destructive" });
                      }
                    }}>
                      <Crown className="h-4 w-4 mr-2" /> Upgrade to Pro — $12/mo
                    </Button>
                    <Button variant="ghost" onClick={() => setShowUpgradeModal(false)} className="text-sm">
                      Maybe later
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="signup" />
    </div>
  );
};

export default SmartApply;
