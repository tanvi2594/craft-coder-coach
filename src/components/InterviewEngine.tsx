import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CodeEditor } from "./CodeEditor";
import { AIInterviewer } from "./AIInterviewer";
import { MetricsPanel } from "./MetricsPanel";
import { AudioRecorder } from "./AudioRecorder";
import { 
  Play, 
  Square, 
  Code, 
  MessageSquare, 
  BarChart3, 
  Clock,
  User,
  Target,
  Lightbulb
} from "lucide-react";

// RL Model States
interface CandidateState {
  // Communication State
  confidence_level: "high" | "medium" | "low";
  thinking_aloud: boolean;
  clarity_level: "clear" | "vague" | "incoherent";
  
  // Progress State  
  progress_stage: "not_started" | "partial" | "near_solution" | "solved";
  error_type: "none" | "syntax_slip" | "logic_gap" | "repeated_error";
  correctness_score: number; // 0-1
  
  // Engagement State
  silence_duration: "short" | "medium" | "long"; // <5s, 5-15s, >15s
  strategy_shift: "none" | "mild" | "frequent";
  activity_level: "actively_typing" | "idle";
  
  // Temporal/Adaptive State
  interview_phase: "warm_up" | "main_problem" | "wrap_up";
  adaptability: "high" | "medium" | "low";
  time_remaining: number; // minutes
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

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number;
  initialCode: string;
  testCases: Array<{
    input: string;
    expected: string;
  }>;
}

interface InterviewEngineProps {
  candidateInfo: CandidateInfo;
  onEndInterview: () => void;
}

export const InterviewEngine = ({ candidateInfo, onEndInterview }: InterviewEngineProps) => {
  // Interview State
  const [currentPhase, setCurrentPhase] = useState<"warm_up" | "main_problem" | "wrap_up">("warm_up");
  const [candidateState, setCandidateState] = useState<CandidateState>({
    confidence_level: "medium",
    thinking_aloud: false,
    clarity_level: "clear",
    progress_stage: "not_started", 
    error_type: "none",
    correctness_score: 0,
    silence_duration: "short",
    strategy_shift: "none",
    activity_level: "idle",
    interview_phase: "warm_up",
    adaptability: "medium",
    time_remaining: 45
  });
  
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "chat" | "metrics">("chat");
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [metrics, setMetrics] = useState({
    timeElapsed: 0,
    hintsUsed: 0,
    testsRun: 0,
    complexity: "O(1)",
    codeQuality: 85
  });

  // Problem bank based on experience level
  const problemBank = {
    beginner: [
      {
        id: "two-sum",
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "Easy" as const,
        timeLimit: 20,
        initialCode: `def two_sum(nums, target):
    """
    Find two numbers that add up to target.
    
    Args:
        nums: List of integers
        target: Target sum
        
    Returns:
        List of two indices
    """
    # Write your solution here
    pass

# Test your solution
if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print(f"Indices: {result}")`,
        testCases: [
          { input: "[2,7,11,15], 9", expected: "[0,1]" },
          { input: "[3,2,4], 6", expected: "[1,2]" }
        ]
      }
    ],
    intermediate: [
      {
        id: "find-duplicates",
        title: "Find Duplicates in Array", 
        description: "Given an array of integers, find all the duplicate elements. Return an array containing all duplicates found. The duplicates should appear in the order they were first encountered.",
        difficulty: "Medium" as const,
        timeLimit: 30,
        initialCode: `def find_duplicates(arr):
    """
    Find all duplicate elements in an array.
    
    Args:
        arr: List of integers
        
    Returns:
        List of duplicate elements
    """
    # Write your solution here
    pass

# Test your solution
if __name__ == "__main__":
    test_array = [1, 2, 3, 2, 4, 5, 1]
    result = find_duplicates(test_array)
    print(f"Duplicates found: {result}")`,
        testCases: [
          { input: "[1,2,3,2,4,5,1]", expected: "[2,1]" },
          { input: "[4,3,2,7,8,2,3,1]", expected: "[3,2]" }
        ]
      }
    ],
    advanced: [
      {
        id: "merge-intervals",
        title: "Merge Intervals",
        description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        difficulty: "Hard" as const,
        timeLimit: 45,
        initialCode: `def merge_intervals(intervals):
    """
    Merge overlapping intervals.
    
    Args:
        intervals: List of [start, end] pairs
        
    Returns:
        List of merged intervals
    """
    # Write your solution here
    pass

# Test your solution  
if __name__ == "__main__":
    intervals = [[1,3],[2,6],[8,10],[15,18]]
    result = merge_intervals(intervals)
    print(f"Merged intervals: {result}")`,
        testCases: [
          { input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" },
          { input: "[[1,4],[4,5]]", expected: "[[1,5]]" }
        ]
      }
    ]
  };

  // RL Decision Engine
  const decideNextAction = useCallback((state: CandidateState): InterviewAction => {
    // Phase transitions
    if (state.interview_phase === "warm_up" && state.confidence_level === "high") {
      return {
        type: "challenge",
        content: "Great! I can see you're comfortable. Let's move on to our main coding challenge. I'll present a problem that matches your experience level.",
        category: "encouragement"
      };
    }

    if (state.interview_phase === "main_problem") {
      // Stuck behavior - long silence or repeated errors
      if (state.silence_duration === "long" || state.error_type === "repeated_error") {
        if (metrics.hintsUsed === 0) {
          return {
            type: "guidance",
            content: "I notice you're taking some time to think through this. That's perfectly normal! Can you walk me through your current approach? Sometimes talking it out helps clarify the next steps.",
            hint_level: "nudge",
            category: "hint"
          };
        } else if (metrics.hintsUsed < 3) {
          return {
            type: "guidance", 
            content: "Let me offer a more specific hint: think about what data structures offer O(1) average lookup time. What comes to mind?",
            hint_level: "guide",
            category: "hint"
          };
        } else {
          return {
            type: "guidance",
            content: "Here's a direct suggestion: try using a hash set (or dictionary in Python) to track elements you've seen. This can help you detect duplicates in a single pass.",
            hint_level: "direction",
            category: "hint"
          };
        }
      }

      // Progress acknowledgment
      if (state.progress_stage === "partial" && state.correctness_score > 0.5) {
        return {
          type: "probing",
          content: "Excellent progress! Your logic is sound. I can see you understand the problem well. Now, what do you think about the time complexity of your current approach?",
          category: "feedback"
        };
      }

      // Solution completed
      if (state.progress_stage === "solved") {
        return {
          type: "probing",
          content: "Great work! You've solved the problem correctly. Can you explain your approach and discuss any alternative solutions you might consider?",
          category: "question"
        };
      }
    }

    // Default responses based on current state
    if (state.activity_level === "actively_typing") {
      return {
        type: "silent_wait",
        content: "",
        category: "encouragement"
      };
    }

    return {
      type: "probing",
      content: "How are you feeling about this problem? What's your initial thought process?",
      category: "question"
    };
  }, [metrics.hintsUsed]);

  // Initialize interview based on candidate experience
  useEffect(() => {
    if (candidateInfo.dsaExperience && !currentProblem) {
      let selectedProblems;
      
      switch (candidateInfo.dsaExperience) {
        case "beginner":
          selectedProblems = problemBank.beginner;
          break;
        case "intermediate": 
          selectedProblems = problemBank.intermediate;
          break;
        case "advanced":
        case "expert":
          selectedProblems = problemBank.advanced;
          break;
        default:
          selectedProblems = problemBank.intermediate;
      }
      
      setCurrentProblem(selectedProblems[0]);
      setSessionStartTime(new Date());
    }
  }, [candidateInfo.dsaExperience, currentProblem]);

  // Timer effect
  useEffect(() => {
    if (sessionStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        setMetrics(prev => ({ ...prev, timeElapsed: elapsed }));
        setCandidateState(prev => ({ 
          ...prev, 
          time_remaining: Math.max(0, (currentProblem?.timeLimit || 45) - Math.floor(elapsed / 60))
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionStartTime, currentProblem?.timeLimit]);

  const handleCodeChange = (code: string) => {
    // Analyze code and update candidate state
    const hasErrors = code.includes('SyntaxError') || code.includes('undefined');
    const isTyping = code.length > 0;
    const complexity = code.includes('for') && code.includes('for') ? "O(n²)" : 
                     code.includes('for') ? "O(n)" : "O(1)";
    
    setCandidateState(prev => ({
      ...prev,
      activity_level: isTyping ? "actively_typing" : "idle",
      error_type: hasErrors ? "syntax_slip" : "none",
      progress_stage: code.includes('return') && code.length > 100 ? "partial" : "not_started"
    }));

    setMetrics(prev => ({ ...prev, complexity }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentProblem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>Initializing your personalized interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Code className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">CodeSage Interview</h1>
              <Badge variant="outline">
                <User className="w-3 h-3 mr-1" />
                {candidateInfo.name}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={currentProblem.difficulty === "Easy" ? "default" : 
                            currentProblem.difficulty === "Medium" ? "secondary" : "destructive"}>
                {currentProblem.difficulty}
              </Badge>
              <Badge variant="outline" className="text-primary">
                <Target className="w-3 h-3 mr-1" />
                {currentPhase.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatTime(metrics.timeElapsed)} / {currentProblem.timeLimit}m
            </div>
            
            <div className="w-32">
              <Progress 
                value={(metrics.timeElapsed / (currentProblem.timeLimit * 60)) * 100} 
                className="h-2"
              />
            </div>

            <AudioRecorder 
              isRecording={isRecording}
              onToggle={() => setIsRecording(!isRecording)}
            />
            
            <Button onClick={onEndInterview} variant="outline" size="sm">
              End Interview
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Problem & Code */}
        <div className="flex-1 flex flex-col">
          {/* Problem Description */}
          <Card className="m-4 p-6 border-code-border bg-code-bg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{currentProblem.title}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Hints: {metrics.hintsUsed}
                </Badge>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4 leading-relaxed">{currentProblem.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Language:</strong> {candidateInfo.preferredLanguage}</p>
                <p><strong>Time Limit:</strong> {currentProblem.timeLimit} minutes</p>
              </div>
              <div>
                <p><strong>Your Experience:</strong> {candidateInfo.dsaExperience}</p>
                <p><strong>Phase:</strong> {currentPhase.replace('_', ' ')}</p>
              </div>
            </div>
          </Card>

          {/* Code Editor */}
          <div className="flex-1 mx-4 mb-4">
            <CodeEditor 
              language={candidateInfo.preferredLanguage}
              initialCode={currentProblem.initialCode}
              onChange={handleCodeChange}
              onRun={() => setMetrics(prev => ({ ...prev, testsRun: prev.testsRun + 1 }))}
            />
          </div>
        </div>

        {/* Right Panel - AI & Metrics */}
        <div className="w-96 border-l border-border flex flex-col">
          {/* Tab Headers */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                activeTab === "chat" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              AI Interviewer
              {metrics.hintsUsed > 0 && (
                <Badge variant="secondary" className="text-xs">{metrics.hintsUsed}</Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("metrics")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                activeTab === "metrics" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "chat" && (
              <AIInterviewer 
                candidateState={candidateState}
                candidateInfo={candidateInfo}
                onHintUsed={() => setMetrics(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }))}
                decideAction={decideNextAction}
              />
            )}
            {activeTab === "metrics" && (
              <MetricsPanel 
                metrics={metrics} 
                candidateState={candidateState}
                candidateInfo={candidateInfo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};