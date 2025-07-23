import React, {useRef, useState, useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import './Quiz.css'
import PageTitle from "../components/PageTitle.jsx";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import axios from "axios";
import { toast } from 'react-hot-toast';


export default function Quiz({ topic }) {
    const params = useParams();
    const selectedTopic = topic || params.topic || 'general';

    const [quizData, setQuizData] = useState([]);
    let [index, setIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());

    let option1 = useRef(null);
    let option2 = useRef(null);
    let option3 = useRef(null);
    let option4 = useRef(null);
    let options = [option1, option2, option3, option4];

    useEffect(() => {
        axios.get(`/quiz/${selectedTopic}`)
            .then(res => {
                setQuizData(res.data);
                setQuestions(res.data[index]);
            })
            .catch(err => console.error(err));
    }, [selectedTopic]);

    useEffect(() => {
        if (result)
        {
            const amount = (score / 5) * 100;

            const now = new Date();
            const sgDate = new Date(now.getTime() + 8 * 60 * 60 * 1000);

            const attemptData = {
                topic: selectedTopic,
                date: sgDate,
                answers: userAnswers,
                score: score,
                xpGained: amount
            };

            axios.post('/gainXP', { xp: amount } )
                .then()
                .catch(err => console.error(err));

            axios.post('/update-quizStats', attemptData)
                 .then()
                 .catch(err => console.error(err));

            toast.success(`Gained +${amount} xp!`);
        }
    }, [result]);

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

    const checkAnswer = (event, ans) => {
        if (!lock) {
            setSelectedOption(ans);
            const isCorrect = questions.ans === ans;
            const timeTaken = (Date.now() - questionStartTime) / 1000;
            setQuestionStartTime(Date.now() + 1200);

            setUserAnswers(prev => [
                ...prev,
                {
                    question: questions.question,
                    selected: ans,
                    correct: isCorrect,
                    timeTaken: timeTaken
                }
            ])

            if (isCorrect) {
                setScore(prev => prev + 1);
            }
            setLock(true);
            setTimeout(() => {
                if (index === quizData.length - 1) {
                    setResult(true);
                } else {
                    setIndex(prevIndex => prevIndex + 1);
                    setQuestions(quizData[index + 1]);
                    setSelectedOption(null);
                    setLock(false);
                }
            }, 1200);
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
            if (index === quizData.length - 1) {
                setResult(true);
            } else {
                setIndex(prevIndex => prevIndex + 1);
                setQuestions(quizData[index + 1]);
                options.forEach(option => {
                    option.current.classList.remove('correct', 'incorrect', 'timeout');
                });
            }
            setLock(false);
            setIsPaused(false); // Resume timer
        }, 2000);
    };

    console.log(quizData);
    console.log(questions);
    console.log(index);

    return (
        <>
            <PageTitle title={`Quiz - ${selectedTopic}`} />
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

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-gray-800 bg-opacity-50 py-8 px-4 shadow-xl ring-1 ring-gray-900/10 backdrop-blur-lg sm:rounded-lg sm:px-10">
                        {/* Centered Timer Above Question */}
                        {!result && (<div className="flex justify-center mb-6">
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
                        )}

                        <div className="mt-0">
                            {result ? <>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-200">Quiz Completed!</h3>
                                    <p className="mt-2 text-lg text-gray-300">Your Score: {score}/{quizData.length}</p>
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
                                    {[1,2,3,4].map((num, idx) => {
                                        let optionClass = 'QuizList';
                                        if (lock && selectedOption === num) {
                                            optionClass += questions.ans === num ? ' correct' : ' incorrect';
                                        } else if (lock && questions.ans === num) {
                                            optionClass += ' correct';
                                        }
                                        optionClass += !lock ? ' hover:bg-indigo-700/60 hover:scale-[1.03] active:scale-95' : '';
                                        return (
                                            <li
                                                key={num}
                                                className={optionClass}
                                                ref={options[idx]}
                                                onClick={(e) => checkAnswer(e, num)}
                                            >
                                                {questions[`option${num}`]}
                                            </li>
                                        );
                                    })}
                                </ul>

                                <div className="mt-2 text-center text-gray-400">{index + 1} of {quizData.length} questions</div>
                            </>}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}