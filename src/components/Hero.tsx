
import { Button } from "@/components/ui/button";
import { ArrowDown, Lightbulb, Check, Shield, Eye } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-20 pb-16 px-6 relative overflow-hidden">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto relative">
          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top Left - Profile Image */}
            <div className="absolute top-0 left-8 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Top Center - Lightbulb */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 translate-x-16 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            
            {/* Top Right - Lightning */}
            <div className="absolute top-4 right-8 w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            
            {/* Left Side - Performance */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
            
            {/* Right Side - Analytics */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border">
              <div className="text-2xl font-bold text-gray-800">AI</div>
            </div>
            
            {/* Bottom Right - Profile */}
            <div className="absolute bottom-12 right-12 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-lg flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
              <defs>
                <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#e5e7eb" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" opacity="0.3" />
              {/* Connecting lines */}
              <path d="M200 100 L400 200" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              <path d="M600 100 L400 200" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              <path d="M150 250 L400 200" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              <path d="M650 250 L400 200" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
            </svg>
          </div>

          {/* Central Success Icon */}
          <div className="relative z-10 mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl mb-12">
              <Check className="w-12 h-12 text-white stroke-[3]" />
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full text-sm font-medium text-orange-700 mb-8">
              🚀 Powered by Advanced AI Technology
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              All-in-one Career
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent block">
                platform
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              CareerHub is a modern, all-in-one AI platform designed to perfectly fit your career advancement needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-4 text-lg">
                Request a Demo
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-16 animate-bounce">
          <ArrowDown className="mx-auto text-gray-400" size={24} />
        </div>
      </div>
    </section>
  );
};
