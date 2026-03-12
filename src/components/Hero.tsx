import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-careerhub.jpg";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-24 md:pt-28 pb-16 md:pb-24">
      {/* Image-first hero */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Abstract career growth path"
          className="h-full w-full object-cover"
          loading="eager"
        />
        {/* readability overlay */}
        <div className="absolute inset-0 bg-background/55" />
        <div className="absolute inset-0 hero-vignette" />
        <div className="absolute inset-0 surface-grid opacity-60" />
      </div>

      <div className="container mx-auto container-padding relative">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur px-4 py-2 text-sm text-muted-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            AI-powered career toolkit — built for job seekers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
            className="mt-6 text-3xl sm:text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-foreground"
          >
            Move faster from
            <span className="text-gradient-primary block">application → offer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
            className="mt-5 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            Build ATS-friendly resumes, generate tailored cover letters, track applications, and practice interviews — all in one modern platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Button
              size="lg"
              className="btn-gradient h-12 px-7 text-base"
              onClick={() => navigate("/get-started")}
            >
              Build your resume
              <ArrowRight className="ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-7 text-base bg-card/40 backdrop-blur"
              onClick={() =>
                document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View pricing
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: "easeOut" }}
            className="mt-6 flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Built-in dashboard + trackers
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Fast AI workflows
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
