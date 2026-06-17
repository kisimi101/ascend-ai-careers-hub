import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./components/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import ProRoute from "./components/ProRoute";
import Index from "./pages/Index";
import ToolsDashboard from "./pages/ToolsDashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import CoverLetterGenerator from "./pages/CoverLetterGenerator";
import ResumeChecker from "./pages/ResumeChecker";
import ResumeSummaryGenerator from "./pages/ResumeSummaryGenerator";
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
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import LinkedInImport from "./pages/LinkedInImport";
import JobAnalytics from "./pages/JobAnalytics";
import Settings from "./pages/Settings";
import CompanyResearch from "./pages/CompanyResearch";
import SharedResume from "./pages/SharedResume";
import ResumeAnalytics from "./pages/ResumeAnalytics";
import GetStarted from "./pages/GetStarted";
import SmartApply from "./pages/SmartApply";
import ApplyHistory from "./pages/ApplyHistory";
import AutoFollowUp from "./pages/AutoFollowUp";
import JobMarketHeatmap from "./pages/JobMarketHeatmap";
import InterviewQuestionBank from "./pages/InterviewQuestionBank";
import CareerTimeline from "./pages/CareerTimeline";
import ReferralMapper from "./pages/ReferralMapper";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import JobSearchToolsLanding from "./pages/JobSearchToolsLanding";
import AiResumeBuilderLanding from "./pages/AiResumeBuilderLanding";
import FreeResumeTemplatesHub from "./pages/FreeResumeTemplatesHub";
import TailoredResumeOnboarding from "./pages/TailoredResumeOnboarding";
import SeoKeywordTracker from "./pages/SeoKeywordTracker";
import CompanyWatchlist from "./pages/CompanyWatchlist";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/job-search-tools" element={<JobSearchToolsLanding />} />
                  <Route path="/ai-resume-builder" element={<AiResumeBuilderLanding />} />
                  <Route path="/free-resume-templates" element={<FreeResumeTemplatesHub />} />
                  <Route path="/tailored-resume" element={<TailoredResumeOnboarding />} />
                  <Route path="/seo-keyword-tracker" element={<ProtectedRoute><SeoKeywordTracker /></ProtectedRoute>} />
                  <Route path="/get-started" element={<GetStarted />} />

                  {/* Free tools — open to all visitors */}
                  <Route path="/tools" element={<ToolsDashboard />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/resume-builder" element={<ResumeBuilder />} />
                  <Route path="/cover-letter-generator" element={<CoverLetterGenerator />} />
                  <Route path="/resume-checker" element={<ResumeChecker />} />
                  <Route path="/resume-summary-generator" element={<ResumeSummaryGenerator />} />
                  <Route path="/job-search" element={<JobSearch />} />
                  <Route path="/resume-bullet-generator" element={<ResumeBulletGenerator />} />
                  <Route path="/resume-skills-generator" element={<ResumeSkillsGenerator />} />
                  <Route path="/resume-keyword-scanner" element={<ResumeKeywordScanner />} />
                  <Route path="/resignation-letter-generator" element={<ResignationLetterGenerator />} />
                  <Route path="/interview-practice" element={<InterviewPractice />} />
                  <Route path="/salary-estimator" element={<SalaryEstimator />} />
                  <Route path="/job-tracker" element={<ProtectedRoute><JobTracker /></ProtectedRoute>} />
                  <Route path="/resume-enhancer" element={<ResumeEnhancer />} />
                  <Route path="/resume-translator" element={<ResumeTranslator />} />
                  <Route path="/resume-examples" element={<ResumeExamples />} />
                  <Route path="/social-preview" element={<SocialPreview />} />
                  <Route path="/video-resume" element={<VideoResume />} />
                  <Route path="/resume-comparison" element={<ResumeComparison />} />
                  <Route path="/network" element={<ProtectedRoute><ProRoute featureName="Recruiters & Contacts"><Network /></ProRoute></ProtectedRoute>} />
                  <Route path="/resume-job-search" element={<ResumeJobSearch />} />
                  <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
                  <Route path="/linkedin-import" element={<LinkedInImport />} />
                  <Route path="/skills-gap-analyzer" element={<SkillsGapAnalyzer />} />
                  <Route path="/reference-manager" element={<ProtectedRoute><ReferenceManager /></ProtectedRoute>} />
                  <Route path="/career-path-planner" element={<CareerPathPlanner />} />
                  <Route path="/industry-insights" element={<IndustryInsights />} />
                  <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/job-analytics" element={<ProtectedRoute><JobAnalytics /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/company-research" element={<CompanyResearch />} />
                  <Route path="/company-watchlist" element={<ProtectedRoute><CompanyWatchlist /></ProtectedRoute>} />
                  <Route path="/resume-analytics" element={<ProtectedRoute><ResumeAnalytics /></ProtectedRoute>} />
                  {/* Smart Apply: 1 free guest application, then signup */}
                  <Route path="/smart-apply" element={<SmartApply />} />
                  <Route path="/apply-history" element={<ProtectedRoute><ApplyHistory /></ProtectedRoute>} />
                  <Route path="/auto-follow-up" element={<ProtectedRoute><ProRoute featureName="Auto Follow-Up"><AutoFollowUp /></ProRoute></ProtectedRoute>} />
                  <Route path="/job-market-heatmap" element={<ProtectedRoute><ProRoute featureName="Job Market Heatmap"><JobMarketHeatmap /></ProRoute></ProtectedRoute>} />
                  <Route path="/interview-question-bank" element={<ProtectedRoute><ProRoute featureName="Interview Question Bank"><InterviewQuestionBank /></ProRoute></ProtectedRoute>} />
                  <Route path="/career-timeline" element={<ProtectedRoute><ProRoute featureName="Career Timeline"><CareerTimeline /></ProRoute></ProtectedRoute>} />
                  <Route path="/referral-mapper" element={<ProtectedRoute><ProRoute featureName="Referral Mapper"><ReferralMapper /></ProRoute></ProtectedRoute>} />
                  
                  {/* Public shared resume view */}
                  <Route path="/shared-resume/:token" element={<SharedResume />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
