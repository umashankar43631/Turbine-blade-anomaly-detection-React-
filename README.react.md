# BladeGuard AI (React)

Vite + React + TypeScript UI for BladeGuard AI. Upload a turbine blade image (standard or binocular), send it to Gemini, and render a health score, detailed findings, and annotated bounding boxes on the preview.

## Features
- Image upload with live preview and clear/reset controls.
- Calls Gemini with a strict JSON schema for defects, bounding boxes (0–1000 grid), recommendations, and summaries.
- Annotated overlay showing defect labels, severity colors, and hover tooltips.
- Executive summary card with condition score and defect counts; detailed defect cards with confidence and recommendations.

## Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind-style utility classes (prebaked in components)
- lucide-react icons

## Prerequisites
- Node.js 18+
- Gemini API key

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Provide your Gemini API key. The client expects `API_KEY` in env; you can add it to `.env.local`:
   ```bash
   echo "API_KEY=your_key_here" > .env.local
   ```
   (A sample `.env.local` may already exist; update it with your key.)

## Run
```bash
npm run dev
```
Open the printed localhost URL in your browser to use the app.

## Build
```bash
npm run build
```
The production build outputs to `dist/`.

## Notes
- Prompt, model (`gemini-3-pro-preview`), schema, and temperature live in `services/geminiService.ts` and mirror the Streamlit version.
- Bounding boxes assume the 0–1000 normalized coordinate system used by Gemini responses.***
