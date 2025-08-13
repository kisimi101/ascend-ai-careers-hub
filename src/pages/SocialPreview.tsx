import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Share2, Download, Copy, Eye, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SocialPreview = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    summary: '',
    location: '',
    industry: '',
    skills: [] as string[],
    newSkill: ''
  });
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const { toast } = useToast();

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-700' }
  ];

  const addSkill = () => {
    if (profileData.newSkill.trim() && !profileData.skills.includes(profileData.newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const generatePreview = () => {
    if (!profileData.name || !profileData.title) {
      toast({
        title: "Error",
        description: "Please fill in your name and professional title",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Preview Generated!",
      description: "Your social media profile preview is ready.",
    });
  };

  const copyContent = () => {
    const content = `${profileData.name}\n${profileData.title}\n\n${profileData.summary}\n\nSkills: ${profileData.skills.join(', ')}`;
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Profile content copied to clipboard",
    });
  };

  const renderLinkedInPreview = () => (
    <div className="bg-white border rounded-lg overflow-hidden max-w-md mx-auto">
      <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-700"></div>
      <div className="px-4 pb-4 -mt-8">
        <div className="w-16 h-16 bg-gray-300 rounded-full border-4 border-white mb-3"></div>
        <h3 className="font-semibold text-lg text-gray-900">{profileData.name || 'Your Name'}</h3>
        <p className="text-gray-600 text-sm mb-2">{profileData.title || 'Your Professional Title'}</p>
        <p className="text-gray-500 text-xs mb-3">{profileData.location || 'Your Location'}</p>
        {profileData.summary && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-3">{profileData.summary}</p>
        )}
        {profileData.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profileData.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
            {profileData.skills.length > 3 && (
              <span className="text-xs text-gray-500">+{profileData.skills.length - 3} more</span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderTwitterPreview = () => (
    <div className="bg-white border rounded-xl overflow-hidden max-w-md mx-auto">
      <div className="h-24 bg-gradient-to-r from-sky-400 to-sky-600"></div>
      <div className="px-4 pb-4 -mt-10">
        <div className="w-20 h-20 bg-gray-300 rounded-full border-4 border-white mb-3"></div>
        <h3 className="font-bold text-xl text-gray-900">{profileData.name || 'Your Name'}</h3>
        <p className="text-gray-500 text-sm mb-2">@{(profileData.name || 'username').toLowerCase().replace(/\s+/g, '')}</p>
        <p className="text-gray-900 text-sm mb-3">{profileData.title || 'Your Professional Title'}</p>
        {profileData.summary && (
          <p className="text-gray-700 text-sm mb-3">{profileData.summary.slice(0, 160)}...</p>
        )}
        <div className="flex items-center text-gray-500 text-sm">
          <span className="mr-4">📍 {profileData.location || 'Your Location'}</span>
          <span>🔗 yourwebsite.com</span>
        </div>
      </div>
    </div>
  );

  const renderFacebookPreview = () => (
    <div className="bg-white border rounded-lg overflow-hidden max-w-md mx-auto">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>
      <div className="px-4 pb-4 -mt-12">
        <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white mb-3"></div>
        <h3 className="font-bold text-2xl text-gray-900">{profileData.name || 'Your Name'}</h3>
        <p className="text-gray-600 text-base mb-2">{profileData.title || 'Your Professional Title'}</p>
        {profileData.summary && (
          <p className="text-gray-700 text-sm mb-3">{profileData.summary}</p>
        )}
        <div className="text-gray-500 text-sm">
          <p>Lives in {profileData.location || 'Your Location'}</p>
          <p>Works in {profileData.industry || 'Your Industry'}</p>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (selectedPlatform) {
      case 'linkedin':
        return renderLinkedInPreview();
      case 'twitter':
        return renderTwitterPreview();
      case 'facebook':
        return renderFacebookPreview();
      default:
        return renderLinkedInPreview();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Social Media Profile Preview</h1>
          <p className="text-xl text-muted-foreground">
            Create and preview your professional social media profiles
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Enter your professional details to generate social media previews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Professional Title</label>
                  <Input
                    placeholder="Software Engineer"
                    value={profileData.title}
                    onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    placeholder="San Francisco, CA"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <Input
                    placeholder="Technology"
                    value={profileData.industry}
                    onChange={(e) => setProfileData(prev => ({ ...prev, industry: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Professional Summary</label>
                <Textarea
                  placeholder="Brief description of your professional background and expertise..."
                  value={profileData.summary}
                  onChange={(e) => setProfileData(prev => ({ ...prev, summary: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Skills</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a skill"
                    value={profileData.newSkill}
                    onChange={(e) => setProfileData(prev => ({ ...prev, newSkill: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} variant="outline">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} ✕
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button onClick={generatePreview} className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Generate Preview
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Preview</CardTitle>
              <CardDescription>
                See how your profile will appear on different platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <TabsList className="grid w-full grid-cols-3">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <TabsTrigger key={platform.id} value={platform.id} className="flex items-center gap-1">
                        <Icon className="h-4 w-4" />
                        {platform.name}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                <TabsContent value={selectedPlatform} className="mt-6">
                  <div className="space-y-4">
                    {renderPreview()}
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={copyContent} className="flex-1">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Content
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Export Image
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SocialPreview;