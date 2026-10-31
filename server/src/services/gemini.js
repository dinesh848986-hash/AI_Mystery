import { GoogleGenAI } from '@google/genai';
import { generatedMysterySchema } from '../validators/mystery.js';
import { fallbackMystery } from './fallbackMystery.js';

const promptFor = (difficulty, format) => `Create one entirely fictional, logically solvable cricket investigation mystery. Do not use real people, teams, or accusations. Return ONLY JSON with fields: title, difficulty, format, scenario, suspects (3-5 objects with id,name,role,profile), evidence (at least 3 objects with id,type [profile|statistics|statement|timeline],title,content), correctAnswerId, answerEvidenceIds (one or more evidence ids which together support the correct answer), explanation, hints (exactly 3 progressive non-answer-revealing strings). Difficulty=${difficulty}; format=${format}. Every clue must fit the scenario and one answer. Make all player/team names fictional. The answer must be one suspect id. Never put the culprit's name or id in the scenario, evidence or hints. Ensure the cited answerEvidenceIds substantiate why that suspect is responsible.`;

export async function generateMystery(difficulty, format) {
  if (!process.env.GEMINI_API_KEY) return fallbackMystery(difficulty, format);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await ai.models.generateContent({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', contents: promptFor(difficulty, format), config: { responseMimeType: 'application/json' } });
      const parsed = generatedMysterySchema.parse(JSON.parse(response.text));
      return parsed;
    } catch (error) { console.warn(`Mystery generation attempt ${attempt + 1} failed:`, error.message); }
  }
  return fallbackMystery(difficulty, format);
}
