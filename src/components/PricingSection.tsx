
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Star, Crown } from "lucide-react";
import { useState } from "react";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    icon: Zap,
    gradient: "from-gray-500 to-gray-600",
    features: [
      "3 Resume Templates",
      "Basic AI Resume Builder",
      "Job Search Engine Access",
      "Community Support",
      "5 Applications per month"
    ],
    limitations: ["Limited templates", "Basic AI features", "No priority support"]
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Most popular for job seekers",
    icon: Star,
    gradient: "from-orange-500 to-red-500",
    popular: true,
    features: [
      "Unlimited Resume Templates",
      "Advanced AI Resume Builder",
      "AI Interview Simulator",
      "24/7 AI Career Coach",
      "Unlimited Applications",
      "ATS Optimization",
      "Priority Support"
    ],
    limitations: []
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    description: "For teams and organizations",
    icon: Crown,
    gradient: "from-purple-500 to-indigo-500",
    features: [
      "Everything in Pro",
      "Team Management",
      "Custom Branding",
      "Analytics Dashboard",
      "API Access",
      "Dedicated Account Manager",
      "Custom Integrations"
    ],
    limitations: []
  }
];

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
              💰 Pricing Plans
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {" "}Success Plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Unlock your career potential with our flexible pricing options designed for every stage of your journey
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-white rounded-full p-1 shadow-lg border">
              <button
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly
                <span className="ml-2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden ${
                plan.popular ? "scale-105 ring-2 ring-orange-200" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <plan.icon className="text-white" size={32} />
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="text-4xl font-bold mb-2">
                  {billingCycle === "yearly" && plan.name !== "Free" 
                    ? `$${Math.floor(parseInt(plan.price.replace("$", "")) * 0.8)}`
                    : plan.price
                  }
                  <span className="text-lg text-gray-500">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <Check className="text-green-500 mr-3 flex-shrink-0" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      : "bg-gray-900 hover:bg-gray-800"
                  } transition-all`}
                >
                  {plan.name === "Free" ? "Get Started" : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">
            All plans include our 30-day money-back guarantee
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
