const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile, logoutUser, requireAuth, getQuizQuestions, getLeaderboard, getLevel, gainXP, 
    getCoins, deductCoins, addOwnedItems, getOwnedItems
} = require('../controllers/authController');

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
router.get('/quiz/:topic', getQuizQuestions);
router.get('/leaderboard', getLeaderboard);
router.get('/level', requireAuth, getLevel);
router.post('/gainxp', requireAuth, gainXP);
router.get('/coins', requireAuth, getCoins);
router.get('/owned-items', requireAuth, getOwnedItems);
router.post('/update-coins', deductCoins);
router.post('/update-ownership', addOwnedItems);

module.exports = router;

