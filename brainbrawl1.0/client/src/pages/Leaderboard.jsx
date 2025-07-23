import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        axios.get("/leaderboard")
            .then(res => setLeaders(res.data))
            .catch(() => setLeaders([]));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col items-center py-12">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-10 drop-shadow-lg tracking-wide animate-pulse">
                🏆 Leaderboard 🏆
            </h1>
            <div className="bg-gray-900 bg-opacity-80 rounded-2xl shadow-2xl p-10 w-full max-w-2xl border-4 border-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
                <table className="w-full text-left text-gray-100 text-lg">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="pb-3 pl-2">Rank</th>
                            <th className="pb-3">Player</th>
                            <th className="pb-3">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-gray-400 text-xl">No data available.</td>
                            </tr>
                        )}
                        {leaders.map((player, idx) => (
                            <tr key={player.name} className={`transition-all duration-200 ${idx === 0 ? 'bg-gradient-to-r from-yellow-400/30 via-pink-400/20 to-purple-400/30 font-bold scale-105' : idx === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-700/10 font-semibold' : idx === 2 ? 'bg-gradient-to-r from-yellow-200/10 to-pink-200/10 font-semibold' : 'hover:bg-gray-800/60'}`}>
                                <td className="py-3 pl-2">{player.rank}</td>
                                <td className="py-3 flex items-center gap-2">
                                    {idx === 0 && <span className="text-yellow-400 text-2xl">🥇</span>}
                                    {idx === 1 && <span className="text-gray-300 text-2xl">🥈</span>}
                                    {idx === 2 && <span className="text-yellow-600 text-2xl">🥉</span>}
                                    <span>{player.name}</span>
                                </td>
                                <td className="py-3">{player.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}