import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Check, Palette, Expand } from "lucide-react";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { TechTemplate } from "./templates/TechTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { MinimalistTemplate } from "./templates/MinimalistTemplate";
import { ResumeData } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  rating: number;
  downloads: string;
  color: string;
  preview: string;
  atsScore: number;
  category: "modern" | "classic" | "creative" | "tech" | "executive" | "minimalist";
  defaultAccent: string;
  colorOptions: string[];
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  accentColor?: string;
  onAccentColorChange?: (color: string) => void;
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
    category: "modern",
    defaultAccent: "#2563eb",
    colorOptions: ["#2563eb", "#0891b2", "#7c3aed", "#dc2626", "#059669", "#d97706"],
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
    category: "classic",
    defaultAccent: "#374151",
    colorOptions: ["#374151", "#1e3a5f", "#4a2c2a", "#1e293b", "#365314", "#713f12"],
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
    category: "tech",
    defaultAccent: "#059669",
    colorOptions: ["#059669", "#2563eb", "#7c3aed", "#0891b2", "#dc2626", "#ea580c"],
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
    category: "creative",
    defaultAccent: "#6d28d9",
    colorOptions: ["#6d28d9", "#db2777", "#2563eb", "#059669", "#dc2626", "#ea580c"],
  },
  {
    id: "executive",
    name: "Executive",
    description: "Commanding dark header for senior & leadership roles",
    rating: 4.8,
    downloads: "6K+",
    color: "from-gray-800 to-gray-600",
    preview: "bg-gradient-to-br from-gray-900/10 to-gray-400/10",
    atsScore: 96,
    category: "executive",
    defaultAccent: "#1e293b",
    colorOptions: ["#1e293b", "#1e3a5f", "#4a1e2a", "#312e81", "#134e4a", "#3f3f46"],
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Maximum whitespace for a calm, elegant impression",
    rating: 4.6,
    downloads: "5K+",
    color: "from-gray-300 to-gray-200",
    preview: "bg-gradient-to-br from-white to-gray-100",
    atsScore: 99,
    category: "minimalist",
    defaultAccent: "#737373",
    colorOptions: ["#737373", "#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed"],
  },
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
    { company: "Tech Corp", position: "Senior Developer", duration: "2021 - Present", description: "Led a team of 8 engineers building scalable microservices." },
    { company: "StartupCo", position: "Software Engineer", duration: "2019 - 2021", description: "Built core product features serving 100K+ users." }
  ],
  education: [{ institution: "MIT", degree: "B.S. Computer Science", year: "2019" }],
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
  sectionOrder: ["summary", "experience", "education", "skills"]
};

const renderMiniTemplate = (templateId: string, accent: string) => {
  const props = { resumeData: sampleData, accentColor: accent };
  switch (templateId) {
    case "classic-minimal": return <ClassicTemplate {...props} />;
    case "tech-specialist": return <TechTemplate {...props} />;
    case "creative-designer": return <CreativeTemplate {...props} />;
    case "executive": return <ExecutiveTemplate {...props} />;
    case "minimalist": return <MinimalistTemplate {...props} />;
    default: return <ModernTemplate {...props} />;
  }
};

export const TemplateSelector = ({
  selectedTemplate,
  onSelectTemplate,
  accentColor,
  onAccentColorChange,
}: TemplateSelectorProps) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const currentTemplate = templates.find(t => t.id === selectedTemplate);
  const previewTpl = previewTemplate ? templates.find(t => t.id === previewTemplate) : null;
  const effectiveAccent = accentColor || currentTemplate?.defaultAccent || "#2563eb";

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
          const previewAccent = isSelected ? effectiveAccent : template.defaultAccent;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => {
                onSelectTemplate(template.id);
                onAccentColorChange?.(template.defaultAccent);
              }}
              className={`group relative text-left rounded-xl border-2 transition-all duration-300 overflow-hidden bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                hover:scale-[1.03] hover:shadow-xl hover:-translate-y-0.5
                ${isSelected
                  ? 'border-primary shadow-lg ring-1 ring-primary/20'
                  : 'border-border hover:border-primary/40 shadow-sm'
                }`}
            >
              {/* Mini preview */}
              <div className="relative h-36 overflow-hidden bg-white rounded-t-[10px]">
                <div
                  className="origin-top-left pointer-events-none"
                  style={{ transform: 'scale(0.26)', width: '700px', height: '900px' }}
                >
                  {renderMiniTemplate(template.id, previewAccent)}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md animate-scale-in">
                    <Check size={14} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template.id);
                  }}
                  className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-foreground rounded-md p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background"
                  title="Preview full size"
                >
                  <Expand size={14} />
                </button>
              </div>

              {/* Info */}
              <div className="p-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-foreground leading-tight">{template.name}</h4>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-medium">
                    ATS {template.atsScore}%
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug line-clamp-1">
                  {template.description}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Star className="text-yellow-500" size={10} fill="currentColor" />
                    {template.rating}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Download size={10} />
                    {template.downloads}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Color Selector */}
      {currentTemplate && onAccentColorChange && (
        <div className="pt-2 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Palette size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Accent Color</span>
            <span className="text-xs text-muted-foreground">— {currentTemplate.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {currentTemplate.colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onAccentColorChange(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  effectiveAccent === color
                    ? 'border-foreground scale-110 shadow-md'
                    : 'border-transparent hover:border-muted-foreground/30'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {/* Custom color via popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-muted-foreground/60 transition-all"
                  title="Custom color"
                >
                  <span className="text-xs font-bold">+</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <label className="text-xs text-muted-foreground block mb-2">Pick a custom color</label>
                <input
                  type="color"
                  value={effectiveAccent}
                  onChange={(e) => onAccentColorChange(e.target.value)}
                  className="w-12 h-10 cursor-pointer rounded border-0"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
      {/* Template Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>{previewTpl?.name} Template</span>
              {previewTpl && (
                <Badge variant="secondary" className="text-xs">
                  ATS {previewTpl.atsScore}%
                </Badge>
              )}
            </DialogTitle>
            {previewTpl && (
              <p className="text-sm text-muted-foreground">{previewTpl.description}</p>
            )}
          </DialogHeader>
          <div className="p-4 pt-2">
            <div className="border rounded-lg overflow-hidden bg-white" style={{ aspectRatio: '8.5/11' }}>
              {previewTemplate && renderMiniTemplate(
                previewTemplate,
                selectedTemplate === previewTemplate ? effectiveAccent : (previewTpl?.defaultAccent || "#2563eb")
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { templates };
