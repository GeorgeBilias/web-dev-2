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

    // Preflight request
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// A map to store session IDs and usernames
const sessions = new Map();

// A map to store user data (username -> { password, favorites: [] })
const users = {
    user1: { password: 'password1', favorites: [] },
    user2: { password: 'password2', favorites: [] },
    // Add more users as needed
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password are valid
    if (users[username] && users[username].password === password) {
        const sessionId = uuidv4();

        // Store the session ID and username
        sessions.set(sessionId, username);

        res.json({ sessionId });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.listen(port, () => {
    console.log(`Login Service listening at http://localhost:${port}`);
});

app.post('/toggle-favorite', (req, res) => {
    const { sessionId, listingId,title,description,cost } = req.body;

    // Check if the session ID is valid
    if (sessions.has(sessionId)) {
        const username = sessions.get(sessionId);

        console.log(description);
        console.log(cost);
        console.log(title);
        // Update the user's favorite ads list
        users[username].favorites.includes(listingId)
            ? users[username].favorites.splice(users[username].favorites.indexOf(listingId), 1)
            : users[username].favorites.push(listingId);

        console.log('Updated favorites:', users[username].favorites);
        res.sendStatus(200);
    } else {
        res.status(401).json({ message: 'Invalid session ID' });
    }
});

// Add this new endpoint to login-service.js
app.post('/get-favorites', (req, res) => {
    const { sessionId } = req.body;

    // Check if the session ID is valid
    if (sessions.has(sessionId)) {
        const username = sessions.get(sessionId);
        console.log("username :"+username);

        // Return the user's favorite ads
        res.json(users[username].favorites);
    } else {
        res.status(401).json({ message: 'Invalid session ID' });
    }
});
