# AI Mystery Room

An interactive cricket investigation game. Fictional mysteries are generated and validated on the server; the answer is withheld until a player submits their final guess.

## Requirements

- Node.js 20+
- MongoDB
- A Google Gemini API key (optional; a validated fallback mystery is used when generation is unavailable)

## Start locally

1. Copy `.env.example` to `.env` in the project root, then set `MONGODB_URI` and optionally `GEMINI_API_KEY`. The current default model is `gemini-3.8-flash`.
2. Install dependencies in `server` and `client` with `npm install` (`npm.cmd` in PowerShell if script execution is restricted).
3. Run `npm run dev` in `server` and `npm run dev` in `client` (`npm.cmd run dev` in PowerShell).
4. Open the Vite URL, usually `http://localhost:5173`.

The Express API listens on port 5000 by default. Vite proxies `/api` to Express during development; production serves the built React app and API from the same origin. `GEMINI_MODEL` is configurable. The browser never receives the Gemini key or mystery answer.

## Tests

Run `npm test` from `server` for unit and HTTP integration checks. Build the frontend with `npm run build` from `client`.

## Deploy to Render

The root `render.yaml` defines a single web service that builds the client and server together. Create a Render Blueprint from the GitHub repository and provide `MONGODB_URI` and `GEMINI_API_KEY` as secret environment variables. Gemini-generated mysteries use `GEMINI_MODEL` (default `gemini-3.8-flash`); without a Gemini key, the validated fallback mystery is used. The deployment URL is assigned by Render after the first successful deploy. Keep `.env` out of Git.
