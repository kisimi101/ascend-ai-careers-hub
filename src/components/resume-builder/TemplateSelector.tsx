import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Star, Download, Check } from "lucide-react";

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

export const TemplateSelector = ({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Template</h3>
        <p className="text-muted-foreground text-sm">
          Select a professional template that matches your industry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`group cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-primary shadow-md' 
                : 'hover:ring-1 hover:ring-primary/30'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardContent className="p-4">
              {/* Template Preview */}
              <div className={`h-24 mb-3 rounded-lg ${template.preview} relative overflow-hidden`}>
                <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${template.color} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check size={12} />
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center ml-2`}>
                    <FileText size={12} className="text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-muted-foreground">
                      <Star className="text-yellow-500 mr-1" size={10} fill="currentColor" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Download className="mr-1" size={10} />
                      <span>{template.downloads}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    ATS {template.atsScore}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { templates };