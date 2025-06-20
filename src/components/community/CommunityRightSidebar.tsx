
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  TrendingUp, 
  Users, 
  Briefcase,
  Calendar,
  MapPin,
  ExternalLink
} from "lucide-react";

export const CommunityRightSidebar = () => {
  const trendingTopics = [
    { tag: "#JobSearch", posts: "12.3K posts" },
    { tag: "#RemoteWork", posts: "8.7K posts" },
    { tag: "#CareerTips", posts: "6.2K posts" },
    { tag: "#TechJobs", posts: "15.1K posts" },
    { tag: "#InterviewTips", posts: "4.8K posts" },
  ];

  const suggestedUsers = [
    {
      name: "Career Coach Lisa",
      username: "@careercoach_lisa",
      followers: "15.2K followers",
      verified: true
    },
    {
      name: "Tech Recruiter Max",
      username: "@techrecruiter_max",
      followers: "8.9K followers",
      verified: false
    },
    {
      name: "Resume Expert Anna",
      username: "@resume_anna",
      followers: "22.1K followers",
      verified: true
    }
  ];

  const upcomingEvents = [
    {
      title: "Virtual Job Fair - Tech",
      date: "Dec 28, 2024",
      time: "2:00 PM EST",
      attendees: 245
    },
    {
      title: "Resume Review Workshop",
      date: "Dec 30, 2024",
      time: "6:00 PM EST",
      attendees: 89
    }
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search CareerHub"
          className="pl-10 bg-gray-50 border-0 focus:bg-white"
        />
      </div>

      {/* Trending Topics */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            What's happening
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="hover:bg-gray-50 p-2 -m-2 rounded-lg cursor-pointer transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{topic.tag}</p>
                  <p className="text-xs text-gray-500">{topic.posts}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-blue-500 text-sm">
            Show more
          </Button>
        </CardContent>
      </Card>

      {/* Who to follow */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Who to follow
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {suggestedUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    {user.verified && (
                      <Badge variant="secondary" className="h-4 px-1 text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{user.followers}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Follow
              </Button>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-blue-500 text-sm">
            Show more
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="border-l-4 border-orange-500 pl-3 hover:bg-gray-50 p-2 -ml-2 rounded-r-lg transition-colors">
              <h4 className="font-semibold text-sm">{event.title}</h4>
              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                <span>{event.date}</span>
                <span>{event.time}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{event.attendees} attending</span>
                <Button size="sm" variant="outline" className="text-xs h-6">
                  Join
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Career Tools Quick Access */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Quick Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm">
            Resume Builder
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Cover Letter Generator
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Interview Practice
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm">
            Salary Estimator
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
