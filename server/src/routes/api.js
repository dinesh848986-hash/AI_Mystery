import { Router } from 'express';
import { health, readiness, createMystery, getMystery, createSession, requestHint, submitAnswer } from '../controllers/api.js';

const router = Router();
router.get('/health', health);
router.get('/ready', readiness);
router.post('/mysteries', createMystery);
router.get('/mysteries/:id', getMystery);
router.post('/sessions', createSession);
router.post('/sessions/:token/hints', requestHint);
router.post('/sessions/:token/answer', submitAnswer);
export default router;
