import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { InterviewEngine } from "@/components/InterviewEngine";

interface CandidateInfo {
  name: string;
  email: string;
  position: string;
  experience: string;
  dsaExperience: string;
  preferredLanguage: string;
  additionalInfo: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "interview">("landing");
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);

  const handleStartInterview = (info: CandidateInfo) => {
    setCandidateInfo(info);
    setCurrentView("interview");
  };

  const handleEndInterview = () => {
    setCandidateInfo(null);
    setCurrentView("landing");
  };

  if (currentView === "interview" && candidateInfo) {
    return (
      <InterviewEngine
        candidateInfo={candidateInfo}
        onEndInterview={handleEndInterview}
      />
    );
  }

  return <LandingPage onStartInterview={handleStartInterview} />;
};

export default Index;
