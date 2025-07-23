const mongoose = require('mongoose');
const { Schema } = mongoose;


const quizSchema = new Schema({
    ans: Number,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    question: String,
});



function getQuizModel(topic) {
    const modelName = `${topic}quiz`;
    if (mongoose.models[modelName]) {
        return mongoose.model(modelName);
    }
    return mongoose.model(modelName, quizSchema, `${topic}quizzes`);
}

module.exports = { getQuizModel };