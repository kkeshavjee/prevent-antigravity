import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, Target, Stethoscope, ChevronRight, ChevronLeft } from 'lucide-react';

interface MotivationScore {
  stage: 'precontemplation' | 'contemplation' | 'preparation' | 'action' | 'maintenance';
  score: number;
  importanceRating: number;
  confidenceRating: number;
}

interface MotivationAssessmentProps {
  onComplete: (assessment: MotivationScore) => void;
  physicianName?: string;
}

const ASSESSMENT_QUESTIONS = [
  {
    id: 'change_intention',
    question: 'How ready are you to make changes to prevent diabetes?',
    options: [
      { value: 1, label: 'Not ready at all', stage: 'precontemplation' as const },
      { value: 2, label: 'Not very ready', stage: 'contemplation' as const },
      { value: 3, label: 'Somewhat ready', stage: 'preparation' as const },
      { value: 4, label: 'Very ready', stage: 'action' as const },
      { value: 5, label: 'Extremely ready', stage: 'action' as const }
    ]
  },
  {
    id: 'timeline',
    question: 'When are you planning to start making health changes?',
    options: [
      { value: 1, label: 'No plans to change', stage: 'precontemplation' as const },
      { value: 2, label: 'Maybe in the future', stage: 'contemplation' as const },
      { value: 3, label: 'Within the next month', stage: 'preparation' as const },
      { value: 4, label: 'Already started', stage: 'action' as const },
      { value: 5, label: 'Been doing it for months', stage: 'maintenance' as const }
    ]
  }
];

export function MotivationAssessment({ onComplete, physicianName = "Dr. Smith" }: MotivationAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [importanceRating, setImportanceRating] = useState<number>(5);
  const [confidenceRating, setConfidenceRating] = useState<number>(5);
  const [showRulers, setShowRulers] = useState(false);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateMotivationStage = (): MotivationScore['stage'] => {
    const scores = Object.values(answers);
    const averageScore = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);

    if (averageScore <= 1.5) return 'precontemplation';
    if (averageScore <= 2.5) return 'contemplation';
    if (averageScore <= 3.5) return 'preparation';
    if (averageScore <= 4.5) return 'action';
    return 'maintenance';
  };

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowRulers(true);
    }
  };

  const handleComplete = () => {
    const stage = calculateMotivationStage();
    const score = Object.values(answers).reduce((a, b) => a + b, 0) / (Object.values(answers).length || 1);

    onComplete({
      stage,
      score,
      importanceRating,
      confidenceRating
    });
  };

  const currentQ = ASSESSMENT_QUESTIONS[currentQuestion];
  const canProceed = currentQ && answers[currentQ.id];

  if (showRulers) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-2xl mx-auto"
      >
        <div className="p-10 border-b border-white/5 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Stethoscope className="h-5 w-5 text-primary opacity-60" />
            <span className="text-[10px] uppercase font-medium tracking-[0.4em] text-white/40">
              Clinical Context: {physicianName}
            </span>
          </div>
          <h2 className="text-4xl font-extralight text-white tracking-tight flex items-center justify-center gap-4">
            <Target className="h-8 w-8 text-primary opacity-40 shrink-0" />
            Prioritization
          </h2>
          <p className="text-white/30 font-light mt-4 max-w-sm mx-auto text-sm leading-relaxed">
            Quantifying your current motivation allows for precise synchronization of resources.
          </p>
        </div>

        <div className="p-10 space-y-12">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <Label className="text-sm font-light uppercase tracking-[0.2em] text-white/50">
                Lvl 1: Importance
              </Label>
              <span className="text-2xl font-light text-primary">{importanceRating}<span className="text-xs opacity-20">/10</span></span>
            </div>
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={importanceRating}
                onChange={(e) => setImportanceRating(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary transition-all hover:bg-white/15"
              />
              <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/20">
                <span>Neutral</span>
                <span>Critical</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <Label className="text-sm font-light uppercase tracking-[0.2em] text-white/50">
                Lvl 2: Confidence
              </Label>
              <span className="text-2xl font-light text-primary">{confidenceRating}<span className="text-xs opacity-20">/10</span></span>
            </div>
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={confidenceRating}
                onChange={(e) => setConfidenceRating(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary transition-all hover:bg-white/15"
              />
              <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/20">
                <span>Reserved</span>
                <span>Optimistic</span>
              </div>
            </div>
          </div>

          <button onClick={handleComplete} className="dawn-button w-full py-5 text-base mt-4 shadow-xl shadow-primary/10">
            FINAL SYNC
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="glass-card w-full max-w-2xl mx-auto">
      <div className="p-10 border-b border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Stethoscope className="h-5 w-5 text-primary opacity-60" />
          <span className="text-[10px] uppercase font-medium tracking-[0.4em] text-white/40">
            Referred by {physicianName}
          </span>
        </div>
        <h2 className="text-4xl font-extralight text-white tracking-tight flex items-center justify-center gap-4">
          <Heart className="h-8 w-8 text-primary opacity-40 shrink-0" />
          Readiness
        </h2>
        <p className="text-white/30 font-light mt-4 max-w-sm mx-auto text-sm leading-relaxed">
          Discovery phase allows us to tailor your interface to your current psychological strata.
        </p>
      </div>

      <div className="p-10 space-y-10">
        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">
            <span>Discovery Block {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}</span>
            <span className="text-primary">{Math.round(((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-0.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
              className="bg-primary h-full shadow-[0_0_10px_rgba(234,179,8,1)]"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-light text-white tracking-wide leading-relaxed">
              {currentQ?.question}
            </h3>

            <RadioGroup
              value={answers[currentQ?.id]?.toString()}
              onValueChange={(value) => handleAnswer(currentQ.id, Number(value))}
              className="grid grid-cols-1 gap-4"
            >
              {currentQ?.options.map((option) => (
                <div key={option.value} className="relative group">
                  <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} className="sr-only" />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className={`block w-full px-8 py-5 rounded-2xl border transition-all cursor-pointer ${answers[currentQ.id] === option.value
                      ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(234,179,8,0.1)] text-white'
                      : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:border-white/20'
                      }`}
                  >
                    <span className="text-sm font-light tracking-wide">{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center pt-6">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="p-4 rounded-full border border-white/5 text-white/20 hover:text-white hover:border-white/20 disabled:opacity-0 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`dawn-button min-w-[180px] flex items-center justify-center gap-3 ${!canProceed ? 'opacity-20 grayscale cursor-not-allowed' : 'shadow-primary/10 opacity-100'}`}
          >
            <span>{currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? 'PROCEED' : 'NEXT'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}