
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
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ToolsDashboard = () => {
  const navigate = useNavigate();

  const toolCategories = [
    {
      title: "Resume Tools",
      description: "Perfect your resume with AI assistance",
      tools: [
        {
          name: "AI Resume Builder",
          description: "Build ATS-friendly resumes with AI guidance",
          icon: User,
          path: "/resume-builder",
          color: "from-blue-500 to-blue-600",
          popular: true
        },
        {
          name: "Resume Checker",
          description: "Get instant feedback and improvement suggestions",
          icon: Search,
          path: "/resume-checker",
          color: "from-green-500 to-green-600",
          popular: true
        },
        {
          name: "Resume Summary Generator",
          description: "Create compelling professional summaries",
          icon: Edit,
          path: "/resume-summary-generator",
          color: "from-purple-500 to-purple-600"
        },
        {
          name: "Resume Bullet Generator",
          description: "Generate impactful bullet points",
          icon: Target,
          path: "/resume-bullet-generator",
          color: "from-orange-500 to-orange-600"
        },
        {
          name: "Skills Generator",
          description: "Optimize your skills section",
          icon: Settings,
          path: "/resume-skills-generator",
          color: "from-teal-500 to-teal-600"
        },
        {
          name: "AI Resume Enhancer",
          description: "AI-powered resume optimization",
          icon: Sparkles,
          path: "/resume-enhancer",
          color: "from-pink-500 to-pink-600"
        }
      ]
    },
    {
      title: "Job Search Tools",
      description: "Accelerate your job search process",
      tools: [
        {
          name: "Cover Letter Generator",
          description: "Create tailored cover letters in minutes",
          icon: FileText,
          path: "/cover-letter-generator",
          color: "from-indigo-500 to-indigo-600",
          popular: true
        },
        {
          name: "Keyword Scanner",
          description: "Optimize for ATS systems",
          icon: Scan,
          path: "/resume-keyword-scanner",
          color: "from-yellow-500 to-yellow-600"
        },
        {
          name: "Job Tracker",
          description: "Track your job applications",
          icon: Clipboard,
          path: "/job-tracker",
          color: "from-red-500 to-red-600"
        },
        {
          name: "Salary Estimator",
          description: "Know your market value",
          icon: DollarSign,
          path: "/salary-estimator",
          color: "from-emerald-500 to-emerald-600"
        }
      ]
    },
    {
      title: "Career Development",
      description: "Advance your professional growth",
      tools: [
        {
          name: "Interview Practice",
          description: "Practice with AI-powered mock interviews",
          icon: MessageCircle,
          path: "/interview-practice",
          color: "from-cyan-500 to-cyan-600"
        },
        {
          name: "Resignation Letter",
          description: "Professional resignation letters",
          icon: FileX,
          path: "/resignation-letter-generator",
          color: "from-gray-500 to-gray-600"
        },
        {
          name: "Resume Examples",
          description: "Industry-specific resume templates",
          icon: User,
          path: "/resume-examples",
          color: "from-violet-500 to-violet-600"
        }
      ]
    },
    {
      title: "Advanced Tools",
      description: "Professional enhancement features",
      tools: [
        {
          name: "Resume Translator",
          description: "Translate resumes to any language",
          icon: Globe,
          path: "/resume-translator",
          color: "from-rose-500 to-rose-600"
        },
        {
          name: "Video Resume Maker",
          description: "Create engaging video resumes",
          icon: Video,
          path: "/video-resume",
          color: "from-amber-500 to-amber-600"
        },
        {
          name: "Social Media Preview",
          description: "Optimize your professional presence",
          icon: Eye,
          path: "/social-preview",
          color: "from-lime-500 to-lime-600"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-800 text-sm font-medium mb-6">
            <Rocket className="w-4 h-4 mr-2" />
            Free AI Career Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> AI Tool</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access our complete suite of AI-powered career tools. All free, no signup required.
            Start with any tool below to accelerate your career journey.
          </p>
        </div>
      </section>

      {/* Tools Categories */}
      <section className="pb-20 px-6">
        <div className="container mx-auto">
          {toolCategories.map((category, categoryIndex) => (
            <div key={category.title} className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{category.title}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, toolIndex) => (
                  <Card 
                    key={tool.name}
                    className="group hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-orange-300 hover:scale-105 relative overflow-hidden"
                  >
                    {tool.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <tool.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {tool.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <Button 
                        onClick={() => navigate(tool.path)}
                        className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 transition-all`}
                      >
                        Try Now - Free
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ToolsDashboard;
