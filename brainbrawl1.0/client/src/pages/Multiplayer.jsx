import {Link} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/userContext.jsx";
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

var socket = io('http://localhost:8000', {
  transports: ['websocket'],
  withCredentials: true
});

export default function Multiplayer() {
    const {user} = useContext(UserContext);
    const [roomCode, setRoomCode] = useState();
    const [info, setInfo] = useState(false);
    const [questions, setQuestions] = useState('');
    const [options, setOptions] = useState([]);
    const [answered, setAnswered] = useState(false);

    const [scoreList, setScoreList] = useState([]);
    const [seconds, setSeconds] = useState(); // Example timer value
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState();
    const [winner, setWinner] = useState();
    const [players, setPlayers] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [allReady, setAllReady] = useState(false);
    const [readyCount, setReadyCount] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [health, setHealth] = useState({});
    const [myName, setMyName] = useState("");
    const [powerups, setPowerups] = useState({});
    const [powerupMsg, setPowerupMsg] = useState("");
    const [powerupCooldown, setPowerupCooldown] = useState(false);
    
    // Powerup button handler
    const handleUsePowerup = (type) => {
        if (powerupCooldown) return;
        if (!powerups[myName] || !powerups[myName].includes(type)) {
            toast.error("You don't have this powerup!");
            return;
        }
        socket.emit("usePowerup", roomCode, type);
        setPowerupCooldown(true);
        setTimeout(() => setPowerupCooldown(false), 2000); // 2s cooldown
    };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user?.name && roomCode) {
            console.log(`User: ${user.name}, Room Code: ${roomCode}`);
            setInfo(true);
        }
    };

    const handleAnswer = (answerIndex) => {
        if (!answered) {
            setSelectedAnswerIndex(answerIndex);

            socket.emit('submitAnswer', roomCode, answerIndex);
            setAnswered(true);
        }
    };

    const leaveRoom = () => {
        socket.emit('leaveRoom', roomCode, user?.name);
        setInfo(false);
    }

    useEffect(() => {
        socket.on('roomFull', (msg) => {
            toast.error(msg);
            setInfo(false);
        });
        return () => {
            socket.off('roomFull');
        };
    }, []);

    useEffect(() => {
        // Exit the effect when the timer reaches 0
        if (seconds === 0) return;

        // Create an interval to decrement the time every second
        const timerInterval = setInterval(() => {
            setSeconds(prevTime => prevTime - 1);
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(timerInterval);
        };
    }, [seconds]);

    useEffect(() => {
        if (user?.name && info) {
            setMyName(user.name);
            socket.emit("joinRoom", roomCode, user?.name);
        }
    }, [info, user, roomCode]);

    useEffect(() => {
        socket.on("message", (message) => {
            // Update players list
            setPlayers((prev) => {
                if (!prev.includes(message)) {
                    return [...prev, message];
                }
                return prev;
            });
        });
        socket.on("playersList", (list) => {
            setPlayers(list);
            setTotalPlayers(list.length);
        }); 
        socket.on("readyCount", (count) => {
            setReadyCount(count);
        });
        socket.on("allReady", () => {
            setAllReady(true);
            
        });
        return () => {
            socket.off("message");
            socket.off("playersList");
            socket.off("readyCount");
            socket.off("allReady");
        };
    }, [navigate]);

    const handleReady = () => {
        setIsReady(true);
        socket.emit("playerReady", roomCode, user?.name);
    };

    useEffect(() => {
        socket.on('newQuestion', (data) => {
            setQuestions(data.question);
            setOptions(data.answers);
            setAnswered(false);
            setSeconds(data.timer)
            setSelectedAnswerIndex();
        });

        socket.on('answerResult', (data) => {
            if (data.isCorrect) {
                toast.success(`${data.playerName} answered correctly!`);
            }
            setScoreList(data.scores);
            // Use health from server if provided
            if (data.health) {
                setHealth(data.health);
            } else {
                // Initialize health for players if not provided
                setHealth(prev => {
                    let newHealth = {...prev};
                    data.scores.forEach(player => {
                        if (newHealth[player.name] === undefined) newHealth[player.name] = 5;
                    });
                    if (data.isCorrect && data.playerName) {
                        data.scores.forEach(player => {
                            if (player.name !== data.playerName) {
                                newHealth[player.name] = Math.max(0, (newHealth[player.name] || 5) - 1);
                            }
                        });
                    }
                    return newHealth;
                });
            }
            // Update powerups if sent
            if (data.powerups) setPowerups(data.powerups);
        });

        socket.on('powerupState', (state) => {
            setPowerups(state);
        });
        socket.on('powerupUsed', (data) => {
            setPowerups(data.powerups);
            setHealth(data.health);
            setPowerupMsg(`${data.playerName} used ${data.powerupType.toUpperCase()}!`);
            setTimeout(() => setPowerupMsg(""), 2000);
        });

        socket.on('gameOver', (data)=>{
            setWinner(data.winner);
        })

        return () => {
            socket.off('newQuestion');
            socket.off('answerResult');
            socket.off('gameOver');
            socket.off('powerupState');
            socket.off('powerupUsed');
        };
    }, []);

    if (winner || Object.values(health).some(h => h === 0)) {
        // Find the winner (the one with health > 0)
        let winnerName = winner;
        if (!winnerName) {
            const alive = Object.entries(health).find(([name, h]) => h > 0);
            winnerName = alive ? alive[0] : null;
        }
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
                <h1 className="text-4xl font-bold text-white mb-6">Victory!</h1>
                <p className="text-2xl text-indigo-300 mb-8">Winner: {winnerName}</p>
                <button
                    className="px-6 py-2 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition mb-2"
                    onClick={() => navigate('/dashboard')}
                >
                    Go Back to Dashboard
                </button>
            </div>
        );
    }

    if (info && !allReady) {
        // Waiting room UI
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="fixed top-4 left-4">
                            <Link to="/dashboard" className="flex items-center text-gray-300 hover:text-white transition-colors"
                                  onClick={leaveRoom}
                            >
                                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Quit Multiplayer
                            </Link>
                    </div>
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-white">Waiting Room</h2>
                        <p className="mt-2 text-sm text-indigo-300">Players in room:</p>
                        <ul className="mt-4 text-gray-200">
                            {players.map((p, idx) => (
                                <li key={idx}>{p}</li>
                            ))}
                        </ul>
                        <button
                            className={`mt-6 px-6 py-2 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-700 hover:scale-105 ${isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleReady}
                            disabled={isReady || players.length !== 2}
                        >
                            {isReady ? 'Ready!' : 'I am Ready'}
                        </button>
                        <p className="mt-4 text-indigo-300">{`${readyCount}/2 ready`}</p>
                        <p className="mt-2 text-indigo-300">Waiting for all players to be ready...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="App">
                {!info ? <>
                    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col py-12 sm:px-6 lg:px-8">
                        <div className="fixed top-4 left-4">
                            <Link to="/dashboard" className="flex items-center text-gray-300 hover:text-white transition-colors">
                                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Dashboard
                            </Link>
                        </div>
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="text-center">
                                <h2 className="text-3xl font-extrabold text-white">
                                    Multiplayer Arena
                                </h2>
                                <p className="mt-2 text-sm text-indigo-300">
                                    Join a room and challenge your opponents in real-time battles!
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="bg-gray-800 bg-opacity-50 py-8 px-4 shadow-xl ring-1 ring-gray-900/10 backdrop-blur-lg sm:rounded-lg sm:px-10">
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="number" className="block text-sm font-medium text-gray-200">
                                            Room Code
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="number"
                                                required
                                                value={roomCode}
                                                onChange={(e) => setRoomCode(e.target.value)}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Enter room code"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition hover:scale-105"
                                        >
                                            Battle On!
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </> : <>
                    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col py-12 sm:px-6 lg:px-8 relative overflow-hidden">
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <div className="w-full h-full bg-gradient-to-tr from-indigo-800/30 via-purple-700/20 to-indigo-900/40 animate-gradient-move"></div>
                            <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
                            <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500 opacity-10 rounded-full blur-2xl animate-pulse-slow"></div>
                        </div>
                        <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                            <div className="text-center">
                                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">
                                    Multiplayer Arena
                                </h2>
                                <p className="mt-2 text-sm text-indigo-200 font-medium">
                                    Join a room and challenge your opponents in real-time battles!
                                </p>
                                <p className="mt-2 text-sm text-indigo-300">
                                    Room ID = {roomCode}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
                            <div className="bg-gray-800 bg-opacity-60 py-10 px-6 shadow-2xl ring-1 ring-indigo-700/30 backdrop-blur-lg rounded-2xl sm:px-12 transition-all duration-500">
                                {questions? <>
                                    <div className="mt-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-gray-200 text-xl font-bold flex items-center gap-2">
                                                <svg className="w-6 h-6 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>
                                                Time Left: <span className="ml-1 text-indigo-300 font-mono text-2xl">{seconds}</span>
                                            </h2>
                                        </div>
                                        <h2 className="text-gray-100 text-2xl font-extrabold mb-4 text-center drop-shadow-lg">
                                            {questions}
                                        </h2>
                                        <div className="relative mt-5">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-indigo-700/40"></div>
                                            </div>
                                        </div>
                                        <ul className="flex flex-col space-y-3 font-medium text-gray-200 mt-7">
                                            {options.map((option, index) => {
                                                let optionState = '';
                                                if (answered) {
                                                    if (selectedAnswerIndex === index) {
                                                        optionState = 'answered-selected';
                                                    } else {
                                                        optionState = 'answered-unselected';
                                                    }
                                                } else if (selectedAnswerIndex === index) {
                                                    optionState = 'selected';
                                                }
                                                return (
                                                    <li
                                                        key={index}
                                                        className={`quizList options relative group transition-all duration-200 border border-indigo-700/30 rounded-lg px-5 py-3 cursor-pointer bg-gray-700/60 hover:bg-indigo-700/60 hover:scale-[1.03] active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/60 ${optionState}`}
                                                        onClick={() => handleAnswer(index)}
                                                        disabled={answered}
                                                        style={{
                                                            opacity: answered && selectedAnswerIndex !== index ? 0.6 : 1,
                                                            pointerEvents: answered ? 'none' : 'auto',
                                                            filter: answered && selectedAnswerIndex === index ? 'brightness(1.1)' : 'none',
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <svg className="w-5 h-5 text-indigo-400 group-hover:text-indigo-200 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /></svg>
                                                            {option}
                                                        </span>
                                                        {selectedAnswerIndex === index && !answered && (
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 animate-bounce">▶</span>
                                                        )}
                                                        {answered && selectedAnswerIndex === index && (
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 font-bold animate-pulse">✓</span>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </> : <>
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-200">Waiting for Questions...</h2>
                                        <p className="mt-2 text-lg text-gray-300">Please wait while the game is being set up.</p>
                                    </div>
                                </>}
                            </div>
                        </div>

                        {questions && (
                            <>
                            {/* Powerup UI */}
                            <div className="flex flex-col items-center mb-4">
                                <div className="flex gap-4 mb-2">
                                    <button
                                        className={`px-4 py-2 rounded bg-green-600 text-white font-bold shadow hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed`}
                                        onClick={() => handleUsePowerup('heal')}
                                        disabled={powerupCooldown || !powerups[myName] || !powerups[myName].includes('heal')}
                                    >
                                        Heal (+2 hp) {powerups[myName]?.filter(p => p === 'heal').length > 0 ? `(${powerups[myName].filter(p => p === 'heal').length})` : ''}
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed`}
                                        onClick={() => handleUsePowerup('shield')}
                                        disabled={powerupCooldown || !powerups[myName] || !powerups[myName].includes('shield')}
                                    >
                                        Shield {powerups[myName]?.filter(p => p === 'shield').length > 0 ? `(${powerups[myName].filter(p => p === 'shield').length})` : ''}
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 transition disabled:opacity-40 disabled:cursor-not-allowed`}
                                        onClick={() => handleUsePowerup('double')}
                                        disabled={powerupCooldown || !powerups[myName] || !powerups[myName].includes('double')}
                                    >
                                        Double Damage {powerups[myName]?.filter(p => p === 'double').length > 0 ? `(${powerups[myName].filter(p => p === 'double').length})` : ''}
                                    </button>
                                </div>
                                {powerupMsg && <div className="text-indigo-300 font-bold animate-pulse mt-2">{powerupMsg}</div>}
                            </div>
                            {/* Health bars */}
                            <div className="flex flex-wrap justify-center items-center gap-8 mb-8 mt-4">
                                {players.map((p, idx) => {
                                    const hp = health[p] ?? 5;
                                    let barColor = 'from-green-400 to-green-600';
                                    if (hp === 2) barColor = 'from-yellow-300 to-yellow-500';
                                    if (hp === 1) barColor = 'from-red-400 to-red-600';
                                    if (hp === 0) barColor = 'from-gray-500 to-gray-700';
                                    return (
                                        <div key={idx} className="flex flex-col items-center relative">
                                            <span className="text-white font-bold mb-1 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                {p}
                                                {p === myName && (
                                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-600 text-xs font-semibold text-white shadow">You</span>
                                                )}
                                            </span>
                                            <div className="w-36 h-6 bg-gray-900 rounded-full border-2 border-indigo-700/40 overflow-hidden shadow-inner relative">
                                                <div
                                                    className={`h-6 bg-gradient-to-r ${barColor} rounded-full transition-all duration-700 ease-in-out flex items-center`}
                                                    style={{ width: `${(hp / 5) * 100}%` }}
                                                >
                                                    <svg className="w-4 h-4 ml-2 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xs text-gray-200 font-bold drop-shadow">{hp} / 5 HP</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            </>
                        )}
                    </div>
                </>}
            </div>
        </>
    )
}