import { GoogleGenAI } from '@google/genai';
import { createHash } from 'node:crypto';
import { generatedMysterySchema } from '../validators/mystery.js';
import { fallbackMystery } from './fallbackMystery.js';

const categories = ['dismissal', 'last-over', 'scorecard', 'statements', 'fielding', 'qualification', 'records', 'fictional'];
const promptFor = (difficulty, format, excluded) => `Create one entirely fictional, logically solvable cricket investigation. Do not use real people, teams, historical match claims or accusations. Return ONLY JSON with fields: title, category (one of ${categories.join(', ')}), incidentFingerprint (a concise, stable identifier for the actual incident, not wording), difficulty, format, scenario, suspects (3-5 objects with id,name,role,profile), evidence (at least 3 objects with id,type [profile|statistics|statement|timeline],title,content), correctAnswerId, answerEvidenceIds (one or more evidence ids which together conclusively support the answer), explanation, hints (exactly 3 progressive hints). Difficulty=${difficulty}; format=${format}. Create a materially different incident, question, suspects and evidence. Do not reuse these incident fingerprints or scenarios: ${JSON.stringify(excluded)}. Every clue must fit the scenario and support one answer. Never put the culprit's name or id in the scenario or hints. Ensure a player can infer the answer from evidence.`;

export async function generateMystery(difficulty, format, excluded = []) {
  const excludedFingerprints = excluded.map((item) => item.incidentFingerprint);
  if (!process.env.GEMINI_API_KEY) {
    console.info('Gemini API key is not configured; trying an unused validated fallback mystery.');
    return fallbackMystery(difficulty, format, excludedFingerprints);
  }
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await ai.models.generateContent({ model, contents: promptFor(difficulty, format, excluded), config: { responseMimeType: 'application/json' } });
      const parsed = generatedMysterySchema.parse(JSON.parse(response.text));
      const fingerprint = parsed.incidentFingerprint.toLocaleLowerCase('en').normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
      const scenario = parsed.scenario.toLocaleLowerCase('en').normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
      const scenarioKey = createHash('sha256').update(scenario).digest('hex');
      if (excluded.some((item) => item.incidentFingerprint === fingerprint || item.scenarioKey === scenarioKey)) throw new Error('Duplicate mystery rejected');
      console.info('Gemini generated a validated, unique mystery.');
      return parsed;
    } catch (error) { console.warn(`Mystery generation attempt ${attempt + 1} failed:`, error.name || 'UnknownError', error.status || error.code || ''); }
  }
  console.warn('Gemini generation failed or repeated an incident; trying an unused validated fallback.');
  return fallbackMystery(difficulty, format, excludedFingerprints);
}
