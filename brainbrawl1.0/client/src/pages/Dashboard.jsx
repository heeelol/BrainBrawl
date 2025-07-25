import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/userContext.jsx';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';
import axios from 'axios';

export default function Dashboard() {
    const topics = [
        { key: 'general', name: 'General Knowledge', desc: 'Everything under the sun!' },
        { key: 'science', name: 'Science', desc: 'Test your science smarts!' },
        { key: 'history', name: 'History', desc: 'Challenge your history knowledge!' },
        { key: 'math', name: 'Math', desc: 'Enhance your calculating skills and speed!' },
        { key: 'english', name: 'English', desc: 'Improve your grammar and vocabulary skills!' },
        { key: 'art', name: 'Art', desc: 'Explore the world of art and creativity!' },
    ];

    const {user} = useContext(UserContext);
    const navigate = useNavigate();
    const [leaders, setLeaders] = useState([]);
    const [levels, setLevels] = useState();

    useEffect(() => {
        axios.get('/leaderboard')
            .then(res => setLeaders(res.data.slice(0, 5))) // Show top 5
            .catch(() => setLeaders([]));
    }, []);

    useEffect(() => {
        axios.get('/level')
            .then(res =>setLevels(res.data))
            .catch(() => setLevels(null));
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
            <div className="pt-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        Welcome, {user?.name || 'Warrior'}!
                    </h1>
                    {/* Dashboard content will go here */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Placeholder cards for dashboard content */}
                        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg">
                            <h2 className="text-xl font-semibold text-white mb-4">Your Stats</h2>
                            {levels ? (
                                <>
                                    <div className="mb-2">
                                        <span className="text-lg text-yellow-300 font-bold">Level {levels.level}</span>
                                        <ProgressBar
                                            percent={levels.needed ? (levels.current / levels.needed) * 100 : 0}
                                            filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
                                        />
                                        <span className="text-gray-400 text-sm block mt-1">
                                            XP: {levels.current} / {levels.needed}
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
                                                        {idx === 0 && <span className="animate-bounce">🥇</span>}
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
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Classic Quizzes
                    </h1>
                    <div className="mb-6 text-lg text-gray-200">
                        Choose a topic you like and test your knowledge in classic quizzes!
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {topics.map(topic => (
                            <div
                                key={topic.key}
                                onClick={() => handleNavigation(`/quiz/${topic.key}`)}
                                className="outline-double bg-gray-700 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg hover:transform hover:scale-105 hover:bg-gray-600 transition duration-300"
                            >
                                <div className="block">
                                    <h2 className="text-xl font-semibold text-white mb-4">{topic.name}</h2>
                                    <p className="text-gray-300">{topic.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16">
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Multiplayer Battles
                    </h1>
                    <div className="mb-6 text-lg text-gray-200">
                        Join a room and fight against your opponents in real-time quiz battles! Earn points, level up, and climb the leaderboard!
                    </div>
                    {/* Dashboard content will go here */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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