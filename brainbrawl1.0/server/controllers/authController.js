const User = require('../models/user');
const General = require('../models/quiz');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

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
        // Check if password was entered
        if(!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        }
        // Check email
        const exist = await User.findOne({email})
        if (exist) {
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
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.set({
                'Access-Control-Allow-Origin': 'https://brainbrawl-frontend.vercel.app',
                'Access-Control-Allow-Credentials': 'true'
            }).json(user);
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
    try {
        // const {ans, option1, option2, option3, option4, question} = req.body;
        const questions = await General.find({});
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch quiz data' });
    }
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    requireAuth,
    getQuizQuestions
}