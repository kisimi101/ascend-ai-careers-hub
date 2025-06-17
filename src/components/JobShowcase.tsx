
import { useState } from "react";
import { SlidingRow } from "./job-showcase/SlidingRow";
import { jobImages } from "./job-showcase/jobsData";

export const JobShowcase = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Split jobs into 3 rows
  const row1 = jobImages.slice(0, 3);
  const row2 = jobImages.slice(3, 6);
  const row3 = jobImages.slice(6, 9);

  return (
    <section 
      className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-100 rounded-full opacity-20"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
              🎯 Career Opportunities
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {" "}Dream Career{" "}
            </span>
            Today
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of professionals who have found their perfect careers with our AI-powered platform
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span>50K+ Active Jobs</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              <span>500+ Companies</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>

        {/* Three sliding rows */}
        <div className={`space-y-8 ${isPaused ? '[&_*]:pause' : ''}`}>
          {/* Row 1: Right to Left */}
          <SlidingRow jobs={row1} direction="left" speed={20} />
          
          {/* Row 2: Left to Right */}
          <SlidingRow jobs={row2} direction="right" speed={25} />
          
          {/* Row 3: Right to Left */}
          <SlidingRow jobs={row3} direction="left" speed={30} />
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
            🚀 Start Your Career Journey
          </div>
          <p className="text-gray-500 mt-4 text-sm">
            No credit card required • Get started in 2 minutes
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slide-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes slide-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-slide-left {
          animation: slide-left linear infinite;
        }
        
        .animate-slide-right {
          animation: slide-right linear infinite;
        }
        
        .pause * {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
};
