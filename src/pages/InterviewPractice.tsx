import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, Play, RotateCcw, Trophy, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  type: 'behavioral' | 'technical' | 'situational';
  question: string;
  tips: string[];
}

const InterviewPractice = () => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const questionBank: Record<string, Question[]> = {
    behavioral: [
      {
        id: 1,
        type: 'behavioral',
        question: "Tell me about a time when you faced a significant challenge at work. How did you handle it?",
        tips: ["Use the STAR method", "Be specific about your role", "Focus on the outcome"]
      },
      {
        id: 2,
        type: 'behavioral',
        question: "Describe a situation where you had to work with a difficult team member.",
        tips: ["Show emotional intelligence", "Demonstrate conflict resolution", "Highlight teamwork"]
      },
      {
        id: 3,
        type: 'behavioral',
        question: "Tell me about a time you failed. What did you learn?",
        tips: ["Show vulnerability and growth", "Focus on lessons learned", "Demonstrate resilience"]
      }
    ],
    technical: [
      {
        id: 4,
        type: 'technical',
        question: "How would you approach debugging a performance issue in a web application?",
        tips: ["Mention profiling tools", "Discuss systematic approach", "Consider multiple causes"]
      },
      {
        id: 5,
        type: 'technical',
        question: "Explain the difference between SQL and NoSQL databases. When would you use each?",
        tips: ["Compare structure vs flexibility", "Discuss scalability", "Give practical examples"]
      }
    ],
    situational: [
      {
        id: 6,
        type: 'situational',
        question: "If you were assigned to a project with an impossible deadline, how would you handle it?",
        tips: ["Show prioritization skills", "Mention stakeholder communication", "Discuss trade-offs"]
      }
    ]
  };

  const startSession = () => {
    if (!selectedType || !selectedRole) {
      toast({
        title: "Missing Information",
        description: "Please select question type and role",
        variant: "destructive",
      });
      return;
    }

    const questions = questionBank[selectedType] || [];
    if (questions.length > 0) {
      setCurrentQuestion(questions[0]);
      setSessionStarted(true);
      setQuestionIndex(0);
      setScore(0);
      setFeedback("");
      setUserAnswer("");
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: "No Answer",
        description: "Please provide an answer before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const answerLength = userAnswer.split(' ').length;
      const hasSTAR = userAnswer.toLowerCase().includes('situation') || 
                      userAnswer.toLowerCase().includes('task') ||
                      userAnswer.toLowerCase().includes('action') ||
                      userAnswer.toLowerCase().includes('result');
      
      let newScore = 0;
      let feedbackText = "";

      if (answerLength < 20) {
        newScore = 3;
        feedbackText = "Your answer is too brief. Try to provide more detail and specific examples.";
      } else if (answerLength < 50) {
        newScore = hasSTAR ? 7 : 5;
        feedbackText = hasSTAR 
          ? "Good structure, but could use more detail in each component."
          : "Consider using the STAR method (Situation, Task, Action, Result) for better structure.";
      } else {
        newScore = hasSTAR ? 9 : 7;
        feedbackText = hasSTAR 
          ? "Excellent detailed response with clear structure!"
          : "Great detail! Consider organizing with the STAR method for even better impact.";
      }

      setScore(newScore);
      setFeedback(feedbackText);
      setIsAnalyzing(false);
      
      toast({
        title: "Answer Analyzed!",
        description: `Score: ${newScore}/10`,
      });
    }, 3000);
  };

  const nextQuestion = () => {
    const questions = questionBank[selectedType] || [];
    const nextIndex = questionIndex + 1;
    
    if (nextIndex < questions.length) {
      setCurrentQuestion(questions[nextIndex]);
      setQuestionIndex(nextIndex);
      setUserAnswer("");
      setFeedback("");
      setScore(0);
    } else {
      // Session complete
      toast({
        title: "Session Complete!",
        description: "Great job practicing! Review your feedback and try again.",
      });
    }
  };

  const resetSession = () => {
    setSessionStarted(false);
    setCurrentQuestion(null);
    setUserAnswer("");
    setFeedback("");
    setScore(0);
    setQuestionIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-800 text-sm font-medium mb-6">
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Interview Practice
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Master Your
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Interview Skills</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practice with AI-powered mock interviews. Get instant feedback and improve your responses.
            </p>
          </div>

          {!sessionStarted ? (
            /* Setup Form */
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-500" />
                  Interview Setup
                </CardTitle>
                <CardDescription>
                  Choose your interview type and role to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Question Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="behavioral">Behavioral Questions</SelectItem>
                      <SelectItem value="technical">Technical Questions</SelectItem>
                      <SelectItem value="situational">Situational Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Target Role</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your target role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software-engineer">Software Engineer</SelectItem>
                      <SelectItem value="product-manager">Product Manager</SelectItem>
                      <SelectItem value="data-scientist">Data Scientist</SelectItem>
                      <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                      <SelectItem value="sales-rep">Sales Representative</SelectItem>
                      <SelectItem value="project-manager">Project Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={startSession}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Interview Practice
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Interview Session */
            <div className="space-y-6">
              {/* Progress Bar */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-500">
                      Question {questionIndex + 1} of {questionBank[selectedType]?.length || 0}
                    </span>
                  </div>
                  <Progress 
                    value={((questionIndex + 1) / (questionBank[selectedType]?.length || 1)) * 100} 
                    className="h-2"
                  />
                </CardContent>
              </Card>

              {/* Current Question */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {currentQuestion?.type} Question
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      No time limit
                    </div>
                  </div>
                  <CardTitle className="text-xl">
                    {currentQuestion?.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">💡 Tips:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {currentQuestion?.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <Textarea
                    placeholder="Type your answer here... Take your time to think through your response."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    rows={6}
                    className="mb-4"
                  />

                  <div className="flex gap-3">
                    <Button 
                      onClick={submitAnswer}
                      disabled={isAnalyzing || !userAnswer.trim()}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                    >
                      {isAnalyzing ? "Analyzing..." : "Submit Answer"}
                    </Button>
                    <Button variant="outline" onClick={resetSession}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Session
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback */}
              {feedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-orange-500" />
                      AI Feedback
                      <Badge className="ml-auto bg-gradient-to-r from-orange-500 to-red-500">
                        Score: {score}/10
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{feedback}</p>
                    
                    {questionIndex + 1 < (questionBank[selectedType]?.length || 0) && (
                      <Button onClick={nextQuestion} variant="outline">
                        Next Question
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InterviewPractice;