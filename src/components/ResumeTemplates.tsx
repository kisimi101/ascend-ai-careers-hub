
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { FileText, Star, Download } from "lucide-react";
import { useEffect, useState } from "react";

const resumeTemplates = [
  {
    id: 1,
    name: "Modern Professional",
    description: "Clean, ATS-friendly design perfect for corporate roles",
    rating: 4.9,
    downloads: "12K+",
    preview: "bg-gradient-to-br from-blue-50 to-indigo-100",
    color: "from-blue-500 to-indigo-500",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=600&fit=crop"
  },
  {
    id: 2,
    name: "Creative Designer",
    description: "Bold layout ideal for creative and design positions",
    rating: 4.8,
    downloads: "8K+",
    preview: "bg-gradient-to-br from-purple-50 to-pink-100",
    color: "from-purple-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=400&h=600&fit=crop"
  },
  {
    id: 3,
    name: "Tech Specialist",
    description: "Minimalist template tailored for tech professionals",
    rating: 4.9,
    downloads: "15K+",
    preview: "bg-gradient-to-br from-green-50 to-teal-100",
    color: "from-green-500 to-teal-500",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=600&fit=crop"
  },
  {
    id: 4,
    name: "Executive Leader",
    description: "Sophisticated design for senior management roles",
    rating: 4.7,
    downloads: "6K+",
    preview: "bg-gradient-to-br from-orange-50 to-red-100",
    color: "from-orange-500 to-red-500",
    image: "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=400&h=600&fit=crop"
  },
  {
    id: 5,
    name: "Fresh Graduate",
    description: "Perfect for entry-level positions and internships",
    rating: 4.8,
    downloads: "10K+",
    preview: "bg-gradient-to-br from-cyan-50 to-blue-100",
    color: "from-cyan-500 to-blue-500",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=600&fit=crop"
  }
];

export const ResumeTemplates = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Auto-scroll functionality
    const interval = setInterval(() => {
      if (api) {
        api.scrollNext();
      }
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-20 px-6 bg-gray-50/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Perfect
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent block">
              Resume Template
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional, ATS-friendly templates designed by experts to help you stand out
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {resumeTemplates.map((template) => (
                <CarouselItem key={template.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                      {/* Template Preview */}
                      <div className="h-64 relative overflow-hidden bg-gray-100">
                        <img 
                          src={template.image} 
                          alt={`${template.name} resume template`}
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className={`absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-r ${template.color} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
                      </div>

                      {/* Template Info */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {template.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {template.description}
                            </p>
                          </div>
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${template.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <FileText className="text-white" size={20} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Star className="text-yellow-400 mr-1" size={14} fill="currentColor" />
                              <span>{template.rating}</span>
                            </div>
                            <div className="flex items-center">
                              <Download className="text-gray-400 mr-1" size={14} />
                              <span>{template.downloads}</span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          className={`w-full bg-gradient-to-r ${template.color} hover:opacity-90 transition-opacity`}
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
