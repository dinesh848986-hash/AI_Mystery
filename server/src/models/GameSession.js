import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  mysteryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mystery', required: true },
  sessionToken: { type: String, required: true, unique: true, index: true },
  selectedAnswerId: String, hintsUsed: { type: Number, default: 0 }, score: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  startedAt: { type: Date, default: Date.now }, completedAt: Date,
});

export default mongoose.model('GameSession', sessionSchema);
