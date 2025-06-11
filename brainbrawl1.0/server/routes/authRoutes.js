const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile, logoutUser, requireAuth } = require('../controllers/authController');

//middleware
router.use(
    cors({
        credentials: true,
        origin: ['http://localhost:5173', 'https://your-vercel-app-url.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
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

module.exports = router;

