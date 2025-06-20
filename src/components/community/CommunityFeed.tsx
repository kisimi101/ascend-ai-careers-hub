
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark,
  Image as ImageIcon,
  Smile,
  MoreHorizontal
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

export const CommunityFeed = () => {
  const [newPost, setNewPost] = useState("");
  
  const [posts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Sarah Johnson",
        username: "@sarahj_dev",
        avatar: "/placeholder.svg",
        verified: true
      },
      content: "Just landed my dream job as a Senior Software Engineer! 🎉 The interview process was intense, but the practice sessions on CareerHub really helped. Special thanks to this amazing community for all the support and advice! #JobSuccess #CareerGrowth",
      timestamp: "2h",
      likes: 142,
      comments: 23,
      shares: 8,
      liked: false
    },
    {
      id: "2",
      author: {
        name: "Mike Chen",
        username: "@mikechen_ux",
        avatar: "/placeholder.svg",
        verified: false
      },
      content: "Pro tip for job seekers: Always customize your resume for each application. I used CareerHub's AI Resume Builder and saw a 3x increase in interview calls! What's your best job search tip?",
      timestamp: "4h",
      likes: 89,
      comments: 17,
      shares: 12,
      liked: true
    },
    {
      id: "3",
      author: {
        name: "Emma Rodriguez",
        username: "@emma_marketing",
        avatar: "/placeholder.svg",
        verified: true
      },
      content: "Networking event was incredible today! Met so many talented professionals. Remember: networking isn't just about what others can do for you, but what you can offer them too. Building genuine relationships is key! 🤝",
      timestamp: "6h",
      likes: 67,
      comments: 9,
      shares: 5,
      liked: false
    }
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Post Composer */}
      <Card className="border-0 border-b border-gray-200 rounded-none">
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's happening in your career journey?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="border-0 resize-none focus:ring-0 text-lg placeholder:text-gray-500"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-3">
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4 text-blue-500" />
                  </Button>
                </div>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  disabled={!newPost.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-0">
        {posts.map((post) => (
          <Card key={post.id} className="border-0 border-b border-gray-200 rounded-none hover:bg-gray-50/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-sm">{post.author.name}</h3>
                    {post.author.verified && (
                      <Badge variant="secondary" className="h-4 px-1 text-xs">
                        ✓
                      </Badge>
                    )}
                    <span className="text-gray-500 text-sm">{post.author.username}</span>
                    <span className="text-gray-500 text-sm">·</span>
                    <span className="text-gray-500 text-sm">{post.timestamp}</span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm mb-3 leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center justify-between max-w-md">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">{post.comments}</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`${post.liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                      <span className="text-xs">{post.likes}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                      <Share className="h-4 w-4 mr-1" />
                      <span className="text-xs">{post.shares}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
