import { createHash, randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import Mystery from '../models/Mystery.js';
import GameSession from '../models/GameSession.js';
import { generateMystery } from '../services/gemini.js';
import { historicalMystery } from '../services/fallbackMystery.js';
import { publicMystery, calculateScore } from '../services/gameRules.js';
import { generationRequestSchema } from '../validators/mystery.js';

const fail = (status, message) => Object.assign(new Error(message), { status });

export async function health(_req, res) { res.json({ status: 'ok' }); }
export async function readiness(_req, res) {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ status: connected ? 'ready' : 'not_ready', database: connected ? 'connected' : 'disconnected' });
}
export async function createMystery(req, res, next) {
  try {
    const input = generationRequestSchema.parse(req.body || {});
    const history = await Mystery.find({}, { scenario: 1, scenarioKey: 1, incidentFingerprint: 1 }).lean();
    const normalize = (value = '') => value.toLocaleLowerCase('en').normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
    for (const prior of history) {
      if (!prior.scenarioKey && prior.scenario) prior.scenarioKey = createHash('sha256').update(normalize(prior.scenario)).digest('hex');
      if (prior.incidentFingerprint) prior.incidentFingerprint = normalize(prior.incidentFingerprint);
    }
    const data = input.type === 'historical'
      ? historicalMystery(history)
      : await generateMystery(input.difficulty, input.format, history);
    if (!data) throw fail(503, 'No unused cases are available right now. Please try again later.');
    const mystery = await Mystery.create({ ...data, type: input.type });
    res.status(201).json(publicMystery(mystery));
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ error: 'Choose an available difficulty and cricket format.' });
    if (error.code === 11000) return res.status(503).json({ error: 'A duplicate case was detected. Please try again for a new mystery.' });
    next(error);
  }
}
export async function getMystery(req, res, next) {
  try { const mystery = await Mystery.findOne({ _id: req.params.id, status: 'active' }); if (!mystery) throw fail(404, 'Mystery not found.'); res.json(publicMystery(mystery)); }
  catch (error) { next(error); }
}
export async function createSession(req, res, next) {
  try {
    if (typeof req.body?.mysteryId !== 'string') throw fail(400, 'A valid mysteryId is required.');
    const mystery = await Mystery.findOne({ _id: req.body.mysteryId, status: 'active' }).select('_id');
    if (!mystery) throw fail(404, 'Mystery not found.');
    const sessionToken = randomBytes(32).toString('hex');
    await GameSession.create({ mysteryId: mystery._id, sessionToken });
    res.status(201).json({ sessionToken, mysteryId: mystery._id });
  } catch (error) { next(error); }
}
export async function requestHint(req, res, next) {
  try {
    const session = await GameSession.findOne({ sessionToken: req.params.token });
    if (!session) throw fail(404, 'Investigation session not found.');
    if (session.status !== 'active') throw fail(409, 'This investigation is already complete.');
    if (session.hintsUsed >= 3) throw fail(409, 'You have used all three hints.');
    const updated = await GameSession.findOneAndUpdate(
      { _id: session._id, status: 'active', hintsUsed: session.hintsUsed },
      { $inc: { hintsUsed: 1 } },
      { new: true },
    );
    if (!updated) throw fail(409, 'This investigation changed. Please request your hint again.');
    const mystery = await Mystery.findById(session.mysteryId).select('+hints');
    if (!mystery) throw fail(404, 'Mystery not found.');
    const hintNumber = updated.hintsUsed;
    res.json({ hintNumber, hint: mystery.hints[hintNumber - 1], hintsRemaining: 3 - hintNumber });
  } catch (error) { next(error); }
}
export async function submitAnswer(req, res, next) {
  try {
    const { selectedAnswerId } = req.body || {};
    if (typeof selectedAnswerId !== 'string' || !selectedAnswerId) throw fail(400, 'Choose a suspect before submitting.');
    const session = await GameSession.findOne({ sessionToken: req.params.token });
    if (!session) throw fail(404, 'Investigation session not found.');
    if (session.status !== 'active') throw fail(409, 'An answer has already been submitted.');
    const mystery = await Mystery.findById(session.mysteryId).select('+correctAnswerId +explanation +sourceUrl');
    if (!mystery) throw fail(404, 'Mystery not found.');
    const suspect = mystery.suspects.find((person) => person.id === selectedAnswerId);
    if (!suspect) throw fail(400, 'That player is not one of the suspects.');
    const correct = selectedAnswerId === mystery.correctAnswerId;
    const score = calculateScore(correct, session.hintsUsed);
    const completed = await GameSession.findOneAndUpdate(
      { _id: session._id, status: 'active', hintsUsed: session.hintsUsed },
      { $set: { selectedAnswerId, status: 'completed', score, completedAt: new Date() } },
      { new: true },
    );
    if (!completed) throw fail(409, 'This investigation changed. Please review it and try again.');
    const answer = mystery.suspects.find((person) => person.id === mystery.correctAnswerId);
    res.json({ correct, correctAnswer: { id: answer.id, name: answer.name }, explanation: mystery.explanation, evidence: mystery.evidence, sourceUrl: mystery.sourceUrl, score: completed.score });
  } catch (error) { next(error); }
}
