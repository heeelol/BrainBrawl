import {Link} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/userContext.jsx";
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';

var socket = io('http://localhost:8000'); // Adjust the URL as needed

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
        if (user?.name) {
            socket.emit("joinRoom", roomCode, user?.name);
        }
    }, [info])

    useEffect(() => {
        socket.on("message", (message) => {
            toast.success(`${message} has joined the lobby!`);
        })
        return () => {
            socket.off("message");
        }
    }, [])

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
        });

        socket.on('gameOver', (data)=>{
            setWinner(data.winner);
        })

        return () => {
            socket.off('newQuestion');
            socket.off('answerResult');
            socket.off('gameOver');
        };
    }, []);

    if (winner) {
        return (
            <h1>winner is {winner}</h1>
        )
    }

    return (
        <>
            <div className="App">
                {!info ? <>
                    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col py-12 sm:px-6 lg:px-8">
                        <div className="fixed top-4 left-4">
                            <Link to="/" className="flex items-center text-gray-300 hover:text-white transition-colors">
                                <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
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
                    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col py-12 sm:px-6 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="text-center">
                                <h2 className="text-3xl font-extrabold text-white">
                                    Multiplayer Arena
                                </h2>
                                <p className="mt-2 text-sm text-indigo-300">
                                    Join a room and challenge your opponents in real-time battles!
                                </p>
                                <p className="mt-2 text-sm text-indigo-300">
                                    Room ID = {roomCode}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="bg-gray-800 bg-opacity-50 py-8 px-4 shadow-xl ring-1 ring-gray-900/10 backdrop-blur-lg sm:rounded-lg sm:px-10">
                                {questions? <>
                                    <div className="mt-0">
                                        <h2 className="text-gray-200 text-2xl font-bold">
                                            Remaining Time: {seconds}
                                        </h2>

                                        <h2 className="text-gray-200 text-2xl font-bold">
                                            {questions}
                                        </h2>

                                        <div className="relative mt-5"> {/* Divider without text */}
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-700"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm"></div>
                                        </div>

                                        <ul className="flex flex-col space-y-2 font-medium text-gray-200 mt-5">
                                            {options.map((option, index) => (
                                                <li
                                                    key={index}
                                                    className={"quizList" + `options ${selectedAnswerIndex === index ? 'selected' : ''}`}
                                                    onClick={() => handleAnswer(index)} disabled={answered}
                                                >
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>

                                        {/*<div className="mt-6">*/}
                                        {/*    <button*/}
                                        {/*        onClick={nextQuestion}*/}
                                        {/*        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition hover:scale-105"*/}
                                        {/*    >*/}
                                        {/*        Next Question*/}
                                        {/*    </button>*/}
                                        {/*</div>*/}

                                        <div className="mt-2 text-center text-gray-400">
                                            {scoreList.map((player, index) => (
                                                <p key={index}>
                                                    {player.name}: {player.score}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </> : <>
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-200">Waiting for Questions...</h2>
                                        <p className="mt-2 text-lg text-gray-300">Please wait while the game is being set up.</p>
                                    </div>
                                </>}

                            </div>
                        </div>
                    </div>
                </>}
            </div>
        </>
    )
}