import React from "react";
import {AnimatedBackground} from "../components/AnimatedBackground.jsx";

export default function About() {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900">
            <AnimatedBackground />
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                    <span className="block">About Us</span>
                                </h1>
                                <h2 className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl md:text-5xl">
                                    <span className="block text-indigo-400">Our Story & Team</span>
                                </h2>
                                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    BrainBrawl was founded by a duo of passionate developers, Jia Wei and Kuan Yi, who desired to make learning fun and competitive. Our journey began in 2024, when BrainBrawl was created during Orbital 2025, fueled by a desire to changing the mundane learning experience into a rewarding one, a love for trivia and a desire to connect people through knowledge battles.
                                </p>
                                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Today, BrainBrawl boasts a vibrant community where players challenge each other, learn new facts and celebrate learning. Join us as we continue to grow and innovate!
                                </p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            <div className="py-12 bg-gray-900 bg-opacity-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mt-5">
                        <h2 className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl md:text-5xl mb-10">
                            <span className="block text-white">Our Values</span>
                        </h2>
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="relative p-6 bg-gray-800 rounded-lg hover:transform hover:scale-105 transition duration-300">
                                <div>
                                    <span className="text-indigo-400 text-4xl">🤝</span>
                                    <h3 className="mt-4 text-xl font-bold text-white">Community</h3>
                                    <p className="mt-2 text-gray-300">
                                        We believe in learning together and supporting each other in our quest for knowledge.
                                    </p>
                                </div>
                            </div>
                            <div className="relative p-6 bg-gray-800 rounded-lg hover:transform hover:scale-105 transition duration-300">
                                <div>
                                    <span className="text-indigo-400 text-4xl">💡</span>
                                    <h3 className="mt-4 text-xl font-bold text-white">Innovation</h3>
                                    <p className="mt-2 text-gray-300">
                                        We are always improving and exploring new ways to make learning fun and rewarding for all.
                                    </p>
                                </div>
                            </div>
                            <div className="relative p-6 bg-gray-800 rounded-lg hover:transform hover:scale-105 transition duration-300">
                                <div>
                                    <span className="text-indigo-400 text-4xl">🎉</span>
                                    <h3 className="mt-4 text-xl font-bold text-white">Passion</h3>
                                    <p className="mt-2 text-gray-300">
                                        We are driven by curiosity and a shared love for sharing knowledge.
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