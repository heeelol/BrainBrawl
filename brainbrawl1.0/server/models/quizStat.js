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
        type: Date, default: Date.now
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

module.exports = mongoose.model('QuizStat', quizStatSchema);