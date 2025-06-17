
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, User, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

export const FloatingSideTools = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const tools = [
    {
      name: "Cover Letter Generator",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "AI Resume Builder",
      icon: User,
      color: "from-green-500 to-green-600",
    },
    {
      name: "Resume Checker",
      icon: CheckCircle,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div
      className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      }`}
    >
      <div className="flex items-center">
        {/* Expanded tools */}
        <div
          className={`flex flex-col space-y-2 mr-2 transition-all duration-300 ${
            isExpanded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          }`}
        >
          {tools.map((tool, index) => (
            <Button
              key={tool.name}
              size="sm"
              className={`bg-gradient-to-r ${tool.color} hover:scale-105 transition-transform shadow-lg min-w-[180px] justify-start`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <tool.icon className="mr-2 h-4 w-4" />
              {tool.name}
            </Button>
          ))}
        </div>

        {/* Toggle button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-full p-3 shadow-lg"
        >
          {isExpanded ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
