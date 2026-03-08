import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TourStep {
  title: string;
  description: string;
  targetSelector?: string;
}

interface OnboardingTourProps {
  tourId: string;
  steps: TourStep[];
}

export const OnboardingTour = ({ tourId, steps }: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(`tour-${tourId}-dismissed`);
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [tourId]);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`tour-${tourId}-dismissed`, 'true');
  };

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else dismiss();
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-full">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <Button onClick={dismiss} variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-3 w-3" />
              </Button>
            </div>
            <h3 className="font-semibold text-foreground text-sm mb-1">{steps[currentStep].title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{steps[currentStep].description}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button onClick={prev} variant="ghost" size="sm" className="h-7 text-xs">
                    <ChevronLeft className="h-3 w-3 mr-1" /> Back
                  </Button>
                )}
                <Button onClick={next} size="sm" className="h-7 text-xs">
                  {currentStep === steps.length - 1 ? "Got it!" : "Next"}
                  {currentStep < steps.length - 1 && <ChevronRight className="h-3 w-3 ml-1" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
