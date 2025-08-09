
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ToolsDashboard from "./pages/ToolsDashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import CoverLetterGenerator from "./pages/CoverLetterGenerator";
import ResumeChecker from "./pages/ResumeChecker";
import ResumeSummaryGenerator from "./pages/ResumeSummaryGenerator";
import Community from "./pages/Community";
import JobSearch from "./pages/JobSearch";
import ResumeBulletGenerator from "./pages/ResumeBulletGenerator";
import InterviewPractice from "./pages/InterviewPractice";
import SalaryEstimator from "./pages/SalaryEstimator";
import JobTracker from "./pages/JobTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tools" element={<ToolsDashboard />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/cover-letter-generator" element={<CoverLetterGenerator />} />
          <Route path="/resume-checker" element={<ResumeChecker />} />
          <Route path="/resume-summary-generator" element={<ResumeSummaryGenerator />} />
          <Route path="/community" element={<Community />} />
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/resume-bullet-generator" element={<ResumeBulletGenerator />} />
          <Route path="/resume-skills-generator" element={<NotFound />} />
          <Route path="/resume-keyword-scanner" element={<NotFound />} />
          <Route path="/resignation-letter-generator" element={<NotFound />} />
          <Route path="/interview-practice" element={<InterviewPractice />} />
          <Route path="/salary-estimator" element={<SalaryEstimator />} />
          <Route path="/job-tracker" element={<JobTracker />} />
          <Route path="/resume-enhancer" element={<NotFound />} />
          <Route path="/resume-translator" element={<NotFound />} />
          <Route path="/resume-examples" element={<NotFound />} />
          <Route path="/social-preview" element={<NotFound />} />
          <Route path="/video-resume" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
