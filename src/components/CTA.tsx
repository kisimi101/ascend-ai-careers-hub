
import { Button } from "@/components/ui/button";
import { FileText, User, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTA = () => {
  const navigate = useNavigate();

  const freeTools = [
    {
      name: "Free Cover Letter Generator",
      description: "Create professional cover letters in minutes",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Free AI Resume Builder",
      description: "Build ATS-friendly resumes with AI assistance",
      icon: User,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      name: "Free Resume Checker",
      description: "Get instant feedback on your resume",
      icon: CheckCircle,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl"></div>
          <div className="relative btn-gradient rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join over 50,000 professionals who have accelerated their careers with our AI-powered platform.
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="px-8 py-4 text-lg bg-card text-primary hover:bg-card/90"
                onClick={() => navigate('/tools')}
              >
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                Schedule Demo
              </Button>
            </div>
            <div className="mt-8 text-sm opacity-75">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>
        </div>
      </div>

      {/* Free Tools Section */}
      <div className="mt-20 container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Free AI Career Tools</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started with our powerful AI tools - completely free, no signup required
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {freeTools.map((tool) => (
            <div
              key={tool.name}
              className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center mb-6`}>
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">{tool.name}</h4>
              <p className="text-muted-foreground mb-6">{tool.description}</p>
              <Button 
                className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90`}
                onClick={() => navigate('/tools')}
              >
                Try Now - Free
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
