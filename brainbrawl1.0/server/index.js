const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

app.use('/', require('./routes/authRoutes'));

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));