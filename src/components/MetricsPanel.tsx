import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Lightbulb, 
  Play, 
  Zap, 
  Star, 
  TrendingUp,
  Target,
  Code
} from "lucide-react";

interface Metrics {
  timeElapsed: number;
  hintsUsed: number;
  testsRun: number;
  complexity: string;
  codeQuality: number;
}

interface MetricsPanelProps {
  metrics: Metrics;
}

export const MetricsPanel = ({ metrics }: MetricsPanelProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return "text-success";
    if (quality >= 60) return "text-warning"; 
    return "text-destructive";
  };

  const getComplexityBadge = (complexity: string) => {
    const variant = complexity === "O(1)" || complexity === "O(log n)" 
      ? "default" 
      : complexity === "O(n)" 
        ? "secondary" 
        : "destructive";
    return variant;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Performance Metrics</h3>
      </div>

      {/* Time Elapsed */}
      <Card className="p-4 border-code-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Time Elapsed</span>
          </div>
          <Badge variant="outline">{formatTime(metrics.timeElapsed)}</Badge>
        </div>
        <Progress value={(metrics.timeElapsed / 2700) * 100} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          Target: 45 minutes
        </p>
      </Card>

      {/* Code Quality */}
      <Card className="p-4 border-code-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Code Quality</span>
          </div>
          <span className={`text-sm font-semibold ${getQualityColor(metrics.codeQuality)}`}>
            {metrics.codeQuality}%
          </span>
        </div>
        <Progress 
          value={metrics.codeQuality} 
          className="h-2"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Based on style, structure, and best practices
        </p>
      </Card>

      {/* Complexity */}
      <Card className="p-4 border-code-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Time Complexity</span>
          </div>
          <Badge variant={getComplexityBadge(metrics.complexity)}>
            {metrics.complexity}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Current algorithm efficiency
        </p>
      </Card>

      {/* Interaction Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 border-code-border">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-warning" />
            <span className="text-xs font-medium">Hints Used</span>
          </div>
          <p className="text-lg font-bold">{metrics.hintsUsed}</p>
        </Card>

        <Card className="p-3 border-code-border">
          <div className="flex items-center gap-2 mb-1">
            <Play className="w-4 h-4 text-success" />
            <span className="text-xs font-medium">Code Runs</span>
          </div>
          <p className="text-lg font-bold">{metrics.testsRun}</p>
        </Card>
      </div>

      {/* Assessment Summary */}
      <Card className="p-4 border-code-border bg-muted/5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Current Assessment</span>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Problem Understanding:</span>
            <span className="text-success font-medium">Strong</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Code Organization:</span>
            <span className="text-success font-medium">Good</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Optimization Awareness:</span>
            <span className="text-warning font-medium">Developing</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Communication:</span>
            <span className="text-success font-medium">Excellent</span>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-4 border-primary/20 bg-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Suggestions</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Consider optimizing time complexity</li>
          <li>• Add edge case handling</li>
          <li>• Improve variable naming</li>
        </ul>
      </Card>
    </div>
  );
};