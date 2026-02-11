
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, Trophy, Target, Zap } from "lucide-react";
import { useState } from "react";

const skillsQuestions = [
  {
    id: 1,
    question: "What is your experience level with React?",
    options: ["Beginner", "Intermediate", "Advanced", "Expert"],
    correct: 2
  },
  {
    id: 2,
    question: "Which programming language are you most comfortable with?",
    options: ["JavaScript", "Python", "Java", "C++"],
    correct: 0
  },
  {
    id: 3,
    question: "How would you rate your problem-solving skills?",
    options: ["Fair", "Good", "Very Good", "Excellent"],
    correct: 3
  },
  {
    id: 4,
    question: "What's your preferred work environment?",
    options: ["Remote", "Hybrid", "Office", "Flexible"],
    correct: 3
  },
  {
    id: 5,
    question: "How do you handle tight deadlines?",
    options: ["Stress out", "Plan carefully", "Work overtime", "Communicate early"],
    correct: 3
  }
];

export const SkillsAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < skillsQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === skillsQuestions[index].correct) {
        correct++;
      }
    });
    return Math.round((correct / skillsQuestions.length) * 100);
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { message: "Excellent! You're ready for senior positions.", icon: Trophy, color: "text-yellow-500" };
    if (score >= 60) return { message: "Good job! You have solid foundation skills.", icon: Target, color: "text-emerald-500" };
    if (score >= 40) return { message: "Not bad! Keep learning and improving.", icon: Zap, color: "text-blue-500" };
    return { message: "Keep practicing! There's room for growth.", icon: Clock, color: "text-muted-foreground" };
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setIsStarted(false);
  };

  if (!isStarted) {
    return (
      <section className="py-20 px-6 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full text-sm font-semibold">
                🎯 Skills Assessment
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Test Your
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {" "}Professional Skills
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Take our quick 5-minute assessment to discover your strengths and get personalized career recommendations
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <Target className="text-white" size={40} />
                </div>
                <CardTitle className="text-2xl mb-4">Ready to Begin?</CardTitle>
                <p className="text-muted-foreground">
                  This assessment will help us understand your skills and match you with the perfect career opportunities.
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">5</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">5</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-500">Free</div>
                    <div className="text-sm text-muted-foreground">Always</div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsStarted(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg"
                >
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const { message, icon: Icon, color } = getScoreMessage(score);

    return (
      <section className="py-20 px-6 bg-muted/20">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <Icon className={`${color} bg-card rounded-full p-2`} size={40} />
                </div>
                <CardTitle className="text-3xl mb-4">Assessment Complete!</CardTitle>
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                  {score}%
                </div>
                <p className="text-muted-foreground mb-6">{message}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm text-foreground">
                    <span>Your Score</span>
                    <span>{score}%</span>
                  </div>
                  <Progress value={score} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-emerald-500/10 rounded-lg">
                    <CheckCircle className="text-emerald-500 mx-auto mb-2" size={24} />
                    <div className="font-semibold text-emerald-500">Correct Answers</div>
                    <div className="text-2xl font-bold text-emerald-500">
                      {answers.filter((answer, index) => answer === skillsQuestions[index].correct).length}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-destructive/10 rounded-lg">
                    <XCircle className="text-destructive mx-auto mb-2" size={24} />
                    <div className="font-semibold text-destructive">Incorrect Answers</div>
                    <div className="text-2xl font-bold text-destructive">
                      {answers.filter((answer, index) => answer !== skillsQuestions[index].correct).length}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={resetAssessment}
                    variant="outline"
                    className="flex-1"
                  >
                    Retake Assessment
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex-1"
                  >
                    View Job Matches
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-muted/20">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {skillsQuestions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentQuestion + 1) / skillsQuestions.length) * 100)}% Complete
              </span>
            </div>
            <Progress 
              value={((currentQuestion + 1) / skillsQuestions.length) * 100} 
              className="h-2 mb-6" 
            />
          </div>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl mb-4">
                {skillsQuestions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skillsQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    variant="outline"
                    className="w-full text-left justify-start p-4 h-auto hover:bg-accent hover:border-primary/30 transition-all"
                  >
                    <span className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center mr-3 text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
