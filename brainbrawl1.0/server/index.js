const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const {mongoose} = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const { Server } = require('socket.io');
const { createServer } = require("node:http");
const multiQns = require('./models/multiQuiz');
const User = require('./models/user');

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

const port = process.env.PORT || 8000;

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Socket.IO setup
const rooms = {};

// Powerup types and their effects
const POWERUPS = {
    heal: {
        name: 'Heal',
        description: 'Restore 2 HP (max 5)',
        apply: (playerName, room) => {
            rooms[room].health[playerName] = Math.min(5, (rooms[room].health[playerName] || 5) + 2);
        }
    },
    shield: {
        name: 'Shield',
        description: 'Block next damage',
        apply: (playerName, room) => {
            if (!rooms[room].shields) rooms[room].shields = {};
            rooms[room].shields[playerName] = true;
        }
    },
    double: {
        name: 'Double Damage',
        description: 'Next correct answer deals 2 damage',
        apply: (playerName, room) => {
            if (!rooms[room].doubleDamage) rooms[room].doubleDamage = {};
            rooms[room].doubleDamage[playerName] = true;
        }
    }
};

function getInitialPowerups(players) {
    // Each player gets 1 of each powerup at the start
    const powerups = {};
    players.forEach(p => {
        powerups[p.name] = ['heal', 'shield', 'double'];
    });
    return powerups;
}

function getInitialHealth(players) {
    const health = {};
    players.forEach(p => { health[p.name] = 5; });
    return health;
}

io.on('connection', (socket) => {
    console.log('A player has connected');

    socket.on("joinRoom", (room, name, email) => {
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
                powerups: {}, 
                shields: {}, 
                doubleDamage: {}, 
            };
        }
        // Prevent more than 2 players from joining the same room
        if (rooms[room].players.length >= 2) {
            socket.emit('roomFull', 'This room is already full. Please join another room.');
            return;
        }

        // Add player if not already in room
        if (!rooms[room].players.find(p => p.id === socket.id)) {
            rooms[room].players.push({ id: socket.id, name, email });
        }
        // Always reset powerups for all players in the room
        rooms[room].powerups = getInitialPowerups(rooms[room].players);
        // Reset ready state for this player
        rooms[room].ready[socket.id] = false;
        // Reset health for all players
        rooms[room].health = getInitialHealth(rooms[room].players);
        // Broadcast player names to all in room
        const playerNames = rooms[room].players.map(p => ({ name: p.name, email: p.email}) );
        io.to(room).emit("playersList", playerNames);
        // Send powerup state to all
        io.to(room).emit("powerupState", rooms[room].powerups);
    });

    socket.on("playerReady", (room, name) => {
        if (rooms[room]) {
            rooms[room].ready[socket.id] = true;
            // Broadcast player names to all in room
            const playerNames = rooms[room].players.map(p => ({ name: p.name, email: p.email }));
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
            // Health logic: if correct, damage all others by 1 (or 2 if doubleDamage)
            let damage = 1;
            if (isCorrect && rooms[room].doubleDamage && rooms[room].doubleDamage[currentPlayer.name]) {
                damage = 2;
                rooms[room].doubleDamage[currentPlayer.name] = false; // consume double damage
            }
            if (isCorrect) {
                rooms[room].players.forEach(player => {
                    if (player.id !== socket.id) {
                        // If shielded, block damage and consume shield
                        if (rooms[room].shields && rooms[room].shields[player.name]) {
                            rooms[room].shields[player.name] = false;
                        } else {
                            rooms[room].health[player.name] = Math.max(0, (rooms[room].health[player.name] || 5) - damage);
                        }
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
                shields: { ...rooms[room].shields },
                doubleDamage: { ...rooms[room].doubleDamage },
            });
            if (loser) {
                io.to(room).emit("gameOver", { winner: currentPlayer.name });
                // Award 100 points to the winner in the database
                User.findOneAndUpdate(
                    { name: currentPlayer.name },
                    { $inc: { points: 100, xp: 50, coins: 100, win: 1 } },
                    { new: true }
                ).then(() => {
                    const losers = rooms[room].players.filter(p => p.name !== currentPlayer.name);
                    losers.forEach(loser => {
                        User.findOneAndUpdate(
                            { email: loser.email },
                            { $inc: { loss: 1 } },
                            { new: true }
                        ).exec();
                    });
                    delete rooms[room];
                });
                return;
            }
            clearTimeout(rooms[room].questionTimeout);
            askNewQuestion(room);
        }
    });

    // Powerup usage event
    socket.on("usePowerup", (room, powerupType) => {
        if (!rooms[room] || !POWERUPS[powerupType]) return;
        const player = rooms[room].players.find(p => p.id === socket.id);
        if (!player) return;
        const playerName = player.name;
        // Check if player has this powerup
        const idx = rooms[room].powerups[playerName]?.indexOf(powerupType);
        if (idx === -1 || idx === undefined) return;
        // Remove powerup from inventory
        rooms[room].powerups[playerName].splice(idx, 1);
        // Apply effect
        POWERUPS[powerupType].apply(playerName, room);
        // Broadcast updated powerup state and effect
        io.to(room).emit("powerupUsed", {
            playerName,
            powerupType,
            powerups: rooms[room].powerups,
            health: { ...rooms[room].health },
            shields: { ...rooms[room].shields },
            doubleDamage: { ...rooms[room].doubleDamage },
        });
    });

    socket.on("disconnect", () => {
        for (const room in rooms) {
            rooms[room].players = rooms[room].players.filter(
                (player) => player.id !== socket.id
            );
            delete rooms[room].ready[socket.id];
            // Remove powerups, shields, doubleDamage for this player
            if (rooms[room].players.length === 0) {
                delete rooms[room];
                continue;
            }
            // Broadcast updated player list
            const playerNames = rooms[room].players.map(p => ({ name: p.name, email: p.email }));
            io.to(room).emit("playersList", playerNames);
            // Emit ready count
            if (rooms[room]) {
                const readyCount = Object.values(rooms[room].ready).filter(Boolean).length;
                io.to(room).emit("readyCount", readyCount);
            }
            // Broadcast updated powerup state
            io.to(room).emit("powerupState", rooms[room].powerups);
        }
        console.log("A player has disconnected");
    });

    socket.on("leaveRoom", (room, name) => {
        if (rooms[room]) {
            rooms[room].players = rooms[room].players.filter(
                (player) => player.id !== socket.id
            );
            delete rooms[room].ready[socket.id];
            // Remove powerups, shields, doubleDamage for this player
            delete rooms[room].powerups?.[name];
            delete rooms[room].shields?.[name];
            delete rooms[room].doubleDamage?.[name];
            // Broadcast updated player list
            const playerNames = rooms[room].players.map(p => ({ name: p.name, email: p.email }));
            io.to(room).emit("playersList", playerNames);
            // Emit ready count
            const readyCount = Object.values(rooms[room].ready).filter(Boolean).length;
            io.to(room).emit("readyCount", readyCount);
            // Broadcast updated powerup state
            io.to(room).emit("powerupState", rooms[room].powerups);
            // Optionally, delete room if empty
            if (rooms[room].players.length === 0) {
                delete rooms[room];
            }
        }
    });
});


async function askNewQuestion(room) {
    if (rooms[room].players.length === 0) {
        clearTimeout(rooms[room].questionTimeout);
        delete rooms[room];
        return;
    }

    const count = await multiQns.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const question = await multiQns.findOne().skip(rand);

    if (!question) return;

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
            health: {...rooms[room].health},
        });
        askNewQuestion(room);
    }, 10000);
}

// Server is already listening above