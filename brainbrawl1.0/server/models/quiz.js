// 1. Import mongoose and connect to your database
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 2. Define a schema and model (replace fields as needed)
const userSchema = new Schema({
    ans: Number,
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    question: String,
});

const General = mongoose.model('generalquiz', userSchema); // third arg is the collection name

module.exports = General;