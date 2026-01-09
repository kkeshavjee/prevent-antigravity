import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Brain, 
  Heart, 
  Target, 
  MessageCircle, 
  Lightbulb,
  CheckCircle,
  Clock
} from 'lucide-react';

interface MotivationScore {
  stage: 'precontemplation' | 'contemplation' | 'preparation' | 'action' | 'maintenance';
  score: number;
  importanceRating: number;
  confidenceRating: number;
}

interface MotivationResultsProps {
  assessment: MotivationScore;
  onStartChat: () => void;
  onRetakeAssessment: () => void;
  physicianName?: string;
}

const STAGE_INFO = {
  precontemplation: {
    title: 'Not Ready Yet',
    description: 'You\'re not currently thinking about making health changes',
    color: 'destructive' as const,
    progress: 10,
    icon: Clock,
    nextSteps: [
      'Explore what diabetes prevention means for you',
      'Learn about your personal risk factors',
      'Consider the benefits of small changes'
    ],
    motivationalMessage: 'That\'s completely normal. Many people aren\'t ready to make changes right away, and that\'s okay. Let\'s explore what might be holding you back and what could motivate you in the future.'
  },
  contemplation: {
    title: 'Getting Ready',
    description: 'You\'re thinking about making changes but haven\'t committed yet',
    color: 'secondary' as const,
    progress: 30,
    icon: Brain,
    nextSteps: [
      'Explore your ambivalence about change',
      'Identify personal reasons for preventing diabetes',
      'Address concerns about making lifestyle changes'
    ],
    motivationalMessage: 'You\'re in a thoughtful place right now. It\'s natural to feel uncertain about making changes. Let\'s explore what\'s important to you and what might help tip the balance toward taking action.'
  },
  preparation: {
    title: 'Ready to Act',
    description: 'You\'re planning to make changes in the near future',
    color: 'default' as const,
    progress: 60,
    icon: Target,
    nextSteps: [
      'Create a specific action plan',
      'Identify potential barriers and solutions',
      'Build confidence in your ability to succeed'
    ],
    motivationalMessage: 'Excellent! You\'re ready to take action. This is an exciting stage where we can work together to create a plan that fits your life and helps you succeed.'
  },
  action: {
    title: 'Taking Action',
    description: 'You\'re actively making health changes',
    color: 'default' as const,
    progress: 80,
    icon: TrendingUp,
    nextSteps: [
      'Maintain momentum and track progress',
      'Problem-solve obstacles as they arise',
      'Build sustainable habits'
    ],
    motivationalMessage: 'Wonderful! You\'re already taking steps to improve your health. Let\'s work on maintaining this momentum and making these changes stick for the long term.'
  },
  maintenance: {
    title: 'Maintaining Changes',
    description: 'You\'re sustaining healthy changes long-term',
    color: 'default' as const,
    progress: 100,
    icon: CheckCircle,
    nextSteps: [
      'Prevent relapse and stay motivated',
      'Refine and optimize your healthy habits',
      'Share your success with others'
    ],
    motivationalMessage: 'Congratulations! You\'ve successfully maintained healthy changes. Let\'s focus on keeping up this great work and potentially expanding on your success.'
  }
};

export function MotivationResults({ 
  assessment, 
  onStartChat, 
  onRetakeAssessment,
  physicianName = "Dr. Smith" 
}: MotivationResultsProps) {
  const stageInfo = STAGE_INFO[assessment.stage];
  const IconComponent = stageInfo.icon;
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 8) return 'text-green-600';
    if (confidence >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return 'text-green-600';
    if (importance >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const needsMotivationalIntervention = 
    assessment.stage === 'precontemplation' || 
    assessment.stage === 'contemplation' ||
    assessment.importanceRating < 7 ||
    assessment.confidenceRating < 6;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Results shared with {physicianName}
            </span>
          </div>
          <CardTitle className="flex items-center justify-center gap-3">
            <IconComponent className="h-8 w-8 text-primary" />
            Your Readiness Profile
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Stage Badge and Progress */}
          <div className="text-center space-y-4">
            <Badge variant={stageInfo.color} className="text-lg py-2 px-4">
              {stageInfo.title}
            </Badge>
            <p className="text-muted-foreground">{stageInfo.description}</p>
            <div className="space-y-2">
              <Progress value={stageInfo.progress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Readiness Level: {stageInfo.progress}%
              </p>
            </div>
          </div>

          {/* Importance and Confidence Scores */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Importance</p>
                    <p className="text-sm text-muted-foreground">How important this is to you</p>
                  </div>
                  <div className={`text-2xl font-bold ${getImportanceColor(assessment.importanceRating)}`}>
                    {assessment.importanceRating}/10
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-secondary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Confidence</p>
                    <p className="text-sm text-muted-foreground">Your confidence in making changes</p>
                  </div>
                  <div className={`text-2xl font-bold ${getConfidenceColor(assessment.confidenceRating)}`}>
                    {assessment.confidenceRating}/10
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription className="text-base leading-relaxed">
          {stageInfo.motivationalMessage}
        </AlertDescription>
      </Alert>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommended Next Steps
          </CardTitle>
          <CardDescription>
            Based on your assessment, here's what we recommend focusing on
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {stageInfo.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                  {index + 1}
                </div>
                <span className="text-base">{step}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4">
        <Button 
          onClick={onStartChat} 
          size="lg" 
          className="w-full h-auto py-4 px-6 whitespace-normal"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          <div className="text-left">
            <div className="font-medium">
              {needsMotivationalIntervention ? 'Explore Your Readiness' : 'Continue Your Journey'}
            </div>
            <div className="text-sm opacity-90">
              {needsMotivationalIntervention 
                ? 'Chat with our AI coach about your concerns and goals'
                : 'Get personalized recommendations and support'
              }
            </div>
          </div>
        </Button>
        
        <Button 
          onClick={onRetakeAssessment} 
          variant="outline" 
          size="lg"
          className="w-full h-auto py-4 px-6 whitespace-normal"
        >
          <Brain className="h-5 w-5 mr-2" />
          <div className="text-left">
            <div className="font-medium">Retake Assessment</div>
            <div className="text-sm opacity-70">Update your motivation profile</div>
          </div>
        </Button>
      </div>
    </div>
  );
}