const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

// Add the following middleware to enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    console.log("here 1")

    // Preflight request
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// A map to store session IDs and usernames
const sessions = new Map();

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check username and password
    if (username === 'Ryan' && password === 'Gosling') {
        const sessionId = uuidv4();

        // Store the session ID and username
        sessions.set(sessionId, username);

        res.json({ sessionId });
        console.log("succesfull login")
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.listen(port, () => {
    console.log(`Login Service listening at http://localhost:${port}`);
});

