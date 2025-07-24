import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/userContext.jsx";
import axios from 'axios';
import {toast} from "react-hot-toast";
import { items } from "../assets/avatars.js";

export default function Shop() {
    const { user } = useContext(UserContext);
    const [coins, setCoins] = useState();
    const [redeemed, setRedeemed] = useState([]);

    useEffect(() => {
        axios.get('/coins')
            .then(res => setCoins(res.data))
            .catch(() => setCoins(null));
    }, []);

    useEffect(() => {
        axios.get('/owned-items')
            .then(res => {
                 if (Array.isArray(res.data)) {
                    const itemIds = res.data.map(item => item.item_id);
                    setRedeemed(itemIds);
                } else {
                    setRedeemed([]);
                }
            })
            .catch(() => setRedeemed([]));
    }, [coins]);

    const handleRedeem = async (e, item) => {
        e.preventDefault();
        if (coins < item.cost) {
            toast.error("Not enough points!");
            return;
        }
        if (redeemed.includes(item.id)) {
            toast("This item has already been purchased.");
            return;
        }
      
        const { email, minus_coins } = { email: user?.email, minus_coins: item.cost };
        console.log(email, minus_coins);
        try {
            const {data} = await axios.post('/update-coins', {
                email,
                minus_coins
            })
            if (data.error) {
                toast.error(data.error)
            }
            else {
                setCoins(prevCoins => prevCoins - item.cost)
                
                toast.success(`Successfully purchased ${item.name}!`);
                const { user_email, item_id } = { user_email: user?.email, item_id: item.id };
                try {
                    const {data} = await axios.post('/update-ownership', {
                        user_email,
                        item_id
                    })
                    if (data.error) {
                        toast.error(data.error)
                    } 
                    else {
                        setRedeemed(prevRedeemed => [...prevRedeemed, item.id])
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }

        }
        catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
                <div className="pt-16 px-4 sm:px-6 lg:px-8"> {/* Added pt-16 to account for Navbar height */}
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-8 flex justify-center items-center animate-pulse">Cosmetic Shop</h1>
                        <div className="mb-6 text-lg text-gray-200">
                            Your Coins: <span className="font-semibold">{coins || 0}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gray-700 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg flex flex-col items-center"
                                >
                                    <img src={item.img} alt={item.name} className={`h-20 w-20 mb-4 rounded-full ${item.style || ""}`} />
                                    <h2 className="text-xl font-semibold text-white mb-2">{item.name}</h2>
                                    <p className="text-gray-300 mb-4">{item.desc}</p>
                                    <div className="mb-4 text-indigo-300 font-bold">Cost: {item.cost} coins</div>
                                    <button
                                        onClick={(e) => handleRedeem(e, item)}
                                        disabled={coins < item.cost || redeemed.includes(item.id)}
                                        className={`px-4 py-2 rounded-md font-medium transition ${
                                            coins < item.cost || redeemed.includes(item.id)
                                                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                                        }`}
                                    >
                                        {redeemed.includes(item.id) ? "Redeemed" : "Redeem"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}