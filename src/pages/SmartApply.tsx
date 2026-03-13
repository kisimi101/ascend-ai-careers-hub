import { useState, useRef, useCallback } from "react";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const { isAuthenticated } = useAuth();

  const [step, setStep] = useState<PipelineStep>("upload");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const requirePro = (action: () => void) => {
    if (isPro) {
      action();
    } else {
      setShowUpgradeModal(true);
    }
  };

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

    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Unsupported file", description: "Please upload PDF, DOCX, or TXT.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB.", variant: "destructive" });
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
    } catch (err: any) {
      console.error("Smart apply error:", err);
      toast({ title: "Error", description: err.message || "Something went wrong.", variant: "destructive" });
      setStep("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseExisting = async () => {
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

  const handleBatchApply = () => {
    requirePro(() => {
      const selected = matchedJobs.filter(j => j.selected);
      selected.forEach((job, i) => {
        setTimeout(() => {
          window.open(job.url, "_blank");
        }, i * 500);
      });
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
                <p className="text-sm text-muted-foreground mb-4">PDF, DOCX, or TXT • Max 5MB</p>
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
                <Button size="sm" onClick={handleBatchApply} disabled={!matchedJobs.some(j => j.selected)}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Apply ({matchedJobs.filter(j => j.selected).length})
                </Button>
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

            {/* Start Over */}
            <div className="text-center pt-4">
              <Button variant="outline" onClick={() => { setStep("upload"); setMatchedJobs([]); setOptimizationResult(null); setProgressPercent(0); }}>
                Start Over
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SmartApply;
