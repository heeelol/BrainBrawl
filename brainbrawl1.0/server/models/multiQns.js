const multiQns = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Lyon", correct: false },
            { text: "Paris", correct: true },
            { text: "London", correct: false },
            { text: "Berlin", correct: false },
        ],
    },
    {
        question: "What is the chemical symbol for methane?",
        answers: [
            { text: "CH4", correct: true },
            { text: "CH3OH", correct: false },
            { text: "H2O", correct: false },
            { text: "WC", correct: false },
        ],
    },
    {
        question: "What is 9 + 5 × 2?",
        answers: [
            { text: "16", correct: false },
            { text: "28", correct: false },
            { text: "19", correct: true },
            { text: "21", correct: false },
        ],
    },
    {
        question: "Which element has the chemical symbol 'V'?",
        answers: [
            { text: "Vanadium", correct: true },
            { text: "Iron", correct: false },
            { text: "Vibranium", correct: false },
            { text: "Sodium", correct: false },
        ],
    },
    {
        question: "Who invented the light bulb?",
        answers: [
            { text: "Alexander Bell", correct: false },
            { text: "Henry Ford", correct: false },
            { text: "Thomas Edison", correct: true },
            { text: "Marie Curie", correct: false },
        ],
    },
    {
        question: "Which country is the largest by land area?",
        answers: [
            { text: "China", correct: false },
            { text: "Russia", correct: true },
            { text: "Canada", correct: false },
            { text: "USA", correct: false },
        ],
    },

    {
        question: "Which substance damages the Earth's ozone layer?",
        answers: [
            { text: "Nitrogen", correct: false },
            { text: "Carbon Dioxide", correct: false },
            { text: "Methane", correct: false },
            { text: "Chlorofluorocarbons", correct: true },
        ],
    },
    {
        question: "Which planet is NOT in our solar system?",
        answers: [
            { text: "Pluto", correct: true },
            { text: "Terra", correct: false },
            { text: "Mercury", correct: false },
            { text: "Jupiter", correct: false },
        ],
    },
    {
        question: "Integrate the function f(x) = 2x + 3 with respect to x. (Use C for the constant of integration)",
        answers: [
            { text: "2x^2 + 3x + C", correct: false },
            { text: "x^2 + 3x + C", correct: true },
            { text: "2x + 3 + C", correct: false },
            { text: "x^3 + 3x^2 + C", correct: false },
        ],
    },

    {
        question: "Which city is known as the 'City of Angels'?",
        answers: [
            { text: "Shanghai", correct: false },
            { text: "Los Angeles", correct: true },
            { text: "Tokyo", correct: false },
            { text: "Bangkok", correct: false },
        ],
    },
    {
        question: "Which famous scientist developed the theory of general relativity?",
        answers: [
            { text: "Isaac Newton", correct: false },
            { text: "Albert Einstein", correct: true },
            { text: "Nikola Tesla", correct: false },
            { text: "Marie Curie", correct: false },
        ],
    },
    {
        question: "What is 65 divided by 5?",
        answers: [
            { text: "12.5", correct: false },
            { text: "13", correct: true },
            { text: "13.5", correct: false },
            { text: "14", correct: false },
        ],
    },

    {
        question: "Which human organ is responsible for filtering blood?",
        answers: [
            { text: "The small intestine", correct: false },
            { text: "The kidneys", correct: true },
            { text: "The heart", correct: false },
            { text: "The brain", correct: false },
        ],
    },
    {
        question: "What is the past tense of the verb 'to go'?",
        answers: [
            { text: "'Going'", correct: false },
            { text: "'Went'", correct: true },
            { text: "'Gone'", correct: false },
            { text: "'Go'", correct: false },
        ],
    },

    {
        question: "How much current is flowing through a circuit with a resistance of 10 ohms and a voltage of 20 volts?",
        answers: [
            { text: "1A", correct: false },
            { text: "2A", correct: true },
            { text: "3A", correct: false },
            { text: "5A", correct: false },
        ],
    },
    {
        question: "Differentiate the function f(x) = 7x^3 - 3x^2 + 5 with respect to x.",
        answers: [
            { text: "21x - 6x", correct: false },
            { text: "7x^2 - 3x", correct: false },
            { text: "21x^2 - 6x", correct: true },
            { text: "21x^2 + 6x", correct: false },
        ],
    },
    {
        question: "Which book/play has the quote 'To be, or not to be, that is the question'?",
        answers: [
            { text: "Romeo & Juliet", correct: false },
            { text: "Les Miserables", correct: false },
            { text: "The Phantom of the Opera", correct: false },
            { text: "Hamlet", correct: true },
        ],
    },
    {
        question: "What is the gravitational force acting on an object with a mass of 10 kg on Earth? (Take g = 9.81 m/s²)",
        answers: [
            { text: "98 N", correct: false },
            { text: "98.1 N", correct: true },
            { text: "9.81 N", correct: false },
            { text: "0.981 N", correct: false },
        ],
    },
    {
        question: "In which battle did Napoleon Bonaparte suffer his final defeat?",
        answers: [
            { text: "Battle of Leipzig", correct: false },
            { text: "Battle of Waterloo", correct: true },
            { text: "Battle of Paris", correct: false },
            { text: "Battle of Austerlitz", correct: false },
        ],
    },
];

module.exports = { multiQns };