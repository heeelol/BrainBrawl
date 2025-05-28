const User = require('../models/user');
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

        // Check if user exists
        const user = await User.findOne({email})
        if (!user) {
            return res.json({
                error: 'User not found'
            })
        }

        // Check if password is correct
        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign({email: user.email, id: user._id, name: user.name}, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user)
            })
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

module.exports = {
    test,
    registerUser,
    loginUser
}