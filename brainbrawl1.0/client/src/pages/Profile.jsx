import { useContext, useState, useEffect } from 'react';
import { UserContext } from "../../context/userContext.jsx";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import mtfuji from "../assets/mtFuji.jpg";
import backdrop from "../assets/backdrop.jpg";
import cat_pfp from "../assets/cat_pfp.png";
import dog_pfp from "../assets/dog_pfp.png";
import robot_pfp from "../assets/robot_pfp.png";


export default function Profile() {

    const { user } = useContext(UserContext);
    const [stats, setStats] = useState();
    const [quizStats, setQuizStats] = useState([]);

    useEffect(() => {
        axios.get('/level')
            .then(res =>setStats(res.data))
            .catch(() => setStats(null));
    }, []);

    useEffect(() => {
        if (user?.email) {
            axios.get(`/quizStats/${user.email}`)
                 .then(res => setQuizStats(res.data))
                 .catch(err => console.error(err));
        }
    }, [user]);


    return (
        <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 space-y-8">
            <div className="fixed top-4 left-4 z-1">
                <Link to="/dashboard" className="flex items-center text-gray-300 hover:text-white transition-colors">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4 flex justify-center pt-20 animate-pulse z-0">Profile</h2>
        
            <div
                className="max-w-screen mx-4 sm:max-w-sm md:max-w-sm lg:min-w-4xl xl:min-w-4xl sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
                 <div className="rounded-t-lg h-50 overflow-hidden">
                    <img className="object-cover object-top w-full" src={backdrop}/>
                </div>
                <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                    <img className="object-cover object-center h-32" src={mtfuji}/>
                </div>
                
                <div className="text-center mt-2">
                    <h2 className="font-bold text-xl ">{user.name}</h2>
                    <p className="text-gray-500 text-sm">{user.title}</p>
                </div>
                <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
                    <li className="flex flex-col items-center justify-between">
                        <div className="mb-2">
                            <span className="text-lg text-yellow-300 font-bold">Level {stats?.level}</span>
                        </div>
                    </li>
                    <li class="flex flex-col items-center justify-center">
                       <div className="mb-2">
                            <span className="text-lg text-blue-300 font-bold">Quiz Attempted: {quizStats?.length}</span>
                        </div>
                    </li>
                </ul>
                <div className="p-4 border-t mx-8 mt-8">
                    <button className="w-3/4 block mx-auto rounded-full bg-gray-900 hover:shadow-lg hover:bg-gray-700 font-semibold text-white px-6 py-2">Update Profile</button>
                </div>
            </div>


        </div>
    )
}