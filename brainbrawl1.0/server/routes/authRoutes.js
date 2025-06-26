const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile, logoutUser, requireAuth, getQuizQuestions} = require('../controllers/authController');
const User = require('../models/user');

// Define frontend URL
const FRONTEND_URL = process.env.NODE_ENV === 'production'
    ? 'https://brainbrawl-frontend.vercel.app'
    : 'http://localhost:5173';

//middleware
router.use(
    cors({
        credentials: true,
        origin: FRONTEND_URL
    })
);

router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.post('/logout', logoutUser);
router.get('/dashboard', requireAuth, (req, res) => {
    res.json({ user: req.user });
});
router.get('/quiz', getQuizQuestions);
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find({}, 'name points')
            .sort({ points: -1 })
            .lean();
        const leaderboard = users.map((u, i) => ({
            name: u.name,
            points: u.points || 0,
            rank: i + 1
        }));
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

module.exports = router;

