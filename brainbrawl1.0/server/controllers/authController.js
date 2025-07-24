const User = require('../models/user');
const QuizStat = require('../models/quizStat');
const {getQuizModel} = require("../models/quiz");
const Ownership = require('../models/ownership');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const { xpForLevel, getLevelFromXP, getXPProgress } = require('../helpers/xp');

const test = (req, res) => {
    res.json('test is working');
}


// Register endpoint
// This endpoint allows users to register by providing their name, email, and password.
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        // Check if name was entered
        if(!name) {
            return res.json({
                error: 'Name is required'
            })
        }
        // Check is name is unique
        const existName = await User.findOne({name})
        if (existName) {
            return res.json({
                error: 'Name already exists'
            })
        }


        // Check if password was entered
        if(!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        }
        // Check email
        const existEmail = await User.findOne({email})
        if (existEmail) {
            return res.json({
                error: 'Email already exists'
            })
        }

        const hashedPassword = await hashPassword(password);
        // Create user in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.json(user);
    } catch (error) {
        console.log(error);   
    }
}

// Login endpoint
// This endpoint allows users to log in by providing their email and password.
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        
        if (!user) {
            return res.json({
                error: 'User not found'
            });
        }

        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign(
                {email: user.email, id: user._id, name: user.name}, 
                process.env.JWT_SECRET, 
                {}, 
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                        path: '/'
                    }).json(user);
                }
            );
        }

        if (!match) {
            return res.json({
                error: 'Invalid credentials'
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const getProfile = (req, res) => {
    const {token} = req.cookies;

    if(!token) return res.json(null);

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            if (err) throw err;
           try {
                const user = await User.findById(userData.id).select('-password');
                res.set({
                    'Access-Control-Allow-Origin': 'https://brainbrawl-frontend.vercel.app',
                    'Access-Control-Allow-Credentials': 'true'
                }).json(user);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch user profile" });
            }
        });
    } else {
        res.json(null);
    }
}

// Logout endpoint
// This endpoint clears the JWT cookie to log out the user
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error during logout'
        });
    }
};

const requireAuth = (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({error: 'Unauthorized access'});
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);;
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({error: "Invalid token"});
    }
}

const getQuizQuestions = async (req, res) => {
    const topic = req.params.topic;
    try {
        const quizModel = getQuizModel(topic);
        const questions = await quizModel.find({});
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch quiz data' });
    }
};


const getLeaderboard = async (req, res) => {
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
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
}

// Get user level, current XP, and needed XP for next level
const getLevel = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        const xp = user.xp || 0;
        const progress = getXPProgress(xp);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch level' });
    }
}

const gainXP = async (req, res) => {
    try {
            const { xp } = req.body;

            await User.findOneAndUpdate(
                    { name: req.user.name },
                    { $inc: { xp: xp } },
                    { new: true }
                );
                res.status(200).json({ message: 'XP updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update xp' });
    }
}

const getCoins = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        const coins = user.coins || 0;
        res.json(coins);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch coins'});
    }
}

const getOwnedItems = async (req, res) => {
    try {
        // Create ownership record if it doesn't exist
        let ownership = await Ownership.findOne({ user_email: req.user.email }).lean();
        if (!ownership) {
            ownership = await Ownership.create({ 
                user_email: req.user.email, 
                item_list: [],
                selected_avatar: "noobbrain"
            });
        }
        const itemList = ownership.item_list || [];
        res.json(itemList);
    } catch (error) {
        console.log("getOwnedItems error:", error);
        res.status(500).json({ error: 'Failed to fetch owned items' });
    }
}

const deductCoins = async (req, res) => {
    try {
        const {email, minus_coins} = req.body;
        // Check if name was entered
        console.log(minus_coins);
        if(!email) {
            return res.json({
                error: 'email is required'
            })
        }

        const user = await User.findOneAndUpdate(
            { email: email },
            { $inc: { coins: -minus_coins} },
            { new: true }
        )

        return res.json(user);
    } catch (error) {
        console.log(error);
    }
}

const addOwnedItems = async (req, res) => {
    try {
        const {user_email, item_id} = req.body;
        // Check if name was entered
        if(!user_email) {
            return res.json({
                error: 'email is required'
            })
        }

        const user = await Ownership.findOneAndUpdate(
            { user_email: user_email },
            { $addToSet: { item_list: {item_id: item_id} } },
            { new: true }
        )

        return res.json(user);
    } catch (error) {
        console.log(error);
    }
}

const updateQuizStats = async (req, res) => {
    try {
        const { topic, date, answers, score, xpGained } = req.body;

        const user_email = req.user.email;

        const quizStat = new QuizStat({
            user_email,
            topic, 
            date,
            answers,
            score,
            xpGained,
        });
        await quizStat.save();
        
        res.status(200).json({ message: 'Quiz stats successfully saved'});
    } catch (error) {
        console.log(error);
    }
}

const getStats = async (req, res) => {
    try {
        const stats = await QuizStat.find( {user_email: req.user.email }).sort( {date: -1 } );
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json( { error: 'Failed to fetch quiz stats'} );
    }
}

const updateProfile = async (req, res) => {
    try {
        const { oldEmail, email, name, selected_avatar } = req.body;
        if (!oldEmail || !email || !name) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        let user = await User.findOne({ email: oldEmail });
        if (!user) {
            return res.status(404).json({ error:"User not found" });
        }

        const existEmail = await User.findOne({ email });
        if (existEmail && existEmail._id.toString() !== user._id.toString()) {
            return res.json({
                error: 'Email already exists'
            });
        }

        const existName = await User.findOne({ name });
            if (existName && existName._id.toString() !== user._id.toString()) {
                return res.json({
                    error: 'Name already exists'
                });
            }


        user.email = email;
        user.name = name;
        await user.save();

        let ownership = await Ownership.findOne({ user_email: oldEmail });
        if (!ownership) {
            return res.status(404).json({ error:"Ownership not found" });
        }
        ownership.user_email = email;
        if (selected_avatar) {
            ownership.selected_avatar = selected_avatar;
        }
        await ownership.save();

        res.json({
            email: user.email,
            name: user.name,
            selected_avatar: ownership.selected_avatar,
            title: user.title,
        })

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
}

const getProfileOwnership = async (req, res) => {
    const Ownership = require('../models/ownership');
    const { email } = req.params;
    const ownership = await Ownership.findOne({ user_email: email });
    if (!ownership) return res.status(404).json({ error: "Not found" });
    res.json(ownership);
}


module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    requireAuth,
    getQuizQuestions,
    getLeaderboard,
    getLevel,
    gainXP,
    getCoins,
    getOwnedItems,
    deductCoins,
    addOwnedItems,
    updateQuizStats,
    getStats,
    updateProfile,
    getProfileOwnership
}