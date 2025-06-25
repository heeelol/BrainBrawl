import { useContext } from 'react';
import { UserContext } from '../../context/userContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

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
                            <p className="text-gray-300">Coming soon...</p>
                        </div>
                        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg">
                            <h2 className="text-xl font-semibold text-white mb-4">Active Challenges</h2>
                            <p className="text-gray-300">No active challenges</p>
                        </div>
                        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg">
                            <h2 className="text-xl font-semibold text-white mb-4">Leaderboard</h2>
                            <p className="text-gray-300">Loading rankings...</p>
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
                        <div onClick={()=>{handleNavigation('/quiz')}} className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg hover:transform hover:scale-105 transition duration-300">
                            <div className="block">
                                <h2 className="text-xl font-semibold text-white mb-4">General Knowledge</h2>
                                <p className="text-gray-300">Everything under the sun!</p>
                            </div>
                        </div>
                        <div onClick={()=>{handleNavigation('/multiplayer')}} className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg hover:transform hover:scale-105 transition duration-300">
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