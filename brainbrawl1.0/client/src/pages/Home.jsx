import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {UserContext} from "../../context/userContext.jsx";

function AnimatedBackground() {
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

export default function Home() {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900">
            <AnimatedBackground />
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                    <span className="block">Test Your Knowledge in</span>
                                    <span className="block text-indigo-400">1v1 Brain Battles</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Challenge other players in real-time quiz battles. Level up your knowledge, earn rewards, and climb the leaderboard!
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    { user?.name ? <>
                                        <div className="rounded-md shadow">
                                            <button
                                                onClick={() => navigate('/dashboard')}
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                                            >
                                                Return to Battle
                                            </button>
                                        </div>
                                    </> : <>
                                        <div className="rounded-md shadow">
                                            <button
                                                onClick={() => navigate('/register')}
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                                            >
                                                Start Battle
                                            </button>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-3">
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                                            >
                                                Login
                                            </button>
                                        </div>
                                    </> }
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

      
            <div className="py-12 bg-gray-900 bg-opacity-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mt-10">
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="relative p-6 bg-gray-800 rounded-lg hover:transform hover:scale-105 transition duration-300">
                                <div>
                                    <span className="text-indigo-400 text-4xl">⚔️</span>
                                    <h3 className="mt-4 text-xl font-bold text-white">Real-time Battles</h3>
                                    <p className="mt-2 text-gray-300">
                                        Challenge players to intense 1v1 quiz duels across various topics
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="relative p-6 bg-gray-800 rounded-lg hover:transform hover:scale-105 transition duration-300">
                                <div>
                                    <span className="text-indigo-400 text-4xl">🏆</span>
                                    <h3 className="mt-4 text-xl font-bold text-white">Rank Up</h3>
                                    <p className="mt-2 text-gray-300">
                                        Win battles to climb the leaderboard and earn prestigious titles
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="relative p-6 bg-gray-800 rounded-lg hover:transform hover:scale-105 transition duration-300">
                                <div>
                                    <span className="text-indigo-400 text-4xl">🎯</span>
                                    <h3 className="mt-4 text-xl font-bold text-white">Learn & Improve</h3>
                                    <p className="mt-2 text-gray-300">
                                        Get instant feedback and track your progress across subjects
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}