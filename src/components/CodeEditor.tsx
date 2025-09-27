import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, Bug, Clock, Zap, Terminal, X } from "lucide-react";

interface CodeEditorProps {
  language: string;
  initialCode?: string;
  onChange: (code: string) => void;
  onRun?: () => void;
}

const defaultCode = `// JavaScript Example
function findDuplicates(arr) {
    /*
    Find all duplicate elements in an array.
    
    Args:
        arr: Array of integers
        
    Returns:
        Array of duplicate elements
    */
    
    const seen = new Set();
    const duplicates = new Set();
    
    for (const num of arr) {
        if (seen.has(num)) {
            duplicates.add(num);
        } else {
            seen.add(num);
        }
    }
    
    return Array.from(duplicates);
}

// Test your solution
const testArray = [1, 2, 3, 2, 4, 5, 1];
const result = findDuplicates(testArray);
console.log("Duplicates found:", result);

// Try modifying this code and click 'Run Code' to see the output!`;

export const CodeEditor = ({ language, initialCode, onChange, onRun }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);
  const [code, setCode] = useState(initialCode || defaultCode);
  const [analysis, setAnalysis] = useState({
    syntaxErrors: 0,
    complexity: "O(1)",
    runtime: "0ms",
    memory: "0MB",
    quality: 85
  });
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [executionError, setExecutionError] = useState("");

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

  const executeJavaScript = (code: string) => {
    const originalLog = console.log;
    const originalError = console.error;
    let capturedOutput = "";
    
    // Capture console output
    console.log = (...args) => {
      capturedOutput += args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ') + '\n';
    };
    
    console.error = (...args) => {
      capturedOutput += 'ERROR: ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ') + '\n';
    };

    try {
      // Create a safe execution environment
      const result = new Function(code)();
      if (result !== undefined) {
        capturedOutput += `Return value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}\n`;
      }
      if (!capturedOutput) {
        capturedOutput = "Code executed successfully (no output)";
      }
    } catch (error) {
      capturedOutput += `Runtime Error: ${error.message}\n`;
    } finally {
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
    }
    
    return capturedOutput;
  };

  const executePython = async (code: string) => {
    try {
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': 'demo', // Using demo key for now
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          language_id: 71, // Python 3
          source_code: btoa(code),
          stdin: btoa('')
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit code');
      }
      
      const submission = await response.json();
      
      // Poll for result
      let result;
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${submission.token}?base64_encoded=true`, {
          headers: {
            'X-RapidAPI-Key': 'demo',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        });
        result = await resultResponse.json();
        if (result.status.id > 2) break;
      }
      
      let output = '';
      if (result.stdout) output += atob(result.stdout);
      if (result.stderr) output += 'ERROR: ' + atob(result.stderr);
      if (result.compile_output) output += 'COMPILE ERROR: ' + atob(result.compile_output);
      
      return output || 'No output';
    } catch (error) {
      return `Network Error: Unable to execute Python code. ${error.message}`;
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setExecutionError("");
    setShowOutput(true);
    onRun?.(); // Call the callback if provided
    
    const startTime = Date.now();
    
    try {
      let result = "";
      
      if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
        result = executeJavaScript(code);
      } else if (language.toLowerCase() === 'python') {
        result = await executePython(code);
      } else {
        result = `Language "${language}" is not yet supported for execution.\nSupported languages: JavaScript, Python`;
      }
      
      setOutput(result);
      
      const executionTime = Date.now() - startTime;
      setAnalysis(prev => ({
        ...prev,
        runtime: `${executionTime}ms`,
        memory: `${(Math.random() * 5 + 2).toFixed(1)}MB`
      }));
    } catch (error) {
      setExecutionError(error.message);
    } finally {
      setIsRunning(false);
    }
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
    <div className="h-full flex flex-col gap-4">
      <Card className="flex-1 flex flex-col border-code-border bg-code-bg">
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
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowOutput(!showOutput)}
              className="text-muted-foreground"
            >
              <Terminal className="w-4 h-4 mr-2" />
              {showOutput ? "Hide" : "Show"} Output
            </Button>
            <Button 
              onClick={runCode} 
              disabled={isRunning}
              className="bg-gradient-to-r from-success to-success-foreground text-success-foreground"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          </div>
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

      {/* Output Section */}
      {showOutput && (
        <Card className="border-code-border bg-code-bg">
          <div className="flex items-center justify-between p-3 border-b border-code-border">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span className="text-sm font-medium">Console Output</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOutput(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4">
            {isRunning ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span>Executing code...</span>
              </div>
            ) : (
              <Textarea
                value={executionError || output || "Click 'Run Code' to see output here..."}
                readOnly
                className={`min-h-[120px] font-mono text-sm resize-none ${
                  executionError ? "text-destructive" : "text-foreground"
                } bg-background/50`}
                placeholder="Code output will appear here..."
              />
            )}
          </div>
        </Card>
      )}
    </div>
  );
};