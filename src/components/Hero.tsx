
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="pt-20 pb-16 px-6">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full text-sm font-medium text-orange-700 mb-8">
            🚀 Powered by Advanced AI Technology
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Career,
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent block">
              AI-Accelerated
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your job search with our all-in-one AI platform. Build perfect resumes, 
            ace interviews, and land your dream job faster than ever.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-4 text-lg">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 to-red-200/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/60 backdrop-blur-sm border border-gray-200/40 rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-gray-600">Resumes Generated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-gray-600">Interview Success</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">2.5x</div>
                  <div className="text-gray-600">Faster Job Placement</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.9/5</div>
                  <div className="text-gray-600">User Rating</div>
                </div>
              </div>
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
