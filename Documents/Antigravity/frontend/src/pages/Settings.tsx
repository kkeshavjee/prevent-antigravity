import React from 'react';


export default function Settings() {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 md:rounded-2xl md:shadow-lg">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Settings</h2>
            </div>
            <div className="p-6">
                <p>Settings placeholder</p>
                <button
                    onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                >
                    Reset & Logout
                </button>
            </div>
        </div>
    );
}
