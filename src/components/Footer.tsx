
import { Button } from "@/components/ui/button";
import { FileText, Search, Edit, Target, Settings, Scan, FileX, MessageCircle, DollarSign, Clipboard, Sparkles, Globe, Video, Eye, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const freeTools = [
    {
      name: "Cover Letter Generator",
      icon: FileText,
      path: "/cover-letter-generator",
      description: "Create professional cover letters"
    },
    {
      name: "Resume Checker",
      icon: Search,
      path: "/resume-checker",
      description: "Get instant resume feedback"
    },
    {
      name: "Resume Summary Generator",
      icon: Edit,
      path: "/resume-summary-generator",
      description: "Generate compelling summaries"
    },
    {
      name: "Resume Bullet Generator",
      icon: Target,
      path: "/resume-bullet-generator",
      description: "Create impactful bullet points"
    },
    {
      name: "Skills Generator",
      icon: Settings,
      path: "/resume-skills-generator",
      description: "Optimize your skills section"
    },
    {
      name: "Keyword Scanner",
      icon: Scan,
      path: "/resume-keyword-scanner",
      description: "Scan for ATS keywords"
    },
    {
      name: "Resignation Letter",
      icon: FileX,
      path: "/resignation-letter-generator",
      description: "Professional resignation letters"
    },
    {
      name: "Interview Practice",
      icon: MessageCircle,
      path: "/interview-practice",
      description: "Practice interview questions"
    },
    {
      name: "Salary Estimator",
      icon: DollarSign,
      path: "/salary-estimator",
      description: "Estimate your market value"
    },
    {
      name: "Job Tracker",
      icon: Clipboard,
      path: "/job-tracker",
      description: "Track your applications"
    },
    {
      name: "AI Resume Enhancer",
      icon: Sparkles,
      path: "/resume-enhancer",
      description: "AI-powered enhancement"
    },
    {
      name: "Resume Translator",
      icon: Globe,
      path: "/resume-translator",
      description: "Translate resumes globally"
    },
    {
      name: "Resume Examples",
      icon: User,
      path: "/resume-examples",
      description: "Industry-specific examples"
    },
    {
      name: "Social Media Preview",
      icon: Eye,
      path: "/social-preview",
      description: "Preview across platforms"
    },
    {
      name: "Video Resume Maker",
      icon: Video,
      path: "/video-resume",
      description: "Create video resumes"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        {/* Free Tools Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Free AI Career Tools</h3>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Accelerate your career with our comprehensive suite of AI-powered tools - all completely free
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {freeTools.map((tool, index) => (
              <Button
                key={tool.name}
                onClick={() => navigate(tool.path)}
                variant="ghost"
                className="h-auto p-3 text-left flex flex-col items-start space-y-2 hover:bg-gray-800 border border-gray-700 rounded-lg group transition-all duration-200"
              >
                <tool.icon className="h-4 w-4 text-orange-500 group-hover:text-orange-400 flex-shrink-0" />
                <div className="min-w-0 w-full">
                  <div className="font-medium text-xs text-white group-hover:text-orange-400 leading-tight truncate">
                    {tool.name}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 leading-tight line-clamp-2">
                    {tool.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          {/* Company Info */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                CareerHub
              </span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                &copy; 2024 CareerHub. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Powered by AI • Built with ❤️ for job seekers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
