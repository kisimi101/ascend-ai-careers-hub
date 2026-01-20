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
import { User, Menu as MenuIcon, X, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

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
    { label: "Dashboard", path: "/dashboard" },
    { label: "AI Resume Builder", path: "/resume-builder" },
    { label: "Resume Checker", path: "/resume-checker" },
    { label: "Keyword Scanner", path: "/resume-keyword-scanner" },
    { label: "Resume Comparison", path: "/resume-comparison" },
    { label: "Job Search", path: "/job-search" },
    { label: "Cover Letter Generator", path: "/cover-letter-generator" },
    { label: "Interview Practice", path: "/interview-practice" },
    { label: "Job Tracker", path: "/job-tracker" },
    { label: "Salary Estimator", path: "/salary-estimator" },
    { label: "LinkedIn Optimizer", path: "/linkedin-optimizer" },
    { label: "LinkedIn Import", path: "/linkedin-import" },
    { label: "Skills Gap Analyzer", path: "/skills-gap-analyzer" },
    { label: "Career Path Planner", path: "/career-path-planner" },
    { label: "Portfolio Builder", path: "/portfolio-builder" },
    { label: "Network", path: "/network" },
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
                  <div className="text-sm grid grid-cols-2 gap-10 p-4">
                    <div className="flex flex-col space-y-4">
                      <HoveredLink to="/job-search">Job Search</HoveredLink>
                      <HoveredLink to="/resume-job-search">Jobs for Your Resume</HoveredLink>
                    </div>
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
                <MenuItem setActive={setActive} active={active} item="Network">
                  <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink to="/network">Find Recruiters & Contacts</HoveredLink>
                    <HoveredLink to="/linkedin-optimizer">LinkedIn Optimizer</HoveredLink>
                    <HoveredLink to="/skills-gap-analyzer">Skills Gap Analyzer</HoveredLink>
                    <HoveredLink to="/reference-manager">Reference Manager</HoveredLink>
                    <HoveredLink to="/career-path-planner">Career Path Planner</HoveredLink>
                    <HoveredLink to="/industry-insights">Industry Insights</HoveredLink>
                    <HoveredLink to="/portfolio-builder">Portfolio Builder</HoveredLink>
                  </div>
                </MenuItem>
              </Menu>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-3">
            <ThemeToggle />
            <LanguageSelector />
            
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
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/profile')}
                  className="hidden sm:flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">Profile</span>
                </Button>
                <Button variant="outline" onClick={logout} className="hidden sm:inline-flex focus-ring">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleSignIn} className="hidden sm:inline-flex focus-ring">
                  Sign In
                </Button>
                <Button className="hidden sm:inline-flex btn-gradient focus-ring" onClick={handleGetStarted}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authMode} />
    </>
  );
};
