import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Logo from "@/components/common/Logo";
import { Link, useNavigate } from 'react-router-dom';

// Survey Data (Moved from Index.tsx)
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
        // Persist name (in a real app, send to backend)
        localStorage.setItem('userName', name);
        setStep('welcome');
    };

    const handleSurveyComplete = (answers: any) => {
        // Persist answers
        localStorage.setItem('surveyAnswers', JSON.stringify(answers));
        navigate('/dashboard');
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 h-screen w-full flex flex-col">
            <div className="container mx-auto h-full max-w-2xl flex flex-col flex-1">
                <div className="flex-1">
                    {step === 'name_prompt' && <NamePromptScreen onNameSubmit={handleNameSubmit} />}
                    {step === 'welcome' && <WelcomeScreen name={userName} onStart={() => setStep('survey')} onSkip={() => navigate('/dashboard')} onBack={() => setStep('name_prompt')} />}
                    {step === 'survey' && <SurveyScreen onComplete={handleSurveyComplete} onBack={() => setStep('welcome')} />}
                </div>
            </div>
        </div>
    );
}

// Sub-components (Copied/Adapted from Index.tsx)
function OnboardingContainer({ children, onBack, showBack }: { children: any; onBack?: any; showBack: any }) {
    return (
        <div className="relative flex flex-col items-center justify-center h-full text-center p-6 bg-white dark:bg-gray-800 md:rounded-2xl md:shadow-lg md:h-auto md:my-auto">
            {showBack && onBack && (
                <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ChevronLeft className="w-6 h-6 text-gray-500" />
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
            <div className="mb-6"><Logo /></div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">What should we call you?</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your first name" className="w-full px-4 py-3 text-center bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6" autoFocus />
                <button type="submit" disabled={!name.trim()} className="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 disabled:bg-gray-400">Continue</button>
            </form>
        </OnboardingContainer>
    );
}

function WelcomeScreen({ name, onStart, onSkip, onBack }: any) {
    return (
        <OnboardingContainer onBack={onBack} showBack={true}>
            <div className="mb-6"><Logo /></div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Welcome, {name}!</h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">I'm your personal diabetes prevention companion, here to help you build healthier habits.</p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button onClick={onStart} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105">Let's Get Started</button>
                <button onClick={onSkip} className="px-8 py-3 bg-transparent text-gray-600 dark:text-gray-400 font-semibold hover:text-gray-900 dark:hover:text-white transition-colors">Skip to Dashboard</button>
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
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 md:rounded-2xl md:shadow-lg">
            <div className="p-6 flex-shrink-0">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 mb-4 ml-[-8px]"><ChevronLeft className="w-6 h-6 text-gray-500" /></button>
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Lifestyle & Motivation Survey</p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{currentQuestionIndex + 1} of {surveyQuestions.length}</p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
                </div>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{surveyQuestions[currentQuestionIndex].question}</h2>
                <div className="space-y-3">
                    {surveyQuestions[currentQuestionIndex].options.map((option) => (
                        <button key={option} onClick={() => handleAnswer(option)} className="w-full text-left p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">{option}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}
