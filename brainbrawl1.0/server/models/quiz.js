// 1. Import mongoose and connect to your database
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 2. Define a schema and model (replace fields as needed)
const quizSchema = new Schema({
    ans: Number,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    question: String,
});

// const General = mongoose.model('generalquiz', quizSchema); // third arg is the collection name
//
// module.exports = General;

function getQuizModel(topic) {
    // Use a unique model name per topic to avoid OverwriteModelError
    const modelName = `${topic}quiz`;
    if (mongoose.models[modelName]) {
        return mongoose.model(modelName);
    }
    return mongoose.model(modelName, quizSchema, `${topic}quizzes`);
}

module.exports = { getQuizModel };