import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Brain,
  Heart,
  Target,
  MessageCircle,
  Lightbulb,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronRight
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
    title: 'Discovery Phase',
    description: 'Processing baseline risk factors and intent.',
    color: 'destructive' as const,
    progress: 10,
    icon: Clock,
    nextSteps: [
      'Synchronize with Dawn to explore risk logic',
      'Identify personal optimization nodes',
      'Benchmark small intervention cycles'
    ],
    motivationalMessage: 'Your current psychological strata represents a baseline state. This is an objective starting point for system synchronization.'
  },
  contemplation: {
    title: 'Analysis State',
    description: 'Evaluating ambivalence and change variables.',
    color: 'secondary' as const,
    progress: 30,
    icon: Brain,
    nextSteps: [
      'Resolve internal logic conflicts regarding change',
      'Inventory personal wellness drivers',
      'Project future wellness trajectories'
    ],
    motivationalMessage: 'You are currently in an intensive analysis state. This period of reflection is essential for high-fidelity behavior planning.'
  },
  preparation: {
    title: 'Ready for Deployment',
    description: 'Finalizing action plan for imminent intervention.',
    color: 'default' as const,
    progress: 60,
    icon: Target,
    nextSteps: [
      'Map specific habit deployment schedule',
      'Establish barrier mitigation protocols',
      'Calibrate confidence feedback loops'
    ],
    motivationalMessage: 'Synchronization complete. You are ready for active deployment. We will now focus on precise habit engineering.'
  },
  action: {
    title: 'Active Optimization',
    description: 'Currently executing new wellness protocols.',
    color: 'default' as const,
    progress: 80,
    icon: TrendingUp,
    nextSteps: [
      'Monitor real-time protocol compliance',
      'Iterative problem-solving for edge cases',
      'Solidify structural habit patterns'
    ],
    motivationalMessage: 'Protocol execution detected. You are actively optimizing your health variables. Momentum is currently nominal.'
  },
  maintenance: {
    title: 'Standard Operation',
    description: 'Intervention successfully integrated into long-term logic.',
    color: 'default' as const,
    progress: 100,
    icon: CheckCircle,
    nextSteps: [
      'Execute relapse prevention subroutines',
      'Fine-tune existing wellness algorithms',
      'Benchmark peer synchronization'
    ],
    motivationalMessage: 'System optimization successful. Your wellness protocols have reached standard operation status. Continuing background monitoring.'
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

  const needsMotivationalIntervention =
    assessment.stage === 'precontemplation' ||
    assessment.stage === 'contemplation' ||
    assessment.importanceRating < 7 ||
    assessment.confidenceRating < 6;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {/* Results Header */}
      <div className="glass-card overflow-hidden">
        <div className="p-10 border-b border-white/5 text-center relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="h-5 w-5 text-primary opacity-60" />
            <span className="text-[10px] uppercase font-medium tracking-[0.4em] text-white/40">
              Analysis Synced with {physicianName}
            </span>
          </div>
          <h2 className="text-4xl font-extralight text-white tracking-tight flex items-center justify-center gap-5">
            <IconComponent className="h-10 w-10 text-primary opacity-40 shrink-0" />
            Psychological Strata
          </h2>
        </div>

        <div className="p-10 space-y-12">
          {/* Stage Badge and Progress */}
          <div className="text-center space-y-6">
            <div className="text-prismatic text-3xl font-light tracking-wide uppercase">
              {stageInfo.title}
            </div>
            <p className="text-white/40 font-light max-w-md mx-auto leading-relaxed">{stageInfo.description}</p>
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="w-full bg-white/5 rounded-full h-0.5 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stageInfo.progress}%` }}
                  className="bg-primary h-full shadow-[0_0_15px_rgba(234,179,8,0.8)]"
                />
              </div>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.4em]">
                Readiness Index: {stageInfo.progress}%
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Importance</p>
                <p className="text-sm font-light text-white/60">Value of Prevention</p>
              </div>
              <div className="text-4xl font-extralight text-primary group-hover:scale-110 transition-transform">
                {assessment.importanceRating}<span className="text-sm opacity-20">/10</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-white/10 transition-colors">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Confidence</p>
                <p className="text-sm font-light text-white/60">Capability Index</p>
              </div>
              <div className="text-4xl font-extralight text-primary group-hover:scale-110 transition-transform">
                {assessment.confidenceRating}<span className="text-sm opacity-20">/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Protocols */}
      <div className="glass-card p-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-light text-white tracking-wide">Optimization Protocols</h3>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mt-1 text-left">Recommended Next Steps</p>
          </div>
        </div>

        <ul className="space-y-4">
          {stageInfo.nextSteps.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-5 p-4 rounded-xl bg-white/[0.02] border border-transparent hover:border-white/5 transition-all"
            >
              <div className="text-[10px] font-medium text-primary/40 border border-primary/20 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                0{index + 1}
              </div>
              <span className="text-sm font-light text-white/70 tracking-wide">{step}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Unified Logic Mapping Alert */}
      <div className="glass-card p-8 bg-[#0a0a0f]/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-30"></div>
        <div className="flex gap-6 items-start">
          <Lightbulb className="h-6 w-6 text-primary shrink-0 mt-1 opacity-60" />
          <div>
            <p className="text-sm font-light text-white/70 leading-relaxed italic">
              "{stageInfo.motivationalMessage}"
            </p>
          </div>
        </div>
      </div>

      {/* Action Subroutines */}
      <div className="grid md:grid-cols-2 gap-6 pb-20">
        <button
          onClick={onStartChat}
          className="dawn-button group h-auto py-8 text-left justify-start px-10 shadow-2xl shadow-primary/10"
        >
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="text-lg font-light text-white mb-2 group-hover:tracking-wider transition-all">
                {needsMotivationalIntervention ? 'INITIATE ANALYSIS' : 'RESUME SYNC'}
              </div>
              <div className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em]">
                {needsMotivationalIntervention
                  ? 'Consult with Neural Coach Dawn'
                  : 'Download Personalized Roadmap'
                }
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
          </div>
        </button>

        <button
          onClick={onRetakeAssessment}
          className="glass-card h-auto py-8 px-10 text-left hover:bg-white/[0.05] group"
        >
          <div className="text-sm font-light text-white/60 mb-2 group-hover:text-white transition-colors">
            RECALIBRATE BASELINE
          </div>
          <div className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
            Update Psychological Data
          </div>
        </button>
      </div>
    </div>
  );
}