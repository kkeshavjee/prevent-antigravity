import React from 'react';
import { Home, MessageCircle, Settings, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ currentPage }: { currentPage: string }) {
    const navigate = useNavigate();
    return (
        <div className="bg-white/5 backdrop-blur-3xl border-t border-white/10 px-6 py-4 flex-shrink-0 z-50">
            <div className="flex justify-around items-center max-w-md mx-auto">
                <NavButton icon={<Home />} label="Dashboard" active={currentPage === 'dashboard'} onClick={() => navigate('/dashboard')} />
                <NavButton icon={<MessageCircle />} label="Chat" active={currentPage === 'chat'} onClick={() => navigate('/chat')} />
                <NavButton icon={<Settings />} label="Settings" active={currentPage === 'settings'} onClick={() => navigate('/settings')} />
                <NavButton icon={<ShieldAlert />} label="Admin" active={currentPage === 'admin'} onClick={() => navigate('/admin')} />
            </div>
        </div>
    );
}

function NavButton({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active
                ? 'text-primary scale-110'
                : 'text-white/40 hover:text-white/60'
                }`}
        >
            <div className={`p-2 rounded-xl transition-all ${active ? 'bg-primary/10 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : ''}`}>
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <span className={`text-[10px] font-light uppercase tracking-[0.2em] transition-all ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                {label}
            </span>
        </button>
    )
}
