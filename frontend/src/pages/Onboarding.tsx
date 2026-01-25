import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Logo from "@/components/common/Logo";
import { Link, useNavigate } from 'react-router-dom';

// Survey Data
const surveyQuestions = [
    {
        question: "What's your primary motivation for improving your health?",
        options: ["To have more energy for daily life", "To prevent future health issues", "To feel more confident and happy", "To be there for my loved ones"],
        key: "motivation"
    },
    {
        question: "Which statement best describes your approach to new health habits?",
        options: ["I like to dive in and make big changes", "I prefer to start small and build gradually", "I need a clear, structured plan to follow", "I'm skeptical and need to see proof it works"],
        key: "approach"
    },
    {
        question: "How do you prefer to receive health advice and support?",
        options: ["Direct facts and data from experts", "Gentle reminders and encouragement", "Practical tips and life hacks", "Stories from people like me"],
        key: "supportStyle"
    },
    {
        question: "When you think about healthy eating, what's your biggest challenge?",
        options: ["Finding time to cook", "Resisting cravings for unhealthy snacks", "The cost of healthy food", "Knowing what's actually healthy"],
        key: "eatingChallenge"
    }
];

export default function Onboarding() {
    const [step, setStep] = useState('name_prompt');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const handleNameSubmit = (name: string) => {
        setUserName(name);
        localStorage.setItem('userName', name);
        setStep('welcome');
    };

    const handleSurveyComplete = (answers: any) => {
        localStorage.setItem('surveyAnswers', JSON.stringify(answers));
        navigate('/dashboard');
    };

    return (
        <div className="app-bg h-screen w-full flex flex-col justify-center items-center">
            <div className="container mx-auto h-full max-w-2xl px-6 flex flex-col justify-center z-10">
                <div className="w-full flex flex-col justify-center">
                    {step === 'name_prompt' && <NamePromptScreen onNameSubmit={handleNameSubmit} />}
                    {step === 'welcome' && <WelcomeScreen name={userName} onStart={() => setStep('survey')} onSkip={() => navigate('/dashboard')} onBack={() => setStep('name_prompt')} />}
                    {step === 'survey' && <SurveyScreen onComplete={handleSurveyComplete} onBack={() => setStep('welcome')} />}
                </div>
            </div>
        </div>
    );
}

// Sub-components
function OnboardingContainer({ children, onBack, showBack }: { children: any; onBack?: any; showBack: any }) {
    return (
        <div className="relative glass-card flex flex-col items-center justify-center text-center p-10 max-w-lg mx-auto overflow-hidden">
            {showBack && onBack && (
                <button onClick={onBack} className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/5 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-white/40" />
                </button>
            )}
            {children}
        </div>
    )
}

function NamePromptScreen({ onNameSubmit }: any) {
    const [name, setName] = useState('');
    const handleSubmit = (e: any) => { e.preventDefault(); if (name.trim()) onNameSubmit(name.trim()); };
    return (
        <OnboardingContainer showBack={false}>
            <div className="mb-8 scale-125"><Logo /></div>
            <h1 className="text-3xl font-extralight mb-2 text-white tracking-tight">What should we call you?</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-8">Personalize your journey</p>
            <form onSubmit={handleSubmit} className="w-full max-w-xs">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full px-6 py-4 text-center bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-primary/40 transition-all text-lg font-light text-white mb-8"
                    autoFocus
                />
                <button type="submit" disabled={!name.trim()} className="dawn-button w-full shadow-lg shadow-primary/20">Continue</button>
            </form>
        </OnboardingContainer>
    );
}

function WelcomeScreen({ name, onStart, onSkip, onBack }: any) {
    return (
        <OnboardingContainer onBack={onBack} showBack={true}>
            <div className="mb-8 scale-125"><Logo /></div>
            <h1 className="text-4xl font-extralight mb-4 text-white tracking-tight">Welcome, {name}!</h1>
            <p className="text-sm font-light text-white/50 mb-10 max-w-sm leading-relaxed tracking-wide">I'm Dawn, your healthcare companion. Together, we'll navigate the path to a healthier, more vibrant you.</p>
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button onClick={onStart} className="dawn-button w-full shadow-lg shadow-primary/10">Begin Discovery</button>
                <button onClick={onSkip} className="px-8 py-3 bg-transparent text-white/20 text-xs uppercase tracking-widest hover:text-white/60 transition-colors">Skip to Overview</button>
            </div>
        </OnboardingContainer>
    );
}

function SurveyScreen({ onComplete, onBack }: any) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const handleAnswer = (option: string) => {
        const newAnswers = { ...answers, [surveyQuestions[currentQuestionIndex].key]: option };
        setAnswers(newAnswers);
        if (currentQuestionIndex < surveyQuestions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
        else onComplete(newAnswers);
    };
    const progress = ((currentQuestionIndex + 1) / surveyQuestions.length) * 100;
    return (
        <div className="glass-card flex flex-col h-full overflow-hidden max-w-lg mx-auto">
            <div className="p-8 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-white/5 transition-colors -ml-2">
                        <ChevronLeft className="w-5 h-5 text-white/40" />
                    </button>
                    <div className="flex-1">
                        <p className="text-[10px] uppercase font-medium tracking-[0.2em] text-primary">Discovery Session</p>
                        <p className="text-[10px] font-light text-white/30 uppercase tracking-[0.1em]">Patient Profile {currentQuestionIndex + 1} of {surveyQuestions.length}</p>
                    </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                    <div className="bg-primary h-1 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: `${progress}%`, transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)' }}></div>
                </div>
            </div>
            <div className="p-8 flex-1 overflow-y-auto space-y-8">
                <h2 className="text-2xl font-extralight text-white leading-tight tracking-tight">{surveyQuestions[currentQuestionIndex].question}</h2>
                <div className="space-y-3">
                    {surveyQuestions[currentQuestionIndex].options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className="w-full text-left px-6 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all text-sm font-light text-white/80"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
