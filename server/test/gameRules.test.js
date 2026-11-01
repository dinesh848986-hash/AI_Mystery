import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { submitAnswer } from '../src/controllers/api.js';
import Mystery from '../src/models/Mystery.js';
import GameSession from '../src/models/GameSession.js';
import { publicMystery, calculateScore, canRequestHint } from '../src/services/gameRules.js';
import { generatedMysterySchema } from '../src/validators/mystery.js';
import { fallbackMystery, fallbackMysteries, historicalMysteryCount, historicalMysteries } from '../src/services/fallbackMystery.js';
import { errorHandler } from '../src/middleware/errors.js';

test('public mystery projection never includes private answer material', () => {
  const full = { _id: 'abc', ...fallbackMystery(), correctAnswerId: 'kian-das', explanation: 'private', hints: ['private'], answerEvidenceIds: ['ev-1'] };
  const exposed = publicMystery(full);
  assert.equal(exposed.correctAnswerId, undefined);
  assert.equal(exposed.explanation, undefined);
  assert.equal(exposed.hints, undefined);
  assert.equal(exposed.answerEvidenceIds, undefined);
  assert.equal(exposed.mysteryId, 'abc');
});

test('correct answer scoring follows hint deductions and wrong answers score zero', () => {
  assert.deepEqual([0, 1, 2, 3].map((used) => calculateScore(true, used)), [100, 80, 60, 40]);
  assert.equal(calculateScore(false, 0), 0);
});

test('hints stop at three and cannot be requested after completion', () => {
  assert.equal(canRequestHint('active', 2), true);
  assert.equal(canRequestHint('active', 3), false);
  assert.equal(canRequestHint('completed', 0), false);
});

test('fallback and historical cases satisfy clue reference and answer secrecy checks', () => {
  assert.equal(generatedMysterySchema.safeParse(fallbackMystery()).success, true);
  assert.equal(historicalMysteryCount() >= 2, true);
  for (const historical of historicalMysteries()) {
    assert.equal(generatedMysterySchema.safeParse(historical).success, true);
    const suspect = historical.suspects.find((person) => person.id === historical.correctAnswerId);
    const clueText = [historical.scenario, ...historical.evidence.map((item) => item.content), ...historical.hints].join(' ').toLowerCase();
    assert.equal([historical.scenario, ...historical.hints].join(' ').toLowerCase().includes(suspect.name.toLowerCase()), false);
    assert.equal(historical.answerEvidenceIds.every((id) => historical.evidence.some((item) => item.id === id)), true);
    assert.equal(historical.suspects.length >= 3, true);
  }
});

test('mystery schema rejects clues that name the culprit and dangling evidence references', () => {
  const valid = fallbackMystery();
  const culprit = valid.suspects.find((person) => person.id === valid.correctAnswerId);
  const leaked = { ...valid, hints: [...valid.hints.slice(0, 2), `It was ${culprit.name}.`] };
  assert.equal(generatedMysterySchema.safeParse(leaked).success, false);
  const dangling = { ...valid, answerEvidenceIds: ['missing-clue'] };
  assert.equal(generatedMysterySchema.safeParse(dangling).success, false);
});

test('fallback cases have distinct incident fingerprints, scenarios, and valid evidence', () => {
  const cases = fallbackMysteries();
  assert.equal(cases.length >= 8, true);
  assert.equal(new Set(cases.map((item) => item.incidentFingerprint)).size, cases.length);
  assert.equal(new Set(cases.map((item) => item.scenario)).size, cases.length);
  for (const mystery of cases) assert.equal(generatedMysterySchema.safeParse(mystery).success, true);
  assert.equal(fallbackMystery('medium', 'T20', cases.map((item) => item.incidentFingerprint)), null);
  assert.doesNotThrow(() => fallbackMystery('easy', 'T20', [undefined, { scenarioKey: 'legacy-record-without-fingerprint' }]));
  const first = cases[0];
  const normalized = first.scenario.toLocaleLowerCase('en').normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
  const legacyRecord = { scenarioKey: createHash('sha256').update(normalized).digest('hex') };
  const next = fallbackMystery('medium', 'T20', [legacyRecord]);
  assert.notEqual(next.scenario, first.scenario);
});

test('safe service-unavailable reasons reach the player instead of a generic 500 message', () => {
  let status;
  let body;
  errorHandler(
    Object.assign(new Error('No unused cases are available right now. Please try again later.'), { status: 503, exposeMessage: true }),
    {},
    { status(code) { status = code; return this; }, json(value) { body = value; } },
    () => {},
  );
  assert.equal(status, 503);
  assert.match(body.error, /No unused cases/);
});

test('answer submission atomically completes the session and returns the scored result', async (t) => {
  const session = { _id: 'session-id', mysteryId: 'mystery-id', status: 'active', hintsUsed: 1 };
  const mystery = {
    suspects: [{ id: 'kian-das', name: 'Kian Das' }],
    correctAnswerId: 'kian-das', explanation: 'The replay and field positions resolve the incident.', evidence: [],
  };
  t.mock.method(GameSession, 'findOne', () => session);
  t.mock.method(Mystery, 'findById', () => ({ select: async () => mystery }));
  t.mock.method(GameSession, 'findOneAndUpdate', async (_query, update) => ({ score: update.$set.score }));
  let response;
  await submitAnswer(
    { params: { token: 'secure-token' }, body: { selectedAnswerId: 'kian-das' } },
    { json: (body) => { response = body; } },
    (error) => { throw error; },
  );
  assert.equal(response.correct, true);
  assert.equal(response.score, 80);
  assert.equal(session.status, 'active'); // Completion uses the guarded atomic update.
});
