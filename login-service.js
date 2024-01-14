const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB URI and client setup
const uri = "mongodb+srv://georgebiliasgr:12345678abcd@cluster0.bhefxh9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const dbName = "Cluster0"; // Replace with your database name

app.use(bodyParser.json());
app.use(cors());

// CORS middleware setup
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e);
    }
}

connectDB();

// Session storage
const sessions = new Map();

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // MongoDB user authentication
    const collection = client.db(dbName).collection("users");
    const user = await collection.findOne({ username: username });

    if (user && user.password === password) {
        const sessionId = uuidv4();
        sessions.set(sessionId, username);
        res.json({ sessionId });
    } else if (user && user.password !== password) {
        res.status(401).json({ message: 'Wrong Password' });
    } else {
        res.status(402).json({ message: 'Invalid credentials' });
    }
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const collection = client.db(dbName).collection("users");

    // Check if the username already exists
    const existingUser = await collection.findOne({ username: username });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (username.length < 3 || /^\d/.test(username) && !regex.test(password)){
        return res.status(401).json({ message: 'Username must be at least 3 characters long and not start with a number. Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.' });
    }

    // check if the username is valid
    if (username.length < 3 || /^\d/.test(username)) {
        return res.status(402).json({ message: 'Username must be at least 3 characters long and not start with a number.' });
    }
    // check if the password is valid
    if (!regex.test(password)) {
        return res.status(403).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.' });
    }

    // Insert the new user into the collection
    await collection.insertOne({
        username: username,
        password: password,
        favorites: []
    });

    res.sendStatus(200);
});


// Toggle favorite endpoint
app.post('/toggle-favorite', async (req, res) => {
    const { sessionId, listingId, title, description, cost, image_url } = req.body;
    
    // Validate session ID
    if (!sessions.has(sessionId)) {
        return res.status(401).json({ message: 'Invalid session ID' });
    }

    const username = sessions.get(sessionId);
    const collection = client.db(dbName).collection("users");

    // Retrieve user document
    const userDoc = await collection.findOne({ username: username });
    
    // Check if the ad is already in favorites
    const adIndex = userDoc.favorites.findIndex(ad => ad.listingId === listingId);

    if (adIndex !== -1) {
        // Remove ad from favorites
        await collection.updateOne(
            { username: username },
            { $pull: { favorites: { listingId: listingId } } }
        );
    } else {
        // Add ad to favorites
        await collection.updateOne(
            { username: username },
            { $push: { favorites: { listingId, title, description, cost, image_url } } }
        );
    }

    res.sendStatus(200);
});

// Get favorites endpoint
app.post('/get-favorites', async (req, res) => {
    const { sessionId } = req.body;

    // Validate session ID
    if (!sessions.has(sessionId)) {
        return res.status(401).json({ message: 'Invalid session ID' });
    }

    const username = sessions.get(sessionId);
    const collection = client.db(dbName).collection("users");
    
    // Retrieve user's favorites
    const userDoc = await collection.findOne({ username: username });
    res.json(userDoc.favorites);
});

app.post('/check-favorites', async (req, res) => {
    const { username, sessionId } = req.body;
    console.log("username :" + username);

    // Check if the session ID is valid
    if (sessions.has(sessionId)) {
        const username_session = sessions.get(sessionId);
        if (username_session !== username) {
            res.status(401).json({ message: 'Invalid username' });
            return;
        }

        // Fetch user's favorites from MongoDB
        const collection = client.db(dbName).collection("users");
        const user = await collection.findOne({ username: username });

        if (user && user.favorites) {
            // Return the user's favorite ads
            res.json(user.favorites);
        } else {
            // Handle case where user has no favorites or does not exist
            res.status(404).json({ message: 'No favorites found' });
        }
    } else {
        res.status(401).json({ message: 'Invalid session ID' });
    }
});


// Logout endpoint
app.post('/logout', (req, res) => {
    const { sessionId } = req.body;
    if (sessions.has(sessionId)) {
        sessions.delete(sessionId);
        res.sendStatus(200);
    } else {
        res.status(401).json({ message: 'Invalid session ID' });
    }
});

// Delete favorite endpoint
app.post('/delete-favorite', async (req, res) => {
    const { sessionId, listingId } = req.body;
    if (sessions.has(sessionId)) {
        const username = sessions.get(sessionId);
        const collection = client.db(dbName).collection("users");
        await collection.updateOne(
            { username: username },
            { $pull: { favorites: { listingId: listingId } } }
        );
        res.sendStatus(200);
    } else {
        res.status(401).json({ message: 'Invalid session ID' });
    }
});

app.listen(port, () => {
    console.log(`Login Service listening at http://localhost:${port}`);
});
