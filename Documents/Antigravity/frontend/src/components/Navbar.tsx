import React from 'react';
import { Home, MessageCircle, Settings, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ currentPage }: { currentPage: string }) {
    const navigate = useNavigate();
    return (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex-shrink-0">
            <div className="flex justify-around">
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
        <button onClick={onClick} className={`flex flex-col items-center p-3 rounded-lg transition-colors ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}>
            {React.cloneElement(icon, { className: "w-6 h-6 mb-1" })}
            <span className="text-xs font-medium">{label}</span>
        </button>
    )
}
