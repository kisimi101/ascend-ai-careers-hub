import { Button } from "@/components/ui/button";
import heroAsset from "@/assets/hero-careernow.png.asset.json";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 md:pt-28 pb-10 md:pb-16 bg-background">
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <img
            src={heroAsset.url}
            alt="CareerNow — Better resume. More opportunities."
            className="w-full h-auto rounded-2xl"
            loading="eager"
            decoding="async"
            // @ts-ignore
            fetchpriority="high"
          />

          {/* Clickable overlay over the dark CTA in the image */}
          <button
            type="button"
            onClick={() => navigate("/get-started")}
            aria-label="Get started for free"
            className="absolute left-1/2 -translate-x-1/2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ top: "62.5%", width: "22%", height: "7%" }}
          />
        </motion.div>

        <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
          <Button
            size="lg"
            className="btn-gradient h-12 px-7 text-base"
            onClick={() => navigate("/resume-checker")}
          >
            Check if your resume beats ATS — free
            <ArrowRight className="ml-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-7 text-base"
            onClick={() => navigate("/smart-apply")}
          >
            Try Smart Apply free →
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-12 px-7 text-base"
            onClick={() =>
              document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View pricing
          </Button>
        </div>
      </div>
    </section>
  );
};
