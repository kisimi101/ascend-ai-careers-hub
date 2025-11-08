import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, MoveUp, MoveDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SectionType = "experience" | "education" | "skills" | "summary";

interface SectionReorderProps {
  sections: SectionType[];
  onReorder: (sections: SectionType[]) => void;
}

const sectionLabels: Record<SectionType, string> = {
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  summary: "Professional Summary"
};

export const SectionReorder = ({ sections, onReorder }: SectionReorderProps) => {
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    onReorder(newSections);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Order</CardTitle>
        <CardDescription>
          Customize the order of sections in your resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section}
            className="flex items-center gap-3 p-3 border rounded-lg hover:border-primary/50 transition-colors"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium">{sectionLabels[section]}</div>
              <Badge variant="secondary" className="text-xs mt-1">
                Position {index + 1}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => moveSection(index, 'up')}
                disabled={index === 0}
              >
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => moveSection(index, 'down')}
                disabled={index === sections.length - 1}
              >
                <MoveDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
