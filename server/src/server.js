import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDatabase } from './config/db.js';

const serverDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: resolve(serverDir, '.env') });
dotenv.config({ path: resolve(serverDir, '..', '.env'), override: false });

const port = Number(process.env.PORT) || 5000;
const host = '0.0.0.0';
try {
  console.info('Connecting to MongoDB...');
  await connectDatabase();
  const { default: app } = await import('./app.js');
  app.listen(port, host, () => console.info(`AI Mystery Room API listening on ${host}:${port}`));
} catch (error) {
  console.error('Server startup failed:', error.message);
  process.exit(1);
}
