
import { Button } from "@/components/ui/button";

export const CTA = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join over 50,000 professionals who have accelerated their careers with our AI-powered platform.
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-orange-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-orange-600">
                Schedule Demo
              </Button>
            </div>
            <div className="mt-8 text-sm opacity-75">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-20 pt-12 border-t border-gray-200">
        <div className="container mx-auto text-center text-gray-600">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              CareerHub
            </span>
          </div>
          <p>&copy; 2024 CareerHub. All rights reserved.</p>
        </div>
      </footer>
    </section>
  );
};
