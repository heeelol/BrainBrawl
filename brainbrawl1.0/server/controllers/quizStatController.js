const QuizStat = require('../models/quizStat');

// Save a quiz attempt/stat for learning insights
const saveQuizStat = async (req, res) => {
    try {
        const { user_email, topic, answers, score, totalQuestions, xpGained } = req.body;
        // Optionally, validate required fields here
        if (!user_email || !topic || !answers || typeof score !== 'number' || typeof totalQuestions !== 'number') {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const quizStat = new QuizStat({
            user_email,
            topic,
            answers,
            score,
            totalQuestions,
            xpGained,
            date: new Date() // optional, schema default
        });
        await quizStat.save();
        res.status(201).json({ message: 'Quiz stats saved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save quiz stats' });
    }
};

module.exports = { saveQuizStat }; 