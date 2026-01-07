# TransIntel Backend

Translation API server using Google Gemini (free tier).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Gemini API key:
```bash
cp .env.example .env
```

3. Get your API key from: https://makersuite.google.com/app/apikey

4. Add your API key to `.env`:
```
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

## Run the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### POST /translate
Translate text from one language to another.

**Request:**
```json
{
  "text": "Hello, world!",
  "sourceLanguage": "en",
  "targetLanguage": "es"
}
```

**Response:**
```json
{
  "translatedText": "¡Hola, mundo!"
}
```

### GET /health
Check server status and API key configuration.

**Response:**
```json
{
  "status": "ok",
  "apiKeyConfigured": true
}
```

## Supported Languages

English (en), Spanish (es), French (fr), German (de), Italian (it), Portuguese (pt), Russian (ru), Japanese (ja), Korean (ko), Chinese (zh), Arabic (ar), Hindi (hi), Turkish (tr), Polish (pl), Dutch (nl), Swedish (sv), Danish (da), Finnish (fi), Norwegian (no), Czech (cs), Greek (el), Hebrew (he), Thai (th), Vietnamese (vi), Indonesian (id)
