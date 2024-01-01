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
    const { sessionId, listingId, title, description, cost,image_url } = req.body;
    
    // Check if the session ID is valid
    if (sessions.has(sessionId)) {
        const username = sessions.get(sessionId);
        console.log(description);
        console.log(cost);
        console.log(title);

        // Create an object with the listing details
        const listingDetails = {
            listingId,
            title,
            description,
            cost,
            image_url,
            username,
            sessionId,
        };

        // Check if the user already has the listing in favorites
        const index = users[username].favorites.findIndex(item => item.listingId === listingId);

        if (index !== -1) {
            // If found, remove it from favorites
            users[username].favorites.splice(index, 1);
            //console.log('Removed from favorites:', listingDetails);
        } else {
            // If not found, add it to favorites
            users[username].favorites.push(listingDetails);
            //console.log('Added to favorites:', listingDetails);
        }

        console.log('Updated favorites:', users[username].favorites);
        res.sendStatus(200);
    } else {
        res.status(401).json({ message: 'Invalid session ID' });
    }
});


// Add this new endpoint to login-service.js
app.post('/get-favorites', (req, res) => {
    const { username,sessionId } = req.body;
    console.log("username :"+username);
    // Check if the session ID is valid
    if (sessions.has(sessionId)) {
        const username_session = sessions.get(sessionId);
        if (username_session !== username) {
            res.status(401).json({ message: 'Invalid username' });
            return;
        }
        // Return the user's favorite ads
        res.json(users[username].favorites);
    } else {
        res.status(401).json({ message: 'Invalid session ID' });
    }
});

app.post('/check-favorites', (req, res) => {
    const { username,sessionId } = req.body;
    console.log("username :"+username);
    // Check if the session ID is valid
    if (sessions.has(sessionId)) {
        const username_session = sessions.get(sessionId);
        if (username_session !== username) {
            res.status(401).json({ message: 'Invalid username' });
            return;
        }
        // Return the user's favorite ads
        res.json(users[username].favorites);
    } else {
        res.status(401).json({ message: 'No favourites found' });
    }
});

app.post('/logout', (req, res) => {
    const { sessionId } = req.body;

    // Check if the session ID is valid
    if (sessions.has(sessionId)) {
        // Remove the session
        sessions.delete(sessionId);
        res.sendStatus(200);
    } else {
        res.status(401).json({ message: 'Invalid session ID' });
    }
});

app.post('/delete-favorite', (req, res) => {
    const { sessionId, listingId } = req.body;

    // Check if the session ID is valid
    if (sessions.has(sessionId)) {
        const username = sessions.get(sessionId);

        // Find the listing in favorites
        const index = users[username].favorites.findIndex(item => item.listingId === listingId);

        if (index !== -1) {
            // If found, remove it from favorites
            users[username].favorites.splice(index, 1);
            console.log('Removed from favorites:', listingId);
            res.sendStatus(200);
        } else {
            res.status(401).json({ message: 'Invalid listing ID' });
        }
    } else {
        res.status(401).json({ message: 'Invalid session ID' });
    }
});
