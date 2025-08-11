import React from "react";

export function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-1/5 top-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative animate-float-left">
                    <div className="text-9xl opacity-30 text-indigo-400 glow-indigo">🧠</div>
                    <div className="absolute inset-0 blur-sm bg-indigo-500/20 rounded-full animate-pulse"></div>
                </div>
            </div>
            <div className="absolute right-1/5 top-1/3 transform translate-x-1/2 -translate-y-1/2">
                <div className="relative animate-float-right">
                    <div className="text-9xl opacity-30 text-red-400 scale-x-[-1] glow-red">🧠</div>
                    <div className="absolute inset-0 blur-sm bg-red-500/20 rounded-full animate-pulse"></div>
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-indigo-900/30"></div>
        </div>
    );
}