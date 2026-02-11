
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content: "CareerHub's AI resume builder helped me land my dream job at Google. The interview prep was incredible!",
    avatar: "SC"
  },
  {
    name: "Marcus Rodriguez",
    role: "Product Manager at Stripe",
    content: "The AI career coach feature is like having a personal mentor 24/7. It completely transformed my approach to job searching.",
    avatar: "MR"
  },
  {
    name: "Emily Foster",
    role: "Data Scientist at Meta",
    content: "I increased my interview success rate by 300% using their mock interview simulator. The feedback is incredibly detailed.",
    avatar: "EF"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-primary/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Trusted by
            <span className="text-gradient-primary">
              {" "}Successful Professionals
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of job seekers who have accelerated their careers with our AI-powered platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-foreground/80 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
