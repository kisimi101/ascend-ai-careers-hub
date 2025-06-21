
import React from "react";
import { Briefcase, Users, TrendingUp, Clock } from "lucide-react";

export const JobSearchHeader = () => {
  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "2,847" },
    { icon: Users, label: "Companies", value: "1,293" },
    { icon: TrendingUp, label: "New This Week", value: "156" },
    { icon: Clock, label: "Avg Response", value: "2 days" }
  ];

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-orange-100 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
