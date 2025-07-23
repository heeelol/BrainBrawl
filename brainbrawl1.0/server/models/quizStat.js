const mongoose = require('mongoose')
const { Schema } = mongoose

const quizStatSchema = new Schema({
    user_email: {
        type: String,
        required: true
    },
    topic: {
        type: String
    },
    date: {
        type: Date, default: Data.Now
    },
    answers: [
        {
            question: String,
            selected: String,
            correct: Boolean,
            timeTaken: Number
        }
    ],
    score: Number,
    xpGained: Number
})