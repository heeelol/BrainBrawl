// 1. Import mongoose and connect to your database
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test');
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

const General = mongoose.model('generalquiz', userSchema, 'generalquiz'); // third arg is the collection name

// // 3. Retrieve all documents
// General.find({}, (err, generalquiz) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(generalquiz);
//     }
// });

module.exports = General;