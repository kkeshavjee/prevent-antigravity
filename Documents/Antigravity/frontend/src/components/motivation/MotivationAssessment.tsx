import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Heart, Brain, Target, Stethoscope } from 'lucide-react';

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

const STAGE_DESCRIPTIONS = {
  precontemplation: {
    title: 'Not Ready',
    description: 'Not thinking about making health changes in the next 6 months',
    color: 'destructive',
    progress: 10
  },
  contemplation: {
    title: 'Getting Ready',
    description: 'Thinking about making changes but not yet committed',
    color: 'secondary',
    progress: 30
  },
  preparation: {
    title: 'Ready to Act',
    description: 'Planning to make changes in the next month',
    color: 'default',
    progress: 60
  },
  action: {
    title: 'Taking Action',
    description: 'Actively making health changes',
    color: 'default',
    progress: 80
  },
  maintenance: {
    title: 'Maintaining',
    description: 'Sustaining changes for 6+ months',
    color: 'default',
    progress: 100
  }
};

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
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

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
    const score = Object.values(answers).reduce((a, b) => a + b, 0) / Object.values(answers).length;

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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Stethoscope className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Assessment from {physicianName}
            </span>
          </div>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Importance & Confidence Rulers
          </CardTitle>
          <CardDescription>
            These final questions help us understand your motivation better
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-4">
            <Label className="text-base font-medium">
              On a scale of 1-10, how important is it for you to prevent diabetes?
            </Label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Not important</span>
                <span>Extremely important</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={importanceRating}
                onChange={(e) => setImportanceRating(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center">
                <Badge variant="outline" className="text-lg font-semibold">
                  {importanceRating}/10
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">
              On a scale of 1-10, how confident are you that you can make these changes?
            </Label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Not confident</span>
                <span>Very confident</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={confidenceRating}
                onChange={(e) => setConfidenceRating(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center">
                <Badge variant="outline" className="text-lg font-semibold">
                  {confidenceRating}/10
                </Badge>
              </div>
            </div>
          </div>

          <Button onClick={handleComplete} className="w-full" size="lg">
            Complete Assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Stethoscope className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            Referred by {physicianName}
          </span>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          Readiness Assessment
        </CardTitle>
        <CardDescription>
          Let's understand where you are in your health journey. Your doctor cares about your progress and will receive a summary of how you're doing.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}</span>
            <span>{Math.round(((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100)}% complete</span>
          </div>
          <Progress value={((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100} className="h-2" />
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium leading-relaxed">
            {currentQ?.question}
          </h3>

          <RadioGroup
            value={answers[currentQ?.id]?.toString()}
            onValueChange={(value) => handleAnswer(currentQ.id, Number(value))}
            className="space-y-3"
          >
            {currentQ?.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                <Label
                  htmlFor={`option-${option.value}`}
                  className="flex-1 cursor-pointer text-base leading-relaxed"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="min-w-24"
          >
            {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? 'Continue' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}