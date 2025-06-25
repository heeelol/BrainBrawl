import React, {useRef, useState} from 'react';
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import {data} from "../assets/data.js";
import './Quiz.css'
import PageTitle from "../components/PageTitle.jsx";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

export default function Quiz() {
    // Add new state for timer control
    const [isPaused, setIsPaused] = useState(false);

    let [index, setIndex] = useState(0);
    let [questions, setQuestions] = useState(data[index]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let[result, setResult] = useState(false);

    let option1 = useRef(null);
    let option2 = useRef(null);
    let option3 = useRef(null);
    let option4 = useRef(null);
    let options = [option1, option2, option3, option4];

    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
            return <div className="timer-display">Time's Up!</div>;
        }
        return (
            <div className="timer-display">
                {remainingTime}
            </div>
        );
    };

    const checkAnswer = (selectedOption, ans) => {
        if (!lock) {
            if (questions.ans === ans) {
                // Correct answer logic
                selectedOption.target.classList.add('correct');
                setScore(prev => prev + 1);
            } else {
                // Incorrect answer logic
                selectedOption.target.classList.add('incorrect');
                options[questions.ans - 1].current.classList.add('correct'); // Highlight the correct answer
            }
            setLock(true);
            setTimeout(() => {
                if (index === data.length - 1) {
                    setResult(true);
                } else {
                    setIndex(prevIndex => prevIndex + 1);
                    setQuestions(data[index + 1]);
                    options.forEach(option => {
                        option.current.classList.remove('correct', 'incorrect', 'timeout');
                    });
                }
                setLock(false);
            }, 1200); // Short delay for feedback
        }
    }

    const showCorrectAnswerAndProceed = () => {
        setIsPaused(true); // Pause the timer
        // Show timeout indicator and correct answer
        const selectedAnswer = options[questions.ans - 1].current;
        options.forEach(option => {
            if (option.current === selectedAnswer) {
                option.current.classList.add('correct');
            } else {
                option.current.classList.add('timeout');
            }
        });
        // Wait 2 seconds then proceed
        setTimeout(() => {
            if (index === data.length - 1) {
                setResult(true);
            } else {
                setIndex(prevIndex => prevIndex + 1);
                setQuestions(data[index + 1]);
                options.forEach(option => {
                    option.current.classList.remove('correct', 'incorrect', 'timeout');
                });
            }
            setLock(false);
            setIsPaused(false); // Resume timer
        }, 2000);
    };

    return (
        <>
            <PageTitle title="Quiz - General Knowledge" />
            <header className="sticky top-0 z-50 flex justify-center items-center">
                <div className="xl:max-w-full w-full">
                    <Navbar />
                </div>
            </header>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-white">
                            Quiz Time, Warrior!
                        </h2>
                        <p className="mt-2 text-sm text-indigo-300">
                            Answer questions, earn points, and climb the leaderboard!
                        </p>
                    </div>
                </div>

                <div className="fixed top-20 right-8 z-50">
                    <CountdownCircleTimer
                        key={index}
                        isPlaying={!isPaused}
                        duration={10}
                        size={120}
                        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                        colorsTime={[10, 6, 3, 0]}
                        onComplete={() => {
                            showCorrectAnswerAndProceed();
                            return { shouldRepeat: true, delay: 1 };
                        }}
                    >
                        {renderTime}
                    </CountdownCircleTimer>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="quiz-card">
                        <div className="mt-0">
                            {result ? <>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-200">Quiz Completed!</h3>
                                    <p className="mt-2 text-lg text-gray-300">Your Score: {score}/{data.length}</p>
                                    <Link to="/dashboard" className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                                        Back to Dashboard
                                    </Link>
                                </div>
                            </> : <>
                                <h2 className="text-gray-200 text-2xl font-bold">
                                    {index + 1}. {questions.question}
                                </h2>

                                <div className="relative mt-5"> {/* Divider without text */}
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm"></div>
                                </div>

                                <ul className="flex flex-col space-y-2 font-medium text-gray-200 mt-5">
                                    <li className="QuizList" ref={option1} onClick={(selectedOption) => {checkAnswer(selectedOption, 1)}}>{questions.option1}</li>
                                    <li className="QuizList" ref={option2} onClick={(selectedOption) => {checkAnswer(selectedOption, 2)}}>{questions.option2}</li>
                                    <li className="QuizList" ref={option3} onClick={(selectedOption) => {checkAnswer(selectedOption, 3)}}>{questions.option3}</li>
                                    <li className="QuizList" ref={option4} onClick={(selectedOption) => {checkAnswer(selectedOption, 4)}}>{questions.option4}</li>
                                </ul>

                                <div className="mt-2 text-center text-gray-400">{index + 1} of {data.length} questions</div>
                            </>}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}