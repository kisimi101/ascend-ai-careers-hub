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
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

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
                  {/* Public route - Landing page */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Protected routes - All tools require authentication */}
                  <Route path="/tools" element={<ProtectedRoute><ToolsDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
                  <Route path="/cover-letter-generator" element={<ProtectedRoute><CoverLetterGenerator /></ProtectedRoute>} />
                  <Route path="/resume-checker" element={<ProtectedRoute><ResumeChecker /></ProtectedRoute>} />
                  <Route path="/resume-summary-generator" element={<ProtectedRoute><ResumeSummaryGenerator /></ProtectedRoute>} />
                  <Route path="/job-search" element={<ProtectedRoute><JobSearch /></ProtectedRoute>} />
                  <Route path="/resume-bullet-generator" element={<ProtectedRoute><ResumeBulletGenerator /></ProtectedRoute>} />
                  <Route path="/resume-skills-generator" element={<ProtectedRoute><ResumeSkillsGenerator /></ProtectedRoute>} />
                  <Route path="/resume-keyword-scanner" element={<ProtectedRoute><ResumeKeywordScanner /></ProtectedRoute>} />
                  <Route path="/resignation-letter-generator" element={<ProtectedRoute><ResignationLetterGenerator /></ProtectedRoute>} />
                  <Route path="/interview-practice" element={<ProtectedRoute><InterviewPractice /></ProtectedRoute>} />
                  <Route path="/salary-estimator" element={<ProtectedRoute><SalaryEstimator /></ProtectedRoute>} />
                  <Route path="/job-tracker" element={<ProtectedRoute><JobTracker /></ProtectedRoute>} />
                  <Route path="/resume-enhancer" element={<ProtectedRoute><ResumeEnhancer /></ProtectedRoute>} />
                  <Route path="/resume-translator" element={<ProtectedRoute><ResumeTranslator /></ProtectedRoute>} />
                  <Route path="/resume-examples" element={<ProtectedRoute><ResumeExamples /></ProtectedRoute>} />
                  <Route path="/social-preview" element={<ProtectedRoute><SocialPreview /></ProtectedRoute>} />
                  <Route path="/video-resume" element={<ProtectedRoute><VideoResume /></ProtectedRoute>} />
                  <Route path="/resume-comparison" element={<ProtectedRoute><ResumeComparison /></ProtectedRoute>} />
                  <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
                  <Route path="/resume-job-search" element={<ProtectedRoute><ResumeJobSearch /></ProtectedRoute>} />
                  <Route path="/linkedin-optimizer" element={<ProtectedRoute><LinkedInOptimizer /></ProtectedRoute>} />
                  <Route path="/linkedin-import" element={<ProtectedRoute><LinkedInImport /></ProtectedRoute>} />
                  <Route path="/skills-gap-analyzer" element={<ProtectedRoute><SkillsGapAnalyzer /></ProtectedRoute>} />
                  <Route path="/reference-manager" element={<ProtectedRoute><ReferenceManager /></ProtectedRoute>} />
                  <Route path="/career-path-planner" element={<ProtectedRoute><CareerPathPlanner /></ProtectedRoute>} />
                  <Route path="/industry-insights" element={<ProtectedRoute><IndustryInsights /></ProtectedRoute>} />
                  <Route path="/portfolio-builder" element={<ProtectedRoute><PortfolioBuilder /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/job-analytics" element={<ProtectedRoute><JobAnalytics /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/company-research" element={<ProtectedRoute><CompanyResearch /></ProtectedRoute>} />
                  
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
