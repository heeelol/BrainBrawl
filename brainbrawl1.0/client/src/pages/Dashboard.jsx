import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/userContext.jsx';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';
import axios from 'axios';

export default function Dashboard() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [stats, setStats] = useState();

    useEffect(() => {
        axios.get('/leaderboard')
            .then(res => setLeaders(res.data.slice(0, 5))) // Show top 5
            .catch(() => setLeaders([]));
    }, []);

    useEffect(() => {
        axios.get('/level')
            .then(res =>setStats(res.data))
            .catch(() => setStats(null));
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
            <div className="pt-16 px-4 sm:px-6 lg:px-8"> {/* Added pt-16 to account for Navbar height */}
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        Welcome, {user?.name || 'Warrior'}!
                    </h1>
                    {/* Dashboard content will go here */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Placeholder cards for dashboard content */}
                        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg">
                            <h2 className="text-xl font-semibold text-white mb-4">Your Stats</h2>
                            {stats ? (
                                <>
                                    <div className="mb-2">
                                        <span className="text-lg text-yellow-300 font-bold">Level {stats.level}</span>
                                        <ProgressBar
                                            percent={stats.needed ? (stats.current / stats.needed) * 100 : 0}
                                            filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
                                        />
                                        <span className="text-gray-400 text-sm block mt-1">
                                            XP: {stats.current} / {stats.needed}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-400">Loading Stats...</div>
                            )}
                        </div>
                        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg">
                            <h2 className="text-xl font-semibold text-white mb-4">Active Challenges</h2>
                            <p className="text-gray-300">No active challenges</p>
                        </div>
                        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                Leaderboard <span className='text-yellow-400 text-2xl'>🏆</span>
                            </h2>
                            {leaders && leaders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-gray-200 text-base">
                                        <thead>
                                            <tr>
                                                <th className="pb-2">Rank</th>
                                                <th className="pb-2">Player</th>
                                                <th className="pb-2">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaders.map((player, idx) => (
                                                <tr
                                                    key={player.name}
                                                    className={
                                                        idx === 0
                                                            ? 'bg-gradient-to-r from-yellow-400/20 to-purple-400/20 font-bold'
                                                            : idx === 1
                                                            ? 'bg-gradient-to-r from-gray-400/20 to-gray-700/10 font-semibold'
                                                            : idx === 2
                                                            ? 'bg-gradient-to-r from-yellow-200/10 to-pink-200/10 font-semibold'
                                                            : ''
                                                    }
                                                >
                                                    <td className="py-2">{player.rank}</td>
                                                    <td className="py-2 flex items-center gap-2">
                                                        {idx === 0 && <span>🥇</span>}
                                                        {idx === 1 && <span>🥈</span>}
                                                        {idx === 2 && <span>🥉</span>}
                                                        <span>{player.name}</span>
                                                    </td>
                                                    <td className="py-2">{player.points}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-gray-400 py-4">Loading Leaderboard...</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        Quizzes
                    </h1>
                    {/* Dashboard content will go here */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Placeholder cards for dashboard content */}
                        <div onClick={()=>{handleNavigation('/quiz')}} className="outline-double bg-gray-700 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg hover:transform hover:scale-105 hover:bg-gray-600 transition duration-300">
                            <div className="block">
                                <h2 className="text-xl font-semibold text-white mb-4">General Knowledge</h2>
                                <p className="text-gray-300">Everything under the sun!</p>
                            </div>
                        </div>
                        <div onClick={()=>{handleNavigation('/multiplayer')}} className="outline-double bg-gray-700 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg hover:transform hover:scale-105 hover:bg-gray-600 transition duration-300">
                            <div className="block">
                                <h2 className="text-xl font-semibold text-white mb-4">Multiplayer</h2>
                                <p className="text-gray-300">Join a room and fight against your opponents!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}