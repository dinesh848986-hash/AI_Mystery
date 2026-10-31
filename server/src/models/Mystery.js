import mongoose from 'mongoose';

const suspectSchema = new mongoose.Schema({ id: String, name: String, role: String, profile: String }, { _id: false });
const evidenceSchema = new mongoose.Schema({ id: String, type: String, title: String, content: String }, { _id: false });
const mysterySchema = new mongoose.Schema({
  title: { type: String, required: true }, type: { type: String, enum: ['fictional', 'historical'], default: 'fictional' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true }, format: { type: String, enum: ['T20', 'ODI', 'Test'], required: true },
  scenario: { type: String, required: true }, suspects: [suspectSchema], evidence: [evidenceSchema],
  correctAnswerId: { type: String, required: true, select: false }, explanation: { type: String, required: true, select: false }, sourceUrl: { type: String, select: false },
  answerEvidenceIds: { type: [String], select: false },
  hints: { type: [String], select: false }, status: { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model('Mystery', mysterySchema);
