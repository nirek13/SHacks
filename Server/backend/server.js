const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 1000;

const SECRET_KEY = 'your_secret_key';
const usersFile = './users.json';
const challengesFile = './challenges.json';

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('../db/collection.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        dropTable(); // Call the function to create the table after connecting to the database
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS challenges (
        id INTEGER PRIMARY KEY,
        text TEXT,
        creator TEXT,
        completedCount INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS participants (
        challengeId INTEGER,
        username TEXT,
        FOREIGN KEY(challengeId) REFERENCES challenges(id)
    )`);
});

const readData = (file) => {
    console.log("shit")
    if (fs.existsSync(file)) {
        const data = fs.readFileSync(file);
        return JSON.parse(data);
    }
    console.log("shit2")

    return [];
};

const writeData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

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

const getLastIndexOfUsers = () => {
    return new Promise((resolve, reject) => {
        db.get('SELECT MAX(user_index) as maxIndex FROM users', (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row ? row.maxIndex : 0);
            }
        });
    });
};

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("f")
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        console.log("fuck")
        try {
            const users = readData(usersFile);
            if (users.find(user => user.username === username)) {
                return res.status(400).json({ error: 'Username already exists' });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            users.push({ username, password: hashedPassword });
            writeData(usersFile, users);
        } catch {
            console.log("d")
        }
        let lastIndex;
        try {
            lastIndex = await getLastIndexOfUsers();
        } catch (err) {
            return res.status(500).json({ error: 'Database error', message: err.message });
        }
        console.log("k")
        const userIndex = lastIndex + 1;

        db.run('INSERT INTO users (username, user_index) VALUES (?, ?)', [username, userIndex], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error inserting into database', message: err.message });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

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

// app.get('/api/challenges', authenticate, (req, res) => {
//     const challenges = readData(challengesFile);
//     res.json(challenges);
// });

// app.post('/api/challenges', authenticate, (req, res) => {
//     const newChallenge = req.body;
//     const challenges = readData(challengesFile);
//     challenges.push(newChallenge);
//     writeData(challengesFile, challenges);
//     res.status(201).json(newChallenge);
// });

// app.post('/api/challenges/:index/join', authenticate, (req, res) => {
//     const { index } = req.params;
//     const { userName } = req.body;
//     const challenges = readData(challengesFile);
//     if (challenges[index]) {
//         challenges[index].participants.push(userName);
//         writeData(challengesFile, challenges);
//         res.json(challenges[index]);
//     } else {
//         res.status(404).json({ error: 'Challenge not found' });
//     }
// });

const getNextChatTableNumber = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'chat_%'", (err, tables) => {
            if (err) {
                return reject(err);
            }
            const chatNumbers = tables.map(table => {
                const match = table.name.match(/chat_(\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            });
            const maxNumber = chatNumbers.length > 0 ? Math.max(...chatNumbers) : 0;
            resolve(maxNumber + 1);
        });
    });
};

app.post('/api/createReply', (req, res) => {
    const { username, message, chatTableName, postId } = req.body;

    if (!username || !message || !chatTableName || !postId) {
        console.log(username, message, chatTableName, postId)
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run(`INSERT INTO "${chatTableName}" (username, message, post) VALUES (?, ?, ?)`, [username, message, false], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error inserting into chat table', message: err.message });
        }
        res.status(201).json({ message: 'Reply posted successfully' });
    });
});


app.post("/api/createPost", async (req, res) => {
    try {
        const { username, message } = req.body;

        if (!username || !message) {
            return res.status(400).json({ error: 'Username and message are required' });
        }

        const nextChatNumber = await getNextChatTableNumber();
        const chatTableName = `chat_${nextChatNumber}`;

        db.run(`CREATE TABLE "${chatTableName}" (username TEXT, message TEXT, post BOOLEAN)`, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error creating chat table', message: err.message });
            }

            db.run(`INSERT INTO "${chatTableName}" (username, message, post) VALUES (?, ?, ?)`, [username, message, true], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error inserting into chat table', message: err.message });
                }

                res.status(201).json({ message: 'Post created successfully', table: chatTableName });
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

app.get('/api/feed', async (req, res) => {
    try {
        db.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'chat_%'", (err, tables) => {
            if (err) {
                return res.status(500).json({ error: 'Error retrieving tables', message: err.message });
            }

            const fetchPostsPromises = tables.map(table => {
                return new Promise((resolve, reject) => {
                    db.all(`SELECT '${table.name}' AS table_name, username, message, post FROM "${table.name}"`, (err, rows) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
                });
            });

            Promise.all(fetchPostsPromises)
                .then(results => {
                    const combinedResults = [].concat(...results);
                    res.json(combinedResults);
                })
                .catch(err => {
                    res.status(500).json({ error: 'Error retrieving posts', message: err.message });
                });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

app.post('/api/createChallenge', (req, res) => {
    const { username, text } = req.body;

    if (!username || !text) {
        return res.status(400).json({ error: 'Username and text are required' });
    }

    db.run(`INSERT INTO challenges (text, creator) VALUES (?, ?)`, [text, username], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error creating challenge', message: err.message });
        }

        res.status(201).json({ id: this.lastID, text, creator: username, completedCount: 0, participants: [] });
    });
});

app.post('/api/joinChallenge/:id', (req, res) => {
    const { username } = req.body;
    const { id } = req.params;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    db.run(`INSERT INTO participants (challengeId, username) VALUES (?, ?)`, [id, username], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error joining challenge', message: err.message });
        }

        db.get(`SELECT * FROM challenges WHERE id = ?`, [id], (err, challenge) => {
            if (err) {
                return res.status(500).json({ error: 'Error retrieving challenge', message: err.message });
            }

            db.all(`SELECT username FROM participants WHERE challengeId = ?`, [id], (err, participants) => {
                if (err) {
                    return res.status(500).json({ error: 'Error retrieving participants', message: err.message });
                }

                challenge.participants = participants.map(p => p.username);
                res.status(200).json(challenge);
            });
        });
    });
});

app.post('/api/completeChallenge/:id', (req, res) => {
    const { id } = req.params;

    db.run(`UPDATE challenges SET completedCount = completedCount + 1 WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error marking challenge as completed', message: err.message });
        }

        db.get(`SELECT * FROM challenges WHERE id = ?`, [id], (err, challenge) => {
            if (err) {
                return res.status(500).json({ error: 'Error retrieving challenge', message: err.message });
            }

            db.all(`SELECT username FROM participants WHERE challengeId = ?`, [id], (err, participants) => {
                if (err) {
                    return res.status(500).json({ error: 'Error retrieving participants', message: err.message });
                }

                challenge.participants = participants.map(p => p.username);
                res.status(200).json(challenge);
            });
        });
    });
});

app.get('/api/challenges', (req, res) => {
    db.all(`SELECT * FROM challenges`, (err, challenges) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving challenges', message: err.message });
        }

        const challengePromises = challenges.map(challenge => {
            return new Promise((resolve, reject) => {
                db.all(`SELECT username FROM participants WHERE challengeId = ?`, [challenge.id], (err, participants) => {
                    if (err) {
                        reject(err);
                    } else {
                        challenge.participants = participants.map(p => p.username);
                        resolve(challenge);
                    }
                });
            });
        });

        Promise.all(challengePromises)
            .then(results => res.status(200).json(results))
            .catch(error => res.status(500).json({ error: 'Error retrieving participants', message: error.message }));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
