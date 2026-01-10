import { useState } from 'react';
import { MotivationAssessment } from './MotivationAssessment';
import { MotivationResults } from './MotivationResults';
import { MotivationalChat } from './MotivationalChat';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MotivationScore {
  stage: 'precontemplation' | 'contemplation' | 'preparation' | 'action' | 'maintenance';
  score: number;
  importanceRating: number;
  confidenceRating: number;
}

type ModuleState = 'assessment' | 'results' | 'chat';

interface MotivationModuleProps {
  physicianName?: string;
  onComplete?: (finalAssessment: MotivationScore) => void;
  onClose?: () => void;
}

export function MotivationModule({ physicianName = "Dr. Smith", onComplete, onClose }: MotivationModuleProps) {
  const [currentState, setCurrentState] = useState<ModuleState>('assessment');
  const [assessment, setAssessment] = useState<MotivationScore | null>(null);

  const handleAssessmentComplete = (newAssessment: MotivationScore) => {
    setAssessment(newAssessment);
    setCurrentState('results');
  };

  const handleStartChat = () => {
    setCurrentState('chat');
  };

  const handleRetakeAssessment = () => {
    setCurrentState('assessment');
    setAssessment(null);
  };

  const handleMotivationUpdate = (updatedAssessment: MotivationScore) => {
    setAssessment(updatedAssessment);
    if (onComplete) {
      onComplete(updatedAssessment);
    }
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'assessment':
        return (
          <MotivationAssessment
            onComplete={handleAssessmentComplete}
            physicianName={physicianName}
          />
        );

      case 'results':
        if (!assessment) return null;
        return (
          <MotivationResults
            assessment={assessment}
            onStartChat={handleStartChat}
            onRetakeAssessment={handleRetakeAssessment}
            physicianName={physicianName}
          />
        );

      case 'chat':
        if (!assessment) return null;
        return (
          <MotivationalChat
            assessment={assessment}
            physicianName={physicianName}
            onMotivationUpdate={handleMotivationUpdate}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8 px-4 relative">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
      )}
      <div className="container mx-auto">
        {renderCurrentState()}
      </div>
    </div>
  );
}