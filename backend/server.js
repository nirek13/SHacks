// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 1000;

app.use(bodyParser.json());
app.use(cors());

const challengesFile = './challenges.json';

// Read challenges from the file
const readChallenges = () => {
    if (fs.existsSync(challengesFile)) {
        const data = fs.readFileSync(challengesFile);
        return JSON.parse(data);
    }
    return [];
};

// Write challenges to the file
const writeChallenges = (challenges) => {
    fs.writeFileSync(challengesFile, JSON.stringify(challenges, null, 2));
};

// Get all challenges
app.get('/api/challenges', (req, res) => {
    const challenges = readChallenges();
    res.json(challenges);
});

// Add a new challenge
app.post('/api/challenges', (req, res) => {
    const newChallenge = req.body;
    const challenges = readChallenges();
    challenges.push(newChallenge);
    writeChallenges(challenges);
    res.status(201).json(newChallenge);
});

// Join a challenge
app.post('/api/challenges/:index/join', (req, res) => {
    const { index } = req.params;
    const { userName } = req.body;
    const challenges = readChallenges();
    if (challenges[index]) {
        challenges[index].participants.push(userName);
        writeChallenges(challenges);
        res.json(challenges[index]);
    } else {
        res.status(404).json({ error: 'Challenge not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
