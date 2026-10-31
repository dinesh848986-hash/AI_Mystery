export function fallbackMystery(difficulty = 'medium', format = 'T20') {
  return {
    title: 'The Vanishing Final Run', difficulty, format,
    scenario: 'In the final over of the fictional Harbor Cup, North Quay needs four runs from two balls. A sharp return catches the non-striker short, but three fielders give different accounts of who collected and released the ball. One of them had no clear path to the stumps.',
    suspects: [
      { id: 'mira-sen', name: 'Mira Sen', role: 'Cover fielder', profile: 'A quick close-in fielder positioned just inside the ring on the off side.' },
      { id: 'dev-arora', name: 'Dev Arora', role: 'Wicketkeeper', profile: 'The keeper stood behind the striker and could see the bowler and running batters.' },
      { id: 'kian-das', name: 'Kian Das', role: 'Bowler', profile: 'Kian completed his follow-through toward the non-striker end after the delivery.' },
    ],
    evidence: [
      { id: 'ev-1', type: 'timeline', title: 'Replay timeline', content: 'The throw came from deep midwicket and passed the bowler before reaching the non-striker end.' },
      { id: 'ev-2', type: 'statement', title: 'Keeper statement', content: 'Dev says he stayed behind the striker stumps throughout the play and never touched the return.' },
      { id: 'ev-3', type: 'statement', title: 'Bowler statement', content: 'Kian says he was still moving toward the non-striker end when the ball passed on his off side.' },
      { id: 'ev-4', type: 'statistics', title: 'Fielding positions', content: 'The field chart places Mira at cover, well away from the deep midwicket return line.' },
    ],
    correctAnswerId: 'kian-das',
    answerEvidenceIds: ['ev-1', 'ev-3', 'ev-4'],
    explanation: 'The replay establishes that the throw passed the bowler on his off side as he moved toward the non-striker end. The keeper remained behind the striker and the cover fielder was away from the return line, leaving Kian as the player who redirected the ball toward the stumps.',
    hints: ['Trace the ball’s route from deep midwicket toward the non-striker end.', 'Compare the stated fielding positions with the throw’s path.', 'The player moving toward the non-striker end was the only one on the return line.'],
  };
}

const historicalCases = [
  {
    title: 'The Direct Hit at Old Trafford', type: 'historical', difficulty: 'easy', format: 'ODI',
    scenario: 'At Old Trafford in the 2019 Cricket World Cup semi-final, India were chasing New Zealand’s 239. With the innings nearing its end, MS Dhoni attempted a run and was dismissed short of his ground. The scorecard records the dismissal. Which New Zealand player made the decisive throw?',
    suspects: [
      { id: 'martin-guptill', name: 'Martin Guptill', role: 'New Zealand fielder', profile: 'A New Zealand outfielder involved in the late innings fielding effort.' },
      { id: 'trent-boult', name: 'Trent Boult', role: 'New Zealand bowler', profile: 'A New Zealand left-arm fast bowler who played in the semi-final.' },
      { id: 'ross-taylor', name: 'Ross Taylor', role: 'New Zealand batter', profile: 'A New Zealand middle-order batter who played in the semi-final.' },
    ],
    evidence: [
      { id: 'hist-1', type: 'statistics', title: 'The scorecard', content: 'The Pakistan Cricket Board scorecard records Dhoni’s dismissal as a run out in the 48th over, after he had scored 50 from 72 balls.' },
      { id: 'hist-2', type: 'timeline', title: 'The chase', content: 'India were dismissed for 221 in 49.3 overs, falling 18 runs short of New Zealand’s 239.' },
      { id: 'hist-3', type: 'statistics', title: 'The innings', content: 'Dhoni’s half-century came from 72 deliveries before his run out ended India’s eighth wicket.' },
    ],
    correctAnswerId: 'martin-guptill',
    answerEvidenceIds: ['hist-1'],
    explanation: 'The official PCB scorecard records MS Dhoni as run out by Martin Guptill for 50. New Zealand won the first semi-final by 18 runs. The scorecard is the factual source for this historical case.',
    sourceUrl: 'https://www.pcb.com.pk/icc-world-cup-2019/match/32694.html',
    hints: ['Look at the wording used in the scorecard’s dismissal entry.', 'The scorecard credits the fielder involved in the run out.', 'The player credited was positioned in the deep field during the chase.'],
  },
  {
    title: 'The Oval Run-Out', type: 'historical', difficulty: 'medium', format: 'ODI',
    scenario: 'In the 2019 Cricket World Cup match at the Oval, Bangladesh were batting against New Zealand. Mushfiqur Rahim was run out for 19 after facing 35 balls. Three New Zealand players are listed as suspects. Which one is credited with the dismissal?',
    suspects: [
      { id: 'martin-guptill', name: 'Martin Guptill', role: 'New Zealand fielder', profile: 'A New Zealand opening batter who also fields during the opposition innings.' },
      { id: 'trent-boult', name: 'Trent Boult', role: 'New Zealand bowler', profile: 'A New Zealand left-arm fast bowler who played in this fixture.' },
      { id: 'lockie-ferguson', name: 'Lockie Ferguson', role: 'New Zealand bowler', profile: 'A New Zealand fast bowler who played in this fixture.' },
    ],
    evidence: [
      { id: 'oval-1', type: 'statistics', title: 'Dismissal entry', content: 'The PCB scorecard records Mushfiqur Rahim’s dismissal as a run out for 19 from 35 balls.' },
      { id: 'oval-2', type: 'timeline', title: 'Match context', content: 'This was the ninth match of the 2019 ICC Cricket World Cup, played at the Oval on 5 June.' },
      { id: 'oval-3', type: 'statistics', title: 'Result', content: 'New Zealand won the match by two wickets while chasing Bangladesh’s total.' },
    ],
    correctAnswerId: 'martin-guptill',
    answerEvidenceIds: ['oval-1'],
    explanation: 'The official PCB scorecard credits Martin Guptill with the run out of Mushfiqur Rahim. New Zealand won the ninth match of the 2019 World Cup by two wickets.',
    sourceUrl: 'https://www.pcb.com.pk/icc-world-cup-2019/match/32648.html',
    hints: ['The dismissal type narrows the relevant scorecard entry.', 'The batting row includes the fielder credited with the run out.', 'Check the name credited beside “run out” in the official scorecard.'],
  },
];

export function historicalMystery() {
  return structuredClone(historicalCases[Math.floor(Math.random() * historicalCases.length)]);
}

export function historicalMysteryCount() { return historicalCases.length; }
export function historicalMysteries() { return structuredClone(historicalCases); }
