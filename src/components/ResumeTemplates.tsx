
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Star, Download, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ModernTemplate } from "@/components/resume-builder/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/resume-builder/templates/ClassicTemplate";
import { TechTemplate } from "@/components/resume-builder/templates/TechTemplate";
import { CreativeTemplate } from "@/components/resume-builder/templates/CreativeTemplate";
import { ExecutiveTemplate } from "@/components/resume-builder/templates/ExecutiveTemplate";
import { MinimalistTemplate } from "@/components/resume-builder/templates/MinimalistTemplate";
import { ResumeData } from "@/components/resume-builder/types";

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

const resumeTemplates = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    description: "Clean, ATS-friendly design perfect for corporate roles",
    rating: 4.9,
    downloads: "12K+",
    atsScore: 95,
    accent: "#2563eb",
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "classic-minimal",
    name: "Classic Minimal",
    description: "Traditional layout with modern typography",
    rating: 4.8,
    downloads: "18K+",
    atsScore: 98,
    accent: "#374151",
    color: "from-gray-600 to-gray-700",
  },
  {
    id: "tech-specialist",
    name: "Tech Specialist",
    description: "Minimalist template tailored for tech professionals",
    rating: 4.9,
    downloads: "15K+",
    atsScore: 97,
    accent: "#059669",
    color: "from-emerald-600 to-teal-600",
  },
  {
    id: "creative-designer",
    name: "Creative Designer",
    description: "Bold layout ideal for creative and design positions",
    rating: 4.7,
    downloads: "8K+",
    atsScore: 85,
    accent: "#6d28d9",
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Commanding dark header for senior & leadership roles",
    rating: 4.8,
    downloads: "6K+",
    atsScore: 96,
    accent: "#1e293b",
    color: "from-gray-800 to-gray-600",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Maximum whitespace for a calm, elegant impression",
    rating: 4.6,
    downloads: "5K+",
    atsScore: 99,
    accent: "#737373",
    color: "from-gray-400 to-gray-300",
  },
];

const renderTemplate = (id: string, accent: string) => {
  const props = { resumeData: sampleData, accentColor: accent };
  switch (id) {
    case "classic-minimal": return <ClassicTemplate {...props} />;
    case "tech-specialist": return <TechTemplate {...props} />;
    case "creative-designer": return <CreativeTemplate {...props} />;
    case "executive": return <ExecutiveTemplate {...props} />;
    case "minimalist": return <MinimalistTemplate {...props} />;
    default: return <ModernTemplate {...props} />;
  }
};

export const ResumeTemplates = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    const interval = setInterval(() => {
      if (api) api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Choose Your Perfect
            <span className="text-gradient-primary block">
              Resume Template
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional, ATS-friendly templates designed by experts to help you stand out
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {resumeTemplates.map((template) => (
                <CarouselItem key={template.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="group hover:shadow-2xl transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      {/* Live mini template preview */}
                      <div className="h-64 relative overflow-hidden bg-white rounded-t-lg">
                        <div
                          className="origin-top-left pointer-events-none"
                          style={{ transform: 'scale(0.32)', width: '700px', height: '900px' }}
                        >
                          {renderTemplate(template.id, template.accent)}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
                        <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-background/80 backdrop-blur-sm">
                          <Shield size={10} className="mr-1" />
                          ATS {template.atsScore}%
                        </Badge>
                      </div>

                      <div className="p-5">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {template.name}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {template.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Star className="text-yellow-500 mr-1" size={14} fill="currentColor" />
                              <span>{template.rating}</span>
                            </div>
                            <div className="flex items-center">
                              <Download className="mr-1" size={14} />
                              <span>{template.downloads}</span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 transition-opacity"
                          onClick={() => window.location.href = '/resume-builder'}
                        >
                          Use This Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="px-8" onClick={() => window.location.href = '/resume-examples'}>
            View All Templates
          </Button>
        </div>
      </div>
    </section>
  );
};
