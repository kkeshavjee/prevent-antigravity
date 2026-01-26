import React from 'react';
import { Home, MessageCircle, Settings, ShieldAlert, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ currentPage }: { currentPage: string }) {
    const navigate = useNavigate();
    return (
        <div className="bg-white/[0.02] backdrop-blur-2xl border-t border-white/5 px-6 py-5 flex-shrink-0 z-50">
            <div className="flex justify-around items-end max-w-sm mx-auto">
                <NavButton icon={<Home />} label="Hub" active={currentPage === 'dashboard'} onClick={() => navigate('/dashboard')} />
                <NavButton icon={<MessageCircle />} label="Dawn" active={currentPage === 'chat'} onClick={() => navigate('/chat')} />
                <NavButton icon={<Settings />} label="Config" active={currentPage === 'settings'} onClick={() => navigate('/settings')} />
                <NavButton icon={<ShieldAlert />} label="Research" active={currentPage === 'admin'} onClick={() => navigate('/admin')} />
            </div>
        </div>
    );
}

function NavButton({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-2 transition-all duration-500 ${active
                ? 'text-primary scale-110'
                : 'text-white/20 hover:text-white/40'
                }`}
        >
            <div className={`p-2.5 rounded-2xl transition-all duration-500 relative ${active ? 'bg-primary/10 shadow-[0_0_25px_rgba(234,179,8,0.15)] ring-1 ring-primary/20' : ''}`}>
                {React.cloneElement(icon, { className: "w-5 h-5" })}
                {active && (
                    <Sparkles className="absolute -top-1 -right-1 w-2.5 h-2.5 text-primary animate-pulse" />
                )}
            </div>
            <span className={`text-[8px] font-medium uppercase tracking-[0.4em] transition-all duration-500 ${active ? 'opacity-100 max-h-4' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                {label}
            </span>
        </button>
    )
}
