
import { Button } from "@/components/ui/button";
import { FileText, User, CheckCircle } from "lucide-react";

export const CTA = () => {
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
      color: "from-green-500 to-green-600",
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
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join over 50,000 professionals who have accelerated their careers with our AI-powered platform.
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-orange-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-orange-600">
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
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Free AI Career Tools</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get started with our powerful AI tools - completely free, no signup required
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {freeTools.map((tool, index) => (
            <div
              key={tool.name}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center mb-6`}>
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{tool.name}</h4>
              <p className="text-gray-600 mb-6">{tool.description}</p>
              <Button className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90`}>
                Try Now - Free
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="mt-20 pt-12 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              CareerHub
            </span>
          </div>
          <p>&copy; 2024 CareerHub. All rights reserved.</p>
        </div>
      </footer>
    </section>
  );
};
