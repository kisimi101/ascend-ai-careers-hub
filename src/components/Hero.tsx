import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 md:pt-56 pb-16 md:pb-24 bg-background overflow-hidden">
      <div className="container mx-auto container-padding relative min-h-[760px] lg:min-h-[820px]">
        {/* Floating: Resume Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden lg:block absolute top-4 left-0 xl:left-4 w-[220px] rounded-3xl p-6 text-left shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
          style={{ background: "hsl(var(--secondary))" }}
        >
          <h4 className="text-base font-semibold text-foreground/80">Resume Score</h4>
          <div className="text-6xl font-extrabold text-primary my-3 leading-none">88</div>
          <p className="text-sm font-medium text-foreground/70">Very Good</p>
          <div className="mt-4 h-2 w-full rounded-full bg-background/60 overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: "88%" }} />
          </div>
        </motion.div>

        {/* Floating: Cover Letter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="hidden lg:block absolute top-[340px] left-0 xl:left-8 w-[240px] rounded-3xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
          style={{ background: "hsl(var(--secondary))" }}
        >
          <h4 className="text-base font-semibold text-foreground/80 mb-3">Cover Letter</h4>
          <div className="bg-card rounded-2xl p-4 space-y-1.5">
            <div className="h-2 w-full rounded bg-muted" />
            <div className="h-2 w-5/6 rounded bg-muted" />
            <div className="h-2 w-4/6 rounded bg-muted" />
            <div className="h-2 w-5/6 rounded bg-muted" />
          </div>
          <button
            onClick={() => navigate("/cover-letter-generator")}
            className="w-full mt-4 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition"
          >
            <Sparkles className="w-4 h-4" /> Generate
          </button>
        </motion.div>

        {/* Floating: To-do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block absolute top-[260px] right-0 xl:right-4 w-[280px] rounded-3xl p-7 text-left shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
          style={{ background: "#ffe57f" }}
        >
          <h4 className="text-lg font-bold text-foreground mb-4">To-do List</h4>
          <ul className="space-y-3">
            {["Optimize Resume", "Find Jobs", "Apply Now"].map((t) => (
              <li key={t} className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="w-5 h-5 text-primary" /> {t}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <h1
            className="font-black tracking-tight text-foreground"
            style={{
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              fontSize: "clamp(2.75rem, 8vw, 6.5rem)",
              lineHeight: 0.95,
            }}
          >
            Better resume.
            <span className="block text-primary">More opportunities.</span>
          </h1>
          <p className="mt-8 text-lg sm:text-2xl text-muted-foreground leading-relaxed">
            Create a resume that stands out and apply to the right jobs with ease.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate("/get-started")}
              className="h-14 px-9 text-lg font-bold rounded-2xl bg-foreground text-background hover:bg-foreground/90"
            >
              Get started for free 🚀
            </Button>
            <p className="text-sm text-muted-foreground">No credit card required</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/resume-checker")}
              className="rounded-xl"
            >
              Check ATS score — free <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/smart-apply")}
              className="rounded-xl"
            >
              Try Smart Apply →
            </Button>
          </div>
        </motion.div>

        {/* Floating: Job Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 w-full max-w-[520px] mt-12 lg:mt-0 mx-auto bg-card rounded-3xl p-7 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-border"
        >
          <h3 className="text-3xl sm:text-4xl font-bold text-foreground">UX Designer</h3>
          <p className="mt-2 text-lg text-foreground/80 font-medium">Design Studio</p>
          <p className="mt-1 text-sm text-muted-foreground inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> San Francisco, CA · Full-time
          </p>
          <Button
            onClick={() => navigate("/job-search")}
            className="w-full mt-5 h-12 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90"
          >
            Apply Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
