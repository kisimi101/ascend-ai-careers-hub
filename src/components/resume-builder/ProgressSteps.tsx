
import { LucideIcon } from "lucide-react";

interface Step {
  title: string;
  icon: LucideIcon;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className={`flex items-center space-x-2 ${
            index <= currentStep ? "text-orange-600" : "text-gray-400"
          }`}
        >
          <step.icon className="h-5 w-5" />
          <span className="hidden sm:block text-sm font-medium">{step.title}</span>
        </div>
      ))}
    </div>
  );
};
