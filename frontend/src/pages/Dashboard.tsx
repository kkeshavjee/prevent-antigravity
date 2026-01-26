import React, { useState, useEffect } from 'react';
import { MessageCircle, Loader2, User, Search, Activity, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import Logo from "@/components/common/Logo";

const DEMO_PATIENT = {
    name: "Karim Keshavjee",
    physician_name: "Dr. Smith",
    diabetes_risk_score: 'High',
    risk_score_numeric: 75,
    biomarkers: {
        a1c: 6.2, fbs: 6.0, bloodPressure: { systolic: 142, diastolic: 88 },
        ldl: 3.8, hdl: 1.0, totalCholesterol: 5.7, weight: 84, height: 178
    },
    readiness_stage: 'contemplation',
    importance_rating: 8,
    confidence_rating: 6
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [nameInput, setNameInput] = useState('');
    const [patientProfile, setPatientProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName && storedName !== 'Guest') {
            fetchPatientProfile(storedName);
        }
    }, []);

    const fetchPatientProfile = async (name: string) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/patient/lookup?name=${name}`, { timeout: 5000 });
            setPatientProfile(response.data);
            localStorage.setItem('userName', response.data.name);
        } catch (err) {
            console.error(err);
            setError('Connection failed. Using sandbox profile.');
            setPatientProfile({ ...DEMO_PATIENT, name: name });
            localStorage.setItem('userName', name);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLookup = (e: React.FormEvent) => {
        e.preventDefault();
        if (nameInput.trim()) fetchPatientProfile(nameInput);
    };

    if (isLoading && !patientProfile) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary opacity-50" />
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 animate-pulse">Illuminating Profile</p>
            </div>
        );
    }

    if (!patientProfile) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
                <div className="mb-12">
                    <Logo size="large" className="opacity-90 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
                    <h1 className="text-4xl font-extralight mt-8 text-white tracking-tight">Welcome, Friend.</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-primary mt-2">Personalize your journey</p>
                </div>

                <form onSubmit={handleLookup} className="w-full max-w-sm space-y-6">
                    <div className="relative group">
                        <Input
                            placeholder="Enter your name..."
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="text-center text-lg h-16 bg-white/5 border-white/10 rounded-full focus:border-primary/40 focus:bg-white/10 transition-all font-light"
                        />
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20 group-focus-within:opacity-50 transition-opacity" />
                    </div>
                    {error && <p className="text-red-400 text-[10px] uppercase tracking-widest">{error}</p>}
                    <button type="submit" className="dawn-button w-full shadow-lg shadow-primary/10" disabled={isLoading}>
                        {isLoading ? 'Connecting...' : 'Connect Profile'}
                    </button>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 mt-8">Secure Access via Unified Health ID</p>
                </form>
            </motion.div>
        );
    }

    const hasReadinessData = patientProfile.readiness_stage && patientProfile.readiness_stage !== 'unknown';

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col h-full bg-transparent overflow-hidden"
        >
            <motion.div variants={itemVariants} className="p-8 pb-4">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-4xl font-extralight text-white tracking-tight">
                        <span className="text-primary text-[10px] font-medium tracking-[0.8em] block mb-3 uppercase">DASHBOARD</span>
                        Welcome back,<br />
                        <span className="text-prismatic font-normal">{patientProfile.name.split(' ')[0]}</span>
                    </h1>
                    <div className="p-3 glass-card rounded-full">
                        <User className="w-5 h-5 text-white/40" />
                    </div>
                </div>
                <p className="text-white/30 font-light text-sm tracking-wide">Your wellness strata, visualized.</p>
            </motion.div>

            <div className="flex-1 p-8 pt-4 overflow-y-auto space-y-10 pb-32 custom-scrollbar">
                {/* Risk Level Section */}
                <motion.section variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(234,179,8,1)]"></div>
                        <h2 className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">Diabetes Risk Strata</h2>
                    </div>

                    <div className="glass-card p-10 flex flex-col items-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity className="w-24 h-24" />
                        </div>
                        <RiskSpeedometer riskLevel={patientProfile.risk_score_numeric || 50} />
                        <div className="mt-8 text-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Assessed Status</p>
                            <p className={`text-2xl font-light tracking-wide ${patientProfile.diabetes_risk_score === 'High' ? "text-red-400" : "text-primary"}`}>
                                {patientProfile.diabetes_risk_score} Risk
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Biomarkers Section */}
                <motion.section variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                        <h2 className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">Vital Biomarkers</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <BiomarkerCard label="HbA1c" value={`${patientProfile.biomarkers.a1c}%`} status="high" />
                        <BiomarkerCard label="FBS" value={`${patientProfile.biomarkers.fbs}`} unit="mmol/L" status="high" />
                        <BiomarkerCard label="Weight" value={`${patientProfile.biomarkers.weight}`} unit="kg" status="neutral" />
                        <BiomarkerCard label="BP" value={`${patientProfile.biomarkers.bloodPressure.systolic}/${patientProfile.biomarkers.bloodPressure.diastolic}`} status="high" />
                    </div>
                </motion.section>

                {/* Wellness Insights Section - Replaces Technical Readiness */}
                {(patientProfile.barriers?.length > 0 || patientProfile.facilitators?.length > 0) && (
                    <motion.section variants={itemVariants}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                            <h2 className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">Wellness Insights</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {patientProfile.facilitators?.length > 0 && (
                                <div className="glass-card p-8 border-primary/20 bg-primary/[0.02]">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-xl mt-1">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-primary font-medium uppercase tracking-[0.3em] mb-2">Core Strength</p>
                                            <p className="text-lg font-light text-white leading-relaxed">
                                                Your {patientProfile.facilitators[0].toLowerCase()} is a powerful catalyst for your health journey.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {patientProfile.barriers?.length > 0 && (
                                <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl mt-1">
                                            <Activity className="w-5 h-5 text-white/40" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-2">Growth Opportunity</p>
                                            <p className="text-sm font-light text-white/70 leading-relaxed">
                                                We're identifying ways to help you navigate {patientProfile.barriers[0].toLowerCase()} more effectively.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}
            </div>
        </motion.div>
    );
}

function RiskSpeedometer({ riskLevel }: { riskLevel: number }) {
    return (
        <div className="relative w-56 h-36 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 60">
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: riskLevel / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={riskLevel > 70 ? "text-red-500/40" : "text-primary/40"}
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-4">
                <div className="text-5xl font-extralight text-white leading-none">{riskLevel}<span className="text-sm opacity-20 ml-1">%</span></div>
                <div className="text-[9px] uppercase tracking-[0.3em] opacity-40 mt-3 font-medium">Risk Score</div>
            </div>
        </div>
    )
}

function BiomarkerCard({ label, value, unit, status }: any) {
    let statusColor = 'text-white/80';
    let dotColor = 'bg-white/20';
    if (status === 'high') {
        statusColor = 'text-red-400';
        dotColor = 'bg-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
    }
    return (
        <div className="glass-card p-6 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">{label}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-light tracking-tight ${statusColor}`}>{value}</span>
                {unit && <span className="text-[10px] text-white/20 uppercase font-light">{unit}</span>}
            </div>
        </div>
    )
}
