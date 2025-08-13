import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Play, Pause, Upload, Download, Share2, Clock, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoResume = () => {
  const [videoData, setVideoData] = useState({
    title: '',
    introduction: '',
    keyPoints: [] as string[],
    newPoint: '',
    duration: '60'
  });
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const { toast } = useToast();

  const templates = [
    {
      id: 'professional',
      name: 'Professional Introduction',
      duration: '60 seconds',
      script: 'Brief introduction → Key achievements → Career goals → Call to action',
      description: 'Perfect for traditional industries and corporate roles'
    },
    {
      id: 'creative',
      name: 'Creative Showcase',
      duration: '90 seconds',
      script: 'Personal story → Portfolio highlights → Unique skills → Vision',
      description: 'Ideal for creative fields like design, marketing, and media'
    },
    {
      id: 'technical',
      name: 'Technical Demo',
      duration: '120 seconds',
      script: 'Technical background → Project showcase → Problem-solving → Innovation',
      description: 'Great for developers, engineers, and technical roles'
    },
    {
      id: 'executive',
      name: 'Executive Summary',
      duration: '45 seconds',
      script: 'Leadership experience → Strategic achievements → Vision → Value proposition',
      description: 'Designed for senior leadership and executive positions'
    }
  ];

  const addKeyPoint = () => {
    if (videoData.newPoint.trim() && !videoData.keyPoints.includes(videoData.newPoint.trim())) {
      setVideoData(prev => ({
        ...prev,
        keyPoints: [...prev.keyPoints, prev.newPoint.trim()],
        newPoint: ''
      }));
    }
  };

  const removeKeyPoint = (pointToRemove: string) => {
    setVideoData(prev => ({
      ...prev,
      keyPoints: prev.keyPoints.filter(point => point !== pointToRemove)
    }));
  };

  const startRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Your video resume recording has begun.",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
    toast({
      title: "Recording Complete",
      description: "Your video resume has been recorded successfully.",
    });
  };

  const generateScript = () => {
    if (!videoData.title || videoData.keyPoints.length === 0) {
      toast({
        title: "Error",
        description: "Please add a title and key points first",
        variant: "destructive",
      });
      return;
    }

    const script = `Hi, I'm [Your Name], ${videoData.title}.

${videoData.introduction}

Here are my key strengths:
${videoData.keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

I'm excited about the opportunity to contribute to your team and would love to discuss how my experience can benefit your organization.

Thank you for your time, and I look forward to hearing from you.`;

    navigator.clipboard.writeText(script);
    toast({
      title: "Script Generated!",
      description: "Your video script has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Video Resume Creator</h1>
          <p className="text-xl text-muted-foreground">
            Create compelling video resumes to stand out from the crowd
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="script">Script Builder</TabsTrigger>
              <TabsTrigger value="record">Record</TabsTrigger>
              <TabsTrigger value="preview">Preview & Share</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Choose a Template</CardTitle>
                  <CardDescription>
                    Select a video resume template that fits your industry and style
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {templates.map((template) => (
                      <Card key={template.id} className="border-2 hover:border-primary cursor-pointer transition-colors">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold">{template.name}</h3>
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                {template.duration}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <div className="text-sm">
                              <span className="font-medium">Structure: </span>
                              <span className="text-muted-foreground">{template.script}</span>
                            </div>
                            <Button className="w-full">Use This Template</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="script" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Build Your Script</CardTitle>
                    <CardDescription>
                      Create a compelling script for your video resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Professional Title</label>
                      <Input
                        placeholder="e.g., Marketing Manager with 5 years experience"
                        value={videoData.title}
                        onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Introduction</label>
                      <Textarea
                        placeholder="Brief introduction about yourself and your passion..."
                        value={videoData.introduction}
                        onChange={(e) => setVideoData(prev => ({ ...prev, introduction: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Key Points</label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="Add a key achievement or skill"
                          value={videoData.newPoint}
                          onChange={(e) => setVideoData(prev => ({ ...prev, newPoint: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && addKeyPoint()}
                        />
                        <Button onClick={addKeyPoint} variant="outline">Add</Button>
                      </div>
                      <div className="space-y-2">
                        {videoData.keyPoints.map((point, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                            <span className="text-sm">{point}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeKeyPoint(point)}
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Target Duration</label>
                      <Input
                        type="number"
                        placeholder="60"
                        value={videoData.duration}
                        onChange={(e) => setVideoData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground ml-2">seconds</span>
                    </div>
                    
                    <Button onClick={generateScript} className="w-full">
                      Generate Script
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tips for Success</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">📹 Recording Tips</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Use good lighting (face a window or use a ring light)</li>
                          <li>• Ensure clear audio (use an external microphone if possible)</li>
                          <li>• Maintain eye contact with the camera</li>
                          <li>• Keep a professional background</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">🎯 Content Tips</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Keep it concise (30-90 seconds ideal)</li>
                          <li>• Start with a strong hook</li>
                          <li>• Focus on achievements, not just responsibilities</li>
                          <li>• End with a clear call to action</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">💼 Professional Tips</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Dress appropriately for your industry</li>
                          <li>• Practice your script beforehand</li>
                          <li>• Speak clearly and at a moderate pace</li>
                          <li>• Show enthusiasm and personality</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="record" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Record Your Video Resume</CardTitle>
                  <CardDescription>
                    Use your device's camera to record your video resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      {!isRecording && !hasRecording && (
                        <div className="text-center">
                          <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">Click "Start Recording" to begin</p>
                        </div>
                      )}
                      {isRecording && (
                        <div className="text-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-4 animate-pulse"></div>
                          <p className="text-red-500 font-medium">Recording in progress...</p>
                        </div>
                      )}
                      {hasRecording && !isRecording && (
                        <div className="text-center">
                          <Play className="h-16 w-16 mx-auto mb-4 text-primary cursor-pointer" />
                          <p className="text-muted-foreground">Click to preview your recording</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      {!isRecording ? (
                        <Button onClick={startRecording} size="lg">
                          <Video className="h-5 w-5 mr-2" />
                          Start Recording
                        </Button>
                      ) : (
                        <Button onClick={stopRecording} variant="destructive" size="lg">
                          <Pause className="h-5 w-5 mr-2" />
                          Stop Recording
                        </Button>
                      )}
                      
                      {hasRecording && (
                        <>
                          <Button variant="outline" size="lg">
                            <Upload className="h-5 w-5 mr-2" />
                            Upload File
                          </Button>
                          <Button variant="outline" size="lg">
                            Re-record
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Preview</CardTitle>
                    <CardDescription>
                      Review your video resume before sharing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        {hasRecording ? (
                          <div className="text-center">
                            <Play className="h-16 w-16 mx-auto mb-4 text-primary cursor-pointer" />
                            <p className="text-muted-foreground">Your Video Resume</p>
                            <Badge variant="outline" className="mt-2">
                              <Clock className="h-3 w-3 mr-1" />
                              {videoData.duration}s
                            </Badge>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No video recorded yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Share & Export</CardTitle>
                    <CardDescription>
                      Download or share your video resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button className="w-full" disabled={!hasRecording}>
                          <Download className="h-4 w-4 mr-2" />
                          Download MP4
                        </Button>
                        <Button variant="outline" className="w-full" disabled={!hasRecording}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Link
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Video Analytics</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Views</span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            0
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span>{videoData.duration}s</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Format</span>
                          <span>MP4</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Sharing Options</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm" className="w-full">
                            LinkedIn
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            Email
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            Embed
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default VideoResume;