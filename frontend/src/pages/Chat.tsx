import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ChevronLeft, Loader2, Apple } from 'lucide-react';
// Navbar import removed
import { api } from '@/api/client';

export default function Chat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(() => {
        const saved = localStorage.getItem('antigravity_userId');
        if (saved) return saved;
        const newId = `user_${Math.floor(Math.random() * 1000)}`;
        localStorage.setItem('antigravity_userId', newId);
        return newId;
    });

    // Sync userId to localStorage if it's manually changed in the UI
    useEffect(() => {
        localStorage.setItem('antigravity_userId', userId);
    }, [userId]);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const userName = localStorage.getItem('userName') || 'Guest';

    const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }
    useEffect(scrollToBottom, [messages]);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ sender: 'ai', text: "Hello! I'm Dawn, your Diabetes Prevention Assistant. To get started, please tell me your name or simply say 'hello'!" }]);
        }
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await api.chat(userId, userMsg);
            setMessages(prev => [...prev, { sender: 'ai', text: result.response }]);
        } catch (error: any) {
            console.error("Chat API error details:", {
                message: error.message,
                response: error.response,
                code: error.code,
                config: error.config
            });

            // Extract the most specific error message possible
            let errorMsg = "Network Error";
            if (error.response?.data?.detail) {
                errorMsg = error.response.data.detail;
            } else if (error.message) {
                errorMsg = error.message;
            }

            setMessages(prev => [...prev, {
                sender: 'ai',
                text: `Sorry, I'm having trouble connecting to my brain right now. (Error: ${errorMsg})`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent overflow-hidden">
            <div className="flex items-center p-4 border-b border-white/10 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 border border-primary/20">
                    <img src="/PREVENT logo.png" className="w-6 h-6 object-contain opacity-80" alt="Logo" />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-extralight tracking-widest text-white uppercase">Dawn</h2>
                    <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-[10px] text-primary/60 uppercase tracking-widest font-light">Direct Assistance</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">ID:</span>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="text-[10px] text-white/40 bg-transparent border-none focus:ring-0 p-0 w-16 font-light"
                        title="Edit User ID"
                    />
                </div>
            </div>

            <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center self-start overflow-hidden">
                                <img src="/PREVENT logo.png" className="w-4 h-4 object-contain" alt="Dawn" />
                            </div>
                        )}
                        <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md ${msg.sender === 'user'
                            ? 'bg-primary/20 border border-primary/30 text-white rounded-br-none'
                            : 'bg-white/5 border border-white/10 text-white/90 rounded-bl-none'
                            }`}>
                            <p className="text-sm font-light leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                            <Loader2 className="animate-spin w-4 h-4 text-primary/60" />
                        </div>
                        <span className="text-[10px] text-white/20 tracking-widest uppercase italic">Dawn is thinking...</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-transparent border-t border-white/10 flex-shrink-0">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Speak with Dawn..."
                        className="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all text-sm font-light text-white placeholder:text-white/20"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-primary-foreground rounded-full hover:scale-105 transition-transform disabled:opacity-20 disabled:scale-100 shadow-lg shadow-primary/20"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
