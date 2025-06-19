
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <Button
        onClick={() => navigate('/tools')}
        size="lg"
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-2xl px-8 py-4 rounded-full text-lg font-semibold animate-pulse"
      >
        <Rocket className="mr-2 h-5 w-5" />
        Start Your Career Journey
      </Button>
    </div>
  );
};
