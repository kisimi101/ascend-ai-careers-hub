
import { Card, CardContent } from "@/components/ui/card";

const jobImages = [
  {
    id: 1,
    title: "Software Engineer",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    description: "Building the future with code"
  },
  {
    id: 2,
    title: "Product Manager",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
    description: "Leading innovative solutions"
  },
  {
    id: 3,
    title: "Data Scientist",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
    description: "Turning data into insights"
  },
  {
    id: 4,
    title: "UX Designer",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
    description: "Crafting user experiences"
  },
  {
    id: 5,
    title: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    description: "Driving growth strategies"
  },
  {
    id: 6,
    title: "Business Analyst",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    description: "Analyzing business solutions"
  }
];

export const JobShowcase = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Find Your
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {" "}Career{" "}
            </span>
            Tonight
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream careers with our AI-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {jobImages.map((job) => (
            <Card key={job.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={job.image} 
                    alt={job.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-200">{job.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-semibold hover:shadow-lg transition-shadow cursor-pointer">
            🎯 Find Your Career
          </div>
        </div>
      </div>
    </section>
  );
};
