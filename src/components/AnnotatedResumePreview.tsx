import { motion } from "framer-motion";

const AnnotationLine = ({
  startX,
  startY,
  endX,
  endY,
  label,
  sublabel,
  side,
  delay = 0,
}: {
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  label: string;
  sublabel?: string;
  side: "left" | "right";
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="absolute pointer-events-none"
      style={{ top: 0, left: 0, width: "100%", height: "100%" }}
    >
      {/* Dot on resume */}
      <div
        className="absolute w-2.5 h-2.5 rounded-full bg-primary border-2 border-primary-foreground shadow-md z-20"
        style={{ left: startX, top: startY, transform: "translate(-50%, -50%)" }}
      />

      {/* SVG line */}
      <svg
        className="absolute inset-0 w-full h-full z-10 overflow-visible"
        preserveAspectRatio="none"
      >
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeDasharray="6 3"
          opacity={0.7}
        />
      </svg>

      {/* Label */}
      <div
        className={`absolute z-20 ${side === "left" ? "text-right pr-2" : "text-left pl-2"}`}
        style={{
          left: side === "right" ? endX : undefined,
          right: side === "left" ? `calc(100% - ${endX})` : undefined,
          top: endY,
          transform: "translateY(-50%)",
        }}
      >
        <div className="bg-card/90 backdrop-blur-sm border border-border/60 rounded-lg px-3 py-1.5 shadow-lg">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{label}</span>
          {sublabel && (
            <span className="block text-[10px] text-muted-foreground leading-tight mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const AnnotatedResumePreview = () => {
  return (
    <div className="relative max-w-5xl mx-auto mt-10 mb-6">
      {/* Glow effect behind resume */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl blur-3xl" />

      <div className="relative flex items-start justify-center">
        {/* Resume Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-[480px] mx-auto"
        >
          {/* Blueprint grid overlay */}
          <div className="absolute -inset-8 rounded-2xl opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-border/40 overflow-hidden relative z-10">
            {/* Resume Content */}
            <div className="p-6 sm:p-8 text-sm leading-relaxed">
              {/* Header / Name Section */}
              <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-4 mb-4" id="resume-header">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Sarah Mitchell Johnson
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 space-x-2">
                  <span>sarah.johnson@email.com</span>
                  <span>•</span>
                  <span>(555) 123-4567</span>
                  <span>•</span>
                  <span>San Francisco, CA</span>
                </p>
                <div className="flex justify-center gap-3 mt-2 text-[10px] text-primary">
                  <span>linkedin.com/in/sarahjohnson</span>
                  <span>•</span>
                  <span>sarahjohnson.dev</span>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="mb-4" id="resume-summary">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                  <span className="w-4 h-px bg-primary" />
                  Professional Summary
                  <span className="flex-1 h-px bg-primary/20" />
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Results-driven Senior Product Designer with 8+ years of experience crafting user-centered 
                  digital experiences for SaaS platforms. Led cross-functional teams that increased user 
                  engagement by 40% and reduced churn by 25%. Expert in design systems, prototyping, 
                  and data-driven UX research methodologies.
                </p>
              </div>

              {/* Experience */}
              <div className="mb-4" id="resume-experience">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                  <span className="w-4 h-px bg-primary" />
                  Experience
                  <span className="flex-1 h-px bg-primary/20" />
                </h4>

                <div className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200">Senior Product Designer</h5>
                    <span className="text-[10px] text-slate-400">2021 – Present</span>
                  </div>
                  <p className="text-[10px] text-primary/80 font-medium">TechVision Inc. — San Francisco, CA</p>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 space-y-0.5 list-none">
                    <li className="flex gap-1.5"><span className="text-primary mt-0.5">▸</span>Led redesign of core product dashboard, improving task completion rate by 35%</li>
                    <li className="flex gap-1.5"><span className="text-primary mt-0.5">▸</span>Managed a design system used by 12 product teams across 3 business units</li>
                    <li className="flex gap-1.5"><span className="text-primary mt-0.5">▸</span>Conducted 50+ user interviews and synthesized findings into actionable insights</li>
                  </ul>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200">UX Designer</h5>
                    <span className="text-[10px] text-slate-400">2018 – 2021</span>
                  </div>
                  <p className="text-[10px] text-primary/80 font-medium">CloudSync Solutions — Austin, TX</p>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 space-y-0.5 list-none">
                    <li className="flex gap-1.5"><span className="text-primary mt-0.5">▸</span>Designed onboarding flow that increased free-to-paid conversion by 22%</li>
                    <li className="flex gap-1.5"><span className="text-primary mt-0.5">▸</span>Collaborated with engineering to ship 15+ features per quarter</li>
                  </ul>
                </div>
              </div>

              {/* Education */}
              <div className="mb-4" id="resume-education">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                  <span className="w-4 h-px bg-primary" />
                  Education
                  <span className="flex-1 h-px bg-primary/20" />
                </h4>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200">B.S. in Human-Computer Interaction</h5>
                    <p className="text-[10px] text-primary/80 font-medium">Stanford University</p>
                  </div>
                  <span className="text-[10px] text-slate-400">2014 – 2018</span>
                </div>
              </div>

              {/* Skills */}
              <div id="resume-skills">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                  <span className="w-4 h-px bg-primary" />
                  Skills
                  <span className="flex-1 h-px bg-primary/20" />
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Figma", "Design Systems", "Prototyping", "User Research",
                    "A/B Testing", "Wireframing", "React", "Accessibility",
                    "Data Analysis", "Agile/Scrum"
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] rounded-md font-medium border border-primary/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Annotations */}
          {/* Header annotation - right side */}
          <AnnotationLine
            startX="75%"
            startY="5%"
            endX="105%"
            endY="3%"
            label="Header"
            sublabel="Name, contact & links"
            side="right"
            delay={0.3}
          />

          {/* Summary annotation - left side */}
          <AnnotationLine
            startX="25%"
            startY="18%"
            endX="-5%"
            endY="16%"
            label="Summary"
            sublabel="Professional overview"
            side="left"
            delay={0.5}
          />

          {/* Experience annotation - right side */}
          <AnnotationLine
            startX="80%"
            startY="38%"
            endX="105%"
            endY="36%"
            label="Experience"
            sublabel="Roles & achievements"
            side="right"
            delay={0.7}
          />

          {/* Bullet points annotation - left side */}
          <AnnotationLine
            startX="15%"
            startY="50%"
            endX="-5%"
            endY="48%"
            label="Bullet Points"
            sublabel="Quantified impact"
            side="left"
            delay={0.9}
          />

          {/* Education annotation - right side */}
          <AnnotationLine
            startX="70%"
            startY="75%"
            endX="105%"
            endY="73%"
            label="Education"
            sublabel="Degrees & institutions"
            side="right"
            delay={1.1}
          />

          {/* Skills annotation - left side */}
          <AnnotationLine
            startX="30%"
            startY="90%"
            endX="-5%"
            endY="88%"
            label="Skills"
            sublabel="Technical & soft skills"
            side="left"
            delay={1.3}
          />
        </motion.div>
      </div>

      {/* Bottom caption */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5 }}
        className="text-center text-xs text-muted-foreground mt-6"
      >
        ✨ Built with CareerHub AI — Every section optimized for ATS compatibility
      </motion.p>
    </div>
  );
};
