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
            <h1 className="text-4xl font-bold text-white mb-8">Leaderboard</h1>
            <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-lg p-8 w-full max-w-xl">
                <table className="w-full text-left text-gray-200">
                    <thead>
                        <tr>
                            <th className="pb-2">Rank</th>
                            <th className="pb-2">Player</th>
                            <th className="pb-2">Wins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-4 text-gray-400">No data available.</td>
                            </tr>
                        )}
                        {leaders.map((player, idx) => (
                            <tr key={player.name}>
                                <td className="py-2">{idx + 1}</td>
                                <td className="py-2">{player.name}</td>
                                <td className="py-2">{player.wins}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}