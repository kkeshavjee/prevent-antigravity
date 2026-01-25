import React, { useState } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
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

    if (isLoading && !patientProfile) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 md:rounded-2xl md:shadow-lg">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                <h2 className="text-xl font-medium text-gray-900 dark:text-white">Connecting...</h2>
                <p className="text-gray-500 dark:text-gray-400">Loading your health profile</p>
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
        <div className="flex flex-col h-full bg-transparent overflow-hidden">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-3xl font-extralight text-white tracking-widest uppercase mb-1">
                    <span className="text-primary text-xs tracking-[0.8em] block mb-2">Health Overview</span>
                    Welcome back, {patientProfile.name.split(' ')[0]}
                </h1>
                <p className="text-white/40 font-light text-sm tracking-wide">Illuminating your path to wellness</p>
                {/* Removed top button */}
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-8 pb-24">
                <section>
                    <h2 className="text-sm font-light uppercase tracking-[0.3em] text-white/60 mb-6">Diabetes Risk Level</h2>
                    <div className="glass-card p-8 flex flex-col items-center">
                        <RiskSpeedometer riskLevel={patientProfile.risk_score_numeric || 50} />
                        <p className="mt-6 text-lg font-light tracking-wide text-center">
                            Calculated Status: <span className={`font-normal ${patientProfile.diabetes_risk_score === 'High' ? "text-red-400" : "text-primary"}`}>
                                {patientProfile.diabetes_risk_score}
                            </span>
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-sm font-light uppercase tracking-[0.3em] text-white/60 mb-6">Vital Biomarkers</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <BiomarkerCard label="A1c" value={`${patientProfile.biomarkers.a1c}%`} status="high" />
                        <BiomarkerCard label="FBS" value={`${patientProfile.biomarkers.fbs} mmol/L`} status="high" />
                        <BiomarkerCard label="Weight" value={`${patientProfile.biomarkers.weight} kg`} status="neutral" />
                    </div>
                </section>

                {/* Readiness Section */}
                <section className="mt-8">
                    <h2 className="text-sm font-light uppercase tracking-[0.3em] text-white/60 mb-6">Readiness for Change</h2>

                    {assessmentData ? (
                        <div className="glass-card p-6 border-primary/20">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] text-primary font-medium uppercase tracking-[0.2em] mb-1">Current Discovery Stage</p>
                                    <h3 className="text-2xl font-light text-white capitalize tracking-wide">{assessmentData.stage}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Last Sync</p>
                                    <p className="font-light text-sm text-white/60">Today</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Importance</p>
                                    <p className="text-2xl font-light text-primary">{assessmentData.importanceRating}<span className="text-sm text-white/20">/10</span></p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Confidence</p>
                                    <p className="text-2xl font-light text-primary">{assessmentData.confidenceRating}<span className="text-sm text-white/20">/10</span></p>
                                </div>
                            </div>

                            <button onClick={() => setShowMotivationModule(true)} className="dawn-button w-full">
                                <MessageCircle className="w-4 h-4 mr-2 inline-block opacity-60" /> Update Assessment
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card p-8 text-center bg-primary/5 border-primary/20">
                            <button onClick={() => setShowMotivationModule(true)} className="dawn-button w-full mb-4">
                                <MessageCircle className="w-4 h-4 mr-2 inline-block opacity-60" /> Begin Discovery
                            </button>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">Analyze your readiness for change</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function RiskSpeedometer({ riskLevel }: { riskLevel: number }) {
    return (
        <div className="relative w-48 h-32 flex items-center justify-center border border-white/5 rounded-xl bg-white/5">
            <div className="text-center">
                <div className="text-4xl font-extralight text-white">{riskLevel}<span className="text-sm opacity-30">%</span></div>
                <div className="text-[10px] uppercase tracking-widest opacity-30 mt-1">Risk Factor</div>
            </div>
        </div>
    )
}

function BiomarkerCard({ label, value, status }: any) {
    let statusColor = 'text-white/80';
    let borderColor = 'border-white/10';
    if (status === 'high') {
        statusColor = 'text-red-400';
        borderColor = 'border-red-500/20';
    }
    return (
        <div className={`glass-card p-5 border ${borderColor}`}>
            <div className="text-[10px] font-light uppercase tracking-widest text-white/30 mb-1">{label}</div>
            <div className={`text-xl font-light tracking-wide ${statusColor}`}>{value}</div>
        </div>
    )
}
