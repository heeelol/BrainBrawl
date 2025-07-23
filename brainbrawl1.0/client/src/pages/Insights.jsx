import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext.jsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import axios from "axios";
import { useNavigate } from 'react-router-dom';


export default function Insights() {
    const { user } = useContext(UserContext);
    const [quizStats, setQuizStats] = useState([]);

    const navigate = useNavigate();

    const handleNavigation = (e, href) => {
    e.preventDefault();
    navigate(href);
    };

    useEffect(() => {
        if (user?.email) {
            axios.get(`/quizStats/${user.email}`)
                 .then(res => setQuizStats(res.data))
                 .catch(err => console.error(err));
        }
    }, [user]);
    
    // Accuracy over time
    const accuracyByDate = {};

    quizStats.forEach(stat => {
    const date = new Date(stat.date).toLocaleDateString("en-SG", { timeZone: "Asia/Singapore" });
    if (!accuracyByDate[date]) {
        accuracyByDate[date] = { totalAccuracy: 0, count: 0 };
    }
    const accuracy =(stat.score / 5) * 100;
    accuracyByDate[date].totalAccuracy += accuracy;
    accuracyByDate[date].count += 1;
    });

    const accuracyData = Object.entries(accuracyByDate).map(([date, { totalAccuracy, count }]) => ({
    date,
    accuracy: totalAccuracy / count
    }))
   .sort((a, b) => a.date.localeCompare(b.date));

// Average time per question by topic
    const topicTimes = {};
    quizStats.forEach(stat => {
        stat.answers.forEach(ans => {
            if (!topicTimes[ans.topic || stat.topic]) topicTimes[ans.topic || stat.topic] = [];
            topicTimes[ans.topic || stat.topic].push(ans.timeTaken);
        });
    });

    const timeData = Object.entries(topicTimes).map(([topic, times]) => ({
        topic,
        avgTime: times.reduce((a, b) => a + b, 0) / times.length
    }));

// Topic accuracy
    const topicCorrect = {};
    const topicTotal = {};
    quizStats.forEach(stat => {
        stat.answers.forEach(ans => {
            const topic = ans.topic || stat.topic;
            topicCorrect[topic] = (topicCorrect[topic] || 0) + (ans.correct ? 1 : 0);
            topicTotal[topic] = (topicTotal[topic] || 0) + 1;
        });
    });
    const topicAccuracy = Object.keys(topicTotal).map(topic => ({
        topic,
        accuracy: (topicCorrect[topic] / topicTotal[topic]) * 100
    }));

// Recent quizzes
    const recentQuizzes = quizStats.slice(0, 5).map(stat => ({
        date: new Date(stat.date).toLocaleDateString("en-SG", { timeZone: "Asia/Singapore" }),
        topic: stat.topic,
        score: `${stat.score}`,
        xp: stat.xpGained
    }));

// Recommendations (weakest topic)
    const weakest = topicAccuracy.sort((a, b) => a.accuracy - b.accuracy)[0];
   

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 space-y-8">
        <h1 className="text-4xl font-bold text-neutral-100 flex justify-center animate-pulse pt-15">Performance Overview</h1>
            <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0}} transition={{ duration: 2 }}>
                <div className="grid grid-cols-1 gap-6">
                    <h3 className="text-2xl font-bold text-teal-500">Accuracy Over Time</h3>
                    <div className="bg-[#2b2b50] rounded-lg shadow-xl p-4 ">
                       { accuracyData.length > 1 ? (
                            <ResponsiveContainer width="100%" height={180}>
                                    <LineChart data={accuracyData}>
                                        <XAxis dataKey="date" stroke="white" />
                                        <YAxis domain={[0, 100]} stroke="white" />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip  formatter={(value, name) => [`${value}%`, name]} labelFormatter={label => label}/>
                                        <Line type="monotone" dataKey="accuracy" stroke="#22c55e" />
                                    </LineChart>
                            </ResponsiveContainer> 
                        ) : (
                            <div className="text-center text-gray-400 py-8">
                                Not enough data to display trend.
                            </div>
                        )}
                    </div>
                </div>
                
                <h3 className="text-2xl font-bold text-teal-500 mt-8">Avg Time per Question</h3>
                <div className="bg-[#2b2b50] rounded-lg shadow-xl p-4 mt-5">
                    { timeData.length > 1 ? (
                        <ResponsiveContainer width="100%" height={40 * timeData.length}>
                            <BarChart data={timeData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" stroke="white"/>
                                <YAxis dataKey="topic" type="category" stroke="white"/>
                                <Tooltip />
                                <Bar dataKey="avgTime" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            Not enough data to display trend.
                        </div>
                    )}
                </div>          
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Topic Breakdown</h2>
            <div className="bg-[#2b2b50] rounded-lg shadow p-4">
                <div className="flex justify-between mb-2">
                    <span className="font-bold text-white border-b">Accuracy by Topic (Weakest to Strongest)</span>
                </div>
                {topicAccuracy.length > 1 ? (
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
                ) : (
                        <div className="text-center text-gray-400 py-8">
                            Not enough data to display trend.
                        </div>
                )}
            </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Recent Quizzes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentQuizzes.map((quiz, idx) => (
                <div key={idx} className="bg-[#2b2b50] rounded-lg shadow p-4 flex flex-col items-center">
                    <span className="text-gray-500 text-xs mb-1">{quiz.date}</span>
                    <span className="text-teal-500 font-semibold text-md">{quiz.topic}</span>
                    <span className="font-bold text-lg mb-1 text-white">Score: {quiz.score}/5</span>
                    <span className="text-green-600 font-semibold">+{quiz.xp} XP</span>
                </div>
            ))}
            </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-2xl font-bold mb-4 text-teal-500">Recommendations</h2>
                <div className="bg-[#2b2b50] rounded-lg shadow p-4 max-w-100">
                    <p className="mb-2 text-white">Based on your stats, you should revisit: <span className="font-semibold text-red-500">{ weakest?.topic || "NA" }</span></p>
                    <button onClick={ (e) => handleNavigation(e, '/dashboard') }className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Practice { weakest?.topic || "Other"} Quiz</button>
                </div>
        </motion.section>
        </div>
    )
}