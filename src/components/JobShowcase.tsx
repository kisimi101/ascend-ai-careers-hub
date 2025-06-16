
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

const jobImages = [
  {
    id: 1,
    title: "Software Engineer",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    description: "Building the future with code",
    company: "Tech Corp",
    salary: "$120k+"
  },
  {
    id: 2,
    title: "Product Manager",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
    description: "Leading innovative solutions",
    company: "Innovation Labs",
    salary: "$110k+"
  },
  {
    id: 3,
    title: "Data Scientist",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
    description: "Turning data into insights",
    company: "Data Solutions",
    salary: "$130k+"
  },
  {
    id: 4,
    title: "UX Designer",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
    description: "Crafting user experiences",
    company: "Design Studio",
    salary: "$95k+"
  },
  {
    id: 5,
    title: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    description: "Driving growth strategies",
    company: "Growth Co",
    salary: "$85k+"
  },
  {
    id: 6,
    title: "Business Analyst",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    description: "Analyzing business solutions",
    company: "Business Hub",
    salary: "$75k+"
  },
  {
    id: 7,
    title: "DevOps Engineer",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop",
    description: "Streamlining operations",
    company: "Cloud Systems",
    salary: "$115k+"
  },
  {
    id: 8,
    title: "Sales Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    description: "Driving revenue growth",
    company: "Sales Pro",
    salary: "$140k+"
  },
  {
    id: 9,
    title: "Financial Analyst",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    description: "Managing financial strategies",
    company: "Finance Plus",
    salary: "$90k+"
  }
];

const JobCard = ({ job, index }: { job: typeof jobImages[0], index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/95 backdrop-blur-sm overflow-hidden min-w-[320px] mx-2 transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 relative">
        <div className="relative h-56 overflow-hidden">
          <img 
            src={job.image} 
            alt={job.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Floating badge */}
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {job.salary}
          </div>
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">Now Hiring</span>
            </div>
            <h3 className="text-xl font-bold mb-1">{job.title}</h3>
            <p className="text-sm text-gray-200 mb-2">{job.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-300 font-medium">{job.company}</span>
              <div className="flex space-x-1">
                {[1,2,3,4,5].map((star) => (
                  <div key={star} className="w-3 h-3 bg-yellow-400 rounded-full opacity-80"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-orange-600/90 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute bottom-6 left-6 right-6">
              <button className="w-full bg-white text-orange-600 py-2 px-4 rounded-full font-semibold hover:bg-orange-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SlidingRow = ({ jobs, direction, speed }: { 
  jobs: typeof jobImages, 
  direction: 'left' | 'right',
  speed: number 
}) => {
  return (
    <div className="relative overflow-hidden py-4">
      <div 
        className={`flex space-x-4 ${
          direction === 'left' ? 'animate-slide-left' : 'animate-slide-right'
        }`}
        style={{
          animationDuration: `${speed}s`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear'
        }}
      >
        {/* Duplicate the jobs array to create seamless loop */}
        {[...jobs, ...jobs].map((job, index) => (
          <JobCard key={`${job.id}-${index}`} job={job} index={index} />
        ))}
      </div>
    </div>
  );
};

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
      <style jsx>{`
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
