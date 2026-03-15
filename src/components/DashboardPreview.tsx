import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

/* ── data ── */
const pieData = [
  { name: "Applied", value: 42, color: "hsl(22, 65%, 42%)" },
  { name: "Interview", value: 18, color: "hsl(152, 55%, 33%)" },
  { name: "Offer", value: 7, color: "hsl(205, 65%, 42%)" },
  { name: "Rejected", value: 12, color: "hsl(220, 10%, 46%)" },
];

const trendData = [
  { week: "W1", applications: 8, interviews: 2 },
  { week: "W2", applications: 12, interviews: 3 },
  { week: "W3", applications: 10, interviews: 5 },
  { week: "W4", applications: 18, interviews: 4 },
  { week: "W5", applications: 15, interviews: 7 },
  { week: "W6", applications: 22, interviews: 9 },
  { week: "W7", applications: 20, interviews: 11 },
];

const upcomingInterviews = [
  { company: "Stripe", role: "Senior Engineer", date: "Mar 17", status: "Confirmed" },
  { company: "Vercel", role: "Frontend Lead", date: "Mar 19", status: "Pending" },
  { company: "Linear", role: "Full Stack Dev", date: "Mar 22", status: "Confirmed" },
];

const careerGoals = [
  { label: "Resume Score", value: 88, target: 100 },
  { label: "Applications Sent", value: 42, target: 50 },
  { label: "Interviews Booked", value: 11, target: 15 },
  { label: "Network Outreach", value: 23, target: 40 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ── Gauge Component ── */
const CareerHealthGauge = ({ score }: { score: number }) => {
  const angle = (score / 100) * 180;
  const r = 70;
  const cx = 100;
  const cy = 90;
  const strokeW = 22;
  const rad = (a: number) => ((180 - a) * Math.PI) / 180;
  const arcPath = (startAngle: number, endAngle: number) => {
    const x1 = cx + r * Math.cos(rad(startAngle));
    const y1 = cy - r * Math.sin(rad(startAngle));
    const x2 = cx + r * Math.cos(rad(endAngle));
    const y2 = cy - r * Math.sin(rad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
  };

  const grade = score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";

  return (
    <div className="flex flex-col items-center pt-2">
      <svg viewBox="0 0 200 115" className="w-full max-w-[260px]">
        {/* Background arc */}
        <path d={arcPath(0, 180)} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeW} strokeLinecap="round" />
        {/* Score arc */}
        <motion.path
          d={arcPath(0, angle)}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeW}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* Grade label */}
        <text x={cx} y={cy - 16} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 13, fontFamily: "Space Grotesk" }}>
          Grade {grade}
        </text>
        {/* Score number */}
        <text x={cx} y={cy + 16} textAnchor="middle" className="fill-foreground" style={{ fontSize: 38, fontWeight: 700, fontFamily: "Space Grotesk" }}>
          {score}
        </text>
      </svg>
      <span className="text-sm text-muted-foreground -mt-2">Points</span>
    </div>
  );
};

/* ── Main Component ── */
export const DashboardPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding container-padding relative overflow-hidden">
      <div className="absolute inset-0 surface-grid opacity-70" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
            📊 Live Dashboard Preview
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-foreground">
            Your Career Command
            <span className="text-gradient-primary block">Center</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Track every aspect of your job search in one powerful, AI-driven dashboard
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          {/* Row 1 — 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Career Health Score */}
            <motion.div variants={item}>
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-foreground mb-2">Career Health Score</h3>
                  <CareerHealthGauge score={85} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Application Categories */}
            <motion.div variants={item}>
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-foreground mb-2">Application Status</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-28 h-28 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={48} dataKey="value" strokeWidth={0}>
                            {pieData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {pieData.map((d) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                          <span className="text-muted-foreground">{d.name}</span>
                          <span className="text-foreground font-semibold ml-auto">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Interviews */}
            <motion.div variants={item}>
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-foreground mb-3">Upcoming Interviews</h3>
                  <div className="space-y-3">
                    {upcomingInterviews.map((iv) => (
                      <div key={iv.company} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{iv.company}</p>
                          <p className="text-xs text-muted-foreground">{iv.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{iv.date}</p>
                          <p className={`text-[10px] font-medium ${iv.status === "Confirmed" ? "text-success" : "text-warning"}`}>
                            {iv.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Career Goals */}
            <motion.div variants={item}>
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-foreground mb-3">Career Goals</h3>
                  <div className="space-y-3">
                    {careerGoals.slice(0, 3).map((goal) => (
                      <div key={goal.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">{goal.label}</span>
                          <span className="text-xs font-semibold text-foreground">{goal.value}/{goal.target}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: goal.value / goal.target >= 0.8
                                ? "hsl(var(--success))"
                                : goal.value / goal.target >= 0.5
                                  ? "hsl(var(--primary))"
                                  : "hsl(var(--warning))",
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(goal.value / goal.target) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Row 2 — Goals detail + Trend chart */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Extended Goals */}
            <motion.div variants={item} className="lg:col-span-2">
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-foreground mb-4">Weekly Targets</h3>
                  <div className="space-y-4">
                    {careerGoals.map((goal) => (
                      <div key={goal.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-foreground">{goal.label}</span>
                          <span className="text-sm font-bold text-foreground">{Math.round((goal.value / goal.target) * 100)}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: goal.value / goal.target >= 0.8
                                ? "hsl(var(--success))"
                                : goal.value / goal.target >= 0.5
                                  ? "hsl(var(--primary))"
                                  : "hsl(var(--warning))",
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(goal.value / goal.target) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Application Trend */}
            <motion.div variants={item} className="lg:col-span-3">
              <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-foreground mb-4">Application Trend</h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="week" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Line type="monotone" dataKey="applications" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                        <Line type="monotone" dataKey="interviews" stroke="hsl(var(--success))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--success))" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-3 h-0.5 rounded bg-primary" /> Applications
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-3 h-0.5 rounded bg-success" /> Interviews
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-10">
            <Button
              size="lg"
              className="btn-gradient px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg gap-2 w-full sm:w-auto"
              onClick={() => navigate("/resume-builder")}
            >
              Build Your Resume
              <ArrowUpRight size={18} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg gap-2 w-full sm:w-auto"
              onClick={() => navigate("/dashboard")}
            >
              Open Your Dashboard
              <ArrowUpRight size={18} />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
