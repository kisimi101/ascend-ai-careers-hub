
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface Job {
  id: number;
  title: string;
  image: string;
  description: string;
  company: string;
  salary: string;
}

interface JobCardProps {
  job: Job;
  index: number;
}

export const JobCard = ({ job, index }: JobCardProps) => {
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
