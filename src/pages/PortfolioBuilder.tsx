import React, { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, Layout, Plus, Trash2, ExternalLink, Copy, Eye, 
  Image, Link2, Github, Globe, Share2, Check, Sparkles, Download, RefreshCw, Save, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
}

interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  email: string;
  linkedin: string;
  github: string;
  website: string;
  projects: Project[];
  template: 'modern' | 'minimal' | 'creative';
}

const PortfolioBuilder = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    name: '',
    title: '',
    bio: '',
    email: '',
    linkedin: '',
    github: '',
    website: '',
    projects: [],
    template: 'modern'
  });
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    image: '',
    tags: [],
    liveUrl: '',
    githubUrl: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPortfolioId, setSavedPortfolioId] = useState<string | null>(null);
  const portfolioPreviewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Load saved portfolio on mount
  useEffect(() => {
    const loadSavedPortfolio = async () => {
      if (!isAuthenticated || !user) return;
      
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data && !error) {
        setPortfolioData({
          name: data.name,
          title: data.title || '',
          bio: data.bio || '',
          email: data.email || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          website: data.website || '',
          projects: (data.projects as unknown as Project[]) || [],
          template: (data.template as 'modern' | 'minimal' | 'creative') || 'modern'
        });
        if (data.share_url) setShareUrl(data.share_url);
        setSavedPortfolioId(data.id);
      }
    };
    
    loadSavedPortfolio();
  }, [isAuthenticated, user]);

  const savePortfolio = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your portfolio.",
        variant: "destructive"
      });
      return;
    }

    if (!portfolioData.name) {
      toast({
        title: "Name required",
        description: "Please enter your name to save the portfolio.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const portfolioPayload = {
        user_id: user.id,
        name: portfolioData.name,
        title: portfolioData.title || null,
        bio: portfolioData.bio || null,
        email: portfolioData.email || null,
        linkedin: portfolioData.linkedin || null,
        github: portfolioData.github || null,
        website: portfolioData.website || null,
        projects: JSON.parse(JSON.stringify(portfolioData.projects)),
        template: portfolioData.template,
        share_url: shareUrl || null,
        updated_at: new Date().toISOString()
      };

      if (savedPortfolioId) {
        const { error } = await supabase
          .from('portfolios')
          .update(portfolioPayload)
          .eq('id', savedPortfolioId);
        
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('portfolios')
          .insert(portfolioPayload)
          .select()
          .single();
        
        if (error) throw error;
        setSavedPortfolioId(data.id);
      }

      toast({
        title: "Portfolio saved!",
        description: "Your portfolio has been saved to your profile."
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save portfolio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and professional with smooth animations' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant, content-focused' },
    { id: 'creative', name: 'Creative', description: 'Bold colors and unique layouts' },
  ];

  const addProject = () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title and description for the project.",
        variant: "destructive"
      });
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title || '',
      description: newProject.description || '',
      image: newProject.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
      tags: newProject.tags || [],
      liveUrl: newProject.liveUrl || '',
      githubUrl: newProject.githubUrl || ''
    };

    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }));

    setNewProject({
      title: '',
      description: '',
      image: '',
      tags: [],
      liveUrl: '',
      githubUrl: ''
    });

    toast({
      title: "Project added!",
      description: "Your project has been added to the portfolio."
    });
  };

  const removeProject = (id: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && newProject.tags && newProject.tags.length < 5) {
      setNewProject(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setNewProject(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }));
  };

  const generateShareableLink = () => {
    // In a real app, this would save to a database and generate a unique URL
    const mockUrl = `https://careerhub.dev/portfolio/${portfolioData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`;
    setShareUrl(mockUrl);
    toast({
      title: "Link generated!",
      description: "Your shareable portfolio link is ready."
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard."
    });
  };

  const exportToPDF = async () => {
    if (!portfolioPreviewRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(portfolioPreviewRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`portfolio-${portfolioData.name.replace(/\s+/g, '-').toLowerCase() || 'preview'}.pdf`);
      
      toast({
        title: "PDF Downloaded!",
        description: "Your portfolio has been exported successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getTemplateStyles = () => {
    switch (portfolioData.template) {
      case 'modern':
        return 'bg-gradient-to-br from-slate-900 to-slate-800 text-white';
      case 'minimal':
        return 'bg-white text-gray-900 border';
      case 'creative':
        return 'bg-gradient-to-br from-purple-600 to-pink-500 text-white';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Portfolio Builder</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Build Your Professional Portfolio</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Showcase your projects with customizable templates and shareable links
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Builder Section */}
            <div className="space-y-6">
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="template">Template</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Add your details for the portfolio header</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input
                            placeholder="John Doe"
                            value={portfolioData.name}
                            onChange={(e) => setPortfolioData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Professional Title</Label>
                          <Input
                            placeholder="Full Stack Developer"
                            value={portfolioData.title}
                            onChange={(e) => setPortfolioData(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Bio</Label>
                        <Textarea
                          placeholder="A brief introduction about yourself and your expertise..."
                          value={portfolioData.bio}
                          onChange={(e) => setPortfolioData(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={portfolioData.email}
                          onChange={(e) => setPortfolioData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label className="flex items-center gap-1">
                            <Link2 className="w-3 h-3" /> LinkedIn
                          </Label>
                          <Input
                            placeholder="linkedin.com/in/..."
                            value={portfolioData.linkedin}
                            onChange={(e) => setPortfolioData(prev => ({ ...prev, linkedin: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label className="flex items-center gap-1">
                            <Github className="w-3 h-3" /> GitHub
                          </Label>
                          <Input
                            placeholder="github.com/..."
                            value={portfolioData.github}
                            onChange={(e) => setPortfolioData(prev => ({ ...prev, github: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label className="flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Website
                          </Label>
                          <Input
                            placeholder="yoursite.com"
                            value={portfolioData.website}
                            onChange={(e) => setPortfolioData(prev => ({ ...prev, website: e.target.value }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Project</CardTitle>
                      <CardDescription>Showcase your best work</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Project Title</Label>
                        <Input
                          placeholder="E-commerce Platform"
                          value={newProject.title}
                          onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe your project, technologies used, and your role..."
                          value={newProject.description}
                          onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Image URL</Label>
                        <Input
                          placeholder="https://..."
                          value={newProject.image}
                          onChange={(e) => setNewProject(prev => ({ ...prev, image: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Tags (max 5)</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="React, Node.js..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          />
                          <Button variant="outline" onClick={addTag}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newProject.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Live URL</Label>
                          <Input
                            placeholder="https://myproject.com"
                            value={newProject.liveUrl}
                            onChange={(e) => setNewProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>GitHub URL</Label>
                          <Input
                            placeholder="https://github.com/..."
                            value={newProject.githubUrl}
                            onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                          />
                        </div>
                      </div>
                      <Button onClick={addProject} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Added Projects */}
                  {portfolioData.projects.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Projects ({portfolioData.projects.length})</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {portfolioData.projects.map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <span className="font-medium">{project.title}</span>
                              <div className="flex gap-1 mt-1">
                                {project.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Template Tab */}
                <TabsContent value="template" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Choose Template</CardTitle>
                      <CardDescription>Select a design style for your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              portfolioData.template === template.id
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'hover:border-primary/50'
                            }`}
                            onClick={() => setPortfolioData(prev => ({ ...prev, template: template.id as any }))}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">{template.name}</span>
                                <p className="text-sm text-muted-foreground">{template.description}</p>
                              </div>
                              {portfolioData.template === template.id && (
                                <Check className="w-5 h-5 text-primary" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Share Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Share Your Portfolio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button onClick={generateShareableLink} className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Shareable Link
                      </Button>
                      {shareUrl && (
                        <div className="flex gap-2">
                          <Input value={shareUrl} readOnly />
                          <Button variant="outline" onClick={copyToClipboard}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </h3>
                <div className="flex items-center gap-2">
                  <Button onClick={exportToPDF} disabled={isExporting} variant="outline" size="sm">
                    {isExporting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export PDF
                  </Button>
                  <Badge variant="outline">{portfolioData.template} template</Badge>
                </div>
              </div>
              
              <Card ref={portfolioPreviewRef} className={`overflow-hidden ${getTemplateStyles()}`}>
                <CardContent className="p-0">
                  {/* Portfolio Header */}
                  <div className="p-8 text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-white">
                        {portfolioData.name ? portfolioData.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">
                      {portfolioData.name || 'Your Name'}
                    </h2>
                    <p className={`text-lg mb-3 ${portfolioData.template === 'minimal' ? 'text-gray-600' : 'opacity-80'}`}>
                      {portfolioData.title || 'Your Title'}
                    </p>
                    <p className={`text-sm max-w-md mx-auto ${portfolioData.template === 'minimal' ? 'text-gray-500' : 'opacity-70'}`}>
                      {portfolioData.bio || 'Your bio will appear here...'}
                    </p>
                    
                    {/* Social Links */}
                    <div className="flex justify-center gap-4 mt-4">
                      {portfolioData.linkedin && (
                        <Link2 className={`w-5 h-5 ${portfolioData.template === 'minimal' ? 'text-gray-600' : 'opacity-80'}`} />
                      )}
                      {portfolioData.github && (
                        <Github className={`w-5 h-5 ${portfolioData.template === 'minimal' ? 'text-gray-600' : 'opacity-80'}`} />
                      )}
                      {portfolioData.website && (
                        <Globe className={`w-5 h-5 ${portfolioData.template === 'minimal' ? 'text-gray-600' : 'opacity-80'}`} />
                      )}
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div className={`p-6 ${portfolioData.template === 'minimal' ? 'bg-gray-50' : 'bg-black/20'}`}>
                    <h3 className="text-lg font-semibold mb-4">Projects</h3>
                    {portfolioData.projects.length > 0 ? (
                      <div className="grid gap-4">
                        {portfolioData.projects.map((project) => (
                          <div 
                            key={project.id} 
                            className={`rounded-lg overflow-hidden ${
                              portfolioData.template === 'minimal' ? 'bg-white border' : 'bg-white/10'
                            }`}
                          >
                            <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="p-4">
                              <h4 className={`font-medium ${portfolioData.template === 'minimal' ? 'text-gray-900' : ''}`}>
                                {project.title}
                              </h4>
                              <p className={`text-sm mt-1 line-clamp-2 ${
                                portfolioData.template === 'minimal' ? 'text-gray-600' : 'opacity-70'
                              }`}>
                                {project.description}
                              </p>
                              <div className="flex gap-1 mt-2">
                                {project.tags.slice(0, 3).map((tag) => (
                                  <span 
                                    key={tag} 
                                    className={`text-xs px-2 py-0.5 rounded ${
                                      portfolioData.template === 'minimal' 
                                        ? 'bg-gray-100 text-gray-700' 
                                        : 'bg-white/20'
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-8 ${portfolioData.template === 'minimal' ? 'text-gray-400' : 'opacity-50'}`}>
                        <Layout className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Add projects to see them here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortfolioBuilder;
