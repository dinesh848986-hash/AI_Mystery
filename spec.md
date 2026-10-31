# AI Mystery Room — Product & Technical Specification

**Document type:** Product Requirements Document (PRD) + Technical Specification  
**Version:** 1.0  
**Status:** Initial implementation specification  
**Project name:** AI Mystery Room  
**Technology:** MERN Stack + Google Gemini

---

## 1. Project Overview

AI Mystery Room is an interactive cricket investigation website where users solve cricket-related mysteries using clues, player profiles, match records, and AI-generated scenarios.

The backend uses Gemini to generate mystery stories and supporting evidence. The user investigates the incident, identifies the responsible player, and submits a final answer.

### Core user experience

1. The user selects a cricket mystery.
2. The website presents a short scenario or story.
3. The user investigates the incident using the available evidence.
4. The user selects the suspected player.
5. The backend checks the answer and displays the result.

### Primary objective

Create an engaging, replayable cricket mystery game that combines cricket knowledge, logical reasoning, and AI-generated storytelling.

---

## 2. Project Goals

### Functional goals

- Generate cricket mystery scenarios using Gemini.
- Display clues, player profiles, and cricket statistics.
- Allow users to investigate and identify the culprit.
- Validate answers securely on the backend.
- Provide hints, scoring, and investigation progress.
- Support both historical and fictional cricket mysteries.

### Non-functional goals

- Responsive design for desktop and mobile.
- Reliable AI response handling.
- Secure backend answer validation.
- Clear separation between fictional data and real cricket records.
- Maintainable MERN architecture.

### Out of scope for the first version

- Multiplayer competitions.
- Real-money rewards or betting.
- User-created public mystery submissions.
- Live cricket score integration.
- Complex user profiles and social features.

---

## 3. Mystery Types

The website must support two distinct mystery types.

### Type A — Historical Cricket Mystery

A mystery based on a real cricket match, player, or incident.

Example:

"During the 2019 Cricket World Cup semi-final, MS Dhoni was run out while attempting a second run. Which New Zealand player made the direct hit?"

The answer must be based on verified historical information.

Requirements:

- Use actual match records.
- Preserve real player names and statistics.
- Never invent historical events.
- Use trusted cricket data or verified source material.
- Gemini may explain the incident, but must not determine historical facts without verification.

### Type B — Fictional Cricket Mystery

A fictional cricket incident created by Gemini.

Example:

"During the final over of a fictional tournament, the captain is dismissed after a suspicious run-out. Three players have conflicting accounts of what happened. Examine the evidence and identify the player responsible."

Requirements:

- Generate fictional players, teams, statistics, and incidents.
- Use realistic cricket rules and match situations.
- Clearly label the mystery as fictional.
- Ensure every clue supports a consistent answer.
- Store the correct answer securely on the backend.

For the MVP, fictional mysteries should be the primary game mode because they allow complete control over the story, clues, and answer validation.

---

## 4. Target Users

- Cricket fans who enjoy solving puzzles.
- Students and casual gamers.
- Users interested in cricket history and match analysis.
- Users who enjoy detective games and logical reasoning.

---

## 5. Core User Flow

```text
Open Website
    |
    v
Home Page
    |
    v
Select Mystery Type
    |
    v
Start New Mystery
    |
    v
Read Scenario
    |
    v
Investigate Evidence
    |
    v
Select Suspected Player
    |
    v
Submit Final Answer
    |
    v
Backend Validates Answer
    |
    v
Display Result and Explanation
```

The user must not be able to access the correct answer before submitting a final guess.

---

## 6. Functional Requirements

### FR-01: Home Page

The home page must display:

- Project title and short description.
- Start Mystery button.
- Historical Mysteries section.
- Fictional Mysteries section.
- How to Play section.

The primary action should be starting a mystery.

### FR-02: Mystery Generation

When the user starts a fictional mystery:

1. The frontend requests a new mystery from the backend.
2. The backend requests a structured mystery from Gemini.
3. The backend validates the generated response.
4. The mystery is stored in MongoDB.
5. The backend returns the mystery's public information to the frontend.

If Gemini fails or generates invalid content, the backend must retry a limited number of times or return a predefined fallback mystery.

The answer must never be included in the public mystery response.

### FR-03: Mystery Scenario

Each mystery must contain:

- Mystery title.
- Mystery ID.
- Mystery type.
- Difficulty level.
- Cricket format.
- Match or tournament context.
- Short incident description.
- List of suspects.
- Available evidence.
- Investigation instructions.

The scenario should create curiosity without immediately revealing the culprit.

### FR-04: Suspect Selection

The user must be able to select one player from the suspects.

The selection must be submitted through a backend API.

The frontend must not compare the selected player with the correct answer.

### FR-05: Answer Validation

The backend must:

- Verify that the mystery exists.
- Verify that the mystery has not already been completed.
- Verify that the selected player belongs to the suspect list.
- Compare the selected player ID against the stored correct answer.
- Record the result.
- Return the result and an explanation.

The correct answer must not be exposed through public APIs, browser state, HTML, or JavaScript bundles.

### FR-06: Results Page

After submitting an answer, display:

- Correct or incorrect result.
- Correct player.
- Explanation of the incident.
- Evidence that supports the answer.
- Final score.
- Play Again button.

For incorrect answers, allow the user to understand the reasoning without repeating the same mystery.

### FR-07: Hints

The user may request hints during an investigation.

The system should provide up to three hints per mystery.

Each hint should reveal progressively more information without directly revealing the answer.

The backend must track the number of hints used.

### FR-08: Scoring

Initial scoring rules:

| Action                          | Score |
| ------------------------------- | ----: |
| Correct answer without hints    |   100 |
| Correct answer with one hint    |    80 |
| Correct answer with two hints   |    60 |
| Correct answer with three hints |    40 |
| Incorrect answer                |     0 |

The user receives one final attempt in the MVP.

A completed mystery cannot be submitted again to earn additional points.

---

## 7. Mystery Evidence System

Evidence is the main investigation feature.

Each mystery must contain at least three evidence items.

Supported evidence types:

- Player profile.
- Batting records.
- Bowling records.
- Wicket and dismissal information.
- Match scorecard.
- Over-by-over events.
- Player statements.
- Witness accounts.
- Timeline of events.
- Match conditions.

### Evidence design rules

1. Evidence must be relevant to the mystery.
2. Evidence must be consistent with the scenario.
3. The clues must collectively support one intended answer.
4. At least one clue should help distinguish the culprit from the other suspects.
5. Evidence should not directly reveal the answer in the initial view.
6. Fictional statistics must be clearly identified as fictional.

The evidence may include misleading statements from suspects, but the overall mystery must remain logically solvable.

---

## 8. Gemini AI Integration

Gemini is responsible for generating fictional mysteries, clues, and explanations.

### AI responsibilities

- Create realistic cricket scenarios.
- Generate suspect profiles.
- Generate fictional match statistics.
- Create evidence and witness statements.
- Produce progressive hints.
- Generate the final explanation.
- Maintain consistent details across the mystery.

### AI must not

- Determine historical cricket facts without verification.
- Change the correct answer after the mystery is generated.
- Return inconsistent statistics.
- Reveal the correct answer in public scenario or evidence responses.
- Generate unsafe or unrelated content.
- Generate real-world accusations against actual players.

### Mystery generation process

```text
Backend receives request
        |
        v
Build structured Gemini prompt
        |
        v
Gemini generates mystery
        |
        v
Validate response structure
        |
        v
Validate cricket logic
        |
        v
Check answer and evidence consistency
        |
        v
Store mystery in MongoDB
        |
        v
Return public mystery data
```

The backend must use structured JSON output or an equivalent schema-constrained response.

Do not rely on parsing arbitrary free-form AI text to create game data.

### AI validation

The backend must reject or regenerate mysteries when:

- Required fields are missing.
- The correct answer is not a valid suspect.
- The evidence contradicts the correct answer.
- The scenario is incomplete.
- Statistics are invalid or inconsistent.
- The generated content does not match the requested mystery type.

Use a limited retry policy to avoid unnecessary Gemini API costs.

---

## 9. Technical Architecture

### Technology Stack

| Layer               | Technology           |
| ------------------- | -------------------- |
| Frontend            | React                |
| Frontend build tool | Vite                 |
| Styling             | CSS                  |
| Backend             | Node.js              |
| Backend framework   | Express.js           |
| Database            | MongoDB              |
| ODM                 | Mongoose             |
| AI integration      | Google Gemini API    |
| API communication   | REST API             |
| Validation          | Zod                  |
| Authentication      | Not required for MVP |

### Architecture

```text
React Frontend
      |
      | REST API
      v
Express Backend
      |
      |--- Gemini API
      |
      |--- MongoDB
      |
      v
Validated Mystery Data
```

The frontend communicates only with the Express backend.

The Gemini API key and all answer-validation logic must remain on the backend.

---

## 10. Database Design

### Collection: mysteries

Each mystery document must contain the following fields:

```json
{
  "_id": "ObjectId",
  "title": "string",
  "type": "fictional | historical",
  "difficulty": "easy | medium | hard",
  "format": "T20 | ODI | Test",
  "scenario": "string",
  "suspects": [],
  "evidence": [],
  "correctAnswerId": "string",
  "explanation": "string",
  "hints": [],
  "status": "active | archived",
  "createdAt": "Date"
}
```

The correct answer and explanation must be stored separately from the public response.

The API must never return the complete MongoDB mystery document.

### Suspect object

```json
{
  "id": "string",
  "name": "string",
  "role": "string",
  "profile": "string"
}
```

For fictional mysteries, all suspect names must be fictional.

### Evidence object

```json
{
  "id": "string",
  "type": "profile | statistics | statement | timeline",
  "title": "string",
  "content": "string"
}
```

### Collection: gameSessions

```json
{
  "_id": "ObjectId",
  "mysteryId": "ObjectId",
  "sessionToken": "string",
  "selectedAnswerId": "string",
  "hintsUsed": 0,
  "score": 0,
  "status": "active | completed",
  "startedAt": "Date",
  "completedAt": "Date"
}
```

The session token must be generated by the backend and must not contain the correct answer.

---

## 11. API Specification

All endpoints must use JSON request and response bodies.

### GET /api/health

Check whether the backend is running.

Response:

```json
{
  "status": "ok"
}
```

### POST /api/mysteries

Generate a new fictional mystery.

Request:

```json
{
  "difficulty": "easy",
  "format": "ODI"
}
```

Response:

```json
{
  "mysteryId": "string",
  "title": "string",
  "type": "fictional",
  "difficulty": "easy",
  "scenario": "string",
  "suspects": [],
  "evidence": []
}
```

The response must not include the correct answer.

### GET /api/mysteries/:id

Retrieve the public information for a mystery.

Response:

```json
{
  "mysteryId": "string",
  "title": "string",
  "scenario": "string",
  "suspects": [],
  "evidence": []
}
```

### POST /api/sessions

Start an investigation session.

Request:

```json
{
  "mysteryId": "string"
}
```

Response:

```json
{
  "sessionToken": "string",
  "mysteryId": "string"
}
```

### POST /api/sessions/:token/hints

Request a hint.

Response:

```json
{
  "hintNumber": 1,
  "hint": "string",
  "hintsRemaining": 2
}
```

### POST /api/sessions/:token/answer

Submit the final answer.

Request:

```json
{
  "selectedAnswerId": "string"
}
```

Response:

```json
{
  "correct": true,
  "correctAnswer": {
    "id": "string",
    "name": "string"
  },
  "explanation": "string",
  "score": 80
}
```

The answer endpoint must only accept one final submission per session.

All invalid requests must return appropriate HTTP error codes and clear error messages.

---

## 12. Frontend Pages

### Page 1: Home

Components:

- Header.
- Project introduction.
- Start Mystery button.
- Mystery type selection.
- How to Play section.

### Page 2: Mystery Selection

Components:

- Historical Mystery card.
- Fictional Mystery card.
- Difficulty selection.
- Cricket format selection.

### Page 3: Investigation Room

Components:

- Mystery title.
- Scenario panel.
- Suspect cards.
- Evidence panel.
- Hint button.
- Submit Answer button.

The investigation page should be the main visual focus of the website.

### Page 4: Results

Components:

- Result status.
- Correct answer.
- Explanation.
- Evidence breakdown.
- Score.
- Play Again button.

### Page 5: Not Found / Error

Provide a friendly error page for invalid mystery IDs, unavailable mysteries, or failed requests.

---

## 13. UI and UX Requirements

The website should feel like a cricket detective investigation room.

### Visual direction

- Dark navy or charcoal background.
- White or light-gray text.
- Cricket-inspired green accent color.
- Evidence cards and suspect cards.
- Clear typography and readable spacing.
- Responsive layouts for mobile and desktop.

### Interaction requirements

- Evidence cards should be easy to inspect.
- Suspect selection should have a clear selected state.
- Submit Answer should remain disabled until a suspect is selected.
- Loading indicators should appear during AI generation.
- API errors should display useful messages.
- The user should not lose their investigation state during normal interactions.

Avoid unnecessary animations or complicated dashboard features in the first version.

---

## 14. Security Requirements

- Store the Gemini API key in backend environment variables.
- Never expose the API key in frontend code.
- Never send the correct answer in public mystery responses.
- Validate all incoming request data.
- Rate-limit AI generation endpoints.
- Prevent repeated answer submissions.
- Avoid logging API keys or sensitive session information.
- Do not execute AI-generated code or database queries.
- Sanitize user-provided data before rendering it.

For the MVP, authentication is not required. Investigation sessions can use secure random tokens.

---

## 15. Environment Variables

Backend `.env` file:

```env
PORT=5000
MONGODB_URI=
GEMINI_API_KEY=
GEMINI_MODEL=
CLIENT_URL=http://localhost:5173
```

The Gemini model name must be configurable rather than hardcoded throughout the application.

The `.env` file must never be committed to GitHub.

Provide a `.env.example` file containing placeholder values.

---

## 16. Project Structure

```text
ai-mystery-room/
|
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- hooks/
|   |   |-- styles/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |
|   |-- package.json
|
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- middleware/
|   |   |-- validators/
|   |   |-- app.js
|   |   |-- server.js
|   |
|   |-- package.json
|
|-- docs/
|   |-- SPEC.md
|
|-- .gitignore
|-- README.md
|-- .env.example
```

The backend should use separate controllers, services, models, and validation modules.

Gemini integration must be isolated in a dedicated service module.

---

## 17. Error Handling

The application must handle:

- Gemini API failures.
- Invalid Gemini JSON responses.
- MongoDB connection failures.
- Invalid mystery IDs.
- Invalid suspect selections.
- Expired or invalid session tokens.
- Duplicate answer submissions.
- Network failures.
- Missing environment variables.

All errors should be logged on the backend with sufficient debugging information.

The frontend should display friendly error messages without exposing internal stack traces.

---

## 18. Testing Requirements

### Unit tests

Test:

- Mystery validation.
- Suspect selection validation.
- Answer correctness.
- Scoring calculations.
- Hint limits.
- Session completion rules.

### Integration tests

Test:

- Mystery generation endpoint.
- Mystery retrieval endpoint.
- Session creation.
- Hint requests.
- Answer submission.
- Database persistence.
- Invalid request handling.

### End-to-end tests

Verify that a user can:

1. Open the website.
2. Start a mystery.
3. Investigate the evidence.
4. Select a suspect.
5. Submit an answer.
6. View the result.

Also verify that the correct answer is not exposed before submission.

---

## 19. Acceptance Criteria

The MVP is complete only when all of the following conditions are met:

- [ ] The React frontend and Express backend run successfully.
- [ ] MongoDB stores generated mysteries and investigation sessions.
- [ ] Gemini generates structured fictional mysteries.
- [ ] Every mystery has a valid suspect list and consistent evidence.
- [ ] The frontend displays the scenario, suspects, and evidence.
- [ ] Users can submit a suspect as their final answer.
- [ ] The backend validates answers securely.
- [ ] Correct and incorrect answers display the appropriate results.
- [ ] Hints and scoring work according to the specification.
- [ ] The correct answer is not exposed before submission.
- [ ] The website works on mobile and desktop.
- [ ] Error handling and basic automated tests are implemented.

---

## 20. Development Phases

### Phase 1 — Project Setup

Create the MERN project structure, configure the frontend and backend, and establish the MongoDB connection.

### Phase 2 — Core Game

Build the home page, investigation room, suspect selection, and results page using predefined mystery data.

### Phase 3 — Gemini Integration

Implement AI mystery generation, structured output validation, and secure database storage.

### Phase 4 — Investigation Features

Add hints, scoring, session management, and answer validation.

### Phase 5 — Testing and Deployment

Run automated tests, verify security requirements, and deploy the frontend and backend.

Do not begin the next phase until the current phase is working correctly.

---

## 21. Instructions for Codex

This document is the authoritative specification for the project.

Codex must follow these rules:

1. Read this specification before writing code.
2. Build the application in the defined development phases.
3. Do not introduce unrequested features or technologies.
4. Do not expose correct answers through frontend code or public APIs.
5. Do not invent historical cricket records.
6. Keep fictional and historical mysteries clearly separated.
7. Validate Gemini responses before storing them.
8. Write maintainable, modular code.
9. Create tests for core business logic.
10. Update the specification only when a requirement is explicitly changed.

If an implementation decision is not defined in this document, choose the simplest maintainable solution that satisfies the existing requirements.

The completed website must be a functional application, not merely a static UI or a collection of mock screens.

---

## 22. Future Enhancements

These features are not required for the MVP:

- User accounts and persistent player statistics.
- Daily cricket mystery challenges.
- Leaderboards and achievements.
- More advanced difficulty levels.
- Real historical cricket database integration.
- Tournament-based mystery campaigns.
- Multiplayer investigation mode.
- Admin interface for reviewing and publishing mysteries.

Historical mystery generation should be expanded only after reliable cricket data sources and verification rules have been established.

---

**Final product definition:** AI Mystery Room is a cricket investigation game powered by Gemini, where users analyze a scenario and supporting evidence to identify the responsible player. The MVP prioritizes fictional mysteries with reliable answer validation, while historical cricket mysteries are supported through verified data rather than AI-generated facts.
