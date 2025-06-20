
"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [active, setActive] = useState<string | null>(null);
  
  return (
    <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/20">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            CareerHub
          </span>
        </div>
        
        {/* Animated Menu */}
        <div className="hidden md:block">
          <div className={cn("max-w-2xl mx-auto")}>
            <Menu setActive={setActive}>
              <MenuItem setActive={setActive} active={active} item="Resume Builder">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink to="/resume-builder">AI Resume Builder</HoveredLink>
                  <HoveredLink to="/resume-checker">Resume Checker</HoveredLink>
                  <HoveredLink to="/resume-summary-generator">Resume Summary</HoveredLink>
                  <HoveredLink to="/resume-examples">Resume Examples</HoveredLink>
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Job Search">
                <div className="text-sm grid grid-cols-2 gap-10 p-4">
                  <ProductItem
                    title="Cover Letter Generator"
                    href="/cover-letter-generator"
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=140&h=70&fit=crop"
                    description="Create personalized cover letters in minutes"
                  />
                  <ProductItem
                    title="Interview Practice"
                    href="/interview-practice"
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=140&h=70&fit=crop"
                    description="Practice with AI-powered interview questions"
                  />
                  <ProductItem
                    title="Job Tracker"
                    href="/job-tracker"
                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=140&h=70&fit=crop"
                    description="Track your job applications efficiently"
                  />
                  <ProductItem
                    title="Salary Estimator"
                    href="/salary-estimator"
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=140&h=70&fit=crop"
                    description="Get accurate salary estimates for your role"
                  />
                </div>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Community">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink to="/community">Community Home</HoveredLink>
                  <HoveredLink to="/community/forums">Discussion Forums</HoveredLink>
                  <HoveredLink to="/community/success-stories">Success Stories</HoveredLink>
                  <HoveredLink to="/community/career-advice">Career Advice</HoveredLink>
                  <HoveredLink to="/community/networking">Networking Events</HoveredLink>
                </div>
              </MenuItem>
            </Menu>
          </div>
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
    </div>
  );
};
