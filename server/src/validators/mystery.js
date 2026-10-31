import { z } from 'zod';

const suspect = z.object({ id: z.string().min(1), name: z.string().min(2), role: z.string().min(1), profile: z.string().min(12) });
const evidence = z.object({ id: z.string().min(1), type: z.enum(['profile', 'statistics', 'statement', 'timeline']), title: z.string().min(2), content: z.string().min(12) });
export const generatedMysterySchema = z.object({
  title: z.string().min(5), difficulty: z.enum(['easy', 'medium', 'hard']), format: z.enum(['T20', 'ODI', 'Test']),
  scenario: z.string().min(40), suspects: z.array(suspect).min(3).max(5), evidence: z.array(evidence).min(3),
  correctAnswerId: z.string().min(1), answerEvidenceIds: z.array(z.string().min(1)).min(1),
  explanation: z.string().min(30), hints: z.array(z.string().min(10)).length(3),
}).superRefine((mystery, ctx) => {
  if (!mystery.suspects.some((person) => person.id === mystery.correctAnswerId)) {
    ctx.addIssue({ code: 'custom', path: ['correctAnswerId'], message: 'Answer must match a suspect' });
  }
  if (new Set(mystery.suspects.map((person) => person.id)).size !== mystery.suspects.length) {
    ctx.addIssue({ code: 'custom', path: ['suspects'], message: 'Suspect ids must be unique' });
  }
  if (new Set(mystery.evidence.map((item) => item.id)).size !== mystery.evidence.length) {
    ctx.addIssue({ code: 'custom', path: ['evidence'], message: 'Evidence ids must be unique' });
  }
  if (!mystery.answerEvidenceIds.every((id) => mystery.evidence.some((item) => item.id === id))) {
    ctx.addIssue({ code: 'custom', path: ['answerEvidenceIds'], message: 'Answer evidence must reference existing clues' });
  }
  const answer = mystery.suspects.find((person) => person.id === mystery.correctAnswerId);
  const publicClues = [mystery.scenario, ...mystery.evidence.map((item) => `${item.title} ${item.content}`), ...mystery.hints].join(' ').toLocaleLowerCase();
  if (answer && [answer.name, answer.id].some((needle) => needle.length > 2 && publicClues.includes(needle.toLocaleLowerCase()))) {
    ctx.addIssue({ code: 'custom', path: ['evidence'], message: 'Public clues and hints must not name the answer directly' });
  }
});
export const generationRequestSchema = z.object({ type: z.enum(['fictional', 'historical']).default('fictional'), difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'), format: z.enum(['T20', 'ODI', 'Test']).default('T20') });
