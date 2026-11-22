# Text-to-Speech Application

A full-stack React and Express application that converts text to downloadable MP3 audio using Microsoft Edge TTS.

## Features

- Character and word counts
- 500-character limit
- Language and voice selection
- Automatic translation into the selected language before speech generation
- MP3 audio playback and download
- Loading, validation, API, and network error states
- Responsive interface

## Prerequisites

- Node.js 18 or newer
- Python 3.9 or newer

Install the Python translation and TTS dependencies:

```powershell
python -m pip install edge-tts deep-translator
```

## Install and run

```powershell
npm run install:all
npm run dev
```

Open `http://localhost:5173`.

The Express API runs at `http://localhost:5001`.

## Production

```powershell
npm run build
npm start
```

Set `PORT` in `server/.env` to change the Express port.
