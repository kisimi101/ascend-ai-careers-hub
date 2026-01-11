import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Mail, Phone, Building, Edit, Trash2, Search, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Reference {
  id: string;
  user_id: string;
  name: string;
  title: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const ReferenceManager = () => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<Reference | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    relationship: '',
    notes: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchReferences();
  }, [user]);

  const fetchReferences = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('references')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferences(data || []);
    } catch (error) {
      console.error('Error fetching references:', error);
      toast({
        title: "Error",
        description: "Failed to load references.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to manage references.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingReference) {
        const { error } = await supabase
          .from('references')
          .update({
            name: formData.name,
            title: formData.title || null,
            company: formData.company || null,
            email: formData.email || null,
            phone: formData.phone || null,
            relationship: formData.relationship || null,
            notes: formData.notes || null
          })
          .eq('id', editingReference.id);

        if (error) throw error;
        toast({
          title: "Reference updated",
          description: "Your reference has been updated successfully."
        });
      } else {
        const { error } = await supabase
          .from('references')
          .insert({
            user_id: user.id,
            name: formData.name,
            title: formData.title || null,
            company: formData.company || null,
            email: formData.email || null,
            phone: formData.phone || null,
            relationship: formData.relationship || null,
            notes: formData.notes || null
          });

        if (error) throw error;
        toast({
          title: "Reference added",
          description: "Your reference has been added successfully."
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchReferences();
    } catch (error) {
      console.error('Error saving reference:', error);
      toast({
        title: "Error",
        description: "Failed to save reference.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('references')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Reference deleted",
        description: "Your reference has been removed."
      });
      fetchReferences();
    } catch (error) {
      console.error('Error deleting reference:', error);
      toast({
        title: "Error",
        description: "Failed to delete reference.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (reference: Reference) => {
    setEditingReference(reference);
    setFormData({
      name: reference.name,
      title: reference.title || '',
      company: reference.company || '',
      email: reference.email || '',
      phone: reference.phone || '',
      relationship: reference.relationship || '',
      notes: reference.notes || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
      notes: ''
    });
    setEditingReference(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`
    });
  };

  const filteredReferences = references.filter(ref =>
    ref.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRelationshipColor = (relationship: string | null) => {
    switch (relationship) {
      case 'manager':
        return 'bg-purple-500';
      case 'colleague':
        return 'bg-blue-500';
      case 'mentor':
        return 'bg-green-500';
      case 'client':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Reference Manager</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Professional References</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Store and organize your professional references for easy access during job applications
            </p>
          </div>

          {!user ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Login Required</h3>
                <p className="text-muted-foreground mb-4">
                  Please log in to manage your professional references.
                </p>
                <Button>Log In</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Search and Add */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search references..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Reference
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingReference ? 'Edit Reference' : 'Add New Reference'}</DialogTitle>
                      <DialogDescription>
                        {editingReference ? 'Update the reference details.' : 'Add a professional reference to your list.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="relationship">Relationship</Label>
                        <Select
                          value={formData.relationship}
                          onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="colleague">Colleague</SelectItem>
                            <SelectItem value="mentor">Mentor</SelectItem>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Any additional notes..."
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        {editingReference ? 'Update Reference' : 'Add Reference'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* References List */}
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                        <div className="h-4 bg-muted rounded w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredReferences.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No References Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your reference list by adding your first reference.
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Reference
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredReferences.map((reference) => (
                    <Card key={reference.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{reference.name}</CardTitle>
                            {reference.title && (
                              <CardDescription>{reference.title}</CardDescription>
                            )}
                          </div>
                          {reference.relationship && (
                            <Badge className={getRelationshipColor(reference.relationship)}>
                              {reference.relationship}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {reference.company && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building className="w-4 h-4" />
                              <span>{reference.company}</span>
                            </div>
                          )}
                          {reference.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span className="flex-1">{reference.email}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(reference.email!, 'Email')}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          {reference.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span className="flex-1">{reference.phone}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(reference.phone!, 'Phone')}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          {reference.notes && (
                            <p className="text-muted-foreground mt-2 pt-2 border-t">
                              {reference.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEdit(reference)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(reference.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReferenceManager;
