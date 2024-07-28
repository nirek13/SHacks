const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 1000;

const sqlite3 = require('sqlite3')

const SECRET_KEY = 'your_secret_key';
const usersFile = './users.json';
const challengesFile = './challenges.json';

app.use(bodyParser.json());
app.use(cors());

// Read data from a file
const readData = (file) => {
    if (fs.existsSync(file)) {
        const data = fs.readFileSync(file);
        return JSON.parse(data);
    }
    return [];
};

const db = new sqlite3.Database('../db/collection.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        dropTable(); // Call the function to create the table after connecting to the database
    }
});

const dropTable = () => {
    db.run('DROP TABLE IF EXISTS users', (err) => {
        if (err) {
            console.error('Error dropping table:', err.message);
        } else {
            console.log('Users table dropped successfully.');
            createTable(); // Create the table after dropping it
        }
    });
};

const createTable = () => {
    db.run('CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, user_index INTEGER)', (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Users table created successfully.');
        }
    });
};
// Write data to a file
const writeData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// User registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const users = readData(usersFile);

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    writeData(usersFile, users);

    res.status(201).json({ message: 'User registered successfully' });
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const users = readData(usersFile);
    const user = users.find(user => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const payload = jwt.verify(token, SECRET_KEY);
        req.user = payload;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Get all challenges
app.get('/api/challenges', authenticate, (req, res) => {
    const challenges = readData(challengesFile);
    res.json(challenges);
});

// Add a new challenge
app.post('/api/challenges', authenticate, (req, res) => {
    const newChallenge = req.body;
    const challenges = readData(challengesFile);
    challenges.push(newChallenge);
    writeData(challengesFile, challenges);
    res.status(201).json(newChallenge);
});

// Join a challenge
app.post('/api/challenges/:index/join', authenticate, (req, res) => {
    const { index } = req.params;
    const { userName } = req.body;
    const challenges = readData(challengesFile);
    if (challenges[index]) {
        challenges[index].participants.push(userName);
        writeData(challengesFile, challenges);
        res.json(challenges[index]);
    } else {
        res.status(404).json({ error: 'Challenge not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
