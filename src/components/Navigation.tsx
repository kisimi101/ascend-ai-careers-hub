
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/20">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            CareerHub
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};
