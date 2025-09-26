import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Play, Bug, Clock, Zap } from "lucide-react";

interface CodeEditorProps {
  language: string;
  onChange: (code: string) => void;
}

const defaultCode = `def find_duplicates(arr):
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
    print(f"Duplicates found: {result}")`;

export const CodeEditor = ({ language, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);
  const [code, setCode] = useState(defaultCode);
  const [analysis, setAnalysis] = useState({
    syntaxErrors: 0,
    complexity: "O(1)",
    runtime: "0ms",
    memory: "0MB",
    quality: 85
  });
  const [isRunning, setIsRunning] = useState(false);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    // Configure editor theme and options
    editor.updateOptions({
      theme: 'vs-dark',
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
      onChange(value);
      
      // Simulate real-time analysis
      setTimeout(() => {
        setAnalysis(prev => ({
          ...prev,
          syntaxErrors: value.includes('pass') ? 0 : Math.floor(Math.random() * 2),
          complexity: value.includes('for') && value.includes('for') ? "O(n²)" : value.includes('for') ? "O(n)" : "O(1)",
          quality: Math.max(60, 100 - (value.split('\n').length * 2))
        }));
      }, 500);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      setAnalysis(prev => ({
        ...prev,
        runtime: `${Math.random() * 100 + 10}ms`,
        memory: `${(Math.random() * 5 + 2).toFixed(1)}MB`
      }));
      setIsRunning(false);
    }, 1500);
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return "text-success";
    if (quality >= 60) return "text-warning";
    return "text-destructive";
  };

  const getComplexityColor = (complexity: string) => {
    if (complexity === "O(1)" || complexity === "O(log n)") return "text-success";
    if (complexity === "O(n)") return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="h-full flex flex-col border-code-border bg-code-bg">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-code-border">
        <div className="flex items-center gap-4">
          <Badge variant="outline">{language}</Badge>
          <div className="flex items-center gap-2 text-sm">
            <Bug className="w-4 h-4" />
            <span className={analysis.syntaxErrors > 0 ? "text-destructive" : "text-success"}>
              {analysis.syntaxErrors} errors
            </span>
          </div>
        </div>
        <Button 
          onClick={runCode} 
          disabled={isRunning}
          className="bg-gradient-to-r from-success to-success-foreground text-success-foreground"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? "Running..." : "Run Code"}
        </Button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            padding: { top: 16 },
          }}
        />
      </div>

      {/* Real-time Analysis Footer */}
      <div className="flex items-center justify-between p-4 border-t border-code-border bg-muted/10">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className={getComplexityColor(analysis.complexity)}>
              {analysis.complexity}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-muted-foreground">{analysis.runtime}</span>
          </div>
          <div className="text-muted-foreground">
            Memory: {analysis.memory}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Quality:</span>
          <span className={`text-sm font-medium ${getQualityColor(analysis.quality)}`}>
            {analysis.quality}%
          </span>
        </div>
      </div>
    </Card>
  );
};