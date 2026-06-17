"use client";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";
import LanguageSelector from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  User, Menu as MenuIcon, Settings, LayoutDashboard, FileText, Search,
  Zap, MessageSquareText, MoreHorizontal, Briefcase, BarChart3, Mail,
  Linkedin, Users, Target, GraduationCap, Map, Building2, Languages,
  Crown, Compass, FileSearch, FileEdit, Sparkles, Calendar, ChevronDown,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { NotificationCenter } from "@/components/NotificationCenter";
import { GuestUsageWidget } from "@/components/GuestUsageWidget";

type PrimaryItem = { label: string; path: string; icon: React.ComponentType<{ className?: string }> };

const PRIMARY_NAV: PrimaryItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Resume Builder", path: "/resume-builder", icon: FileText },
  { label: "Job Search", path: "/job-search", icon: Search },
  { label: "Smart Apply", path: "/smart-apply", icon: Zap },
  { label: "Interview", path: "/interview-practice", icon: MessageSquareText },
];

const MORE_GROUPS: { heading: string; items: PrimaryItem[] }[] = [
  {
    heading: "Resume Tools",
    items: [
      { label: "Resume Checker", path: "/resume-checker", icon: FileSearch },
      { label: "Keyword Scanner", path: "/resume-keyword-scanner", icon: Target },
      { label: "Resume Comparison", path: "/resume-comparison", icon: FileEdit },
      { label: "Resume Examples", path: "/resume-examples", icon: FileText },
      { label: "Resume Translator", path: "/resume-translator", icon: Languages },
    ],
  },
  {
    heading: "Job Hunt",
    items: [
      { label: "Cover Letter", path: "/cover-letter-generator", icon: Mail },
      { label: "Job Tracker", path: "/job-tracker", icon: Briefcase },
      { label: "Company Watchlist", path: "/company-watchlist", icon: Building2 },
      { label: "Salary Estimator", path: "/salary-estimator", icon: BarChart3 },
      { label: "Company Research", path: "/company-research", icon: Building2 },
    ],
  },
  {
    heading: "Network & Growth",
    items: [
      { label: "Network", path: "/network", icon: Users },
      { label: "LinkedIn Optimizer", path: "/linkedin-optimizer", icon: Linkedin },
      { label: "LinkedIn Import", path: "/linkedin-import", icon: Linkedin },
      { label: "Skills Gap", path: "/skills-gap-analyzer", icon: GraduationCap },
      { label: "Career Path", path: "/career-path-planner", icon: Compass },
      { label: "Portfolio Builder", path: "/portfolio-builder", icon: Sparkles },
    ],
  },
  {
    heading: "Pro",
    items: [
      { label: "Question Bank", path: "/interview-question-bank", icon: MessageSquareText },
      { label: "Auto Follow-Up", path: "/auto-follow-up", icon: Calendar },
      { label: "Market Heatmap", path: "/job-market-heatmap", icon: Map },
      { label: "Career Timeline", path: "/career-timeline", icon: Crown },
      { label: "Referral Mapper", path: "/referral-mapper", icon: Users },
    ],
  },
];

export const Navigation = () => {
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
        {/* Top row: centered brand + utilities + account */}
        <div className="container mx-auto container-padding pt-3 pb-2 relative flex items-center justify-center gap-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src={logo} alt="CareerNow AI Logo" width={36} height={36} decoding="async" className="w-9 h-9 rounded-lg" />
            <span className="text-lg font-bold text-gradient-primary leading-none">CareerNow</span>
          </Link>

          <div className="flex items-center gap-2">
            <GuestUsageWidget />
            <LanguageSelector />
            <ThemeToggle />
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

        {/* Bottom row: centered horizontal pill nav (desktop only) */}
        <div className="hidden md:block border-t border-border/40">
          <div className="container mx-auto container-padding py-2 flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
            {PRIMARY_NAV.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Third row: always-visible category groups (desktop only) */}
        <div className="hidden md:block border-t border-border/40 bg-background/40">
          <div className="container mx-auto container-padding py-2 flex items-center justify-center gap-2">
            {MORE_GROUPS.map((group) => (
              <div key={group.heading} className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {group.heading}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div
                  className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
                >
                  <div className="min-w-[240px] rounded-xl border border-border bg-popover text-popover-foreground shadow-lg p-2">
                    {group.items.map(({ label, path, icon: Icon }) => (
                      <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/80 hover:bg-accent hover:text-foreground"
                          )
                        }
                      >
                        <Icon className="h-4 w-4 text-primary/70" />
                        {label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authMode} />
    </>
  );
};
