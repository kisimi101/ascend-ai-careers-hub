import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Languages, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResumeTranslator = () => {
  const [resumeText, setResumeText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translatedResume, setTranslatedResume] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const translateResume = async () => {
    if (!resumeText.trim() || !targetLanguage) {
      toast({
        title: "Error",
        description: "Please provide resume content and select target language",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock translation - in real implementation, this would call translation API
    const mockTranslation = `[Translated Resume Content]

NOMBRE: Juan Pérez
EMAIL: juan.perez@email.com
TELÉFONO: +1-555-0123

RESUMEN PROFESIONAL:
Desarrollador de software experimentado con más de 5 años de experiencia en desarrollo full-stack. Especializado en JavaScript, React y Node.js. Probada capacidad para liderar equipos y entregar proyectos de alta calidad a tiempo.

EXPERIENCIA LABORAL:

Desarrollador Senior de Software | TechCorp Inc. | 2020 - Presente
• Dirigí el desarrollo de aplicaciones web escalables que sirven a más de 100,000 usuarios
• Implementé arquitectura de microservicios, mejorando el rendimiento del sistema en un 40%
• Mentoricé a desarrolladores junior y establecí mejores prácticas de codificación

Desarrollador de Software | StartupXYZ | 2018 - 2020
• Desarrollé y mantuve múltiples aplicaciones web usando React y Node.js
• Colaboré con equipos multifuncionales para entregar características del producto
• Optimicé el rendimiento de la base de datos, reduciendo los tiempos de consulta en un 30%

EDUCACIÓN:
Licenciatura en Ciencias de la Computación | Universidad Tech | 2018

HABILIDADES TÉCNICAS:
JavaScript, React, Node.js, Python, SQL, MongoDB, AWS, Git, Docker`;
    
    setTranslatedResume(mockTranslation);
    setIsTranslating(false);
    
    toast({
      title: "Translation Complete!",
      description: "Your resume has been translated successfully.",
    });
  };

  const copyTranslation = () => {
    navigator.clipboard.writeText(translatedResume);
    toast({
      title: "Copied!",
      description: "Translated resume copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resume Translator</h1>
          <p className="text-xl text-muted-foreground">
            Translate your resume to any language while maintaining professional formatting
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Language Settings
              </CardTitle>
              <CardDescription>
                Select source and target languages for translation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">From</label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <ArrowRight className="h-5 w-5 text-muted-foreground mt-6" />
                
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">To</label>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.filter(lang => lang.code !== sourceLanguage).map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Original Resume</CardTitle>
                <CardDescription>
                  Paste your resume content in the source language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[400px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Translated Resume</CardTitle>
                <CardDescription>
                  Your resume translated to the target language
                </CardDescription>
              </CardHeader>
              <CardContent>
                {translatedResume ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg min-h-[400px]">
                      <pre className="whitespace-pre-wrap text-sm">{translatedResume}</pre>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={copyTranslation} className="flex-1">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Translation
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted rounded-lg min-h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Translated resume will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={translateResume} 
              size="lg"
              disabled={isTranslating}
            >
              <Languages className="h-5 w-5 mr-2" />
              {isTranslating ? "Translating..." : "Translate Resume"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeTranslator;