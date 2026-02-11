import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, TrendingUp, FileText, Users, 
  ArrowUpRight, Calendar, Target, BarChart3 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const stats = [
  {
    label: "Jobs Tracked",
    value: "2,847",
    change: "+12%",
    icon: Briefcase,
    color: "from-primary to-primary/80",
  },
  {
    label: "Resumes Built",
    value: "1,253",
    change: "+8%",
    icon: FileText,
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Interviews Scheduled",
    value: "489",
    change: "+24%",
    icon: Calendar,
    color: "from-violet-500 to-purple-500",
  },
  {
    label: "Offer Rate",
    value: "73%",
    change: "+5%",
    icon: Target,
    color: "from-amber-500 to-orange-500",
  },
];

const recentActivity = [
  { action: "Resume optimized", tool: "AI Resume Builder", time: "2 min ago", icon: FileText },
  { action: "Interview scheduled", tool: "Job Tracker", time: "1 hr ago", icon: Calendar },
  { action: "Skills assessed", tool: "Skills Gap Analyzer", time: "3 hrs ago", icon: BarChart3 },
  { action: "Company saved", tool: "Company Research", time: "5 hrs ago", icon: Users },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const DashboardPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--muted-foreground)/0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
            📊 Live Dashboard Preview
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Career Command
            <span className="text-gradient-primary block">Center</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track every aspect of your job search in one powerful, AI-driven dashboard
          </p>
        </div>

        {/* Dashboard Mock */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} variants={item}>
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <stat.icon className="text-white" size={20} />
                      </div>
                      <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                        <TrendingUp size={12} />
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Activity + Chart Row */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Mini Chart Area */}
            <motion.div variants={item} className="lg:col-span-3">
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Application Trends</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">Last 7 days</span>
                  </div>
                  {/* Simulated bar chart */}
                  <div className="flex items-end gap-3 h-40">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          className="w-full rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/40"
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={item} className="lg:col-span-2">
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <activity.icon className="text-primary" size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.tool} · {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div variants={item} className="text-center mt-10">
            <Button
              size="lg"
              className="btn-gradient px-8 py-4 text-lg gap-2"
              onClick={() => navigate('/dashboard')}
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
