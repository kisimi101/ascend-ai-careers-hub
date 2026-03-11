import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const freeTools = [
    { name: "Cover Letter Generator", icon: FileText, path: "/cover-letter-generator", description: "Create professional cover letters" },
    { name: "Resume Checker", icon: Search, path: "/resume-checker", description: "Get instant resume feedback" },
    { name: "Resume Summary Generator", icon: Edit, path: "/resume-summary-generator", description: "Generate compelling summaries" },
    { name: "Resume Bullet Generator", icon: Target, path: "/resume-bullet-generator", description: "Create impactful bullet points" },
    { name: "Skills Generator", icon: Settings, path: "/resume-skills-generator", description: "Optimize your skills section" },
    { name: "Keyword Scanner", icon: Scan, path: "/resume-keyword-scanner", description: "Scan for ATS keywords" },
    { name: "Resignation Letter", icon: FileX, path: "/resignation-letter-generator", description: "Professional resignation letters" },
    { name: "Interview Practice", icon: MessageCircle, path: "/interview-practice", description: "Practice interview questions" },
    { name: "Salary Estimator", icon: DollarSign, path: "/salary-estimator", description: "Estimate your market value" },
    { name: "Job Tracker", icon: Clipboard, path: "/job-tracker", description: "Track your applications" },
    { name: "AI Resume Enhancer", icon: Sparkles, path: "/resume-enhancer", description: "AI-powered enhancement" },
    { name: "Resume Translator", icon: Globe, path: "/resume-translator", description: "Translate resumes globally" },
    { name: "Resume Examples", icon: User, path: "/resume-examples", description: "Industry-specific examples" },
    { name: "Social Media Preview", icon: Eye, path: "/social-preview", description: "Preview across platforms" },
    { name: "Video Resume Maker", icon: Video, path: "/video-resume", description: "Create video resumes" },
  ];

  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="absolute inset-0 surface-grid opacity-50" />

        <div className="container mx-auto container-padding py-14 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Explore free tools
              </h3>
              <p className="mt-3 text-muted-foreground">
                A full suite of AI-powered career tools designed to help you move faster, stay organized, and apply with confidence.
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="btn-gradient" onClick={() => navigate("/tools")}>
                Open tools
              </Button>
              <Button variant="outline" className="bg-card/40 backdrop-blur" onClick={() => navigate("/dashboard")}>
                Go to dashboard
              </Button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {freeTools.map((tool) => (
              <Button
                key={tool.name}
                onClick={() => navigate(tool.path)}
                variant="ghost"
                className="h-auto p-3 text-left flex flex-col items-start gap-2 rounded-xl border border-border/60 bg-card/40 backdrop-blur hover:bg-card/60"
              >
                <tool.icon className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="min-w-0 w-full">
                  <div className="font-medium text-xs text-foreground leading-tight truncate">
                    {tool.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-tight line-clamp-2 mt-1">
                    {tool.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/12 border border-border/60 flex items-center justify-center">
                <span className="font-bold text-foreground">AI</span>
              </div>
              <div>
                <div className="text-lg font-bold text-gradient-primary">CareerHub</div>
                <div className="text-xs text-muted-foreground">A modern career platform</div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">© 2026 CareerHub. All rights reserved.</p>
              <p className="text-xs text-muted-foreground/80 mt-1">Built for job seekers, by job seekers</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
