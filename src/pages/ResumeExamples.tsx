import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Eye, Download, Star, Filter } from 'lucide-react';

const ResumeExamples = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'technology', name: 'Technology' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'finance', name: 'Finance' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'education', name: 'Education' },
    { id: 'sales', name: 'Sales' }
  ];

  const resumeExamples = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      category: 'technology',
      experience: 'Senior Level',
      rating: 4.9,
      downloads: 2543,
      description: 'Full-stack developer with 8+ years experience in React, Node.js, and cloud architecture.',
      tags: ['React', 'Node.js', 'AWS', 'Python'],
      preview: 'https://via.placeholder.com/300x400'
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
      preview: 'https://via.placeholder.com/300x400'
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
      preview: 'https://via.placeholder.com/300x400'
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
      preview: 'https://via.placeholder.com/300x400'
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
      preview: 'https://via.placeholder.com/300x400'
    },
    {
      id: 6,
      title: 'Sales Representative',
      category: 'sales',
      experience: 'Entry Level',
      rating: 4.5,
      downloads: 643,
      description: 'Motivated sales professional with strong communication skills and customer service experience.',
      tags: ['Customer Service', 'CRM', 'Lead Generation', 'Negotiation'],
      preview: 'https://via.placeholder.com/300x400'
    }
  ];

  const filteredExamples = resumeExamples.filter(example => {
    const matchesSearch = example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         example.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || example.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resume Examples</h1>
          <p className="text-xl text-muted-foreground">
            Browse professional resume templates and examples across different industries
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by job title, skills, or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExamples.map((example) => (
                  <Card key={example.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-24 bg-white rounded shadow-sm mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Resume Preview</p>
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
                          <span>{example.downloads} downloads</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" className="flex-1">
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
    </div>
  );
};

export default ResumeExamples;