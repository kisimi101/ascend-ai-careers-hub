
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Star, Crown } from "lucide-react";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    description: "Explore all tools with limited access",
    icon: Zap,
    gradient: "from-zinc-500 to-zinc-600",
    features: [
      "3 Resume Templates",
      "AI Resume Builder (preview only)",
      "Resume Checker & Grader",
      "Cover Letter Generator (1/day)",
      "Job Search Engine",
      "Skills Assessment Quiz",
    ],
    limitations: ["No resume downloads", "Limited AI generations", "No priority support"],
    cta: "Get Started Free"
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "Everything you need to land your dream job",
    icon: Star,
    gradient: "from-primary to-primary/80",
    popular: true,
    features: [
      "Unlimited Resume Templates",
      "Unlimited PDF/DOCX/PNG Downloads",
      "AI Resume Optimizer & Enhancer",
      "ATS Score Analysis",
      "AI Interview Practice",
      "Unlimited Cover Letters",
      "LinkedIn Profile Optimizer",
      "Company Research Tool",
      "Job Alerts & Tracking",
      "Priority Support",
    ],
    limitations: [],
    cta: "Start 7-Day Free Trial"
  },
  {
    name: "Enterprise",
    price: "$39",
    period: "/month",
    description: "For career coaches, agencies & teams",
    icon: Crown,
    gradient: "from-purple-500 to-indigo-500",
    features: [
      "Everything in Pro",
      "Up to 25 Team Members",
      "Team Analytics Dashboard",
      "Custom Resume Branding",
      "Portfolio Builder",
      "Career Path Planner",
      "API Access",
      "Dedicated Account Manager",
      "White-label Options",
    ],
    limitations: [],
    cta: "Contact Sales"
  }
];

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing-section" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              💰 Pricing Plans
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Choose Your
            <span className="text-gradient-primary">
              {" "}Success Plan
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Unlock your career potential with our flexible pricing options designed for every stage of your journey
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-card rounded-full p-1 shadow-lg border border-border">
              <button
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === "monthly"
                    ? "btn-gradient"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === "yearly"
                    ? "btn-gradient"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly
                <span className="ml-2 bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full text-xs">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative group hover:shadow-2xl transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden ${
                plan.popular ? "scale-105 ring-2 ring-primary/30" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 btn-gradient px-6 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <plan.icon className="text-white" size={32} />
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="text-4xl font-bold mb-2 text-foreground">
                  {billingCycle === "yearly" && plan.name !== "Free" 
                    ? `$${Math.floor(parseInt(plan.price.replace("$", "")) * 0.8)}`
                    : plan.price
                  }
                  <span className="text-lg text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-foreground/80">
                      <Check className="text-emerald-500 mr-3 flex-shrink-0" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "btn-gradient"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  } transition-all`}
                  onClick={() => {
                    if (plan.name === "Free") window.location.href = '/tools';
                    else if (plan.name === "Enterprise") window.location.href = '/tools';
                    else window.location.href = '/tools';
                  }}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include our 30-day money-back guarantee
          </p>
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
