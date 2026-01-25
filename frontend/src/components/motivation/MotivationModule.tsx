import { useState } from 'react';
import { MotivationAssessment } from './MotivationAssessment';
import { MotivationResults } from './MotivationResults';
import { Button } from '@/components/ui/button';
import { X, MessageCircle } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center space-y-8 p-12 glass-card max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <MessageCircle className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-light text-white mb-4 tracking-wide">Continue with Dawn</h2>
              <p className="text-white/60 font-light leading-relaxed">
                For a deeper conversation about your health journey and personalized coaching,
                let's connect with <strong>Dawn</strong>, your Diabetes Prevention Assistant.
              </p>
            </div>
            <div className="flex flex-col w-full gap-4 pt-4">
              <button
                onClick={() => window.location.href = '/chat'}
                className="dawn-button py-4 text-lg"
              >
                Open Chat Assistant
              </button>
              <button
                onClick={() => setCurrentState('results')}
                className="text-white/40 hover:text-white/60 text-sm font-light uppercase tracking-widest transition-colors"
              >
                Back to Results
              </button>
            </div>
          </div>
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