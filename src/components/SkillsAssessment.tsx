
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Code, Users, TrendingUp, Award, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const skillCategories = [
  {
    name: "Technical Skills",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    skills: ["JavaScript", "Python", "React", "Data Analysis", "SQL"],
    progress: 75
  },
  {
    name: "Soft Skills",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    skills: ["Communication", "Leadership", "Problem Solving", "Teamwork", "Time Management"],
    progress: 82
  },
  {
    name: "Industry Knowledge",
    icon: TrendingUp,
    color: "from-green-500 to-teal-500",
    skills: ["Market Trends", "Business Strategy", "Project Management", "Analytics", "Innovation"],
    progress: 68
  },
  {
    name: "AI & Automation",
    icon: Brain,
    color: "from-orange-500 to-red-500",
    skills: ["Machine Learning", "AI Tools", "Process Automation", "Data Science", "Prompt Engineering"],
    progress: 45
  }
];

const achievements = [
  { name: "Quick Learner", icon: "🚀", description: "Completed 5 assessments in one day" },
  { name: "Skill Master", icon: "🏆", description: "Scored 90%+ in Technical Skills" },
  { name: "Well Rounded", icon: "⭐", description: "High scores across all categories" },
  { name: "Growth Mindset", icon: "📈", description: "Improved scores by 20% this month" }
];

export const SkillsAssessment = () => {
  const [currentSkill, setCurrentSkill] = useState(0);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentProgress, setAssessmentProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skillCategories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const startAssessment = () => {
    setIsAssessing(true);
    setAssessmentProgress(0);
    
    const progressInterval = setInterval(() => {
      setAssessmentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAssessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
              🧠 Skills Assessment
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Your
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {" "}Skill Strengths
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take our AI-powered assessment to identify your strengths, discover growth opportunities, and get personalized career recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Assessment Interface */}
          <div className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Brain className="mr-3 text-purple-500" size={28} />
                  Interactive Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${skillCategories[currentSkill].color} flex items-center justify-center mb-4 transition-all duration-500`}>
                      <skillCategories[currentSkill].icon className="text-white" size={36} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{skillCategories[currentSkill].name}</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {skillCategories[currentSkill].skills.map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isAssessing ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Assessment Progress</span>
                        <span className="text-sm font-semibold">{assessmentProgress}%</span>
                      </div>
                      <Progress value={assessmentProgress} className="h-3" />
                      <p className="text-center text-gray-600">Analyzing your responses...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Clock className="text-purple-500 mr-2" size={16} />
                          <span className="text-sm font-semibold text-purple-700">Quick Assessment</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          • 15 minutes to complete<br/>
                          • Get instant results<br/>
                          • Personalized recommendations
                        </p>
                      </div>
                      <Button 
                        onClick={startAssessment}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        size="lg"
                      >
                        Start Free Assessment
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 text-yellow-500" size={20} />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, idx) => (
                    <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <div className="text-sm font-semibold text-gray-900">{achievement.name}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Progress */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center mb-8">Your Current Skill Profile</h3>
            {skillCategories.map((category, idx) => (
              <Card key={idx} className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${currentSkill === idx ? 'ring-2 ring-purple-200' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mr-3`}>
                        <category.icon className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.skills.length} skills assessed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{category.progress}%</div>
                      <div className="text-xs text-gray-500">Proficiency</div>
                    </div>
                  </div>
                  <Progress value={category.progress} className="h-2" />
                  <div className="flex flex-wrap gap-1 mt-3">
                    {category.skills.slice(0, 3).map((skill, skillIdx) => (
                      <span key={skillIdx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {category.skills.length > 3 && (
                      <span className="text-gray-400 text-xs px-2 py-1">
                        +{category.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to unlock your potential?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who have discovered their strengths and accelerated their careers with our comprehensive skill assessment platform.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Get Detailed Assessment Report
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
