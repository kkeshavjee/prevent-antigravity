import React, { useEffect, useState } from 'react';
import { api } from '@/api/client';

export default function Admin() {
    const [agents, setAgents] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('agents');

    useEffect(() => {
        // Fetch data from admin API
        api.admin.getAgents().then(setAgents).catch(console.error);
        api.admin.getConversations().then(setLogs).catch(console.error);
    }, []);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 md:rounded-2xl md:shadow-lg overflow-hidden">
            <div className="p-4 border-b bg-purple-50 dark:bg-purple-900/20">
                <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Researcher Dashboard</h2>
            </div>
            <div className="flex border-b">
                <button onClick={() => setActiveTab('agents')} className={`flex-1 p-3 ${activeTab === 'agents' ? 'border-b-2 border-purple-600 font-bold' : ''}`}>Agents</button>
                <button onClick={() => setActiveTab('logs')} className={`flex-1 p-3 ${activeTab === 'logs' ? 'border-b-2 border-purple-600 font-bold' : ''}`}>Conversations</button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'agents' && (
                    <div className="space-y-4">
                        {agents.map((agent, i) => (
                            <div key={i} className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
                                <div className="font-bold">{agent.name}</div>
                                <div className="text-sm text-gray-500">{agent.description}</div>
                                <div className="text-xs mt-2 px-2 py-1 bg-green-100 text-green-800 rounded inline-block">{agent.status}</div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'logs' && (
                    <div className="space-y-4">
                        {logs.map((log, i) => (
                            <div key={i} className="p-4 border rounded hover:bg-gray-50 cursor-pointer">
                                <div className="font-bold">User: {log.user_id}</div>
                                <div className="text-sm">Messages: {log.message_count}</div>
                                <div className="text-xs text-gray-400">Last active: {log.last_active}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
