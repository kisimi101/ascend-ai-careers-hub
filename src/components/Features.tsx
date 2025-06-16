
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, User, Book, CheckCircle } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume & Document Tools",
    description: "Smart ATS-friendly resume builder with real-time optimization, cover letter generator, and brutally honest AI feedback.",
    features: ["Smart Resume Builder", "Cover Letter Generator", "Resume 'Roast' Mode", "Grammar & Style Enhancer"],
    gradient: "from-blue-500 to-purple-500"
  },
  {
    icon: Search,
    title: "Job Search Engine",
    description: "Aggregated listings with smart filters, AI-powered matching, and instant apply functionality.",
    features: ["Aggregated Job Listings", "AI-Powered Matching", "Smart Filters", "Instant Apply"],
    gradient: "from-green-500 to-teal-500"
  },
  {
    icon: User,
    title: "Interview Mastery Suite",
    description: "Mock interview simulator with AI grading, real questions, and personalized 30-day prep plans.",
    features: ["Mock Interview Simulator", "AI Question Grading", "Behavioral & Technical", "30-Day Prep Planner"],
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Book,
    title: "AI Career Coach",
    description: "24/7 chatbot for career guidance, skills gap analysis, and employer research insights.",
    features: ["24/7 AI Chatbot", "Skills Gap Analysis", "Salary Negotiation Tips", "Employer Research"],
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: CheckCircle,
    title: "Community & Growth",
    description: "Anonymous peer reviews, success stories, and skill-based micro-courses for continuous learning.",
    features: ["Peer Resume Reviews", "Success Stories", "Micro-Courses", "Community Support"],
    gradient: "from-indigo-500 to-blue-500"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent block">
              Accelerate Your Career
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive AI-powered platform provides all the tools you need to land your dream job.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {features.slice(0, 2).map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600 text-lg">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 group-hover:text-white transition-all">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.slice(2).map((feature, index) => (
            <Card key={index + 2} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700 text-sm">
                      <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 group-hover:text-white transition-all">
                  Try Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
