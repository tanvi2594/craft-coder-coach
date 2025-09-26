import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Code, 
  Bot, 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  BarChart3
} from "lucide-react";

interface CandidateInfo {
  name: string;
  email: string;
  position: string;
  experience: string;
  dsaExperience: string;
  preferredLanguage: string;
  additionalInfo: string;
}

interface LandingPageProps {
  onStartInterview: (candidateInfo: CandidateInfo) => void;
}

export const LandingPage = ({ onStartInterview }: LandingPageProps) => {
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>({
    name: "",
    email: "",
    position: "",
    experience: "",
    dsaExperience: "",
    preferredLanguage: "python",
    additionalInfo: ""
  });

  const [currentStep, setCurrentStep] = useState<"intro" | "form">("intro");

  const handleStartAssessment = () => {
    setCurrentStep("form");
  };

  const handleSubmitForm = () => {
    if (candidateInfo.name && candidateInfo.email && candidateInfo.experience && candidateInfo.dsaExperience) {
      onStartInterview(candidateInfo);
    }
  };

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI-Powered Interviewer",
      description: "Advanced conversational AI that adapts to your coding style and provides human-like feedback"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Real-time Code Analysis", 
      description: "Instant syntax checking, complexity analysis, and code quality assessment as you type"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Adaptive Difficulty",
      description: "Dynamic problem selection based on your performance and experience level"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Progressive Hints",
      description: "Contextual guidance system: Nudge → Guide → Direction, just like a human interviewer"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Comprehensive Analytics",
      description: "Detailed performance metrics, code quality scores, and behavioral analysis"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Natural Flow",
      description: "Warm-up, main problem, and wrap-up phases that mirror real interview experiences"
    }
  ];

  const stats = [
    { number: "95%", label: "Accuracy in candidate assessment" },
    { number: "60%", label: "Reduction in interview time" },
    { number: "10k+", label: "Successful interviews conducted" },
    { number: "4.9/5", label: "Average candidate satisfaction" }
  ];

  if (currentStep === "form") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 border-code-border bg-card">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">CodeSage Assessment</h1>
            </div>
            <p className="text-muted-foreground">Please provide some information to personalize your interview experience</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={candidateInfo.name}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={candidateInfo.email}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position Applied For</Label>
              <Input
                id="position"
                value={candidateInfo.position}
                onChange={(e) => setCandidateInfo(prev => ({ ...prev, position: e.target.value }))}
                placeholder="e.g., Software Engineer, Frontend Developer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Overall Programming Experience *</Label>
                <Select onValueChange={(value) => setCandidateInfo(prev => ({ ...prev, experience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years (Beginner)</SelectItem>
                    <SelectItem value="1-3">1-3 years (Junior)</SelectItem>
                    <SelectItem value="3-5">3-5 years (Mid-level)</SelectItem>
                    <SelectItem value="5-8">5-8 years (Senior)</SelectItem>
                    <SelectItem value="8+">8+ years (Expert)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dsa-experience">Data Structures & Algorithms Experience *</Label>
                <Select onValueChange={(value) => setCandidateInfo(prev => ({ ...prev, dsaExperience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select DSA level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (Basic concepts)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (Can solve medium problems)</SelectItem>
                    <SelectItem value="advanced">Advanced (Complex algorithms & optimization)</SelectItem>
                    <SelectItem value="expert">Expert (Competitive programming level)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Preferred Programming Language</Label>
              <Select 
                defaultValue="python"
                onValueChange={(value) => setCandidateInfo(prev => ({ ...prev, preferredLanguage: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional">Additional Information (Optional)</Label>
              <Textarea
                id="additional"
                value={candidateInfo.additionalInfo}
                onChange={(e) => setCandidateInfo(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="Any specific areas you'd like to focus on or concerns you have..."
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep("intro")}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmitForm}
                disabled={!candidateInfo.name || !candidateInfo.email || !candidateInfo.experience || !candidateInfo.dsaExperience}
                className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
              >
                Start Interview
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 rounded bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Code className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                CodeSage
              </h1>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground">
              The AI Technical Interviewer
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Revolutionary AI-powered platform that conducts live, adaptive coding interviews with human-like insight. 
              Experience the future of technical assessment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={handleStartAssessment}
                className="bg-gradient-to-r from-primary to-primary-glow text-lg px-8 py-3 hover:scale-105 transform transition-all"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Assessment
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Why Choose CodeSage?</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets human-centered interview design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 border-code-border hover:border-primary/50 transition-all hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold">{feature.title}</h4>
                </div>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">How CodeSage Works</h3>
            <p className="text-xl text-muted-foreground">
              Experience a natural, adaptive interview process
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Warm-Up & Rapport Building",
                  description: "Friendly introduction to reduce anxiety and establish psychological safety. We gauge your communication style and baseline comfort level.",
                  icon: <Users className="w-6 h-6" />
                },
                {
                  step: "2", 
                  title: "Adaptive Problem Selection",
                  description: "Based on your experience level, we select appropriate coding challenges that match your skill level and gradually increase complexity.",
                  icon: <Target className="w-6 h-6" />
                },
                {
                  step: "3",
                  title: "Real-time Code Analysis",
                  description: "Our AI monitors your coding process, analyzing syntax, logic, complexity, and approach while providing contextual feedback.",
                  icon: <Zap className="w-6 h-6" />
                },
                {
                  step: "4",
                  title: "Human-like Guidance",
                  description: "Progressive hint system (Nudge → Guide → Direction) helps you when stuck, just like a supportive human interviewer would.",
                  icon: <Brain className="w-6 h-6" />
                },
                {
                  step: "5",
                  title: "Comprehensive Assessment",
                  description: "Detailed performance report covering code quality, problem-solving approach, communication, and areas for improvement.",
                  icon: <TrendingUp className="w-6 h-6" />
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-primary">{item.icon}</div>
                      <h4 className="text-xl font-semibold">{item.title}</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 to-primary-glow/10">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Experience the Future of Technical Interviews?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of candidates who have improved their interview skills with CodeSage
          </p>
          
          <Button 
            size="lg" 
            onClick={handleStartAssessment}
            className="bg-gradient-to-r from-primary to-primary-glow text-lg px-8 py-3 hover:scale-105 transform transition-all"
          >
            <Star className="w-5 h-5 mr-2" />
            Start Your Assessment Now
          </Button>
        </div>
      </section>
    </div>
  );
};