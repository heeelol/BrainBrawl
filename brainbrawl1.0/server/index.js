const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const {mongoose} = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const { Server } = require('socket.io');
const { createServer } = require("node:http");
const { multiQns } = require('./models/multiQns');

// Define frontend URL for local development
const FRONTEND_URL = 'http://localhost:5173';

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

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    },
});

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', require('./routes/authRoutes'));

const port = 8000 || process.env.PORT;

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Socket.IO setup
const rooms = {};

function getInitialHealth(players) {
    const health = {};
    players.forEach(p => { health[p.name] = 3; });
    return health;
}

io.on('connection', (socket) => {
    console.log('A player has connected');

    socket.on("joinRoom", (room, name) => {
        socket.join(room);
        if (!rooms[room]) {
            rooms[room] = {
                players: [],
                ready: {},
                currentQuestion: null,
                correctAnswer: null,
                questionTimeout: null,
                shouldAskNewQuestion: true,
                health: {},
            };
        }
        // Add player if not already in room
        if (!rooms[room].players.find(p => p.id === socket.id)) {
            rooms[room].players.push({ id: socket.id, name });
        }
        // Reset ready state for this player
        rooms[room].ready[socket.id] = false;
        // Reset health for all players
        rooms[room].health = getInitialHealth(rooms[room].players);
        // Broadcast player names to all in room
        const playerNames = rooms[room].players.map(p => p.name);
        io.to(room).emit("playersList", playerNames);
    });

    socket.on("playerReady", (room, name) => {
        if (rooms[room]) {
            rooms[room].ready[socket.id] = true;
            // Broadcast player names to all in room
            const playerNames = rooms[room].players.map(p => p.name);
            io.to(room).emit("playersList", playerNames);
            // Emit ready count
            const readyCount = Object.values(rooms[room].ready).filter(Boolean).length;
            io.to(room).emit("readyCount", readyCount);
            // If all players are ready, start the game
            const allReady = rooms[room].players.every(p => rooms[room].ready[p.id]);
            if (allReady && rooms[room].players.length > 0) {
                io.to(room).emit("allReady");
                askNewQuestion(room);
            }
        }
    });

    socket.on("submitAnswer", (room, answerIndex) => {
        const currentPlayer = rooms[room].players.find(
            (player) => player.id === socket.id
        );
        if (currentPlayer) {
            const correctAnswer = rooms[room].correctAnswer;
            const isCorrect = correctAnswer !== null && correctAnswer === answerIndex;
            // Health logic: if correct, damage all others by 1
            if (isCorrect) {
                rooms[room].players.forEach(player => {
                    if (player.id !== socket.id) {
                        rooms[room].health[player.name] = Math.max(0, (rooms[room].health[player.name] || 3) - 1);
                    }
                });
            }
            // Check for defeat
            const loser = Object.entries(rooms[room].health).find(([name, hp]) => hp === 0);
            io.to(room).emit("answerResult", {
                playerName: currentPlayer.name,
                isCorrect,
                correctAnswer,
                scores: rooms[room].players.map((player) => ({
                    name: player.name,
                    score: player.score || 0,
                })),
                health: { ...rooms[room].health },
            });
            if (loser) {
                io.to(room).emit("gameOver", { winner: currentPlayer.name });
                delete rooms[room];
                return;
            }
            clearTimeout(rooms[room].questionTimeout);
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
            delete rooms[room].ready[socket.id];
            // Broadcast updated player list
            const playerNames = rooms[room].players.map(p => p.name);
            io.to(room).emit("playersList", playerNames);
            // Emit ready count
            if (rooms[room]) {
                const readyCount = Object.values(rooms[room].ready).filter(Boolean).length;
                io.to(room).emit("readyCount", readyCount);
            }
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
        if (!rooms[room]) return; // Room may have been deleted if game ended
        io.to(room).emit("answerResult", {
            playerName: "None",
            isCorrect: false,
            correctAnswer: rooms[room].correctAnswer,
            scores: rooms[room].players.map((player) => ({
                name: player.name,
                score: player.score || 0,
            })),
            health: { ...rooms[room].health },
        });
        askNewQuestion(room);
    }, 10000);
}

// Server is already listening above