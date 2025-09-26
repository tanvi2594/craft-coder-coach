import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "./CodeEditor";
import { AIInterviewer } from "./AIInterviewer";
import { MetricsPanel } from "./MetricsPanel";
import { AudioRecorder } from "./AudioRecorder";
import { Play, Square, Mic, MicOff, Code, MessageSquare, BarChart3 } from "lucide-react";

export interface InterviewSession {
  id: string;
  problem: {
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    language: string;
  };
  status: "idle" | "active" | "paused" | "completed";
  startTime?: Date;
  metrics: {
    timeElapsed: number;
    hintsUsed: number;
    testsRun: number;
    complexity: string;
    codeQuality: number;
  };
}

export const InterviewLayout = () => {
  const [session, setSession] = useState<InterviewSession>({
    id: "session-1",
    problem: {
      title: "Find Duplicates in Array",
      description: "Implement a function to find all duplicate elements in an array. The function should return an array containing all duplicates found.",
      difficulty: "Medium",
      language: "python"
    },
    status: "idle",
    metrics: {
      timeElapsed: 0,
      hintsUsed: 0,
      testsRun: 0,
      complexity: "O(1)",
      codeQuality: 85
    }
  });

  const [activeTab, setActiveTab] = useState<"code" | "chat" | "metrics">("code");
  const [isRecording, setIsRecording] = useState(false);

  const startInterview = () => {
    setSession(prev => ({
      ...prev,
      status: "active",
      startTime: new Date()
    }));
  };

  const pauseInterview = () => {
    setSession(prev => ({ ...prev, status: "paused" }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Code className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">CodeSage</h1>
            </div>
            <Badge variant={session.problem.difficulty === "Easy" ? "default" : session.problem.difficulty === "Medium" ? "secondary" : "destructive"}>
              {session.problem.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Time: {formatTime(session.metrics.timeElapsed)}
            </div>
            <AudioRecorder 
              isRecording={isRecording}
              onToggle={() => setIsRecording(!isRecording)}
            />
            {session.status === "idle" ? (
              <Button onClick={startInterview} className="bg-gradient-to-r from-primary to-primary-glow">
                <Play className="w-4 h-4 mr-2" />
                Start Interview
              </Button>
            ) : (
              <Button onClick={pauseInterview} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Problem & Code */}
        <div className="flex-1 flex flex-col">
          {/* Problem Description */}
          <Card className="m-4 p-6 border-code-border bg-code-bg">
            <h2 className="text-lg font-semibold mb-2">{session.problem.title}</h2>
            <p className="text-muted-foreground mb-4">{session.problem.description}</p>
            
            <div className="text-sm text-muted-foreground">
              <p><strong>Language:</strong> {session.problem.language}</p>
              <p><strong>Expected Time:</strong> 45 minutes</p>
            </div>
          </Card>

          {/* Code Editor */}
          <div className="flex-1 mx-4 mb-4">
            <CodeEditor 
              language={session.problem.language}
              onChange={(code) => console.log("Code changed:", code)}
            />
          </div>
        </div>

        {/* Right Panel - Tabs */}
        <div className="w-96 border-l border-border flex flex-col">
          {/* Tab Headers */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                activeTab === "chat" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              AI Interviewer
            </button>
            <button
              onClick={() => setActiveTab("metrics")}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                activeTab === "metrics" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Metrics
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "chat" && <AIInterviewer />}
            {activeTab === "metrics" && <MetricsPanel metrics={session.metrics} />}
          </div>
        </div>
      </div>
    </div>
  );
};