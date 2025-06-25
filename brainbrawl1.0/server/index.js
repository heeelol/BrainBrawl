const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const {mongoose} = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const {socketIO} = require('socket.io');
const {createServer} = require("node:http");
import {multiQns} from './models/multiQns.js';

// Define frontend URL
const FRONTEND_URL = process.env.NODE_ENV === 'production'
    ? 'https://brainbrawl-frontend.vercel.app'
    : 'http://localhost:5173';

// database connection to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// CORS configuration 
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

const server = createServer(app);

const io = socketIO(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', require('./routes/authRoutes'));

const port = process.env.PORT || 8000;

// Socket.IO setup
const rooms = {};

io.on('connection', (socket) => {
    console.log('A player has connected');

    socket.on("joinRoom", (room, name) => {
        socket.join(room);
        io.to(room).emit("message", `${name} has joined the lobby`);
        if (!rooms[room]) {
            rooms[room] = {
                players: [],
                currentQuestion: null,
                correctAnswer: null,
                questionTimeout: null,
                shouldAskNewQuestion: true,
            };
        }

        rooms[room].players.push({ id: socket.id, name });
        console.log(rooms);

        if (!rooms[room].currentQuestion) {
            askNewQuestion(room);
        }
    });

    socket.on("submitAnswer", (room, answerIndex) => {
        const currentPlayer = rooms[room].players.find(
            (player) => player.id === socket.id
        );

        if (currentPlayer) {
            const correctAnswer = rooms[room].correctAnswer;
            const isCorrect = correctAnswer !== null && correctAnswer === answerIndex;
            currentPlayer.score = isCorrect
                ? (currentPlayer.score || 0) + 1
                : (currentPlayer.score || 0) - 1;

            clearTimeout(rooms[room].questionTimeout);

            io.to(room).emit("answerResult", {
                playerName: currentPlayer.name,
                    isCorrect,
                    correctAnswer,
                scores: rooms[room].players.map((player) => ({
                    name: player.name,
                    score: player.score || 0,
                })),
            });

            const winningThreshold = 5;
            const winner = rooms[room].players.find(
                (player) => (player.score || 0) >= winningThreshold
            );

            if (winner) {
                io.to(room).emit("gameOver", { winner: winner.name });
                delete rooms[room];
            } else {
                askNewQuestion(room);
            }
        }
    });

    socket.on("disconnect", () => {
        for (const room in rooms) {
            rooms[room].players = rooms[room].players.filter(
                (player) => player.id !== socket.id
            );
        }
        console.log("A player has disconnected");
    });
});

function askNewQuestion(room) {
    if (rooms[room].players.length === 0) {
        clearTimeout(rooms[room].questionTimeout);
        delete rooms[room];
        return;
    }

    const randIndex = Math.floor(Math.random() * multiQns.length);
    const question = multiQns[randIndex];
    rooms[room].currentQuestion = question;
    rooms[room].correctAnswer = question.answers.findIndex(
        (answer) => answer.correct
    );
    rooms[room].shouldAskNewQuestion = true;
    io.to(room).emit("newQuestion", {
        question: question.question,
        answers: question.answers.map((answer) => answer.text),
        timer: 10,
    });

    rooms[room].questionTimeout = setTimeout(() => {
        io.to(room).emit("answerResult", {
            playerName: "None",
            isCorrect: false,
            correctAnswer: rooms[room].correctAnswer,
            scores: rooms[room].players.map((player) => ({
                name: player.name,
                score: player.score || 0,
            })),
        });
        askNewQuestion(room);
    }, 10000);
}

app.listen(port, () => console.log(`Server is running on port ${port}`));