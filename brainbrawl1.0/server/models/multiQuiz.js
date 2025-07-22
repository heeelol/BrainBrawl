const mongoose = require('mongoose');
const {Schema} = mongoose;

const answerSchema = new Schema({
    text: String,
    correct: Boolean
});

const multiQnSchema = new Schema({
    question: String,
    answers: [answerSchema]
});

module.exports = mongoose.model('multiquiz', multiQnSchema);