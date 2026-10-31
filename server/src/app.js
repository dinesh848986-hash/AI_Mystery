import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import api from './routes/api.js';
import { notFound, errorHandler } from './middleware/errors.js';

const app = express();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
    },
  },
}));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/mysteries', rateLimit({
  windowMs: 60_000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ error: 'Too many new cases requested. Wait a minute and try again.' }),
}));
app.use('/api', api);
app.use('/api', notFound);

if (process.env.NODE_ENV === 'production') {
  const clientDist = resolve(dirname(fileURLToPath(import.meta.url)), '../../client/dist');
  app.use(express.static(clientDist, { index: false }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    res.sendFile(resolve(clientDist, 'index.html'), (error) => error && next(error));
  });
} else {
  app.use(notFound);
}
app.use(errorHandler);
export default app;
