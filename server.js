const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');

const app = express();
// Enable CORS so the frontend (including file:// or localhost origins) can call the API
app.use(cors({ origin: '*' }));
app.use(express.json());

const MONGO = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kiddospark';

mongoose.connect(MONGO)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Mongo connection error:', err));

// POST /api/login { username }
// Returns user document (including games) and creates user if not exists
app.post('/api/login', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'username required' });

    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, games: [] });
      await user.save();
    }

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// GET /api/user/:username  - return user history
app.get('/api/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'user not found' });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// POST /api/game { username, gameName, score }
// Creates or updates a game's stats for the user
app.post('/api/game', async (req, res) => {
  try {
    const { username, gameName, score } = req.body;
    if (!username || !gameName || typeof score !== 'number') {
      return res.status(400).json({ error: 'username, gameName and numeric score are required' });
    }

    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, games: [] });
    }

    const existing = user.games.find(g => g.gameName === gameName);
    const now = new Date();
    if (existing) {
      existing.lastScore = score;
      existing.lastPlayed = now;
      existing.timesPlayed = (existing.timesPlayed || 0) + 1;
      if (score > (existing.highScore || 0)) existing.highScore = score;
    } else {
      user.games.push({ gameName, highScore: score, lastScore: score, timesPlayed: 1, lastPlayed: now });
    }

    await user.save();
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  return res.json({ status: 'ok', message: 'API test endpoint working' });
});

// Basic root endpoint to help frontend smoke-test the API
app.get('/', (req, res) => {
  return res.json({ status: 'ok', message: 'API running' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
