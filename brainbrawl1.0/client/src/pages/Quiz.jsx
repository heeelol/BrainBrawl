import React from 'react';
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function Quiz() {
    return (
        <>
            <header className="sticky top-0 z-50 flex justify-center items-center">
                <div className="xl:max-w-full w-full">
                    <Navbar />
                </div>
            </header>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col py-12 sm:px-6 lg:px-8">
                <div className="fixed top-4 left-4">
                    <Link to="/dashboard" className="flex items-center text-gray-300 hover:text-white transition-colors">
                        <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-white">
                            Welcome Back, Warrior
                        </h2>
                        <p className="mt-2 text-sm text-indigo-300">
                            Ready to continue your quest for knowledge?
                        </p>
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-gray-800 bg-opacity-50 py-8 px-4 shadow-xl ring-1 ring-gray-900/10 backdrop-blur-lg sm:rounded-lg sm:px-10">

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-800 text-gray-400">New to BrainBrawl?</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => navigate('#')}
                                    className="w-full flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Join the Battle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}