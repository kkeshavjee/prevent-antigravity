import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ChevronLeft, Loader2, Apple } from 'lucide-react';
// Navbar import removed
import { api } from '@/api/client';

export default function Chat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(() => `user_${Math.floor(Math.random() * 1000)}`);
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
            console.error("Chat API error:", error);
            const errorMsg = error.response?.data?.detail || error.message || "Unknown error";
            setMessages(prev => [...prev, {
                sender: 'ai',
                text: `Sorry, I'm having trouble connecting to my brain right now. (Error: ${errorMsg})`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 md:rounded-2xl md:shadow-lg">
            <div className="flex items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                    <Apple className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dawn</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-green-500">Online</span>
                        <span className="text-[10px] text-gray-400">| ID: </span>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="text-[10px] text-gray-400 bg-transparent border-none focus:ring-0 p-0 w-20"
                            title="Click to edit User ID for testing (e.g. 1001)"
                        />
                    </div>
                </div>
                <button
                    onClick={async () => {
                        try {
                            const res = await fetch('http://127.0.0.1:8000/health');
                            const data = await res.json();
                            alert(`Connection Success: ${JSON.stringify(data)}`);
                        } catch (e: any) {
                            alert(`Connection Failed: ${e.message}`);
                        }
                    }}
                    className="ml-auto text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-500"
                >
                    Test Connection
                </button>
            </div>

            <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center self-start"><Apple className="w-5 h-5 text-green-600" /></div>}
                        <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-lg'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && <Loader2 className="animate-spin w-5 h-5 text-gray-500" />}
                <div ref={chatEndRef} />
            </div>

            <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 flex-shrink-0">
                <div className="relative">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type message..." className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-full"><Send className="w-5 h-5" /></button>
                </div>
            </div>
        </div>
    );
}
