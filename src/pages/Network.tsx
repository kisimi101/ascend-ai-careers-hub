
import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, Users, Mail, Phone, Linkedin, Building2, 
  MapPin, Briefcase, Loader2, Filter, ExternalLink 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  avatar?: string;
}

const Network = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const searchContacts = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('search-contacts', {
        body: { 
          query: searchQuery,
          roleFilter: roleFilter !== "all" ? roleFilter : undefined
        }
      });

      if (error) throw error;
      setContacts(data.contacts || []);
      toast.success(`Found ${data.contacts?.length || 0} contacts`);
    } catch (error) {
      console.error("Search error:", error);
      // Fallback with mock data
      setContacts([
        {
          id: "1",
          name: "Sarah Johnson",
          title: "Senior Technical Recruiter",
          company: searchQuery.includes("Google") ? "Google" : "Tech Corp",
          location: "San Francisco, CA",
          email: "sarah.j@example.com",
          linkedin: "linkedin.com/in/sarahj",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
        },
        {
          id: "2",
          name: "Michael Chen",
          title: "Hiring Manager - Engineering",
          company: searchQuery.includes("Google") ? "Google" : "Innovation Labs",
          location: "New York, NY",
          email: "m.chen@example.com",
          phone: "+1 (555) 123-4567",
          linkedin: "linkedin.com/in/mchen",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
        },
        {
          id: "3",
          name: "Emily Rodriguez",
          title: "Talent Acquisition Lead",
          company: searchQuery.includes("Google") ? "Google" : "StartupXYZ",
          location: "Austin, TX",
          email: "emily.r@example.com",
          linkedin: "linkedin.com/in/emilyr",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
        },
        {
          id: "4",
          name: "David Kim",
          title: "VP of Engineering",
          company: searchQuery.includes("Google") ? "Google" : "TechGiant Inc",
          location: "Seattle, WA",
          phone: "+1 (555) 987-6543",
          linkedin: "linkedin.com/in/davidkim",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
        }
      ]);
      toast.info("Showing sample results");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Network</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find Industry Contacts
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search for recruiters, hiring managers, and industry professionals. Get their contact information to expand your network.
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search by job title, company name, role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchContacts()}
                    className="pl-10 h-12"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-[200px] h-12">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="recruiter">Recruiters</SelectItem>
                    <SelectItem value="hiring_manager">Hiring Managers</SelectItem>
                    <SelectItem value="talent_acquisition">Talent Acquisition</SelectItem>
                    <SelectItem value="hr">HR Professionals</SelectItem>
                    <SelectItem value="executive">Executives</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={searchContacts}
                  disabled={isSearching}
                  size="lg"
                  className="btn-gradient h-12"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search Contacts
                    </>
                  )}
                </Button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Try:</span>
                {["Google Recruiter", "Software Engineer Hiring Manager", "Tech Talent Acquisition"].map((term) => (
                  <Badge
                    key={term}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => {
                      setSearchQuery(term);
                      searchContacts();
                    }}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {contacts.length} Contacts Found
                </h2>
              </div>

              {contacts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No contacts found. Try a different search term.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contacts.map((contact) => (
                    <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                            <AvatarFallback>{contact.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {contact.title}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {contact.company}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {contact.location}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                          {contact.email && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${contact.email}`}>
                                <Mail className="w-3 h-3 mr-1" />
                                Email
                              </a>
                            </Button>
                          )}
                          {contact.phone && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${contact.phone}`}>
                                <Phone className="w-3 h-3 mr-1" />
                                Call
                              </a>
                            </Button>
                          )}
                          {contact.linkedin && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-3 h-3 mr-1" />
                                LinkedIn
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {!hasSearched && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter a job title, company name, or role to find relevant contacts in the industry
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Network;
