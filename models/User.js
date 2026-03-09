const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  gameName: { type: String, required: true },
  highScore: { type: Number, default: 0 },
  lastScore: { type: Number, default: 0 },
  timesPlayed: { type: Number, default: 0 },
  lastPlayed: { type: Date, default: null }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  games: { type: [GameSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
