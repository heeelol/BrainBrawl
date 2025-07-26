import { useContext, useState, useEffect } from 'react';
import { UserContext } from "../../context/userContext.jsx";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import backdrop from "../assets/backdrop.jpg"
import mtfuji from "../assets/mtFuji.jpg";
import noobbrain from "../assets/noobbrain.jpg";
import { avatarMap } from "../assets/avatars.js";


export default function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [stats, setStats] = useState();
    const [quizStats, setQuizStats] = useState([]);
    const [ownedAvatars, setOwnedAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const [editName, setEditName] = useState(user?.name || "");
    const [editEmail, setEditEmail] = useState(user?.email || "");
    const [editAvatar, setEditAvatar] = useState("");

      useEffect(() => {
            axios.get('/profile')
                .then(({data}) => {
                    setUser(data);
                })
                .catch(() => {
                    setUser(null);
                });
        }, []);

    useEffect(() => {
        if (user?.email) {
            axios.get(`/quizStats/${user.email}`)
                 .then(res => setQuizStats(res.data))
                 .catch(err => console.error(err));
            
            axios.get('/level')
                 .then(res =>setStats(res.data))
                 .catch(() => setStats(null));

             axios.get(`/ownership/${user.email}`)
                .then(res => {
                    if (res.data) {
                        setOwnedAvatars(res.data.item_list.map(item => item.item_id));
                        setSelectedAvatar(res.data.selected_avatar || noobbrain);
                    }
                })
                .catch(() => {
                    setOwnedAvatars([]);
                    setSelectedAvatar("");
                });
        }
    }, [user]);


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.put('/updateProfile', {
                oldEmail: user.email,
                email: editEmail,
                name: editName,
                selected_avatar: editAvatar
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                setUser(prev => ({
                    ...prev,
                    name: data.name,
                    email: data.email,
                    selected_avatar: editAvatar
                })

                )
                toast.success("Profile Updated");
                setIsEditing(false);
                setSelectedAvatar(editAvatar);
            }
        } catch (err) {
            console.log(err);
        }
    };


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
                    <img className="object-cover object-center h-32" src={isEditing ? avatarMap[editAvatar] : avatarMap[selectedAvatar] || (user.name == "test" ? mtfuji : noobbrain)} test-dataid="avatar"/>
                </div>
                
                {isEditing ? (
                    <form className="p-8 flex flex-col gap-4" onSubmit={handleUpdateProfile}>
                        <label className="font-semibold">Name
                            <input
                                className="block w-full border rounded p-2 mt-1"
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                required
                            />
                        </label>
                        <label className="font-semibold">Email
                            <input
                                className="block w-full border rounded p-2 mt-1"
                                type="email"
                                value={editEmail}
                                onChange={e => setEditEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label className="font-semibold">Avatar
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {ownedAvatars.map(itemId => (
                                    <img
                                        key={itemId}
                                        src={avatarMap[itemId] || noobbrain}
                                        alt={itemId}
                                        className={`w-12 h-12 rounded-full cursor-pointer border-2 ${editAvatar === itemId ? "border-blue-500" : "border-gray-300"}`}
                                        onClick={() => setEditAvatar(itemId)}
                                    />
                                ))}
                            </div>
                        </label>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 rounded-full bg-green-600 hover:bg-green-700 text-white px-6 py-2">Save</button>
                            <button type="button" className="flex-1 rounded-full bg-gray-400 hover:bg-gray-500 text-white px-6 py-2" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="text-center mt-2">
                            <h2 className="font-bold text-xl" test-dataid="name">{user.name}</h2>
                            {/* //to be added on in the future (title)
                             <p className="text-gray-500 text-sm">{user.title}</p> */}
                        </div>
                        <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
                            <li className="flex flex-col items-center justify-center">
                                <div className="mb-2 pt-10">
                                    <span className="text-md text-green-400 font-medium">Win: {user?.win || 0} </span>
                                    <span className="text-md text-red-400 font-medium">Loss: {user?.loss || 0}</span>
                                </div>
                            </li>
                            <li className="flex flex-col items-center justify-center">
                                <div className="mb-2 ml-10 pb-10">
                                    <span className="text-xl text-yellow-300 font-bold animate-pulse">Level {stats?.level}</span>
                                </div>
                            </li>
                            <li className="flex flex-col items-center justify-center">
                                <div className="mb-2 pt-10">
                                    <span className="text-md text-blue-300 font-medium">Quizzes Attempted: {quizStats?.length}</span>
                                </div>
                            </li>
                        </ul>
                        <div className="p-4 border-t mx-8 mt-8">
                            <button
                                className="w-3/4 block mx-auto rounded-full bg-gray-900 hover:shadow-lg hover:bg-gray-700 font-semibold text-white px-6 py-2"
                                onClick={() => {
                                    setEditName(user.name);
                                    setEditEmail(user.email);
                                    setEditAvatar(selectedAvatar);
                                    setIsEditing(true);
                                }}
                            >
                                Update Profile
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}