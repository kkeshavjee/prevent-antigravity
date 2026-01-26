import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MotivationAssessment } from './MotivationAssessment';
import { MotivationResults } from './MotivationResults';
import { Button } from '@/components/ui/button';
import { X, MessageCircle, Sparkles } from 'lucide-react';

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
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-10 p-12 glass-card max-w-2xl mx-auto text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-32 h-32 text-primary" />
            </div>

            <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center border-primary/20 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
              <MessageCircle className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl font-extralight text-white mb-4 tracking-tight">Illuminate your path.</h2>
              <p className="text-white/50 font-light leading-relaxed max-w-md mx-auto">
                For a deeper synchronization with your wellness goals, let's connect with <strong>Dawn</strong>, your specialized neural coach.
              </p>
            </div>
            <div className="flex flex-col w-full gap-5 pt-4 max-w-xs relative z-10">
              <button
                onClick={() => window.location.href = '/chat'}
                className="dawn-button py-5 text-base flex items-center justify-center gap-3"
              >
                <span>Synchronize with Dawn</span>
              </button>
              <button
                onClick={() => setCurrentState('results')}
                className="text-[10px] text-white/30 hover:text-white/60 uppercase tracking-[0.4em] transition-all font-medium py-2"
              >
                Return to Analysis
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full py-12 px-6 relative flex flex-col items-center overflow-y-auto custom-scrollbar">
      {onClose && (
        <button
          className="absolute top-8 right-8 z-50 text-white/30 hover:text-white/80 transition-all p-2"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
      )}
      <div className="container mx-auto max-w-4xl relative z-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentState}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {renderCurrentState()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
