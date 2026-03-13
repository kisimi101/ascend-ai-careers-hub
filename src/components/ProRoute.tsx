import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, CheckCircle2, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProRouteProps {
  children: React.ReactNode;
  featureName?: string;
}

const ProRoute: React.FC<ProRouteProps> = ({ children, featureName = "this feature" }) => {
  const { isPro, isLoading } = useSubscription();
  const { toast } = useToast();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsCheckoutLoading(true);
      const { createCheckout, POLAR_PRODUCTS } = await import("@/lib/polar");
      const url = await createCheckout(POLAR_PRODUCTS.pro);

      window.location.href = data.url;
    } catch (error: any) {
      toast({
        title: "Unable to start checkout",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isPro) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-24 pb-10">
      <Card className="w-full max-w-lg border-border/70">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Crown className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Upgrade to access {featureName}</CardTitle>
          <CardDescription>
            This section is available on Pro plans. Upgrade to unlock premium job search, networking, and advanced automation tools.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2.5">
            {[
              "Unlimited premium tool access",
              "Advanced job search and networking",
              "Smart Apply + bulk application workflows",
              "Download optimized resumes and cover letters",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <Button className="btn-gradient w-full" onClick={handleUpgrade} disabled={isCheckoutLoading}>
            {isCheckoutLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProRoute;
