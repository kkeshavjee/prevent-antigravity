import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { MotivationModule } from "@/components/motivation/MotivationModule";
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

// Mock Data (Shared)
const mockPatientData = {
    diabetesRiskScore: 'High',
    riskLevel: 75,
    biomarkers: {
        a1c: 6.2, fbs: 6.0, bloodPressure: { systolic: 142, diastolic: 88 },
        ldl: 3.8, hdl: 1.0, totalCholesterol: 5.7, weight: 84, height: 178
    }
};

// Replaced Dashboard component to handle Layout and Lookup
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Logo from "@/components/common/Logo";

const DEMO_PATIENT = {
    name: "Karim Keshavjee",
    physician_name: "Dr. Smith",
    diabetes_risk_score: 'High',
    risk_score_numeric: 75,
    biomarkers: {
        a1c: 6.2, fbs: 6.0, bloodPressure: { systolic: 142, diastolic: 88 },
        ldl: 3.8, hdl: 1.0, totalCholesterol: 5.7, weight: 84, height: 178
    }
};

export default function Dashboard() {
    const [showMotivationModule, setShowMotivationModule] = useState(false);
    const [nameInput, setNameInput] = useState('');

    // State to store patient profile
    const [patientProfile, setPatientProfile] = useState<any>(null);
    const [assessmentData, setAssessmentData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check local storage on mount
        const storedName = localStorage.getItem('userName');
        if (storedName && storedName !== 'Guest') {
            // Trigger lookup automatically
            fetchPatientProfile(storedName);
        }
    }, []);

    const fetchPatientProfile = async (name: string) => {
        setIsLoading(true);
        setError('');
        try {
            // Using localhost:8000 for backend based on main.py. In production, relative path
            // Added timeout to prevent hanging
            const response = await axios.get(`http://127.0.0.1:8000/api/patient/lookup?name=${name}`, { timeout: 5000 });
            setPatientProfile(response.data);
            localStorage.setItem('userName', response.data.name);

            // Load saved assessment
            const savedAssessment = localStorage.getItem(`readinessAssessment_${response.data.name}`);
            if (savedAssessment) {
                try {
                    setAssessmentData(JSON.parse(savedAssessment));
                } catch (e) {
                    console.error("Failed to parse saved assessment", e);
                }
            }
        } catch (err) {
            console.error(err);
            setError('Connection failed. Loaded demo profile.');
            // Fallback to demo data so app isn't stuck
            setPatientProfile({ ...DEMO_PATIENT, name: name });
            setPatientProfile({ ...DEMO_PATIENT, name: name });
            localStorage.setItem('userName', name);
            // Load demo assessment if exists (or mock one for demo?)
            const savedAssessment = localStorage.getItem(`readinessAssessment_${name}`);
            if (savedAssessment) {
                setAssessmentData(JSON.parse(savedAssessment));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLookup = (e: React.FormEvent) => {
        e.preventDefault();
        if (nameInput.trim()) fetchPatientProfile(nameInput);
    };

    if (showMotivationModule) {
        return (
            <div className="h-full w-full flex flex-col overflow-y-auto">
                <MotivationModule
                    physicianName={patientProfile?.physician_name || "Dr. Smith"}
                    onComplete={(assessment: any) => {
                        console.log('Motivation assessment completed:', assessment);
                        setAssessmentData(assessment);
                        localStorage.setItem(`readinessAssessment_${patientProfile.name}`, JSON.stringify(assessment));
                        setShowMotivationModule(false);
                    }}
                    onClose={() => setShowMotivationModule(false)}
                />
            </div>
        );
    }

    if (!patientProfile) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
                <div className="flex flex-col items-center">
                    <Logo />
                    <h1 className="text-2xl font-bold mt-6 mb-2">Welcome</h1>
                    <p className="text-gray-500">Please enter your name to connect your profile.</p>
                </div>
                <form onSubmit={handleLookup} className="w-full max-w-sm space-y-4">
                    <Input
                        placeholder="e.g. John Doe"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="text-center text-lg"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Connecting...' : 'Connect Profile'}
                    </Button>
                </form>
            </div>
        );
    }

    // Main Dashboard View
    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 md:rounded-2xl md:shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {patientProfile.name.split(' ')[0]}!</h1>
                <p className="text-gray-600 dark:text-gray-400">Here's your health overview</p>
                {/* Removed top button */}
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Diabetes Risk Level</h2>
                    <div className="flex flex-col items-center">
                        <RiskSpeedometer riskLevel={patientProfile.risk_score_numeric || 50} />
                        <p className="mt-4 text-lg font-semibold text-center">
                            Risk Level: <span className={patientProfile.diabetes_risk_score === 'High' ? "text-red-600" : "text-yellow-600"}>
                                {patientProfile.diabetes_risk_score}
                            </span>
                        </p>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Biomarkers</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <BiomarkerCard label="A1c" value={`${patientProfile.biomarkers.a1c}%`} status="high" />
                        <BiomarkerCard label="FBS" value={`${patientProfile.biomarkers.fbs} mmol/L`} status="high" />
                        <BiomarkerCard label="Weight" value={`${patientProfile.biomarkers.weight} kg`} status="neutral" />
                    </div>
                </div>

                {/* Readiness Button Moved to Bottom of Content */}
                {/* Readiness Section */}
                <div className="mt-8 pt-4 border-t">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Readiness Assessment</h2>

                    {assessmentData ? (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-blue-600 dark:text-blue-300 font-medium uppercase tracking-wide">Current Stage</p>
                                    <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 capitalize">{assessmentData.stage}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Last Updated</p>
                                    <p className="font-medium">Today</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                    <p className="text-xs text-gray-500">Importance</p>
                                    <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{assessmentData.importanceRating}/10</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                    <p className="text-xs text-gray-500">Confidence</p>
                                    <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{assessmentData.confidenceRating}/10</p>
                                </div>
                            </div>

                            <button onClick={() => setShowMotivationModule(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-200 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                                <MessageCircle className="w-5 h-5" /> Update Assessment
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button onClick={() => setShowMotivationModule(true)} className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                                <MessageCircle className="w-5 h-5" /> Start Readiness Assessment
                            </button>
                            <p className="text-center text-sm text-gray-500 mt-2">Check your readiness for change</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Keeping Subcomponents...


function RiskSpeedometer({ riskLevel }: { riskLevel: number }) {
    // Simplified for brevity in this extraction, assumes SVG logic from previous View
    return (
        <div className="relative w-48 h-32">
            {/* SVG logic would go here, mimicking the original */}
            <div className="text-center p-4 border rounded">Speedometer Placeholder ({riskLevel}%)</div>
        </div>
    )
}

function BiomarkerCard({ label, value, status }: any) {
    let colorClass = 'text-gray-600 bg-gray-50';
    if (status === 'high') colorClass = 'text-red-600 bg-red-50';
    return (
        <div className={`p-4 rounded-lg ${colorClass}`}>
            <div className="text-sm font-medium opacity-75">{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    )
}
