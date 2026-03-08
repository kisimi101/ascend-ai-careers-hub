import { Badge } from "@/components/ui/badge";
import { Star, Download, Check } from "lucide-react";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { TechTemplate } from "./templates/TechTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ResumeData } from "./types";

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  rating: number;
  downloads: string;
  color: string;
  preview: string;
  atsScore: number;
  category: "modern" | "classic" | "creative" | "tech" | "executive";
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const templates: ResumeTemplate[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    description: "Clean, ATS-friendly design perfect for corporate roles",
    rating: 4.9,
    downloads: "12K+",
    color: "from-primary to-primary-variant",
    preview: "bg-gradient-to-br from-background to-secondary/20",
    atsScore: 95,
    category: "modern"
  },
  {
    id: "classic-minimal",
    name: "Classic Minimal",
    description: "Traditional layout with modern typography",
    rating: 4.8,
    downloads: "18K+",
    color: "from-secondary to-secondary/80",
    preview: "bg-gradient-to-br from-background to-muted/30",
    atsScore: 98,
    category: "classic"
  },
  {
    id: "tech-specialist",
    name: "Tech Specialist",
    description: "Minimalist template tailored for tech professionals",
    rating: 4.9,
    downloads: "15K+",
    color: "from-accent to-accent/80",
    preview: "bg-gradient-to-br from-background to-accent/10",
    atsScore: 97,
    category: "tech"
  },
  {
    id: "creative-designer",
    name: "Creative Designer",
    description: "Bold layout ideal for creative and design positions",
    rating: 4.7,
    downloads: "8K+",
    color: "from-primary-variant to-accent",
    preview: "bg-gradient-to-br from-primary/5 to-accent/20",
    atsScore: 85,
    category: "creative"
  }
];

const sampleData: ResumeData = {
  personalInfo: {
    fullName: "Alex Johnson",
    email: "alex@email.com",
    phone: "+1 555-0123",
    location: "San Francisco, CA",
    summary: "Results-driven professional with 5+ years of experience delivering innovative solutions."
  },
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Developer",
      duration: "2021 - Present",
      description: "Led a team of 8 engineers building scalable microservices."
    },
    {
      company: "StartupCo",
      position: "Software Engineer",
      duration: "2019 - 2021",
      description: "Built core product features serving 100K+ users."
    }
  ],
  education: [
    { institution: "MIT", degree: "B.S. Computer Science", year: "2019" }
  ],
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
  sectionOrder: ["summary", "experience", "education", "skills"]
};

const renderMiniTemplate = (templateId: string) => {
  switch (templateId) {
    case "classic-minimal":
      return <ClassicTemplate resumeData={sampleData} />;
    case "tech-specialist":
      return <TechTemplate resumeData={sampleData} />;
    case "creative-designer":
      return <CreativeTemplate resumeData={sampleData} />;
    default:
      return <ModernTemplate resumeData={sampleData} />;
  }
};

export const TemplateSelector = ({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-1">Choose Template</h3>
        <p className="text-muted-foreground text-sm">
          Select a professional template that matches your industry
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template.id)}
              className={`group relative text-left rounded-xl border-2 transition-all duration-200 overflow-hidden bg-card hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? 'border-primary shadow-lg ring-1 ring-primary/20'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {/* Mini preview */}
              <div className="relative h-40 overflow-hidden bg-white rounded-t-[10px]">
                <div
                  className="origin-top-left pointer-events-none"
                  style={{
                    transform: 'scale(0.28)',
                    width: '700px',
                    height: '900px',
                  }}
                >
                  {renderMiniTemplate(template.id)}
                </div>

                {/* Fade overlay */}
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />

                {/* Selected check */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                    <Check size={14} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-foreground leading-tight">{template.name}</h4>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-medium">
                    ATS {template.atsScore}%
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-1">
                  {template.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Star className="text-yellow-500" size={11} fill="currentColor" />
                    {template.rating}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Download size={11} />
                    {template.downloads}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { templates };
