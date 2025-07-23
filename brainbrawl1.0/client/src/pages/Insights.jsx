import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import axios from "axios";


export default function Insights() {

    // mock data -- replace with data from backend
    const accuracyData = [
    { date: '2024-06-01', accuracy: 70 },
    { date: '2024-06-05', accuracy: 75 },
    { date: '2024-06-10', accuracy: 80 },
    { date: '2024-06-15', accuracy: 85 },
    { date: '2024-06-20', accuracy: 90 },
    ];
    const timeData = [
    { topic: 'Math', avgTime: 12 },
    { topic: 'History', avgTime: 15 },
    { topic: 'Science', avgTime: 10 },
    ];
    const topicAccuracy = [
    { topic: 'Math', accuracy: 60 },
    { topic: 'History', accuracy: 80 },
    { topic: 'Science', accuracy: 50 },
    { topic: 'Geography', accuracy: 90 },
    ];
    const recentQuizzes = [
    { date: '2024-06-20', score: '8/10', xp: '120'},
    { date: '2024-06-18', score: '6/10', xp: '80'},
    { date: '2024-06-15', score: '9/10', xp: '140'},
    ];

    return (


        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 max-w-screen mx-auto py-12 space-y-8">
        <h1 className="text-4xl font-extrabold text-neutral-100 flex justify-center animate-pulse">Performance Overview</h1>
            <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0}} transition={{ duration: 2 }}>
                <div className="grid grid-cols-1 gap-6">
                    <h3 className="text-2xl font-bold text-teal-500">Accuracy Over Time</h3>
                    <div className="bg-[#2b2b50] rounded-lg shadow-xl p-4 ">
                        <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={accuracyData}>
                                <XAxis dataKey="date" stroke="white" />
                                <YAxis domain={[0, 100]} stroke="white" />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Line type="monotone" dataKey="accuracy" stroke="#22c55e" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <h3 className="text-2xl font-bold text-teal-500 mt-8">Avg Time per Question</h3>
                <div className="bg-[#2b2b50] rounded-lg shadow-xl p-4 mt-5">
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={timeData} layout="vertical">
                            <CartesianGrid strokeDasharra="3 3" />
                            <XAxis type="number" stroke="white"/>
                            <YAxis dataKey="topic" type="category" stroke="white"/>
                            <Tooltip />
                            <Bar dataKey="avgTime" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>          
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Topic Breakdown</h2>
            <div className="bg-[#2b2b50] rounded-lg shadow p-4">
                <div className="flex justify-between mb-2">
                    <span className="font-bold text-white border-b">Accuracy by Topic</span>
                    <button className="text-blue-500 text-sm hover:text-blue-400">Show Weakest First</button>
                </div>
                <div className="space-y-3 text-white">
                    {topicAccuracy.map((t) => (
                    <div key={t.topic} className="flex items-center">
                        <span className="w-24 font-medium">{t.topic}</span>
                        <div className="flex-1 mx-2 bg-gray-200 rounded-full h-4">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${t.accuracy}%` }}></div>
                        </div>
                        <span className="w-12 text-right">{t.accuracy}%</span>
                    </div>
                    ))}
                </div>
            </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Recent Quizzes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentQuizzes.map((quiz, idx) => (
                <div key={idx} className="bg-[#2b2b50] rounded-lg shadow p-4 flex flex-col items-center">
                    <span className="text-gray-500 text-xs mb-1">{quiz.date}</span>
                    <span className="font-bold text-lg mb-1 text-white">Score: {quiz.score}</span>
                    <span className="text-green-600 font-semibold">+{quiz.xp} XP</span>
                </div>
            ))}
            </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Recommendations</h2>
                <div className="bg-[#2b2b50] rounded-lg shadow p-4">
                    <p className="mb-2 text-white">Based on your stats, you should revisit: <span className="font-semibold text-red-500">Algebra</span></p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Practice Algebra Quiz</button>
                </div>
        </motion.section>
        </div>
    )
}