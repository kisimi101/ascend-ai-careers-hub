import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Building2, MessageCircle, Sparkles, Loader2, ThumbsUp, ThumbsDown, BookOpen, Star, Filter, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InterviewQuestion {
  id: string;
  company: string;
  role: string;
  question: string;
  category: 'behavioral' | 'technical' | 'system-design' | 'case-study' | 'culture-fit';
  difficulty: 'easy' | 'medium' | 'hard';
  sampleAnswer?: string;
  tips: string[];
  upvotes: number;
  source: 'ai' | 'crowdsourced';
}

const POPULAR_COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Apple', 'Meta', 'Netflix', 'Salesforce', 'Adobe', 'Stripe', 'Airbnb', 'Uber', 'Tesla'];

const InterviewQuestionBank = () => {
  const { toast } = useToast();
  const [searchCompany, setSearchCompany] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAnswer, setExpandedAnswer] = useState<string | null>(null);

  const generateQuestions = async (company: string) => {
    if (!company) return;
    setIsLoading(true);
    setSelectedCompany(company);

    try {
      const { data, error } = await supabase.functions.invoke('generate-interview-questions', {
        body: { company, role: selectedRole || 'Software Engineer' }
      });

      if (!error && data?.questions) {
        setQuestions(data.questions);
      } else {
        // Fallback with template questions
        setQuestions(generateTemplateQuestions(company, selectedRole || 'Software Engineer'));
      }
    } catch {
      setQuestions(generateTemplateQuestions(company, selectedRole || 'Software Engineer'));
    } finally {
      setIsLoading(false);
    }
  };

  const generateTemplateQuestions = (company: string, role: string): InterviewQuestion[] => {
    const categories: InterviewQuestion['category'][] = ['behavioral', 'technical', 'system-design', 'case-study', 'culture-fit'];
    const templates: Record<string, { q: string; tips: string[]; answer: string }[]> = {
      behavioral: [
        { q: `Tell me about a time you disagreed with a decision at work. How did you handle it?`, tips: ['Use STAR method', 'Show emotional intelligence', 'Focus on resolution'], answer: `I disagreed with a technical approach on a key project. I scheduled a 1:1 with the lead, prepared data supporting my view, and proposed a compromise. We ran a small A/B test and the data guided the final decision. The key was staying respectful and data-driven.` },
        { q: `Describe a project where you had to learn something new quickly.`, tips: ['Show adaptability', 'Mention specific learning strategies', 'Quantify the outcome'], answer: `When tasked with migrating our system to a new framework, I dedicated 2 weeks to intensive learning through docs, tutorials, and pair programming. I delivered the migration ahead of schedule, reducing page load by 40%.` },
        { q: `How do you prioritize when everything is urgent?`, tips: ['Show a framework', 'Give a concrete example', `Mention stakeholder communication`], answer: `I use an impact-urgency matrix. I communicate trade-offs to stakeholders transparently, negotiate deadlines where possible, and focus on items that unblock others first.` },
      ],
      technical: [
        { q: `How would you design a scalable notification system for ${company}?`, tips: ['Discuss message queues', 'Consider rate limiting', 'Think about delivery guarantees'], answer: `I'd use a pub/sub model with a message queue (Kafka/SQS), a priority system for different notification types, fan-out for multiple channels (push, email, SMS), and a dead-letter queue for failed deliveries.` },
        { q: `What's your approach to debugging a production performance issue?`, tips: ['Mention monitoring tools', 'Discuss systematic approach', 'Talk about rollback strategies'], answer: `Start with metrics (latency, error rates, CPU/memory), identify the regression timeframe, correlate with recent deploys, use profiling tools to isolate bottlenecks, apply a fix with a feature flag, and add monitoring to prevent recurrence.` },
      ],
      'system-design': [
        { q: `Design a real-time feed system similar to what ${company} might use.`, tips: ['Start with requirements', 'Discuss data model', 'Address scaling challenges'], answer: `Requirements: low latency, ordered feed, personalized ranking. Architecture: write path (event → queue → fanout), read path (cache-first with fallback), ranking service, and a hybrid push/pull model for different user segments.` },
      ],
      'case-study': [
        { q: `${company} is expanding to a new market. How would you approach the product strategy?`, tips: ['Research the company', 'Think about market fit', 'Consider local regulations'], answer: `I'd start with market research (TAM, competition, regulations), identify a beachhead segment, adapt the core product for local needs, run a limited pilot, measure key metrics, and iterate before full launch.` },
      ],
      'culture-fit': [
        { q: `Why do you want to work at ${company} specifically?`, tips: ['Show genuine knowledge', 'Connect to your values', 'Mention specific products or initiatives'], answer: `I admire ${company}'s commitment to [specific value]. My experience in [relevant area] aligns with your mission. I'm particularly excited about [recent initiative] and believe I can contribute meaningfully.` },
        { q: `How do you handle receiving critical feedback?`, tips: ['Show growth mindset', 'Give a real example', 'Demonstrate self-awareness'], answer: `I view feedback as a growth opportunity. Recently, I received feedback about my communication style in cross-functional meetings. I started summarizing action items after each meeting and asking for clarification, which improved team alignment significantly.` },
      ],
    };

    const result: InterviewQuestion[] = [];
    let id = 0;
    for (const cat of categories) {
      const catQuestions = templates[cat] || [];
      for (const tq of catQuestions) {
        id++;
        result.push({
          id: `q-${id}`,
          company,
          role,
          question: tq.q,
          category: cat,
          difficulty: cat === 'system-design' ? 'hard' : cat === 'technical' ? 'medium' : 'easy',
          sampleAnswer: tq.answer,
          tips: tq.tips,
          upvotes: Math.floor(10 + Math.random() * 200),
          source: 'ai',
        });
      }
    }
    return result;
  };

  const filteredQuestions = questions.filter(q => 
    selectedCategory === 'all' || q.category === selectedCategory
  );

  const getDifficultyColor = (d: string) => {
    if (d === 'easy') return 'bg-green-500/10 text-green-600';
    if (d === 'medium') return 'bg-amber-500/10 text-amber-600';
    return 'bg-red-500/10 text-red-600';
  };

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = { behavioral: '🧠', technical: '💻', 'system-design': '🏗️', 'case-study': '📊', 'culture-fit': '🤝' };
    return icons[cat] || '❓';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Interview Question Bank
          </h1>
          <p className="text-muted-foreground mt-1">AI-generated questions specific to each company</p>
        </div>

        {/* Company Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-1 block">Company</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Enter company name..." value={searchCompany} onChange={e => setSearchCompany(e.target.value)}
                    className="pl-9" onKeyDown={e => e.key === 'Enter' && generateQuestions(searchCompany)} />
                </div>
              </div>
              <div className="w-48">
                <label className="text-sm font-medium mb-1 block">Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                    <SelectItem value="UX Designer">UX Designer</SelectItem>
                    <SelectItem value="Engineering Manager">Engineering Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => generateQuestions(searchCompany)} disabled={isLoading || !searchCompany}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Questions
              </Button>
            </div>
            {/* Popular companies */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-muted-foreground mr-1">Popular:</span>
              {POPULAR_COMPANIES.map(c => (
                <Badge key={c} variant="outline" className="cursor-pointer hover:bg-primary/10 text-xs"
                  onClick={() => { setSearchCompany(c); generateQuestions(c); }}>
                  {c}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {selectedCompany && !isLoading && (
          <>
            {/* Category Filter */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
              <TabsList className="flex-wrap h-auto gap-1">
                <TabsTrigger value="all">All ({questions.length})</TabsTrigger>
                <TabsTrigger value="behavioral">🧠 Behavioral</TabsTrigger>
                <TabsTrigger value="technical">💻 Technical</TabsTrigger>
                <TabsTrigger value="system-design">🏗️ System Design</TabsTrigger>
                <TabsTrigger value="case-study">📊 Case Study</TabsTrigger>
                <TabsTrigger value="culture-fit">🤝 Culture Fit</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Questions */}
            <div className="space-y-4">
              {filteredQuestions.map((q) => (
                <Card key={q.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(q.category)}</span>
                        <Badge variant="secondary" className="text-xs capitalize">{q.category.replace('-', ' ')}</Badge>
                        <Badge variant="secondary" className={`text-xs ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ThumbsUp className="w-3 h-3" /> {q.upvotes}
                      </div>
                    </div>
                    <h3 className="text-base font-semibold mb-3">{q.question}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {q.tips.map((tip, i) => (
                        <Badge key={i} variant="outline" className="text-xs font-normal">💡 {tip}</Badge>
                      ))}
                    </div>
                    {q.sampleAnswer && (
                      <Accordion type="single" collapsible>
                        <AccordionItem value="answer" className="border-none">
                          <AccordionTrigger className="text-sm text-primary py-2 hover:no-underline">
                            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> View Sample Answer</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
                              {q.sampleAnswer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {isLoading && (
          <Card><CardContent className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-primary mb-3" /><p className="text-muted-foreground">Generating {searchCompany} interview questions...</p></CardContent></Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default InterviewQuestionBank;
