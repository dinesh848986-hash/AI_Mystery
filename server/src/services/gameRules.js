export function publicMystery(mystery) {
  return {
    mysteryId: mystery._id,
    title: mystery.title,
    type: mystery.type,
    difficulty: mystery.difficulty,
    format: mystery.format,
    scenario: mystery.scenario,
    suspects: mystery.suspects,
    evidence: mystery.evidence,
  };
}

export function calculateScore(correct, hintsUsed) {
  if (!correct) return 0;
  return [100, 80, 60, 40][Math.min(3, Math.max(0, hintsUsed))];
}

export function canRequestHint(status, hintsUsed) {
  return status === 'active' && hintsUsed < 3;
}
