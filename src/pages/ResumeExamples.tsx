import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Eye, Download, Star, Filter, FileText, Briefcase, GraduationCap, Code, Palette, HeartPulse, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeExample {
  id: number;
  title: string;
  category: string;
  experience: string;
  rating: number;
  downloads: number;
  description: string;
  tags: string[];
  content: {
    summary: string;
    experience: { title: string; company: string; duration: string; bullets: string[] }[];
    education: { degree: string; school: string; year: string }[];
    skills: string[];
  };
}

const ResumeExamples = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<ResumeExample | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = [
    { id: 'all', name: 'All', icon: FileText },
    { id: 'technology', name: 'Tech', icon: Code },
    { id: 'marketing', name: 'Marketing', icon: Briefcase },
    { id: 'finance', name: 'Finance', icon: DollarSign },
    { id: 'healthcare', name: 'Healthcare', icon: HeartPulse },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'design', name: 'Design', icon: Palette }
  ];

  const resumeExamples: ResumeExample[] = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      category: 'technology',
      experience: 'Senior Level',
      rating: 4.9,
      downloads: 2543,
      description: 'Full-stack developer with 8+ years experience in React, Node.js, and cloud architecture.',
      tags: ['React', 'Node.js', 'AWS', 'Python'],
      content: {
        summary: 'Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architecture with a proven track record of leading development teams and delivering high-impact projects.',
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Corp Inc.',
            duration: '2020 - Present',
            bullets: [
              'Led development of microservices architecture serving 2M+ daily users',
              'Reduced page load time by 40% through performance optimization',
              'Mentored team of 5 junior developers, improving team velocity by 25%'
            ]
          },
          {
            title: 'Software Engineer',
            company: 'StartupXYZ',
            duration: '2016 - 2020',
            bullets: [
              'Built React-based dashboard processing $10M+ monthly transactions',
              'Implemented CI/CD pipeline reducing deployment time by 60%',
              'Developed RESTful APIs serving mobile and web applications'
            ]
          }
        ],
        education: [{ degree: 'B.S. Computer Science', school: 'State University', year: '2016' }],
        skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker', 'GraphQL', 'Python']
      }
    },
    {
      id: 2,
      title: 'Digital Marketing Manager',
      category: 'marketing',
      experience: 'Mid Level',
      rating: 4.8,
      downloads: 1876,
      description: 'Results-driven marketing professional with expertise in SEO, PPC, and content strategy.',
      tags: ['SEO', 'Google Ads', 'Analytics', 'Content Strategy'],
      content: {
        summary: 'Creative Digital Marketing Manager with 5+ years driving brand growth through data-driven strategies. Expertise in SEO, PPC, and content marketing with proven success increasing organic traffic and conversion rates.',
        experience: [
          {
            title: 'Digital Marketing Manager',
            company: 'Growth Agency',
            duration: '2021 - Present',
            bullets: [
              'Increased organic traffic by 150% through comprehensive SEO strategy',
              'Managed $500K annual PPC budget with 3.5x ROAS',
              'Led content team producing 50+ pieces monthly across channels'
            ]
          },
          {
            title: 'Marketing Specialist',
            company: 'E-commerce Brand',
            duration: '2018 - 2021',
            bullets: [
              'Grew email list from 10K to 100K subscribers',
              'Achieved 25% increase in customer retention through email campaigns',
              'Launched influencer program generating $2M in attributed revenue'
            ]
          }
        ],
        education: [{ degree: 'B.A. Marketing', school: 'Business University', year: '2018' }],
        skills: ['Google Ads', 'SEO', 'Analytics', 'Content Strategy', 'Social Media', 'Email Marketing', 'CRM', 'A/B Testing']
      }
    },
    {
      id: 3,
      title: 'Financial Analyst',
      category: 'finance',
      experience: 'Entry Level',
      rating: 4.7,
      downloads: 1432,
      description: 'Recent graduate with strong analytical skills and internship experience in investment banking.',
      tags: ['Excel', 'Financial Modeling', 'SQL', 'Bloomberg'],
      content: {
        summary: 'Detail-oriented Financial Analyst with strong foundation in financial modeling and data analysis. Recent graduate with internship experience at top investment bank and proven ability to deliver actionable insights.',
        experience: [
          {
            title: 'Financial Analyst Intern',
            company: 'Goldman Sachs',
            duration: 'Summer 2023',
            bullets: [
              'Built financial models for M&A transactions totaling $500M',
              'Conducted industry research supporting 3 client pitches',
              'Automated weekly reporting saving 10+ hours per week'
            ]
          },
          {
            title: 'Research Assistant',
            company: 'University Finance Department',
            duration: '2022 - 2023',
            bullets: [
              'Analyzed 10 years of market data for faculty research paper',
              'Created visualizations presenting complex financial trends',
              'Presented findings to department of 50+ students and faculty'
            ]
          }
        ],
        education: [{ degree: 'B.S. Finance', school: 'Ivy University', year: '2023' }],
        skills: ['Excel', 'Financial Modeling', 'SQL', 'Bloomberg Terminal', 'Python', 'Tableau', 'PowerPoint', 'Valuation']
      }
    },
    {
      id: 4,
      title: 'Registered Nurse',
      category: 'healthcare',
      experience: 'Mid Level',
      rating: 4.9,
      downloads: 987,
      description: 'Compassionate RN with 5 years experience in critical care and patient management.',
      tags: ['Patient Care', 'Critical Care', 'EMR', 'BLS Certified'],
      content: {
        summary: 'Dedicated Registered Nurse with 5 years of critical care experience. Known for exceptional patient outcomes, leadership abilities, and expertise in emergency response protocols.',
        experience: [
          {
            title: 'Critical Care Nurse',
            company: 'City General Hospital',
            duration: '2020 - Present',
            bullets: [
              'Provide care for 4-6 critically ill patients per shift in 20-bed ICU',
              'Achieved 98% patient satisfaction scores consistently',
              'Train new nurses on ventilator management and cardiac monitoring'
            ]
          },
          {
            title: 'Staff Nurse',
            company: 'Regional Medical Center',
            duration: '2018 - 2020',
            bullets: [
              'Managed care for 8-10 patients on medical-surgical unit',
              'Reduced medication errors by 30% through protocol improvements',
              'Led unit quality improvement committee'
            ]
          }
        ],
        education: [{ degree: 'B.S. Nursing', school: 'Nursing College', year: '2018' }],
        skills: ['Critical Care', 'Patient Assessment', 'EMR Systems', 'BLS/ACLS', 'IV Therapy', 'Wound Care', 'Team Leadership', 'Patient Education']
      }
    },
    {
      id: 5,
      title: 'Elementary School Teacher',
      category: 'education',
      experience: 'Mid Level',
      rating: 4.6,
      downloads: 756,
      description: 'Dedicated educator with 6 years experience in elementary education and curriculum development.',
      tags: ['Curriculum Development', 'Classroom Management', 'Assessment', 'Technology Integration'],
      content: {
        summary: 'Passionate Elementary School Teacher with 6 years creating engaging learning environments. Expertise in differentiated instruction and technology integration with proven success improving student outcomes.',
        experience: [
          {
            title: '3rd Grade Teacher',
            company: 'Sunshine Elementary',
            duration: '2019 - Present',
            bullets: [
              'Increased class reading proficiency by 35% through personalized intervention',
              'Implemented project-based learning curriculum adopted school-wide',
              'Mentored 3 student teachers and 2 new faculty members'
            ]
          },
          {
            title: '2nd Grade Teacher',
            company: 'Valley School District',
            duration: '2017 - 2019',
            bullets: [
              'Managed classroom of 25 diverse learners with varied needs',
              'Created STEM enrichment program for gifted students',
              'Organized annual science fair with 100+ student participants'
            ]
          }
        ],
        education: [{ degree: 'M.Ed. Elementary Education', school: 'Teachers College', year: '2017' }],
        skills: ['Curriculum Design', 'Differentiated Instruction', 'Classroom Management', 'Assessment', 'Google Classroom', 'Parent Communication', 'IEP Development', 'STEM Education']
      }
    },
    {
      id: 6,
      title: 'UX/UI Designer',
      category: 'design',
      experience: 'Mid Level',
      rating: 4.8,
      downloads: 1243,
      description: 'Creative designer with expertise in user research, prototyping, and design systems.',
      tags: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      content: {
        summary: 'Innovative UX/UI Designer with 4+ years creating user-centered digital experiences. Expert in design thinking methodology with a portfolio of successful product launches for startups and enterprise clients.',
        experience: [
          {
            title: 'Senior UX Designer',
            company: 'Design Studio Pro',
            duration: '2021 - Present',
            bullets: [
              'Redesigned e-commerce platform increasing conversion by 45%',
              'Built comprehensive design system used across 12 products',
              'Conducted 50+ user interviews informing product roadmap'
            ]
          },
          {
            title: 'UX Designer',
            company: 'Tech Startup',
            duration: '2019 - 2021',
            bullets: [
              'Designed mobile app achieving 4.8 star rating with 100K+ downloads',
              'Reduced user onboarding drop-off by 60% through UX improvements',
              'Created interactive prototypes for investor presentations'
            ]
          }
        ],
        education: [{ degree: 'B.F.A. Graphic Design', school: 'Art Institute', year: '2019' }],
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing', 'Wireframing', 'Interaction Design']
      }
    }
  ];

  const filteredExamples = resumeExamples.filter(example => {
    const matchesSearch = example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         example.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || example.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePreview = (example: ResumeExample) => {
    setSelectedExample(example);
    setPreviewOpen(true);
  };

  const handleUseTemplate = (example: ResumeExample) => {
    toast({
      title: "Template selected!",
      description: "Redirecting to Resume Builder with this template..."
    });
    navigate('/resume-builder');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Resume Examples</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Professional Resume Examples</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse real resume examples from professionals across industries. Preview and use as templates for your own resume.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title, skills, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs py-2 flex flex-col sm:flex-row items-center gap-1">
                  <category.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExamples.map((example) => (
                  <Card key={example.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    {/* Mini Preview */}
                    <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 p-4 relative">
                      <div className="bg-background rounded-lg shadow-sm p-3 h-full overflow-hidden text-[8px] leading-tight">
                        <div className="font-bold text-[10px] mb-1">{example.content.experience[0]?.title || example.title}</div>
                        <div className="text-muted-foreground mb-2">{example.content.experience[0]?.company}</div>
                        <div className="space-y-1">
                          {example.content.experience[0]?.bullets.slice(0, 2).map((bullet, idx) => (
                            <div key={idx} className="flex gap-1">
                              <span>•</span>
                              <span className="line-clamp-1">{bullet}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-[10px] font-medium">Skills</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {example.content.skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="bg-muted px-1 rounded text-[7px]">{skill}</span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary" onClick={() => handlePreview(example)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{example.title}</h3>
                          <p className="text-sm text-muted-foreground">{example.experience}</p>
                        </div>
                        
                        <p className="text-sm line-clamp-2">{example.description}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          {example.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {example.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{example.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{example.rating}</span>
                          </div>
                          <span>{example.downloads.toLocaleString()} downloads</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePreview(example)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" className="flex-1" onClick={() => handleUseTemplate(example)}>
                            <Download className="h-4 w-4 mr-1" />
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredExamples.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No resume examples found matching your criteria. Try adjusting your search or filters.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedExample?.title} Resume</DialogTitle>
            <DialogDescription>
              Preview this professional resume example
            </DialogDescription>
          </DialogHeader>
          
          {selectedExample && (
            <div className="bg-white text-gray-900 p-8 rounded-lg border shadow-sm">
              {/* Header */}
              <div className="text-center border-b pb-4 mb-4">
                <h1 className="text-2xl font-bold">{selectedExample.title}</h1>
                <p className="text-muted-foreground">{selectedExample.experience}</p>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Professional Summary</h2>
                <p className="text-sm">{selectedExample.content.summary}</p>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-1 mb-3">Experience</h2>
                <div className="space-y-4">
                  {selectedExample.content.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{exp.title}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{exp.duration}</span>
                      </div>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {exp.bullets.map((bullet, bidx) => (
                          <li key={bidx} className="text-sm">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Education</h2>
                {selectedExample.content.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <span className="font-medium">{edu.degree}</span>
                      <span className="text-muted-foreground"> - {edu.school}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{edu.year}</span>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedExample.content.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button className="flex-1" onClick={() => selectedExample && handleUseTemplate(selectedExample)}>
              <Download className="w-4 h-4 mr-2" />
              Use This Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ResumeExamples;