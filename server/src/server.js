import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const serverDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: resolve(serverDir, '.env') });
dotenv.config({ path: resolve(serverDir, '..', '.env'), override: false });

const port = Number(process.env.PORT) || 5000;
try {
  console.info('Connecting to MongoDB...');
  await connectDatabase();
  app.listen(port, () => console.info(`AI Mystery Room API listening on ${port}`));
} catch (error) {
  console.error('Server startup failed:', error.message);
  process.exit(1);
}
