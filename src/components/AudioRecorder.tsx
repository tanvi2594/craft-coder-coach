import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Square, Volume2 } from "lucide-react";

interface AudioRecorderProps {
  isRecording: boolean;
  onToggle: () => void;
}

export const AudioRecorder = ({ isRecording, onToggle }: AudioRecorderProps) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      
      // Create audio context for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      source.connect(analyser);
      analyser.fftSize = 256;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(average);
        
        if (isRecording) {
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      if (isRecording) {
        updateAudioLevel();
      }
      
      // Setup MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Here you would typically send the audio data to your AI processing service
          console.log("Audio chunk received:", event.data);
        }
      };
      
      return stream;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      setHasPermission(false);
      return null;
    }
  };

  const handleToggleRecording = async () => {
    if (hasPermission === null) {
      const stream = await requestMicrophonePermission();
      if (!stream) return;
    }

    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setAudioLevel(0);
    } else {
      // Start recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
        mediaRecorderRef.current.start(1000); // Collect data every second
      }
    }
    
    onToggle();
  };

  if (hasPermission === false) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="destructive" className="text-xs">
          Mic Access Denied
        </Badge>
        <Button
          size="sm"
          variant="outline"
          onClick={requestMicrophonePermission}
          className="text-xs"
        >
          Grant Access
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Audio Level Indicator */}
      {isRecording && (
        <div className="flex items-center gap-1">
          <Volume2 className="w-3 h-3 text-success" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-4 rounded-full transition-colors ${
                  audioLevel > (i + 1) * 20 
                    ? "bg-success" 
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recording Status */}
      {isRecording && (
        <Badge variant="default" className="bg-success text-success-foreground animate-pulse">
          Recording
        </Badge>
      )}

      {/* Record Button */}
      <Button
        size="sm"
        variant={isRecording ? "destructive" : "outline"}
        onClick={handleToggleRecording}
        className={`transition-all ${
          isRecording 
            ? "bg-destructive hover:bg-destructive/90" 
            : "hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        {isRecording ? (
          <>
            <Square className="w-4 h-4 mr-2" />
            Stop
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Record
          </>
        )}
      </Button>
    </div>
  );
};