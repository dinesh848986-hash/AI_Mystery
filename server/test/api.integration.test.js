import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('HTTP API health and invalid request handling', async (t) => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const base = `http://127.0.0.1:${server.address().port}/api`;

  const health = await fetch(`${base}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ok' });

  const readiness = await fetch(`${base}/ready`);
  assert.equal(readiness.status, 503);
  assert.deepEqual(await readiness.json(), { status: 'not_ready', database: 'disconnected' });

  const session = await fetch(`${base}/sessions`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mysteryId: 5 }),
  });
  assert.equal(session.status, 400);
  assert.match((await session.json()).error, /mysteryId/);

  const answer = await fetch(`${base}/sessions/not-a-real-token/answer`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({}),
  });
  assert.equal(answer.status, 400);
  assert.match((await answer.json()).error, /suspect/);

  const malformed = await fetch(`${base}/sessions`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{not-json',
  });
  assert.equal(malformed.status, 400);
  assert.match((await malformed.json()).error, /valid JSON/);

  const oversized = await fetch(`${base}/sessions`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ padding: 'x'.repeat(21_000) }),
  });
  assert.equal(oversized.status, 413);
  assert.match((await oversized.json()).error, /too large/);
});
