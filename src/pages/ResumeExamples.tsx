import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Search, Eye, Download, Star, FileText, Briefcase, GraduationCap,
  Code, Palette, HeartPulse, DollarSign, ArrowRight, Sparkles, TrendingUp, Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ModernTemplate } from '@/components/resume-builder/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/resume-builder/templates/ClassicTemplate';
import { TechTemplate } from '@/components/resume-builder/templates/TechTemplate';
import { CreativeTemplate } from '@/components/resume-builder/templates/CreativeTemplate';
import { ExecutiveTemplate } from '@/components/resume-builder/templates/ExecutiveTemplate';
import { MinimalistTemplate } from '@/components/resume-builder/templates/MinimalistTemplate';
import { ResumeData } from '@/components/resume-builder/types';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface ResumeExample {
  id: number;
  title: string;
  category: string;
  experience: string;
  rating: number;
  downloads: number;
  description: string;
  tags: string[];
  accent: string;
  icon: React.ElementType;
  templateStyle: 'modern' | 'classic' | 'tech' | 'creative' | 'executive' | 'minimalist';
  content: {
    name: string;
    summary: string;
    experience: { title: string; company: string; duration: string; bullets: string[] }[];
    education: { degree: string; school: string; year: string }[];
    skills: string[];
  };
}

const categories = [
  { id: 'all', name: 'All Examples', icon: FileText },
  { id: 'technology', name: 'Technology', icon: Code },
  { id: 'marketing', name: 'Marketing', icon: Briefcase },
  { id: 'finance', name: 'Finance', icon: DollarSign },
  { id: 'healthcare', name: 'Healthcare', icon: HeartPulse },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'design', name: 'Design', icon: Palette },
];

const resumeExamples: ResumeExample[] = [
  {
    id: 1, title: 'Senior Software Engineer', category: 'technology', experience: 'Senior · 8+ yrs',
    rating: 4.9, downloads: 12543, description: 'Full-stack developer with deep React, Node.js, and cloud expertise.',
    tags: ['React', 'Node.js', 'AWS', 'Python', 'TypeScript', 'Docker'],
    accent: '221 83% 53%', icon: Code, templateStyle: 'modern',
    content: {
      name: 'Alex Johnson',
      summary: 'Results-driven Senior Software Engineer with 8+ years building scalable web apps. Expert in React, Node.js & cloud architecture. Led teams delivering high-impact products to 2M+ users.',
      experience: [
        { title: 'Senior Software Engineer', company: 'Tech Corp Inc.', duration: '2020 – Present', bullets: ['Led microservices architecture serving 2M+ daily users', 'Reduced page load time by 40% through performance optimization', 'Mentored 5 junior developers, improving team velocity by 25%'] },
        { title: 'Software Engineer', company: 'StartupXYZ', duration: '2016 – 2020', bullets: ['Built React dashboard processing $10M+ monthly transactions', 'Implemented CI/CD pipeline reducing deployment time by 60%', 'Developed RESTful APIs for mobile and web'] },
      ],
      education: [{ degree: 'B.S. Computer Science', school: 'Stanford University', year: '2016' }],
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker', 'GraphQL', 'Python'],
    },
  },
  {
    id: 2, title: 'Digital Marketing Manager', category: 'marketing', experience: 'Mid · 5+ yrs',
    rating: 4.8, downloads: 8876, description: 'Data-driven marketer with SEO, PPC, and content strategy wins across SaaS and e-commerce.',
    tags: ['SEO', 'Google Ads', 'Analytics', 'Content Strategy', 'Email Marketing'],
    accent: '262 83% 58%', icon: Briefcase, templateStyle: 'creative',
    content: {
      name: 'Sarah Mitchell',
      summary: 'Creative Digital Marketing Manager with 5+ years driving brand growth through data-driven strategies. Grew organic traffic 150% and managed $500K annual ad budgets at 3.5× ROAS.',
      experience: [
        { title: 'Digital Marketing Manager', company: 'Growth Agency', duration: '2021 – Present', bullets: ['Increased organic traffic by 150% through comprehensive SEO strategy', 'Managed $500K annual PPC budget with 3.5× ROAS', 'Led content team producing 50+ pieces monthly'] },
        { title: 'Marketing Specialist', company: 'E-commerce Brand', duration: '2018 – 2021', bullets: ['Grew email list from 10K to 100K subscribers', 'Achieved 25% increase in customer retention via lifecycle campaigns', 'Launched influencer program generating $2M attributed revenue'] },
      ],
      education: [{ degree: 'B.A. Marketing', school: 'Northwestern University', year: '2018' }],
      skills: ['Google Ads', 'SEO', 'Analytics', 'Content Strategy', 'Social Media', 'Email Marketing', 'CRM', 'A/B Testing'],
    },
  },
  {
    id: 3, title: 'Financial Analyst', category: 'finance', experience: 'Entry · 0-2 yrs',
    rating: 4.7, downloads: 6432, description: 'Recent Ivy League graduate with investment banking internship experience and advanced financial modeling skills.',
    tags: ['Excel', 'Financial Modeling', 'SQL', 'Bloomberg', 'Valuation'],
    accent: '142 71% 45%', icon: DollarSign, templateStyle: 'classic',
    content: {
      name: 'James Park',
      summary: 'Detail-oriented Financial Analyst with strong foundation in financial modeling and data analysis. Goldman Sachs internship experience; proven ability to deliver actionable insights under pressure.',
      experience: [
        { title: 'Financial Analyst Intern', company: 'Goldman Sachs', duration: 'Summer 2023', bullets: ['Built financial models for M&A transactions totaling $500M', 'Conducted industry research supporting 3 live client pitches', 'Automated weekly reporting saving 10+ hours per week'] },
        { title: 'Research Assistant', company: 'University Finance Dept.', duration: '2022 – 2023', bullets: ['Analyzed 10 years of market data for faculty research paper', 'Created visualizations presenting complex financial trends', 'Presented findings to department of 50+ members'] },
      ],
      education: [{ degree: 'B.S. Finance, magna cum laude', school: 'Columbia University', year: '2023' }],
      skills: ['Excel', 'Financial Modeling', 'SQL', 'Bloomberg', 'Python', 'Tableau', 'PowerPoint', 'Valuation'],
    },
  },
  {
    id: 4, title: 'Registered Nurse (ICU)', category: 'healthcare', experience: 'Mid · 5 yrs',
    rating: 4.9, downloads: 4987, description: 'Critical-care RN with 98% patient satisfaction scores, BLS/ACLS certified, and quality improvement leadership.',
    tags: ['Critical Care', 'Patient Assessment', 'EMR', 'BLS/ACLS', 'IV Therapy'],
    accent: '0 84% 60%', icon: HeartPulse, templateStyle: 'executive',
    content: {
      name: 'Maria Gonzalez',
      summary: 'Dedicated Registered Nurse with 5 years of critical-care experience. Known for exceptional patient outcomes (98% satisfaction), emergency leadership, and mentoring new hires.',
      experience: [
        { title: 'Critical Care Nurse', company: 'City General Hospital', duration: '2020 – Present', bullets: ['Provide care for 4-6 critically ill patients per shift in 20-bed ICU', 'Achieved 98% patient satisfaction scores consistently', 'Train new nurses on ventilator management and cardiac monitoring'] },
        { title: 'Staff Nurse', company: 'Regional Medical Center', duration: '2018 – 2020', bullets: ['Managed care for 8-10 patients on medical-surgical unit', 'Reduced medication errors by 30% through protocol improvements', 'Led unit quality improvement committee'] },
      ],
      education: [{ degree: 'B.S. Nursing', school: 'Johns Hopkins School of Nursing', year: '2018' }],
      skills: ['Critical Care', 'Patient Assessment', 'EMR Systems', 'BLS/ACLS', 'IV Therapy', 'Wound Care', 'Team Leadership', 'Patient Education'],
    },
  },
  {
    id: 5, title: 'Elementary School Teacher', category: 'education', experience: 'Mid · 6 yrs',
    rating: 4.6, downloads: 3756, description: 'Passionate educator specializing in differentiated instruction and STEM enrichment with measurable student growth.',
    tags: ['Curriculum Design', 'Classroom Management', 'STEM', 'Google Classroom'],
    accent: '35 92% 50%', icon: GraduationCap, templateStyle: 'minimalist',
    content: {
      name: 'Emily Turner',
      summary: 'Passionate Elementary Teacher with 6 years creating engaging learning environments. Expertise in differentiated instruction and STEM enrichment; achieved 35% reading proficiency improvement.',
      experience: [
        { title: '3rd Grade Teacher', company: 'Sunshine Elementary', duration: '2019 – Present', bullets: ['Increased class reading proficiency by 35% through personalized intervention', 'Implemented project-based learning curriculum adopted school-wide', 'Mentored 3 student teachers and 2 new faculty members'] },
        { title: '2nd Grade Teacher', company: 'Valley School District', duration: '2017 – 2019', bullets: ['Managed classroom of 25 diverse learners with varied needs', 'Created STEM enrichment program for gifted students', 'Organized annual science fair with 100+ participants'] },
      ],
      education: [{ degree: 'M.Ed. Elementary Education', school: 'Columbia Teachers College', year: '2017' }],
      skills: ['Curriculum Design', 'Differentiated Instruction', 'Classroom Management', 'Assessment', 'Google Classroom', 'Parent Communication', 'IEP Development', 'STEM Education'],
    },
  },
  {
    id: 6, title: 'UX / UI Designer', category: 'design', experience: 'Mid · 4+ yrs',
    rating: 4.8, downloads: 7243, description: 'User-centered designer who increased conversion by 45% through research-driven redesigns and scalable design systems.',
    tags: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Interaction Design'],
    accent: '292 84% 51%', icon: Palette, templateStyle: 'creative',
    content: {
      name: 'Jordan Lee',
      summary: 'Innovative UX/UI Designer with 4+ years crafting user-centered digital products. Built design systems used across 12 products; increased e-commerce conversion by 45%.',
      experience: [
        { title: 'Senior UX Designer', company: 'Design Studio Pro', duration: '2021 – Present', bullets: ['Redesigned e-commerce platform increasing conversion by 45%', 'Built comprehensive design system used across 12 products', 'Conducted 50+ user interviews informing product roadmap'] },
        { title: 'UX Designer', company: 'Tech Startup', duration: '2019 – 2021', bullets: ['Designed mobile app achieving 4.8★ rating with 100K+ downloads', 'Reduced user onboarding drop-off by 60% through UX improvements', 'Created interactive prototypes for investor presentations'] },
      ],
      education: [{ degree: 'B.F.A. Graphic Design', school: 'Rhode Island School of Design', year: '2019' }],
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing', 'Wireframing', 'Interaction Design'],
    },
  },
  {
    id: 7, title: 'Data Scientist', category: 'technology', experience: 'Mid · 4 yrs',
    rating: 4.8, downloads: 9120, description: 'ML-focused data scientist with experience deploying production models, driving $3M+ annual revenue impact.',
    tags: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Spark'],
    accent: '199 89% 48%', icon: TrendingUp, templateStyle: 'tech',
    content: {
      name: 'Priya Sharma',
      summary: 'Data Scientist with 4 years of experience building and deploying machine-learning models at scale. Delivered $3M+ annual revenue impact through predictive analytics and recommendation engines.',
      experience: [
        { title: 'Data Scientist', company: 'DataDriven Inc.', duration: '2021 – Present', bullets: ['Built recommendation engine increasing user engagement by 28%', 'Deployed real-time fraud detection model saving $1.2M annually', 'Created automated reporting pipeline reducing analysis time by 70%'] },
        { title: 'Junior Data Scientist', company: 'Analytics Co.', duration: '2019 – 2021', bullets: ['Developed churn prediction model with 92% accuracy', 'Analyzed 50M+ rows of user behavior data for product insights', 'Presented quarterly findings to C-suite stakeholders'] },
      ],
      education: [{ degree: 'M.S. Data Science', school: 'UC Berkeley', year: '2019' }],
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Spark', 'Pandas', 'AWS SageMaker', 'Statistics'],
    },
  },
  {
    id: 8, title: 'Product Manager', category: 'technology', experience: 'Senior · 7 yrs',
    rating: 4.9, downloads: 10340, description: 'Strategic PM who launched 5 products from 0→1 and grew ARR from $2M to $15M across B2B SaaS.',
    tags: ['Roadmapping', 'Agile', 'Analytics', 'User Stories', 'Go-To-Market'],
    accent: '340 82% 52%', icon: Users, templateStyle: 'executive',
    content: {
      name: 'Michael Chen',
      summary: 'Strategic Product Manager with 7 years launching B2B SaaS products. Grew ARR from $2M to $15M, launched 5 products from 0→1, and led cross-functional teams of 20+.',
      experience: [
        { title: 'Senior Product Manager', company: 'SaaS Platform', duration: '2020 – Present', bullets: ['Grew product ARR from $5M to $15M over 3 years', 'Defined and executed roadmap across 4 engineering squads', 'Increased NPS from 32 to 58 through user-feedback loops'] },
        { title: 'Product Manager', company: 'Enterprise SaaS', duration: '2017 – 2020', bullets: ['Launched 2 products from concept to $2M ARR in 18 months', 'Reduced churn by 40% with onboarding redesign', 'Managed backlog of 200+ user stories with Agile methodology'] },
      ],
      education: [{ degree: 'MBA', school: 'Wharton School of Business', year: '2017' }],
      skills: ['Roadmapping', 'Agile / Scrum', 'Analytics', 'User Stories', 'Go-To-Market', 'SQL', 'Jira', 'Stakeholder Management'],
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: convert example data → ResumeData for templates            */
/* ------------------------------------------------------------------ */

const toResumeData = (ex: ResumeExample): ResumeData => ({
  personalInfo: {
    fullName: ex.content.name,
    email: '',
    phone: '',
    location: '',
    summary: ex.content.summary,
  },
  experience: ex.content.experience.map(e => ({
    company: e.company,
    position: e.title,
    duration: e.duration,
    description: e.bullets.join('. '),
  })),
  education: ex.content.education.map(e => ({
    institution: e.school,
    degree: e.degree,
    year: e.year,
  })),
  skills: ex.content.skills,
  sectionOrder: ['summary', 'experience', 'education', 'skills'],
});

const hslToHex = (hslStr: string): string => {
  const parts = hslStr.split(/\s+/).map(s => parseFloat(s));
  if (parts.length < 3) return '#2563eb';
  const [h, s, l] = parts;
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const renderExampleTemplate = (ex: ResumeExample) => {
  const data = toResumeData(ex);
  const hex = hslToHex(ex.accent);
  switch (ex.templateStyle) {
    case 'classic': return <ClassicTemplate resumeData={data} accentColor={hex} />;
    case 'tech': return <TechTemplate resumeData={data} accentColor={hex} />;
    case 'creative': return <CreativeTemplate resumeData={data} accentColor={hex} />;
    case 'executive': return <ExecutiveTemplate resumeData={data} accentColor={hex} />;
    case 'minimalist': return <MinimalistTemplate resumeData={data} accentColor={hex} />;
    default: return <ModernTemplate resumeData={data} accentColor={hex} />;
  }
};

/* ------------------------------------------------------------------ */
/*  Mini Resume Preview — uses actual builder templates                 */
/* ------------------------------------------------------------------ */

const MiniResume = ({ example }: { example: ResumeExample }) => (
  <div className="h-full w-full relative overflow-hidden bg-white">
    <div
      className="origin-top-left pointer-events-none"
      style={{ transform: 'scale(0.28)', width: '700px', height: '960px' }}
    >
      {renderExampleTemplate(example)}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

const ResumeExamples = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<ResumeExample | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filtered = useMemo(() =>
    resumeExamples.filter(ex => {
      const matchSearch = !searchTerm || ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCat = activeCategory === 'all' || ex.category === activeCategory;
      return matchSearch && matchCat;
    }),
    [searchTerm, activeCategory]
  );

  const handleUseTemplate = (ex: ResumeExample) => {
    toast({ title: "Template selected!", description: "Opening Resume Builder…" });
    navigate('/resume-builder');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-4 gap-1.5 px-4 py-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5" /> Curated by career experts
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Professional Resume
              <span className="text-gradient-primary block">Examples & Templates</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Browse real-world resumes that landed jobs at top companies.
              Preview full details, then use any template in our builder.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title, skill, or industry…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-border/60 bg-card/80 backdrop-blur-sm shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pb-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((ex, i) => (
                <motion.div
                  key={ex.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Mini preview */}
                    <div className="aspect-[3/4] relative overflow-hidden border-b border-border/30">
                      <MiniResume example={ex} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          className="shadow-lg"
                          onClick={() => { setSelectedExample(ex); setPreviewOpen(true); }}
                        >
                          <Eye className="w-4 h-4 mr-1" /> Preview
                        </Button>
                      </div>
                      {/* Accent bar */}
                      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `hsl(${ex.accent})` }} />
                    </div>

                    {/* Card info */}
                    <CardContent className="p-4 flex flex-col gap-2.5 flex-1">
                      <div>
                        <h3 className="font-semibold text-sm text-foreground leading-tight">{ex.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{ex.experience}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {ex.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-medium">{tag}</Badge>
                        ))}
                        {ex.tags.length > 3 && <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">+{ex.tags.length - 3}</Badge>}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                        <span className="flex items-center gap-0.5"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />{ex.rating}</span>
                        <span className="flex items-center gap-0.5"><Download className="w-3.5 h-3.5" />{(ex.downloads / 1000).toFixed(1)}K</span>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-1 text-xs group/btn"
                        onClick={() => handleUseTemplate(ex)}
                      >
                        Use This Template <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No examples found</p>
              <p className="text-sm">Try a different search or category.</p>
            </div>
          )}
        </div>
      </main>

      {/* Full Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl">{selectedExample?.title} Resume</DialogTitle>
            <DialogDescription>Full preview — click "Use Template" to start editing</DialogDescription>
          </DialogHeader>

          {selectedExample && (
            <div className="px-6 pb-6">
              <div className="bg-white text-gray-900 rounded-xl border shadow-sm overflow-hidden">
                {/* Header band */}
                <div className="px-8 py-6" style={{ background: `linear-gradient(135deg, hsl(${selectedExample.accent}), hsl(${selectedExample.accent} / 0.8))` }}>
                  <h1 className="text-2xl font-bold text-white">{selectedExample.content.name}</h1>
                  <p className="text-white/80 text-sm mt-1">{selectedExample.title} · {selectedExample.experience}</p>
                </div>

                <div className="p-8 space-y-6">
                  {/* Summary */}
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: `hsl(${selectedExample.accent})` }}>Professional Summary</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedExample.content.summary}</p>
                  </div>

                  {/* Experience */}
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: `hsl(${selectedExample.accent})` }}>Experience</h2>
                    <div className="space-y-5">
                      {selectedExample.content.experience.map((exp, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-baseline flex-wrap gap-1">
                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                            <span className="text-xs text-gray-500">{exp.duration}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-1.5">{exp.company}</p>
                          <ul className="space-y-1">
                            {exp.bullets.map((b, j) => (
                              <li key={j} className="flex gap-2 text-sm text-gray-700">
                                <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(${selectedExample.accent})` }} />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: `hsl(${selectedExample.accent})` }}>Education</h2>
                    {selectedExample.content.education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span><span className="font-medium text-gray-900">{edu.degree}</span> · {edu.school}</span>
                        <span className="text-gray-500">{edu.year}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: `hsl(${selectedExample.accent})` }}>Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedExample.content.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: `hsl(${selectedExample.accent} / 0.1)`, color: `hsl(${selectedExample.accent})` }}
                        >{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <Button variant="outline" className="flex-1" onClick={() => setPreviewOpen(false)}>Close</Button>
                <Button className="flex-1 btn-gradient" onClick={() => { setPreviewOpen(false); handleUseTemplate(selectedExample); }}>
                  <Download className="w-4 h-4 mr-2" /> Use This Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ResumeExamples;
