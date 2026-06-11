import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Mail,
  Briefcase,
  Zap,
  Video,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    name: "Resume Builder",
    desc: "ATS-friendly templates with AI bullet suggestions.",
    href: "/resume-builder",
    icon: FileText,
  },
  {
    name: "Cover Letter Generator",
    desc: "Tailored cover letters in seconds for any role.",
    href: "/cover-letter-generator",
    icon: Mail,
  },
  {
    name: "Job Tracker",
    desc: "Track every application, interview, and follow-up.",
    href: "/job-tracker",
    icon: Briefcase,
  },
  {
    name: "Smart Apply",
    desc: "One pipeline: optimize, match jobs, write covers.",
    href: "/smart-apply",
    icon: Zap,
  },
  {
    name: "Video Resume",
    desc: "Record a 60-second pitch recruiters actually watch.",
    href: "/video-resume",
    icon: Video,
    highlight: true,
  },
  {
    name: "Resume Checker",
    desc: "Free ATS scan with line-by-line fixes.",
    href: "/resume-checker",
    icon: ShieldCheck,
  },
];

export const ToolsGrid = () => {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Every tool you need to land the job
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Use any of them free — no signup required to try.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {tools.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={t.href}
                  className={`group relative block h-full rounded-2xl border bg-card/60 backdrop-blur p-5 hover:shadow-lg transition-all ${
                    t.highlight ? "border-primary/40 ring-1 ring-primary/20" : "border-border/60"
                  }`}
                >
                  {t.highlight && (
                    <span className="absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide">
                      <Sparkles className="h-3 w-3" />
                      New
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{t.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                        Open <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ToolsGrid;