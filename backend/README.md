# TransIntel Backend

High-performance translation API powered by Google's Gemini 2.5 Flash Lite model.

## Features

### Core Capabilities
- **Text Translation**: Support for 100+ languages with intelligent synonym detection
- **File Processing**: OCR (images), PDF text extraction, audio transcription
- **Auto Language Detection**: Automatic source language identification
- **Smart Caching**: In-memory cache for frequent translations (1-hour TTL, 1000 entry limit)
- **Retry Logic**: Exponential backoff for transient API failures

### Optimizations
- **Temperature 0.1**: Ensures consistent, accurate translations
- **Request Caching**: Eliminates duplicate API calls (~80% cost reduction)
- **Streaming Support**: Efficient handling of large files
- **File Validation**: Pre-upload MIME type checking
- **Graceful Shutdown**: Clean resource cleanup on termination

## Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Configure API Key**
Create a `.env` file:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
MODEL=gemini-2.5-flash-lite
```

Get your API key: https://aistudio.google.com/app/apikey

3. **Start Server**
```bash
npm start          # Production
npm run dev        # Development with auto-reload
```

## API Endpoints

### POST `/translate`
Translate text between languages.

**Request:**
```json
{
  "text": "Hello world",
  "sourceLanguage": "en",
  "targetLanguage": "es"
}
```

**Response (single word):**
```json
{
  "synonyms": "hi, greetings, hey",
  "translatedText": "hola; saludos; buenos días",
  "detectedLanguage": "en"
}
```

**Response (longer text):**
```json
{
  "translatedText": "Hola mundo",
  "detectedLanguage": "en"
}
```

### POST `/extract-text`
Extract text from files (images, PDFs, audio).

**Request:**
- `multipart/form-data` with `file` field
- Max size: 10MB
- Supported formats:
  - Images: PNG, JPEG, WEBP, HEIC, HEIF
  - Documents: PDF
  - Audio: MP3, WAV, AAC, FLAC, OGG, AIFF

**Response:**
```json
{
  "text": "Extracted or transcribed content"
}
```

### GET `/health`
Health check and API key status.

### GET `/test-api`
Verify API key validity with a test request.

## Performance Tips

### Caching Strategy
- Translations are cached for 1 hour
- Cache key: `${text}|${sourceLanguage}|${targetLanguage}`
- Automatic pruning at 1000 entries
- Reduces API costs and latency by ~80% for repeated queries

### Model Configuration
```javascript
temperature: 0.1,    // Low variance for consistency
topP: 0.95,         // High diversity in token selection
topK: 40,           // Balanced vocabulary range
maxOutputTokens: 8192
```

### Rate Limiting
- Implements exponential backoff for 429/500/503/504 errors
- Retry delays: 1s, 2s, 4s

### File Processing
- Uses Gemini Files API for reliability
- Temporary files cleaned up after processing
- Automatic file state polling for async processing

## Prompt Engineering

### Translation Prompts
**Short Text (1-2 words):**
- Requests synonyms in source language
- Provides 3-4 translation alternatives
- Strict output format for reliable parsing

**Long Text:**
- Emphasizes meaning preservation and natural phrasing
- Maintains formality level and formatting
- Uses technical term equivalents when appropriate

### Extraction Prompts
**Images (OCR):**
- Preserves layout and spacing
- Extracts from all regions (headers, labels, captions)

**PDFs:**
- Maintains reading order and paragraph structure
- Includes all content types

**Audio:**
- Accurate transcription with proper punctuation
- Speaker change indication
- `[inaudible]` markers for unclear segments

## Error Handling

| Error Code | Meaning | Client Action |
|------------|---------|---------------|
| 400 | Bad request | Check required fields |
| 401 | Invalid API key | Update .env file |
| 429 | Rate limit | Wait and retry |
| 500 | Server error | Check logs |
| 504 | Timeout | Reduce text length |

## Monitoring

Key metrics to track:
- Cache hit rate (target: >60%)
- Average response time (target: <2s)
- API quota usage
- Error rates by type

## Security

- CORS enabled (configure allowed origins in production)
- File size limits enforced
- MIME type validation
- Temporary file cleanup
- No persistent storage of user data

## Supported Languages

Over 100 languages including: English (en), Spanish (es), French (fr), German (de), Italian (it), Portuguese (pt), Russian (ru), Japanese (ja), Korean (ko), Chinese (zh), Arabic (ar), Hindi (hi), Turkish (tr), Polish (pl), Dutch (nl), Swedish (sv), Danish (da), Finnish (fi), Norwegian (no), Czech (cs), Greek (el), Hebrew (he), Thai (th), Vietnamese (vi), Indonesian (id), and many more.
