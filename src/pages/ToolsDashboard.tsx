import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  FileText,
  Search,
  Edit,
  Target,
  Settings,
  Scan,
  FileX,
  MessageCircle,
  DollarSign,
  Clipboard,
  Sparkles,
  Globe,
  Video,
  Eye,
  User,
  Rocket,
  Star,
  Mail,
  Map,
  BookOpen,
  TrendingUp,
  Users,
  Crown,
  Loader2,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ToolItem {
  name: string;
  description: string;
  icon: any;
  path: string;
  color: string;
  popular?: boolean;
  premium?: boolean;
}

const ToolsDashboard = () => {
  const navigate = useNavigate();
  const { isPro } = useSubscription();
  const { toast } = useToast();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const toolCategories: { title: string; description: string; tools: ToolItem[] }[] = [
    {
      title: "Resume Tools",
      description: "Perfect your resume with AI assistance",
      tools: [
        { name: "AI Resume Builder", description: "Build ATS-friendly resumes with AI guidance", icon: User, path: "/resume-builder", color: "from-blue-500 to-blue-600", popular: true },
        { name: "Resume Checker", description: "Get instant feedback and improvement suggestions", icon: Search, path: "/resume-checker", color: "from-green-500 to-green-600", popular: true },
        { name: "Resume Summary Generator", description: "Create compelling professional summaries", icon: Edit, path: "/resume-summary-generator", color: "from-purple-500 to-purple-600" },
        { name: "Resume Bullet Generator", description: "Generate impactful bullet points", icon: Target, path: "/resume-bullet-generator", color: "from-orange-500 to-orange-600" },
        { name: "Skills Generator", description: "Optimize your skills section", icon: Settings, path: "/resume-skills-generator", color: "from-teal-500 to-teal-600" },
        { name: "AI Resume Enhancer", description: "AI-powered resume optimization", icon: Sparkles, path: "/resume-enhancer", color: "from-pink-500 to-pink-600" },
      ],
    },
    {
      title: "Job Search Tools",
      description: "Accelerate your job search process",
      tools: [
        { name: "Job Search", description: "Search thousands of jobs across major boards", icon: Briefcase, path: "/job-search", color: "from-primary to-primary/80", premium: true },
        { name: "Smart Apply", description: "Upload → AI optimize → batch apply to matching jobs", icon: Rocket, path: "/smart-apply", color: "from-primary to-primary/80", popular: true, premium: true },
        { name: "Cover Letter Generator", description: "Create tailored cover letters in minutes", icon: FileText, path: "/cover-letter-generator", color: "from-indigo-500 to-indigo-600", popular: true },
        { name: "Keyword Scanner", description: "Optimize for ATS systems", icon: Scan, path: "/resume-keyword-scanner", color: "from-yellow-500 to-yellow-600" },
        { name: "Job Tracker", description: "Track your job applications", icon: Clipboard, path: "/job-tracker", color: "from-red-500 to-red-600" },
        { name: "Salary Estimator", description: "Know your market value", icon: DollarSign, path: "/salary-estimator", color: "from-emerald-500 to-emerald-600" },
      ],
    },
    {
      title: "Career Development",
      description: "Advance your professional growth",
      tools: [
        { name: "Recruiters & Contacts", description: "Find and connect with recruiters and hiring managers", icon: Users, path: "/network", color: "from-primary to-primary/80", premium: true },
        { name: "Interview Practice", description: "Practice with AI-powered mock interviews", icon: MessageCircle, path: "/interview-practice", color: "from-cyan-500 to-cyan-600" },
        { name: "Career Timeline", description: "AI-predicted career path with milestones", icon: TrendingUp, path: "/career-timeline", color: "from-violet-500 to-violet-600", premium: true },
        { name: "Interview Question Bank", description: "Company-specific AI questions", icon: BookOpen, path: "/interview-question-bank", color: "from-sky-500 to-sky-600", premium: true },
        { name: "Resignation Letter", description: "Professional resignation letters", icon: FileX, path: "/resignation-letter-generator", color: "from-gray-500 to-gray-600" },
        { name: "Resume Examples", description: "Industry-specific resume templates", icon: User, path: "/resume-examples", color: "from-violet-500 to-violet-600" },
      ],
    },
    {
      title: "Advanced Tools",
      description: "Premium AI-powered career intelligence",
      tools: [
        { name: "Auto Follow-Up", description: "AI-generated follow-up emails at optimal timing", icon: Mail, path: "/auto-follow-up", color: "from-rose-500 to-rose-600", premium: true },
        { name: "Job Market Heatmap", description: "Demand, salary & growth by role and location", icon: Map, path: "/job-market-heatmap", color: "from-amber-500 to-amber-600", premium: true },
        { name: "Referral Mapper", description: "Find warm intros at target companies", icon: Users, path: "/referral-mapper", color: "from-fuchsia-500 to-fuchsia-600", premium: true },
        { name: "Resume Translator", description: "Translate resumes to any language", icon: Globe, path: "/resume-translator", color: "from-rose-500 to-rose-600" },
        { name: "Video Resume Maker", description: "Create engaging video resumes", icon: Video, path: "/video-resume", color: "from-amber-500 to-amber-600" },
        { name: "Social Media Preview", description: "Optimize your professional presence", icon: Eye, path: "/social-preview", color: "from-lime-500 to-lime-600" },
      ],
    },
  ];

  const handleToolAccess = (tool: ToolItem) => {
    if (tool.premium && !isPro) {
      setShowUpgradeModal(true);
      return;
    }

    navigate(tool.path);
  };

  const startUpgradeCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const { createCheckout, POLAR_PRODUCTS } = await import("@/lib/polar");
      const url = await createCheckout(POLAR_PRODUCTS.pro);
      window.location.href = url;
    } catch (error: any) {
      toast({
        title: "Could not start checkout",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-24 sm:pt-32 pb-10 sm:pb-16 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Rocket className="w-4 h-4 mr-2" />
            Free + Pro AI Career Tools
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            Choose Your
            <span className="text-gradient-primary"> AI Tool</span>
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
            Start with free tools, then upgrade for premium job search, networking, and automation workflows.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6">
        <div className="container mx-auto">
          {toolCategories.map((category) => (
            <div key={category.title} className="mb-10 sm:mb-16">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">{category.title}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {category.tools.map((tool) => (
                  <Card
                    key={tool.name}
                    className="group hover:shadow-2xl transition-all duration-300 border border-border hover:border-primary/30 hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden"
                  >
                    {(tool.popular || tool.premium) && (
                      <div className="absolute top-4 right-4 z-10 flex gap-1.5">
                        {tool.premium && (
                          <Badge className="bg-gradient-primary text-primary-foreground text-[10px]">
                            <Crown className="w-3 h-3 mr-0.5" /> Pro
                          </Badge>
                        )}
                        {tool.popular && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px]">
                            <Star className="w-3 h-3 mr-0.5" /> Popular
                          </Badge>
                        )}
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <tool.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {tool.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <Button
                        onClick={() => handleToolAccess(tool)}
                        className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 transition-all`}
                      >
                        {tool.premium ? (isPro ? "Open Pro Feature" : "Upgrade to Access") : "Try Now"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Crown className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center text-2xl">Upgrade to Pro</DialogTitle>
            <DialogDescription className="text-center">
              Unlock Job Search, Recruiters & Contacts, and all Pro tools in one plan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            {[
              "Full Job Search access",
              "Recruiters & Contacts network tools",
              "Referral Mapper + advanced Pro tools",
              "Smart Apply downloads and batch apply",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-foreground">
                <Crown className="h-4 w-4 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <Button className="btn-gradient w-full" onClick={startUpgradeCheckout} disabled={checkoutLoading}>
            {checkoutLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </>
            )}
          </Button>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ToolsDashboard;
