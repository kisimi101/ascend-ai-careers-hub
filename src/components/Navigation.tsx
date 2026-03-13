"use client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import LanguageSelector from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User, Menu as MenuIcon, X, LayoutDashboard, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { NotificationCenter } from "@/components/NotificationCenter";

export const Navigation = () => {
  const [active, setActive] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleSignIn = () => {
    setAuthMode('signin');
    setAuthOpen(true);
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    setAuthMode('signup');
    setAuthOpen(true);
    setMobileMenuOpen(false);
  };

  const mobileNavLinks = [
    { label: "Get Started", path: "/get-started" },
    { label: "Smart Apply ✨ (Pro)", path: "/smart-apply" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "AI Resume Builder", path: "/resume-builder" },
    { label: "Resume Checker", path: "/resume-checker" },
    { label: "Keyword Scanner", path: "/resume-keyword-scanner" },
    { label: "Resume Comparison", path: "/resume-comparison" },
    { label: "Job Search (Pro)", path: "/job-search" },
    { label: "Cover Letter Generator", path: "/cover-letter-generator" },
    { label: "Interview Practice", path: "/interview-practice" },
    { label: "Interview Question Bank (Pro)", path: "/interview-question-bank" },
    { label: "Job Tracker", path: "/job-tracker" },
    { label: "Salary Estimator", path: "/salary-estimator" },
    { label: "Auto Follow-Up (Pro)", path: "/auto-follow-up" },
    { label: "Job Market Heatmap (Pro)", path: "/job-market-heatmap" },
    { label: "Career Timeline (Pro)", path: "/career-timeline" },
    { label: "Referral Mapper (Pro)", path: "/referral-mapper" },
    { label: "LinkedIn Optimizer", path: "/linkedin-optimizer" },
    { label: "LinkedIn Import", path: "/linkedin-import" },
    { label: "Skills Gap Analyzer", path: "/skills-gap-analyzer" },
    { label: "Career Path Planner", path: "/career-path-planner" },
    { label: "Portfolio Builder", path: "/portfolio-builder" },
    { label: "Company Research", path: "/company-research" },
    { label: "Network (Pro)", path: "/network" },
  ];
  
  return (
    <>
      <div className="fixed top-0 w-full z-50 glass border-b border-border/50">
        <div className="container mx-auto container-padding py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src={logo} alt="CareerHub AI Logo" className="w-10 h-10 rounded-lg" />
            <span className="text-xl font-bold text-gradient-primary">
              CareerHub
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className={cn("max-w-2xl mx-auto")}>
              <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Resume Builder">
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink to="/resume-builder">AI Resume Builder</HoveredLink>
                    <HoveredLink to="/resume-checker">Resume Checker</HoveredLink>
                    <HoveredLink to="/resume-keyword-scanner">Keyword Scanner</HoveredLink>
                    <HoveredLink to="/resume-comparison">Resume Comparison</HoveredLink>
                    <HoveredLink to="/resume-summary-generator">Resume Summary</HoveredLink>
                    <HoveredLink to="/resume-examples">Resume Examples</HoveredLink>
                  </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Job Search">
                  <div className="text-sm grid grid-cols-2 gap-6 p-4 min-w-[520px]">
                    <ProductItem
                      title="Job Search"
                      href="/job-search"
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=140&h=70&fit=crop"
                      description="Search thousands of jobs across top boards"
                    />
                    <ProductItem
                      title="Jobs for Your Resume"
                      href="/resume-job-search"
                      src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=140&h=70&fit=crop"
                      description="AI-matched jobs based on your resume skills"
                    />
                    <ProductItem
                      title="Cover Letter Generator"
                      href="/cover-letter-generator"
                      src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=140&h=70&fit=crop"
                      description="Create personalized cover letters in minutes"
                    />
                    <ProductItem
                      title="Interview Practice"
                      href="/interview-practice"
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=140&h=70&fit=crop"
                      description="Practice with AI-powered interview questions"
                    />
                    <ProductItem
                      title="Job Tracker"
                      href="/job-tracker"
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=140&h=70&fit=crop"
                      description="Track all your applications in one place"
                    />
                    <ProductItem
                      title="Salary Estimator"
                      href="/salary-estimator"
                      src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=140&h=70&fit=crop"
                      description="Get accurate salary estimates for your role"
                    />
                  </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Network">
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink to="/network">Find Recruiters & Contacts</HoveredLink>
                    <HoveredLink to="/linkedin-optimizer">LinkedIn Optimizer</HoveredLink>
                    <HoveredLink to="/company-research">Company Research</HoveredLink>
                    <HoveredLink to="/skills-gap-analyzer">Skills Gap Analyzer</HoveredLink>
                    <HoveredLink to="/reference-manager">Reference Manager</HoveredLink>
                    <HoveredLink to="/career-path-planner">Career Path Planner</HoveredLink>
                    <HoveredLink to="/industry-insights">Industry Insights</HoveredLink>
                    <HoveredLink to="/portfolio-builder">Portfolio Builder</HoveredLink>
                    <HoveredLink to="/referral-mapper">Referral Mapper ✨</HoveredLink>
                  </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Pro Tools">
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink to="/smart-apply">Smart Apply Pipeline</HoveredLink>
                    <HoveredLink to="/auto-follow-up">Auto Follow-Up</HoveredLink>
                    <HoveredLink to="/job-market-heatmap">Job Market Heatmap</HoveredLink>
                    <HoveredLink to="/interview-question-bank">Interview Question Bank</HoveredLink>
                    <HoveredLink to="/career-timeline">Career Timeline</HoveredLink>
                  </div>
                </MenuItem>
              </Menu>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
            {isAuthenticated && <NotificationCenter />}
            
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] overflow-y-auto">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold">Menu</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {mobileNavLinks.map((link) => (
                      <SheetClose asChild key={link.path}>
                        <Link
                          to={link.path}
                          className="px-4 py-3 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                    {isAuthenticated ? (
                      <>
                        <SheetClose asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/profile')}
                            className="w-full justify-start"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Profile
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/settings')}
                            className="w-full justify-start"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Button>
                        </SheetClose>
                        <Button variant="outline" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full">
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" onClick={handleSignIn} className="w-full">
                          Sign In
                        </Button>
                        <Button className="btn-gradient w-full" onClick={handleGetStarted}>
                          Get Started
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-1.5">
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-1.5 h-9 px-3"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-1.5 h-9 px-3"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm" onClick={logout} className="h-9 px-4 focus-ring">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleSignIn} className="h-9 px-4 focus-ring">
                    Sign In
                  </Button>
                  <Button size="sm" className="btn-gradient h-9 px-4 focus-ring" onClick={handleGetStarted}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authMode} />
    </>
  );
};
