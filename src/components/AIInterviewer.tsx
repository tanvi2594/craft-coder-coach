import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Lightbulb, Brain, Target } from "lucide-react";

interface Message {
  id: string;
  type: "ai" | "user" | "system";
  content: string;
  timestamp: Date;
  category?: "hint" | "question" | "feedback" | "encouragement";
}

interface CandidateState {
  confidence_level: "high" | "medium" | "low";
  thinking_aloud: boolean;
  clarity_level: "clear" | "vague" | "incoherent";
  progress_stage: "not_started" | "partial" | "near_solution" | "solved";
  error_type: "none" | "syntax_slip" | "logic_gap" | "repeated_error";
  correctness_score: number;
  silence_duration: "short" | "medium" | "long";
  strategy_shift: "none" | "mild" | "frequent";
  activity_level: "actively_typing" | "idle";
  interview_phase: "warm_up" | "main_problem" | "wrap_up";
  adaptability: "high" | "medium" | "low";
  time_remaining: number;
}

interface InterviewAction {
  type: "warmup" | "challenge" | "guidance" | "probing" | "silent_wait" | "clarification" | "wrap_up";
  content: string;
  hint_level?: "nudge" | "guide" | "direction";
  category?: "hint" | "question" | "feedback" | "encouragement";
}

interface CandidateInfo {
  name: string;
  email: string;
  position: string;
  experience: string;
  dsaExperience: string;
  preferredLanguage: string;
  additionalInfo: string;
}

interface AIInterviewerProps {
  candidateState?: CandidateState;
  candidateInfo?: CandidateInfo;
  onHintUsed?: () => void;
  decideAction?: (state: CandidateState) => InterviewAction;
}

export const AIInterviewer = ({ candidateState, candidateInfo, onHintUsed, decideAction }: AIInterviewerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I'm CodeSage, your AI technical interviewer. I see you're working on finding duplicates in an array. Take your time to understand the problem, and feel free to think aloud as you code. I'm here to help guide you through the process!",
      timestamp: new Date(),
      category: "encouragement"
    },
    {
      id: "2", 
      type: "ai",
      content: "When you're ready, start by thinking about different approaches. What's the first solution that comes to mind?",
      timestamp: new Date(),
      category: "question"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        {
          content: "Great thinking! That's a valid approach. I notice you're considering nested loops - that would work, but let's think about the time complexity. With nested loops, what would the Big O notation be?",
          category: "question" as const
        },
        {
          content: "Excellent question! Let me give you a hint: think about data structures that offer O(1) average lookup time. What comes to mind?",
          category: "hint" as const
        },
        {
          content: "I can see you're on the right track! Your logic is sound. Now, let's optimize this solution. Can you think of a way to solve this in a single pass through the array?",
          category: "feedback" as const
        }
      ];

      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.content,
        timestamp: new Date(),
        category: response.category
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "hint":
        return <Lightbulb className="w-4 h-4" />;
      case "question":
        return <Brain className="w-4 h-4" />;
      case "feedback":
        return <Target className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "hint":
        return "text-warning";
      case "question":
        return "text-primary";
      case "feedback":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-medium">CodeSage AI</h3>
            <p className="text-xs text-muted-foreground">Technical Interviewer</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === "user" 
                  ? "bg-muted" 
                  : "bg-gradient-to-br from-primary to-primary-glow"
              }`}>
                {message.type === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  getCategoryIcon(message.category)
                )}
              </div>
              
              <Card className={`max-w-[85%] p-3 ${
                message.type === "user" 
                  ? "bg-muted" 
                  : "bg-card border-primary/20"
              }`}>
                {message.category && message.type === "ai" && (
                  <Badge 
                    variant="outline" 
                    className={`mb-2 ${getCategoryColor(message.category)}`}
                  >
                    {message.category}
                  </Badge>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <Card className="p-3 bg-card border-primary/20">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question or explain your approach..."
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Tip: Think aloud! Explain your reasoning as you code.
        </p>
      </div>
    </div>
  );
};