
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
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
import ResumeSkillsGenerator from "./pages/ResumeSkillsGenerator";
import ResumeKeywordScanner from "./pages/ResumeKeywordScanner";
import ResignationLetterGenerator from "./pages/ResignationLetterGenerator";
import ResumeEnhancer from "./pages/ResumeEnhancer";
import ResumeTranslator from "./pages/ResumeTranslator";
import ResumeExamples from "./pages/ResumeExamples";
import SocialPreview from "./pages/SocialPreview";
import VideoResume from "./pages/VideoResume";
import ResumeComparison from "./pages/ResumeComparison";
import Network from "./pages/Network";
import ResumeJobSearch from "./pages/ResumeJobSearch";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import SkillsGapAnalyzer from "./pages/SkillsGapAnalyzer";
import ReferenceManager from "./pages/ReferenceManager";
import CareerPathPlanner from "./pages/CareerPathPlanner";
import IndustryInsights from "./pages/IndustryInsights";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
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
            <Route path="/resume-skills-generator" element={<ResumeSkillsGenerator />} />
            <Route path="/resume-keyword-scanner" element={<ResumeKeywordScanner />} />
            <Route path="/resignation-letter-generator" element={<ResignationLetterGenerator />} />
            <Route path="/interview-practice" element={<InterviewPractice />} />
            <Route path="/salary-estimator" element={<SalaryEstimator />} />
            <Route path="/job-tracker" element={<JobTracker />} />
            <Route path="/resume-enhancer" element={<ResumeEnhancer />} />
            <Route path="/resume-translator" element={<ResumeTranslator />} />
            <Route path="/resume-examples" element={<ResumeExamples />} />
            <Route path="/social-preview" element={<SocialPreview />} />
            <Route path="/video-resume" element={<VideoResume />} />
            <Route path="/resume-comparison" element={<ResumeComparison />} />
            <Route path="/network" element={<Network />} />
            <Route path="/resume-job-search" element={<ResumeJobSearch />} />
            <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
            <Route path="/skills-gap-analyzer" element={<SkillsGapAnalyzer />} />
            <Route path="/reference-manager" element={<ReferenceManager />} />
            <Route path="/career-path-planner" element={<CareerPathPlanner />} />
            <Route path="/industry-insights" element={<IndustryInsights />} />
            <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
